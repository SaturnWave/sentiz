from chalice import Chalice, CORSConfig, Response
# Import route registration functions
from chalicelib.api import auth_routes, analysis_routes, batch_routes, tts_routes, history_routes
from chalicelib.utils.security import setup_cors
import os
import logging

# Setup logging level based on config
from config import config
logging.basicConfig(level=config.LOG_LEVEL)
logger = logging.getLogger()
logger.setLevel(config.LOG_LEVEL)


app = Chalice(app_name="social-media-sentiment-analyzer")
app.log.setLevel(config.LOG_LEVEL) # Set Chalice's internal logger level

# Configure CORS using the helper function
cors_config = setup_cors()
# Apply CORS globally to all routes defined below
app.api.cors = cors_config

# Register all API route groups
auth_routes.register_routes(app)
analysis_routes.register_routes(app)
batch_routes.register_routes(app)
tts_routes.register_routes(app)
history_routes.register_routes(app)

# Root route for basic health check/testing
@app.route('/', methods=['GET'], cors=cors_config) # Apply CORS explicitly if needed, though global should work
def index():
    logger.info("Root endpoint '/' accessed.")
    return {'message': 'Social Media Sentiment Analyzer API is running'}

# Example of an authenticated route (if using API Gateway Cognito Authorizer)
# Requires authorizer setup in config.json or template.yaml
# from chalicelib.utils.security import authorizer # Assuming authorizer is defined
# @app.route('/protected', methods=['GET'], authorizer=authorizer, cors=cors_config)
# def protected_route():
#     # Access user info from the authorizer context
#     user_context = app.current_request.context.get('authorizer', {})
#     claims = user_context.get('claims', {})
#     username = claims.get('cognito:username')
#     user_id = claims.get('sub') # User sub (ID)
#     logger.info(f"Protected route accessed by user: {username} ({user_id})")
#     return {'message': f'Hello {username}, you accessed a protected route!', 'user_id': user_id}

# Note: If not using API Gateway authorizer, token verification happens inside each route handler.
