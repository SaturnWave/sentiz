import os
from typing import Dict, List, Any
from chalice import CORSConfig
from config import config

def setup_cors() -> CORSConfig:
    """
    Sets up CORS configuration for the Chalice application.
    
    Returns:
        CORSConfig: CORS configuration object for Chalice
    """
    # Get allowed origins from environment or use default for local development
    allowed_origins = config.ALLOWED_ORIGINS
    
    # Create CORS configuration using the Chalice CORSConfig class
    cors_config = CORSConfig(
        allow_origin=allowed_origins,
        allow_headers=[
            'Content-Type',
            'X-Amz-Date',
            'Authorization',
            'X-Api-Key',
            'X-Amz-Security-Token'
        ],
        max_age=600,
        expose_headers=['Content-Type', 'X-Amz-Date', 'X-Api-Key'],
        allow_credentials=True
    )
    
    return cors_config