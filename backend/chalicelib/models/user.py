from dataclasses import dataclass
from typing import Dict, Any, Optional, List


@dataclass
class UserLoginRequest:
    """Request model for user login"""
    email: str
    password: str
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary"""
        return {
            "email": self.email,
            "password": self.password
        }
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'UserLoginRequest':
        """Create from dictionary"""
        return cls(
            email=data["email"],
            password=data["password"]
        )


@dataclass
class UserRegistrationRequest:
    """Request model for user registration"""
    email: str
    password: str
    name: str
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary"""
        return {
            "email": self.email,
            "password": self.password,
            "name": self.name
        }
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'UserRegistrationRequest':
        """Create from dictionary"""
        return cls(
            email=data["email"],
            password=data["password"],
            name=data["name"]
        )


@dataclass
class UserConfirmationRequest:
    """Request model for confirming a registered user"""
    email: str
    confirmation_code: str
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary"""
        return {
            "email": self.email,
            "confirmation_code": self.confirmation_code
        }
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'UserConfirmationRequest':
        """Create from dictionary"""
        return cls(
            email=data["email"],
            confirmation_code=data["confirmation_code"]
        )


@dataclass
class AuthResponse:
    """Response model for authentication operations"""
    id_token: Optional[str] = None
    access_token: Optional[str] = None
    refresh_token: Optional[str] = None
    user_id: Optional[str] = None
    success: bool = True
    message: Optional[str] = None
    error: Optional[str] = None
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary"""
        result = {
            "success": self.success
        }
        if self.id_token:
            result["id_token"] = self.id_token
        if self.access_token:
            result["access_token"] = self.access_token
        if self.refresh_token:
            result["refresh_token"] = self.refresh_token
        if self.user_id:
            result["user_id"] = self.user_id
        if self.message:
            result["message"] = self.message
        if self.error:
            result["error"] = self.error
        return result
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'AuthResponse':
        """Create from dictionary"""
        return cls(
            id_token=data.get("id_token"),
            access_token=data.get("access_token"),
            refresh_token=data.get("refresh_token"),
            user_id=data.get("user_id"),
            success=data.get("success", True),
            message=data.get("message"),
            error=data.get("error")
        )
    
    @classmethod
    def error_response(cls, error_message: str) -> 'AuthResponse':
        """Create an error response"""
        return cls(success=False, error=error_message)


@dataclass
class UserProfile:
    """Model representing a user profile"""
    user_id: str
    email: str
    name: str
    created_at: str
    preferences: Optional[Dict[str, Any]] = None
    settings: Optional[Dict[str, Any]] = None
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary"""
        result = {
            "user_id": self.user_id,
            "email": self.email,
            "name": self.name,
            "created_at": self.created_at
        }
        if self.preferences:
            result["preferences"] = self.preferences
        if self.settings:
            result["settings"] = self.settings
        return result
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'UserProfile':
        """Create from dictionary"""
        return cls(
            user_id=data["user_id"],
            email=data["email"],
            name=data["name"],
            created_at=data["created_at"],
            preferences=data.get("preferences"),
            settings=data.get("settings")
        )