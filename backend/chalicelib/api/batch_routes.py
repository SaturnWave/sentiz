from chalice import Chalice, Response
from chalicelib.core.batch_processor import BatchProcessor
from chalicelib.services.s3_client import S3Client
from chalicelib.services.dynamodb_client import DynamoDBClient
from chalicelib.services.comprehend import ComprehendService
from chalicelib.utils.csv_processor import CSVProcessor
from chalicelib.utils.validation import validate_batch_request
import logging
import json
import uuid

logger = logging.getLogger(__name__)

# Initialize services
s3_client = S3Client()
dynamodb_client = DynamoDBClient()
comprehend_service = ComprehendService()
csv_processor = CSVProcessor()
batch_processor = BatchProcessor(
    s3_client=s3_client,
    dynamodb_client=dynamodb_client,
    comprehend_service=comprehend_service,
    csv_processor=csv_processor
)

def register_routes(app: Chalice):
    @app.route('/batch/jobs', methods=['POST'], cors=True)
    def create_batch_job():
        """
        Create a new batch processing job
        """
        try:
            request_body = app.current_request.json_body
            
            # Validate request
            if not validate_batch_request(request_body):
                return Response(
                    body={'error': 'Invalid request format'},
                    status_code=400,
                    headers={'Content-Type': 'application/json'}
                )
            
            user_id = request_body.get('user_id', 'anonymous')
            source_data = request_body.get('data')
            job_name = request_body.get('name', f'batch-job-{uuid.uuid4().hex[:8]}')
            
            # Create and start batch job
            job_id = batch_processor.create_job(
                user_id=user_id,
                job_name=job_name,
                source_data=source_data
            )
            
            return Response(
                body={'job_id': job_id, 'status': 'created'},
                status_code=202,  # Accepted
                headers={'Content-Type': 'application/json'}
            )
            
        except Exception as e:
            logger.error(f"Error creating batch job: {str(e)}")
            return Response(
                body={'error': str(e)},
                status_code=500,
                headers={'Content-Type': 'application/json'}
            )

    @app.route('/batch/jobs/{job_id}', methods=['GET'], cors=True)
    def get_batch_job(job_id):
        """
        Get status and details of a batch processing job
        """
        try:
            user_id = app.current_request.query_params.get('user_id', 'anonymous')
            
            # Get job details
            job_details = batch_processor.get_job(job_id, user_id)
            
            if not job_details:
                return Response(
                    body={'error': 'Batch job not found'},
                    status_code=404,
                    headers={'Content-Type': 'application/json'}
                )
            
            return Response(
                body=job_details,
                status_code=200,
                headers={'Content-Type': 'application/json'}
            )
            
        except Exception as e:
            logger.error(f"Error retrieving batch job: {str(e)}")
            return Response(
                body={'error': str(e)},
                status_code=500,
                headers={'Content-Type': 'application/json'}
            )

    @app.route('/batch/jobs', methods=['GET'], cors=True)
    def list_batch_jobs():
        """
        List batch processing jobs for a user
        """
        try:
            user_id = app.current_request.query_params.get('user_id', 'anonymous')
            limit = int(app.current_request.query_params.get('limit', 10))
            last_evaluated_key = app.current_request.query_params.get('lastEvaluatedKey')
            
            # Get jobs list
            result = batch_processor.list_jobs(user_id, limit, last_evaluated_key)
            
            return Response(
                body=result,
                status_code=200,
                headers={'Content-Type': 'application/json'}
            )
            
        except Exception as e:
            logger.error(f"Error listing batch jobs: {str(e)}")
            return Response(
                body={'error': str(e)},
                status_code=500,
                headers={'Content-Type': 'application/json'}
            )

    @app.route('/batch/jobs/{job_id}/results', methods=['GET'], cors=True)
    def get_batch_results(job_id):
        """
        Get results of a completed batch job
        """
        try:
            user_id = app.current_request.query_params.get('user_id', 'anonymous')
            
            # Get job results
            result = batch_processor.get_job_results(job_id, user_id)
            
            if not result:
                return Response(
                    body={'error': 'Batch job results not found or job not completed'},
                    status_code=404,
                    headers={'Content-Type': 'application/json'}
                )
            
            return Response(
                body=result,
                status_code=200,
                headers={'Content-Type': 'application/json'}
            )
            
        except Exception as e:
            logger.error(f"Error retrieving batch results: {str(e)}")
            return Response(
                body={'error': str(e)},
                status_code=500,
                headers={'Content-Type': 'application/json'}
            )