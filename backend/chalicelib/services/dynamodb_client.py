import boto3
import logging
from botocore.exceptions import ClientError
from config import config
import time

logger = logging.getLogger(__name__)

class DynamoDBServiceError(Exception):
    """Raised when DynamoDB service encounters an error."""
    pass

class DynamoDBClient:
    def __init__(self, region_name='us-east-1'):
        self.resource = boto3.resource('dynamodb', region_name=region_name)
        self.client = boto3.client('dynamodb', region_name=region_name)
        self.analysis_table_name = config.ANALYSIS_TABLE_NAME
        self.batch_table_name = config.BATCH_TABLE_NAME
    
    def create_analysis_record(self, user_id, analysis_id, timestamp, sentiment, source, text_length, s3_result_path, s3_text_path):
        """
        Create a record in the analysis table
        
        Args:
            user_id (str): User identifier
            analysis_id (str): Analysis identifier
            timestamp (str): ISO-format timestamp
            sentiment (str): Sentiment classification
            source (str): Source of the text
            text_length (int): Length of the analyzed text
            s3_result_path (str): S3 path to the result JSON
            s3_text_path (str): S3 path to the original text
            
        Returns:
            dict: DynamoDB response
        """
        table = self.resource.Table(self.analysis_table_name)
        
        # Calculate TTL (90 days from now)
        ttl = int(time.time()) + (90 * 24 * 60 * 60)
        
        try:
            response = table.put_item(
                Item={
                    'userId': user_id,
                    'analysisId': analysis_id,
                    'timestamp': timestamp,
                    'sentiment': sentiment,
                    'source': source,
                    'textLength': text_length,
                    's3ResultPath': s3_result_path,
                    's3TextPath': s3_text_path,
                    'ttl': ttl
                }
            )
            return response
        
        except ClientError as e:
            logger.error(f"Error creating analysis record: {str(e)}")
            raise DynamoDBServiceError(f"DynamoDB service error: {str(e)}")
    
    def get_analysis_record(self, user_id, analysis_id):
        """
        Get an analysis record by ID
        
        Args:
            user_id (str): User identifier
            analysis_id (str): Analysis identifier
            
        Returns:
            dict: Analysis record
        """
        table = self.resource.Table(self.analysis_table_name)
        
        try:
            response = table.get_item(
                Key={
                    'userId': user_id,
                    'analysisId': analysis_id
                }
            )
            
            return response.get('Item')
        
        except ClientError as e:
            logger.error(f"Error retrieving analysis record: {str(e)}")
            raise DynamoDBServiceError(f"DynamoDB service error: {str(e)}")
    
    def get_user_analyses(self, user_id, limit=20, last_evaluated_key=None):
        """
        Get analysis records for a user
        
        Args:
            user_id (str): User identifier
            limit (int): Maximum number of records to retrieve
            last_evaluated_key (dict): Key to start from for pagination
            
        Returns:
            dict: Analysis records and last evaluated key
        """
        table = self.resource.Table(self.analysis_table_name)
        
        query_params = {
            'KeyConditionExpression': 'userId = :userId',
            'ExpressionAttributeValues': {
                ':userId': user_id
            },
            'Limit': limit,
            'ScanIndexForward': False  # Sort from newest to oldest
        }
        
        if last_evaluated_key:
            query_params['ExclusiveStartKey'] = last_evaluated_key
        
        try:
            response = table.query(**query_params)
            
            return {
                'items': response.get('Items', []),
                'lastEvaluatedKey': response.get('LastEvaluatedKey')
            }
        
        except ClientError as e:
            logger.error(f"Error querying analysis records: {str(e)}")
            raise DynamoDBServiceError(f"DynamoDB service error: {str(e)}")
    
    def create_batch_job_record(self, user_id, job_id, timestamp, file_name, status, total_records, s3_input_path):
        """
        Create a batch job record
        
        Args:
            user_id (str): User identifier
            job_id (str): Batch job identifier
            timestamp (str): ISO-format timestamp
            file_name (str): Original file name
            status (str): Job status
            total_records (int): Total records in the batch
            s3_input_path (str): S3 path to the input file
            
        Returns:
            dict: DynamoDB response
        """
        table = self.resource.Table(self.batch_table_name)
        
        # Calculate TTL (90 days from now)
        ttl = int(time.time()) + (90 * 24 * 60 * 60)
        
        try:
            response = table.put_item(
                Item={
                    'userId': user_id,
                    'jobId': job_id,
                    'timestamp': timestamp,
                    'fileName': file_name,
                    'status': status,
                    'totalRecords': total_records,
                    's3InputPath': s3_input_path,
                    'ttl': ttl
                }
            )
            return response
        
        except ClientError as e:
            logger.error(f"Error creating batch job record: {str(e)}")
            raise DynamoDBServiceError(f"DynamoDB service error: {str(e)}")