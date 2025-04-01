from chalice import Chalice, Response
from chalicelib.core.auth_service import AuthService
import logging

logger = logging.getLogger(__name__)

def register_routes(app: Chalice):
    """
    Register all authentication related routes to the Chalice app
    
    Args:
        app (Chalice): The Chalice application instance
    """
    auth_service = AuthService()
    
    @app.route('/auth/register', methods=['POST'])
    def register():
        """Register a new user"""
        try:
            request_body = app.current_request.json_body
            result = auth_service.register_user(request_body)
            return result
        except Exception as e:
            logger.error(f"Error in register: {str(e)}")
            return Response(
                body={"error": str(e)},
                status_code=500,
                headers={"Content-Type": "application/json"}
            )
    
    @app.route('/auth/login', methods=['POST'])
    def login():
        """Log in a user"""
        try:
            request_body = app.current_request.json_body
            result = auth_service.login_user(request_body)
            return result
        except Exception as e:
            logger.error(f"Error in login: {str(e)}")
            return Response(
                body={"error": str(e)},
                status_code=500,
                headers={"Content-Type": "application/json"}
            )
    
    @app.route('/auth/verify', methods=['POST'])
    def verify():
        """Verify a user's registration"""
        try:
            request_body = app.current_request.json_body
            result = auth_service.verify_user(request_body)
            return result
        except Exception as e:
            logger.error(f"Error in verify: {str(e)}")
            return Response(
                body={"error": str(e)},
                status_code=500,
                headers={"Content-Type": "application/json"}
            )

    logger.info("Auth routes registered successfully")