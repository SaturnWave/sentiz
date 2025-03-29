import boto3
import logging
from botocore.exceptions import ClientError
from config import config # Assuming your config is in backend/config.py
from decimal import Decimal # Required if getting batch job records here

logger = logging.getLogger(__name__)

class S3ServiceError(Exception):
    """Raised when S3 service encounters an error."""
    pass

# Need DynamoDBServiceError if get_batch_job_record/update_batch_job_record are here
class DynamoDBServiceError(Exception):
    """Placeholder if DynamoDB client methods were moved here."""
    pass


class S3Client:
    def __init__(self, region_name=None):
        """
        Initializes the S3 client. Also needs DynamoDB resources if methods are moved here.
        """
        self.region_name = region_name or config.REGION
        self.s3_client = boto3.client('s3', region_name=self.region_name)
        # Initialize DynamoDB resources if needed by methods in this class
        # self.dynamodb_resource = boto3.resource('dynamodb', region_name=self.region_name)
        # self.batch_table_name = config.BATCH_TABLE_NAME
        # self.batch_table = self.dynamodb_resource.Table(self.batch_table_name)
        self.bucket_name = config.BUCKET_NAME
        if not self.bucket_name:
            raise ValueError("S3 Bucket Name is not configured.")


    def store_object(self, key: str, body: str or bytes, content_type: str = 'application/octet-stream', acl: str = 'private'):
        """
        Stores an object in the configured S3 bucket.
        """
        try:
            if isinstance(body, str):
                body = body.encode('utf-8') # Ensure body is bytes

            response = self.s3_client.put_object(
                Bucket=self.bucket_name,
                Key=key,
                Body=body,
                ContentType=content_type,
                ACL=acl # Control object ACL if needed, 'private' is default
            )
            logger.info(f"Stored object '{key}' in bucket '{self.bucket_name}'")
            return response
        except ClientError as e:
            logger.error(f"Error storing object '{key}' in S3: {e}")
            raise S3ServiceError(f"Failed to store object in S3: {e}")
        except Exception as e:
            logger.exception(f"Unexpected error storing object '{key}': {e}")
            raise S3ServiceError(f"Unexpected error storing object: {e}")


    def get_object(self, key: str) -> bytes or None:
        """
        Retrieves an object from the configured S3 bucket. Returns None if not found.
        """
        try:
            response = self.s3_client.get_object(
                Bucket=self.bucket_name,
                Key=key
            )
            body = response['Body'].read()
            logger.info(f"Retrieved object '{key}' from bucket '{self.bucket_name}'")
            return body
        except ClientError as e:
            if e.response['Error']['Code'] == 'NoSuchKey':
                logger.warning(f"Object '{key}' not found in S3 bucket '{self.bucket_name}'")
                return None
            else:
                logger.error(f"Error retrieving object '{key}' from S3: {e}")
                raise S3ServiceError(f"Failed to retrieve object from S3: {e}")
        except Exception as e:
            logger.exception(f"Unexpected error getting object '{key}': {e}")
            raise S3ServiceError(f"Unexpected error retrieving object: {e}")

    def generate_presigned_url(self, key: str, expiration: int = 3600, http_method: str = 'GET') -> str or None:
        """
        Generate a presigned URL to share an S3 object (GET or PUT).
        """
        s3_action = 'get_object' if http_method.upper() == 'GET' else \
                    'put_object' if http_method.upper() == 'PUT' else \
                    None

        if not s3_action:
             raise ValueError(f"Unsupported http_method for presigned URL: {http_method}")

        try:
            url = self.s3_client.generate_presigned_url(
                s3_action,
                Params={'Bucket': self.bucket_name, 'Key': key},
                ExpiresIn=expiration,
                HttpMethod=http_method.upper()
            )
            logger.info(f"Generated presigned {http_method} URL for '{key}'")
            return url
        except ClientError as e:
            logger.error(f"Error generating presigned URL for '{key}': {e}")
            raise S3ServiceError(f"Failed to generate presigned URL: {e}")
        except Exception as e:
            logger.exception(f"Unexpected error generating presigned URL for '{key}': {e}")
            raise S3ServiceError(f"Unexpected error generating presigned URL: {e}")

    def generate_presigned_post(self, key: str, fields: dict = None, conditions: list = None, expiration: int = 3600) -> dict or None:
        """
        Generate a presigned URL and fields for a POST request (direct browser uploads).
        """
        try:
            response = self.s3_client.generate_presigned_post(
                Bucket=self.bucket_name,
                Key=key,
                Fields=fields,
                Conditions=conditions,
                ExpiresIn=expiration
            )
            logger.info(f"Generated presigned POST data for key '{key}'")
            return response
        except ClientError as e:
            logger.error(f"Error generating presigned post for key '{key}': {e}")
            raise S3ServiceError(f"Failed to generate presigned post URL: {e}")
        except Exception as e:
            logger.exception(f"Unexpected error generating presigned post for '{key}': {e}")
            raise S3ServiceError(f"Unexpected error generating presigned post URL: {e}")


    def delete_object(self, key: str):
        """
        Deletes an object from the S3 bucket.
        """
        try:
            self.s3_client.delete_object(Bucket=self.bucket_name, Key=key)
            logger.info(f"Deleted object '{key}' from bucket '{self.bucket_name}'")
        except ClientError as e:
            logger.error(f"Error deleting object '{key}': {e}")
            raise S3ServiceError(f"Failed to delete object: {e}")
        except Exception as e:
            logger.exception(f"Unexpected error deleting object '{key}': {e}")
            raise S3ServiceError(f"Unexpected error deleting object: {e}")

    # Methods moved to DynamoDBClient:
    # def get_batch_job_record(...)
    # def update_batch_job_record(...)
