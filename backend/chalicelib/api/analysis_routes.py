from chalice import Chalice, Response
from chalicelib.core.text_analyzer import TextAnalyzer
from chalicelib.services.comprehend import ComprehendService
from chalicelib.services.s3_client import S3Client
from chalicelib.services.dynamodb_client import DynamoDBClient
from chalicelib.utils.validation import validate_analysis_request
import json

# Initialize services
comprehend_service = ComprehendService()
s3_client = S3Client()
dynamodb_client = DynamoDBClient()
text_analyzer = TextAnalyzer(
    comprehend_service=comprehend_service,
    storage_service=s3_client,
    db_service=dynamodb_client
)

def register_routes(app: Chalice):
    @app.route('/analyze', methods=['POST'], cors=True)
    def analyze_text():
        """
        Analyze sentiment of text
        """
        try:
            request_body = app.current_request.json_body
            
            # Validate request
            if not validate_analysis_request(request_body):
                return Response(
                    body={'error': 'Invalid request format'},
                    status_code=400,
                    headers={'Content-Type': 'application/json'}
                )
            
            text = request_body.get('text', '')
            source = request_body.get('source', 'direct_input')
            user_id = request_body.get('user_id', 'anonymous')
            
            # Call text analyzer service
            result = text_analyzer.analyze(text, user_id, source)
            
            return Response(
                body=result,
                status_code=200,
                headers={'Content-Type': 'application/json'}
            )
            
        except Exception as e:
            return Response(
                body={'error': str(e)},
                status_code=500,
                headers={'Content-Type': 'application/json'}
            )
    
    @app.route('/analyze/{analysis_id}', methods=['GET'], cors=True)
    def get_analysis(analysis_id):
        """
        Get analysis result by ID
        """
        try:
            user_id = app.current_request.query_params.get('user_id', 'anonymous')
            result = text_analyzer.get_analysis(analysis_id, user_id)
            
            if not result:
                return Response(
                    body={'error': 'Analysis not found'},
                    status_code=404,
                    headers={'Content-Type': 'application/json'}
                )
            
            return Response(
                body=result,
                status_code=200,
                headers={'Content-Type': 'application/json'}
            )
            
        except Exception as e:
            return Response(
                body={'error': str(e)},
                status_code=500,
                headers={'Content-Type': 'application/json'}
            )