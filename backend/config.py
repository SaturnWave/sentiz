import os
from dotenv import load_dotenv

# Load environment variables from .env file if it exists (for local development)
load_dotenv()

class Config:
    """Base configuration."""
    BUCKET_NAME = os.environ.get('BUCKET_NAME', 'your-unique-sentiment-analyzer-bucket') # CHANGE THIS DEFAULT LATER
    ANALYSIS_TABLE_NAME = os.environ.get('ANALYSIS_TABLE_NAME', 'sentiment-analysis-records')
    BATCH_TABLE_NAME = os.environ.get('BATCH_TABLE_NAME', 'sentiment-batch-jobs')
    USER_POOL_ID = os.environ.get('USER_POOL_ID', '') # MUST BE SET in .env or environment
    USER_POOL_CLIENT_ID = os.environ.get('USER_POOL_CLIENT_ID', '') # MUST BE SET in .env or environment
    REGION = os.environ.get('REGION', 'us-east-1') # Default or from env
    USER_POOL_ARN = os.environ.get('USER_POOL_ARN', '') # Needed for API Gateway Authorizer if used
    ALLOWED_ORIGINS = os.environ.get('ALLOWED_ORIGINS', 'http://localhost:3000').split(',')

class DevelopmentConfig(Config):
    """Development configuration."""
    DEBUG = True
    LOG_LEVEL = 'DEBUG'

class ProductionConfig(Config):
    """Production configuration."""
    DEBUG = False
    LOG_LEVEL = 'INFO'

# Select configuration based on environment variable 'STAGE' (e.g., set in Chalice config)
env_stage = os.environ.get('STAGE', 'dev').lower()
if env_stage == 'prod':
    config = ProductionConfig()
else:
    config = DevelopmentConfig()

print(f"--- Using {type(config).__name__} ---")
print(f"Bucket Name: {config.BUCKET_NAME}")
print(f"Region: {config.REGION}")
print(f"Allowed Origins: {config.ALLOWED_ORIGINS}")
# Avoid printing sensitive IDs in production logs if possible
if env_stage == 'dev':
     print(f"User Pool ID: {config.USER_POOL_ID}")
     print(f"Client ID: {config.USER_POOL_CLIENT_ID}")
