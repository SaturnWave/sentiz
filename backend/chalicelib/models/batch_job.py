from dataclasses import dataclass, asdict
from typing import Dict, Any, Optional
from datetime import datetime
from enum import Enum

class BatchJobStatus(Enum):
    """
    Enum representing the various states of a batch job
    """
    CREATED = "CREATED"
    PROCESSING = "PROCESSING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"
    CANCELED = "CANCELED"

@dataclass
class BatchJob:
    """
    Data class representing a batch processing job
    """
    job_id: str
    user_id: str
    name: str
    status: str
    created_at: str
    item_count: int
    completed_count: int = 0
    updated_at: Optional[str] = None
    completed_at: Optional[str] = None
    results_path: Optional[str] = None
    error_message: Optional[str] = None
    
    def to_dict(self) -> Dict[str, Any]:
        """
        Convert to dictionary format for storage in DynamoDB
        
        Returns:
            Dict[str, Any]: Dictionary representation of the job
        """
        # Convert to dict and filter out None values
        result = {k: v for k, v in asdict(self).items() if v is not None}
        
        # Handle dates if they're datetime objects
        for key in ['created_at', 'updated_at', 'completed_at']:
            if key in result and isinstance(result[key], datetime):
                result[key] = result[key].isoformat()
        
        return result
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'BatchJob':
        """
        Create a BatchJob instance from a dictionary
        
        Args:
            data: Dictionary containing job data
        
        Returns:
            BatchJob: Instance created from the dictionary
        """
        # Initialize required fields
        job_id = data.get('jobId')
        user_id = data.get('userId')
        name = data.get('name')
        status = data.get('status')
        created_at = data.get('createdAt')
        item_count = data.get('itemCount', 0)
        
        # Create instance with required fields
        job = cls(
            job_id=job_id,
            user_id=user_id,
            name=name,
            status=status,
            created_at=created_at,
            item_count=item_count
        )
        
        # Set optional fields if they exist
        if 'completedCount' in data:
            job.completed_count = data['completedCount']
        
        if 'updatedAt' in data:
            job.updated_at = data['updatedAt']
        
        if 'completedAt' in data:
            job.completed_at = data['completedAt']
        
        if 'resultsPath' in data:
            job.results_path = data['resultsPath']
        
        if 'errorMessage' in data:
            job.error_message = data['errorMessage']
        
        return job

# For backward compatibility, alias BatchJob as BatchJobModel
BatchJobModel = BatchJob