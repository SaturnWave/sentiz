import decimal
import json
from datetime import datetime
from typing import Dict, Any, List, Union

def format_timestamp(timestamp: str) -> str:
    """
    Format a timestamp string into a human-readable format.
    
    Args:
        timestamp (str): ISO-format timestamp string
        
    Returns:
        str: Formatted date and time string
    """
    try:
        dt = datetime.fromisoformat(timestamp)
        return dt.strftime("%B %d, %Y at %I:%M %p")
    except (ValueError, TypeError):
        return timestamp

def format_sentiment(sentiment: str) -> str:
    """
    Format a sentiment value with proper capitalization.
    
    Args:
        sentiment (str): Raw sentiment value (e.g., "POSITIVE", "NEGATIVE")
        
    Returns:
        str: Formatted sentiment string (e.g., "Positive", "Negative")
    """
    if not sentiment:
        return "Unknown"
    
    return sentiment.capitalize()

def format_percentage(value: float) -> str:
    """
    Format a decimal value as a percentage string.
    
    Args:
        value (float): Decimal value (0-1)
        
    Returns:
        str: Formatted percentage string
    """
    if value is None:
        return "0%"
    
    return f"{value * 100:.1f}%"

def format_file_size(size_bytes: int) -> str:
    """
    Format file size in bytes to a human-readable string.
    
    Args:
        size_bytes (int): File size in bytes
        
    Returns:
        str: Formatted file size string
    """
    if size_bytes < 1024:
        return f"{size_bytes} bytes"
    elif size_bytes < 1024 * 1024:
        return f"{size_bytes / 1024:.1f} KB"
    else:
        return f"{size_bytes / (1024 * 1024):.1f} MB"

def format_dynamodb_item(item):
    """
    Convert DynamoDB item with Decimal types to JSON-serializable format.
    
    Args:
        item (dict): DynamoDB item with potential Decimal values
        
    Returns:
        dict: JSON-serializable dictionary
    """
    if isinstance(item, dict):
        return {k: format_dynamodb_item(v) for k, v in item.items()}
    elif isinstance(item, list):
        return [format_dynamodb_item(i) for i in item]
    elif isinstance(item, decimal.Decimal):
        if item % 1 == 0:
            return int(item)
        else:
            return float(item)
    elif isinstance(item, datetime):
        return item.isoformat()
    else:
        return item

def format_analysis_result(result: Dict[str, Any]) -> Dict[str, Any]:
    """
    Format an analysis result for API response.
    
    Args:
        result (dict): Raw analysis result
        
    Returns:
        dict: Formatted analysis result
    """
    if not result:
        return {}
    
    # Convert any Decimal values
    formatted_result = format_dynamodb_item(result)
    
    # Format specific fields if needed
    if 'timestamp' in formatted_result:
        formatted_result['formatted_timestamp'] = format_timestamp(formatted_result['timestamp'])
    
    if 'sentiment' in formatted_result:
        formatted_result['formatted_sentiment'] = format_sentiment(formatted_result['sentiment'])
    
    return formatted_result

def format_batch_job(job: Dict[str, Any]) -> Dict[str, Any]:
    """
    Format a batch job for API response.
    
    Args:
        job (dict): Raw batch job data
        
    Returns:
        dict: Formatted batch job
    """
    if not job:
        return {}
    
    # Convert any Decimal values
    formatted_job = format_dynamodb_item(job)
    
    # Format specific fields if needed
    if 'timestamp' in formatted_job:
        formatted_job['formatted_timestamp'] = format_timestamp(formatted_job['timestamp'])
    
    if 'totalRecords' in formatted_job and 'processedRecords' in formatted_job:
        if formatted_job['totalRecords'] > 0:
            formatted_job['progress_percentage'] = (formatted_job['processedRecords'] / formatted_job['totalRecords']) * 100
        else:
            formatted_job['progress_percentage'] = 0
    
    return formatted_job

def format_api_response(data: Any, status: str = "success", message: str = "") -> Dict[str, Any]:
    """
    Format a standard API response.
    
    Args:
        data (Any): Response data
        status (str): Response status ("success" or "error")
        message (str): Optional status message
        
    Returns:
        dict: Formatted API response
    """
    response = {
        "status": status,
        "data": data
    }
    
    if message:
        response["message"] = message
    
    return response