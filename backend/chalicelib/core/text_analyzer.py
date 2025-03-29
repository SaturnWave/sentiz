import uuid
import json
import datetime
from chalicelib.services.comprehend import ComprehendService
from chalicelib.services.s3_client import S3Client
from chalicelib.services.dynamodb_client import DynamoDBClient

class TextAnalyzer:
    def __init__(self, comprehend_service, storage_service, db_service):
        self.comprehend_service = comprehend_service
        self.storage_service = storage_service
        self.db_service = db_service
    
    def analyze(self, text, user_id, source='direct_input'):
        """
        Analyze text and return sentiment analysis results
        
        Args:
            text (str): Text to analyze
            user_id (str): User identifier
            source (str): Source of the text (e.g., 'twitter', 'facebook')
            
        Returns:
            dict: Analysis result including sentiment and key phrases
        """
        if not text:
            raise ValueError("Text cannot be empty")
        
        # Generate unique ID for this analysis
        analysis_id = str(uuid.uuid4())
        timestamp = datetime.datetime.now().isoformat()
        
        # Store original text in S3
        text_path = f"raw/{user_id}/{analysis_id}.txt"
        self.storage_service.store_object(text_path, text, "text/plain")
        
        # Analyze sentiment with AWS Comprehend
        sentiment_result = self.comprehend_service.analyze_sentiment(text)
        
        # Extract key phrases
        key_phrases = self.comprehend_service.extract_key_phrases(text)
        
        # Combine results
        result = {
            "analysis_id": analysis_id,
            "user_id": user_id,
            "text_length": len(text),
            "source": source,
            "timestamp": timestamp,
            "sentiment": sentiment_result.get("Sentiment", "NEUTRAL"),
            "sentiment_scores": sentiment_result.get("SentimentScore", {}),
            "key_phrases": key_phrases,
            "text_sample": text[:100] + ("..." if len(text) > 100 else "")
        }
        
        # Store analysis result in S3
        result_path = f"results/{user_id}/{analysis_id}.json"
        self.storage_service.store_object(result_path, json.dumps(result), "application/json")
        
        # Store metadata in DynamoDB
        self.db_service.create_analysis_record(
            user_id=user_id,
            analysis_id=analysis_id,
            timestamp=timestamp,
            sentiment=result["sentiment"],
            source=source,
            text_length=len(text),
            s3_result_path=result_path,
            s3_text_path=text_path
        )
        
        return result
    
    def get_analysis(self, analysis_id, user_id):
        """
        Retrieve analysis result by ID
        
        Args:
            analysis_id (str): Analysis identifier
            user_id (str): User identifier
            
        Returns:
            dict: Analysis result
        """
        # Get metadata from DynamoDB
        record = self.db_service.get_analysis_record(user_id, analysis_id)
        
        if not record:
            return None
        
        # Get full result from S3
        result_path = record.get("s3_result_path")
        result_json = self.storage_service.get_object(result_path)
        
        if not result_json:
            return None
        
        return json.loads(result_json)