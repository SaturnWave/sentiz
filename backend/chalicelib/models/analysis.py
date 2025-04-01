from typing import List, Dict, Optional, Any
from dataclasses import dataclass
from datetime import datetime


@dataclass
class SentimentScores:
    """Model representing sentiment analysis scores"""
    positive: float
    negative: float
    neutral: float
    mixed: float


@dataclass
class KeyPhrase:
    """Model representing a key phrase extracted from text"""
    text: str
    score: Optional[float] = None


@dataclass
class AnalysisResultModel:
    """Model representing the result of text analysis"""
    text: str
    sentiment: str
    sentiment_scores: SentimentScores
    key_phrases: List[KeyPhrase]
    language_code: str
    created_at: str = None
    
    def __post_init__(self):
        if self.created_at is None:
            self.created_at = datetime.utcnow().isoformat()
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert the model to a dictionary"""
        return {
            "text": self.text,
            "sentiment": self.sentiment,
            "sentiment_scores": {
                "positive": self.sentiment_scores.positive,
                "negative": self.sentiment_scores.negative,
                "neutral": self.sentiment_scores.neutral,
                "mixed": self.sentiment_scores.mixed
            },
            "key_phrases": [{"text": kp.text, "score": kp.score} for kp in self.key_phrases],
            "language_code": self.language_code,
            "created_at": self.created_at
        }
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'AnalysisResultModel':
        """Create an instance from a dictionary"""
        sentiment_scores = SentimentScores(
            positive=data["sentiment_scores"]["positive"],
            negative=data["sentiment_scores"]["negative"],
            neutral=data["sentiment_scores"]["neutral"],
            mixed=data["sentiment_scores"]["mixed"]
        )
        
        key_phrases = [
            KeyPhrase(text=kp["text"], score=kp.get("score")) 
            for kp in data["key_phrases"]
        ]
        
        return cls(
            text=data["text"],
            sentiment=data["sentiment"],
            sentiment_scores=sentiment_scores,
            key_phrases=key_phrases,
            language_code=data["language_code"],
            created_at=data.get("created_at")
        )


class AnalysisRequest:
    """Request model for text analysis"""
    def __init__(self, text: str, language_code: str = "en"):
        self.text = text
        self.language_code = language_code
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary"""
        return {
            "text": self.text,
            "language_code": self.language_code
        }
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'AnalysisRequest':
        """Create from dictionary"""
        return cls(
            text=data["text"],
            language_code=data.get("language_code", "en")
        )


class AnalysisResponse:
    """Response model for text analysis"""
    def __init__(self, 
                 result: AnalysisResultModel, 
                 request_id: str = None,
                 success: bool = True,
                 error: str = None):
        self.result = result
        self.request_id = request_id
        self.success = success
        self.error = error
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary"""
        return {
            "result": self.result.to_dict() if self.result else None,
            "request_id": self.request_id,
            "success": self.success,
            "error": self.error
        }
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'AnalysisResponse':
        """Create from dictionary"""
        result = None
        if data.get("result"):
            result = AnalysisResultModel.from_dict(data["result"])
            
        return cls(
            result=result,
            request_id=data.get("request_id"),
            success=data.get("success", True),
            error=data.get("error")
        )
    
    @classmethod
    def error_response(cls, error_message: str) -> 'AnalysisResponse':
        """Create an error response"""
        return cls(result=None, success=False, error=error_message)