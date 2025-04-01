import re
from typing import Dict, Any

# Basic email regex (RFC 5322 standard is complex, this is a common practical one)
EMAIL_REGEX = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
# Basic password check (example: min 8 chars, at least one number, one uppercase, one lowercase)
# Adjust complexity as required by Cognito policy
PASSWORD_REGEX = r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$'

def validate_analysis_request(body: Dict[str, Any]) -> bool:
    """
    Validates the request body for the /analyze endpoint.
    """
    if not isinstance(body, dict):
        return False
    # Text field must exist and be a non-empty string
    text = body.get('text')
    if not isinstance(text, str) or not text.strip():
        return False
    # Optional fields validation (basic type checks)
    if 'source' in body and not isinstance(body.get('source'), str):
        return False
    # user_id is now typically handled by auth context, not passed in body usually
    # if 'user_id' in body and not isinstance(body.get('user_id'), str):
    #    return False
    return True

def validate_registration_request(body: Dict[str, Any]) -> bool:
    """
    Validates the request body for the /register endpoint.
    """
    if not isinstance(body, dict):
        return False
    # Check required keys
    if not all(k in body for k in ('username', 'password', 'email')):
        return False
    # Validate types and basic constraints
    username = body.get('username')
    password = body.get('password')
    email = body.get('email')
    if not isinstance(username, str) or len(username) < 3 or len(username) > 128: # Cognito limits
        return False
    if not isinstance(password, str): # Add regex check if desired: or not re.match(PASSWORD_REGEX, password):
         return False # Basic check, Cognito enforces policy
    if not isinstance(email, str) or not re.match(EMAIL_REGEX, email):
        return False
    return True

def validate_confirmation_request(body: Dict[str, Any]) -> bool:
    """Validates the request body for the /confirm endpoint."""
    if not isinstance(body, dict):
        return False
    if not all(k in body for k in ('username', 'confirmation_code')):
        return False
    if not isinstance(body.get('username'), str) or not body['username']:
        return False
    # Confirmation codes are typically 6 digits
    code = body.get('confirmation_code')
    if not isinstance(code, str) or not re.fullmatch(r'\d{6}', code):
        return False
    return True


def validate_login_request(body: Dict[str, Any]) -> bool:
    """
    Validates the request body for the /login endpoint.
    """
    if not isinstance(body, dict):
        return False
    if not all(k in body for k in ('username', 'password')):
        return False
    if not isinstance(body.get('username'), str) or not body['username']:
        return False
    if not isinstance(body.get('password'), str) or not body['password']:
        return False
    return True

def validate_batch_submission(content_type: str) -> bool:
    """
    Validates if the uploaded file type is acceptable for batch processing.
    """
    allowed_types = [
        'text/csv',
        'application/csv', # Common alternative
        'application/vnd.ms-excel' # Sometimes used for CSV
    ]
    return content_type.lower() in allowed_types

def validate_batch_start_request(body: Dict[str, Any]) -> bool:
    """Validates request for the /batch/start endpoint."""
    if not isinstance(body, dict):
        return False
    required_keys = ['jobId', 's3Key', 'filename', 'userId']
    if not all(k in body for k in required_keys):
        return False
    if not all(isinstance(body.get(k), str) and body[k] for k in required_keys):
        return False
    # Basic S3 key structure check (optional)
    if not body['s3Key'].startswith('batch-input/'):
         return False
    return True

def validate_batch_request(body: Dict[str, Any]) -> bool:
    """
    Validates the request body for batch processing job creation.
    
    Expected format:
    {
        "user_id": "string",
        "name": "string",
        "data": [
            {"text": "string", "id": "string"},
            ...
        ]
    }
    """
    if not isinstance(body, dict):
        return False
        
    # Check for user_id (optional in some cases)
    if 'user_id' in body and not isinstance(body.get('user_id'), str):
        return False
        
    # Check job name if provided
    if 'name' in body and not isinstance(body.get('name'), str):
        return False
        
    # Validate data array - this is required
    data = body.get('data')
    if not isinstance(data, list) or len(data) == 0:
        return False
        
    # Validate each item in the data array
    for item in data:
        if not isinstance(item, dict):
            return False
            
        # Each item must have text
        if 'text' not in item or not isinstance(item['text'], str) or not item['text'].strip():
            return False
            
        # ID is optional but must be a string if present
        if 'id' in item and not isinstance(item['id'], str):
            return False
            
    return True

def validate_tts_request(query_params: Dict[str, Any]) -> bool:
    """
    Validates query parameters for the GET /tts/{analysis_id} endpoint.
    """
    if not isinstance(query_params, dict): 
        return False
    
    # Check for required user_id
    if 'user_id' not in query_params or not query_params['user_id']:
        return False
        
    # Validate voice parameter if provided
    if 'voice' in query_params:
        if not isinstance(query_params['voice'], str):
            return False
        
        # Optional: Add allowed voices validation
        allowed_voices = ['Joanna', 'Matthew', 'Salli', 'Kimberly', 'Kendra', 'Joey', 'Justin']
        if query_params['voice'] not in allowed_voices:
            return False
    
    return True

def validate_presign_request(body: Dict[str, Any]) -> bool:
    """Validates request for the /batch/presign endpoint."""
    if not isinstance(body, dict): return False
    if not all(k in body for k in ('filename', 'contentType', 'userId')): return False
    if not all(isinstance(body.get(k), str) and body[k] for k in ['filename', 'contentType', 'userId']): return False
    # Optional: Validate filename format/extension
    if not body['filename'].lower().endswith('.csv'): return False
    return True

# Add more validation functions as needed...