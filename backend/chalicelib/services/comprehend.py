import boto3
from botocore.exceptions import ClientError
import logging

logger = logging.getLogger(__name__)

class ComprehendServiceError(Exception):
    """Raised when AWS Comprehend service encounters an error."""
    pass

class ComprehendService:
    def __init__(self, region_name='us-east-1'):
        self.client = boto3.client('comprehend', region_name=region_name)
    
    def analyze_sentiment(self, text):
        """
        Analyze the sentiment of the provided text using AWS Comprehend
        
        Args:
            text (str): The text to analyze
            
        Returns:
            dict: Sentiment analysis result containing Sentiment and SentimentScore
        """
        if not text or len(text) == 0:
            return {
                "Sentiment": "NEUTRAL",
                "SentimentScore": {
                    "Positive": 0,
                    "Negative": 0,
                    "Neutral": 1,
                    "Mixed": 0
                }
            }
        
        # Ensure text is within AWS Comprehend limits (5KB)
        if len(text) > 5000:
            text = text[:5000]
        
        try:
            response = self.client.detect_sentiment(
                Text=text,
                LanguageCode='en'
            )
            
            # Return just the sentiment parts of the response
            return {
                "Sentiment": response['Sentiment'],
                "SentimentScore": response['SentimentScore']
            }
        
        except ClientError as e:
            logger.error(f"Error in sentiment analysis: {str(e)}")
            raise ComprehendServiceError(f"Comprehend service error: {str(e)}")
    
    def extract_key_phrases(self, text, max_phrases=10):
        """
        Extract key phrases from the provided text using AWS Comprehend
        
        Args:
            text (str): The text to analyze
            max_phrases (int): Maximum number of phrases to return
            
        Returns:
            list: List of key phrases
        """
        if not text or len(text) == 0:
            return []
        
        # Ensure text is within AWS Comprehend limits
        if len(text) > 5000:
            text = text[:5000]
        
        try:
            response = self.client.detect_key_phrases(
                Text=text,
                LanguageCode='en'
            )
            
            # Extract just the text of each key phrase and sort by score
            phrases = sorted(
                [{'text': item['Text'], 'score': item['Score']} for item in response['KeyPhrases']],
                key=lambda x: x['score'],
                reverse=True
            )
            
            # Return just the text of the top phrases
            return phrases[:max_phrases]
        
        except ClientError as e:
            logger.error(f"Error in key phrase extraction: {str(e)}")
            raise ComprehendServiceError(f"Comprehend service error: {str(e)}")