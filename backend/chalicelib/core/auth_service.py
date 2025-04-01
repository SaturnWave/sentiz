import logging
import json
import os
import boto3
from typing import Dict, Any
from chalice import Response
from botocore.exceptions import ClientError
from config import config

logger = logging.getLogger(__name__)

class AuthService:
    """Service class to handle user authentication operations"""
    
    def __init__(self):
        """Initialize the auth service with AWS Cognito client"""
        self.cognito_client = None
        self.user_pool_id = config.USER_POOL_ID
        self.client_id = config.USER_POOL_CLIENT_ID
        
        if self.user_pool_id and self.client_id:
            self.cognito_client = boto3.client('cognito-idp')
            logger.info(f"Cognito client initialized with User Pool ID: {self.user_pool_id}")
        else:
            logger.warning("Cognito User Pool ID or Client ID not configured. Authentication will be limited.")
    
    def register_user(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Register a new user in the system
        
        Args:
            data: Registration data including username, password, email
            
        Returns:
            Dict containing registration result
        """
        try:
            if not self.cognito_client:
                # Mock response for local development
                logger.info(f"Mock registration for user: {data.get('username')}")
                return {
                    "message": "User registered successfully (mock)",
                    "user": {"username": data.get("username")},
                    "status": "SUCCESS"
                }
            
            # Extract user data
            username = data.get("username")
            password = data.get("password")
            email = data.get("email")
            
            if not all([username, password, email]):
                return {"error": "Missing required fields", "status_code": 400}
            
            # Register user with Cognito
            response = self.cognito_client.sign_up(
                ClientId=self.client_id,
                Username=username,
                Password=password,
                UserAttributes=[
                    {"Name": "email", "Value": email},
                ]
            )
            
            return {
                "message": "User registered successfully. Verification required.",
                "user_id": response["UserSub"],
                "status": "SUCCESS"
            }
            
        except ClientError as e:
            error_message = e.response["Error"]["Message"]
            logger.error(f"Cognito error: {error_message}")
            return {"error": error_message, "status_code": 400}
        
        except Exception as e:
            logger.error(f"Registration error: {str(e)}")
            return {"error": str(e), "status_code": 500}
    
    def login_user(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Login a user
        
        Args:
            data: Login credentials including username and password
            
        Returns:
            Dict containing login result with tokens
        """
        try:
            if not self.cognito_client:
                # Mock response for local development
                logger.info(f"Mock login for user: {data.get('username')}")
                return {
                    "message": "Logged in successfully (mock)",
                    "tokens": {
                        "id_token": "mock-id-token",
                        "access_token": "mock-access-token",
                        "refresh_token": "mock-refresh-token"
                    },
                    "user": {"username": data.get("username")},
                    "status": "SUCCESS"
                }
            
            # Extract login data
            username = data.get("username")
            password = data.get("password")
            
            if not all([username, password]):
                return {"error": "Missing username or password", "status_code": 400}
            
            # Authenticate with Cognito
            response = self.cognito_client.initiate_auth(
                ClientId=self.client_id,
                AuthFlow="USER_PASSWORD_AUTH",
                AuthParameters={
                    "USERNAME": username,
                    "PASSWORD": password
                }
            )
            
            return {
                "message": "Logged in successfully",
                "tokens": response["AuthenticationResult"],
                "status": "SUCCESS"
            }
            
        except ClientError as e:
            error_message = e.response["Error"]["Message"]
            logger.error(f"Cognito error: {error_message}")
            return {"error": error_message, "status_code": 400}
        
        except Exception as e:
            logger.error(f"Login error: {str(e)}")
            return {"error": str(e), "status_code": 500}
    
    def verify_user(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Verify a user's account with confirmation code
        
        Args:
            data: Verification data including username and confirmation code
            
        Returns:
            Dict containing verification result
        """
        try:
            if not self.cognito_client:
                # Mock response for local development
                logger.info(f"Mock verification for user: {data.get('username')}")
                return {
                    "message": "User verified successfully (mock)",
                    "status": "SUCCESS"
                }
            
            # Extract verification data
            username = data.get("username")
            confirmation_code = data.get("code")
            
            if not all([username, confirmation_code]):
                return {"error": "Missing username or verification code", "status_code": 400}
            
            # Confirm signup with Cognito
            self.cognito_client.confirm_sign_up(
                ClientId=self.client_id,
                Username=username,
                ConfirmationCode=confirmation_code
            )
            
            return {
                "message": "User verified successfully",
                "status": "SUCCESS"
            }
            
        except ClientError as e:
            error_message = e.response["Error"]["Message"]
            logger.error(f"Cognito error: {error_message}")
            return {"error": error_message, "status_code": 400}
        
        except Exception as e:
            logger.error(f"Verification error: {str(e)}")
            return {"error": str(e), "status_code": 500}