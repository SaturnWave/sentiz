import uuid
import json
import logging
from datetime import datetime
from typing import Dict, List, Any, Optional

from chalicelib.services.s3_client import S3Client
from chalicelib.services.dynamodb_client import DynamoDBClient
from chalicelib.services.comprehend import ComprehendService
from chalicelib.utils.csv_processor import CSVProcessor
from chalicelib.models.batch_job import BatchJob

logger = logging.getLogger(__name__)

class BatchProcessor:
    """
    Handles batch processing of text data for sentiment analysis
    """
    
    def __init__(
        self,
        s3_client: S3Client,
        dynamodb_client: DynamoDBClient,
        comprehend_service: ComprehendService,
        csv_processor: CSVProcessor
    ):
        self.s3_client = s3_client
        self.dynamodb_client = dynamodb_client
        self.comprehend_service = comprehend_service
        self.csv_processor = csv_processor
    
    def create_job(self, user_id: str, job_name: str, source_data: List[Dict[str, str]]) -> str:
        """
        Creates a new batch processing job
        
        Args:
            user_id: ID of the user creating the job
            job_name: Name of the batch job
            source_data: List of data items to process
        
        Returns:
            str: ID of the created job
        """
        job_id = str(uuid.uuid4())
        timestamp = datetime.now().isoformat()
        
        # Create job record
        job = BatchJob(
            job_id=job_id,
            user_id=user_id,
            name=job_name,
            status="PENDING",
            created_at=timestamp,
            item_count=len(source_data),
            completed_count=0
        )
        
        # Store source data in S3
        data_key = f"batch/{user_id}/{job_id}/source-data.json"
        data_content = json.dumps(source_data)
        self.s3_client.put_object(data_key, data_content)
        
        # Store job details in DynamoDB
        self.dynamodb_client.create_batch_job(job.to_dict())
        
        # In a real application, this would trigger an async job
        # For now, we process immediately
        try:
            self._process_job(job_id, user_id, source_data)
        except Exception as e:
            logger.error(f"Error processing batch job {job_id}: {e}")
            # Update job status to FAILED
            self.dynamodb_client.update_batch_job_status(job_id, user_id, "FAILED", error_message=str(e))
        
        return job_id
    
    def _process_job(self, job_id: str, user_id: str, source_data: List[Dict[str, str]]) -> None:
        """
        Process the batch job data
        
        Args:
            job_id: ID of the job being processed
            user_id: ID of the user who created the job
            source_data: List of data items to process
        """
        # Update status to PROCESSING
        self.dynamodb_client.update_batch_job_status(job_id, user_id, "PROCESSING")
        
        results = []
        completed_count = 0
        
        # Process each item
        for item in source_data:
            try:
                text = item.get('text', '')
                
                if not text:
                    results.append({
                        'input': item,
                        'success': False,
                        'error': 'Empty text field'
                    })
                    continue
                
                # Analyze sentiment
                sentiment_result = self.comprehend_service.detect_sentiment(text)
                
                # Add result
                results.append({
                    'input': item,
                    'sentiment': sentiment_result.get('Sentiment'),
                    'sentimentScore': sentiment_result.get('SentimentScore'),
                    'success': True
                })
                
                completed_count += 1
                
                # Update progress every 10 items or configurable batch
                if completed_count % 10 == 0 or completed_count == len(source_data):
                    self.dynamodb_client.update_batch_job_progress(job_id, user_id, completed_count)
                
            except Exception as e:
                logger.error(f"Error processing item in batch job {job_id}: {e}")
                results.append({
                    'input': item,
                    'success': False,
                    'error': str(e)
                })
        
        # Store results in S3
        results_key = f"batch/{user_id}/{job_id}/results.json"
        results_content = json.dumps(results)
        self.s3_client.put_object(results_key, results_content)
        
        # Update job status to COMPLETED
        self.dynamodb_client.update_batch_job_status(
            job_id, 
            user_id, 
            "COMPLETED", 
            results_path=results_key,
            completed_count=completed_count
        )
    
    def get_job(self, job_id: str, user_id: str) -> Optional[Dict[str, Any]]:
        """
        Get details of a batch job
        
        Args:
            job_id: ID of the job to retrieve
            user_id: ID of the user who created the job
        
        Returns:
            Dict containing job details or None if not found
        """
        job_details = self.dynamodb_client.get_batch_job(job_id, user_id)
        return job_details
    
    def list_jobs(self, user_id: str, limit: int = 10, last_evaluated_key: str = None) -> Dict[str, Any]:
        """
        List batch jobs for a user
        
        Args:
            user_id: ID of the user
            limit: Maximum number of jobs to return
            last_evaluated_key: Key for pagination
        
        Returns:
            Dict containing list of jobs and pagination info
        """
        return self.dynamodb_client.list_batch_jobs(user_id, limit, last_evaluated_key)
    
    def get_job_results(self, job_id: str, user_id: str) -> Optional[Dict[str, Any]]:
        """
        Get results of a completed batch job
        
        Args:
            job_id: ID of the job
            user_id: ID of the user who created the job
        
        Returns:
            Dict containing job results or None if job not found/completed
        """
        # Get job details
        job_details = self.dynamodb_client.get_batch_job(job_id, user_id)
        
        if not job_details:
            return None
        
        # Check if job is completed and has results
        if job_details.get('status') != 'COMPLETED' or 'resultsPath' not in job_details:
            return None
        
        # Get results from S3
        results_path = job_details['resultsPath']
        results_json = self.s3_client.get_object(results_path).decode('utf-8')
        
        try:
            results = json.loads(results_json)
            return {
                'jobDetails': job_details,
                'results': results
            }
        except json.JSONDecodeError:
            logger.error(f"Failed to decode results JSON for job {job_id}")
            return None