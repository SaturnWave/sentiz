from chalice import Chalice, Response, NotFoundError, BadRequestError
from botocore.exceptions import ClientError # Import ClientError
from chalicelib.core.tts_generator import TTSGenerator
from chalicelib.core.text_analyzer import TextAnalyzer # To get text if needed
from chalicelib.services.polly import PollyService, PollyServiceError
from chalicelib.services.s3_client import S3Client, S3ServiceError
from chalicelib.services.dynamodb_client import DynamoDBClient, DynamoDBServiceError
from chalicelib.utils.validation import validate_tts_request # Import validator
import json
import logging

logger = logging.getLogger(__name__)

# Initialize services
# Consider dependency injection if complexity grows
comprehend_service = ComprehendService()
s3_client = S3Client()
dynamodb_client = DynamoDBClient()
polly_service = PollyService()
# text_analyzer = TextAnalyzer(comprehend_service, s3_client, dynamodb_client) # Might not be needed here
tts_generator = TTSGenerator(polly_service, s3_client)

def register_routes(app: Chalice):

    @app.route('/tts/{analysis_id}', methods=['GET'], cors=True)
    def generate_tts(analysis_id):
        """
        Generates Text-to-Speech audio for a given analysis ID and returns a presigned URL.
        Expects 'user_id' as a query parameter.
        """
        try:
            query_params = app.current_request.query_params or {}
            # if not validate_tts_request(query_params): # Basic validation if needed
            #     raise BadRequestError("Invalid query parameters for TTS request.")

            user_id = query_params.get('user_id')
            if not user_id: # Make user_id strictly required
                 raise BadRequestError('user_id query parameter is required')

            # 1. Retrieve the analysis record to get the text path
            record = dynamodb_client.get_analysis_record(user_id, analysis_id)
            if not record:
                logger.warning(f"Analysis record not found for ID: {analysis_id}, User: {user_id}")
                raise NotFoundError(f"Analysis {analysis_id} not found for user.")

            text_path = record.get("s3TextPath")
            if not text_path:
                 logger.error(f"S3 text path missing in record for analysis ID: {analysis_id}")
                 # Internal error, data should be consistent
                 return Response(body={'error': 'Internal configuration error: Analysis text path not found'}, status_code=500)

            # 2. Retrieve the text content from S3
            raw_text_bytes = s3_client.get_object(text_path)
            if raw_text_bytes is None:
                 logger.error(f"Could not retrieve text from S3 for analysis ID: {analysis_id} at path {text_path}")
                 # Data inconsistency
                 return Response(body={'error': 'Failed to retrieve analysis text content'}, status_code=500)

            try:
                 text_to_speak = raw_text_bytes.decode('utf-8')
            except UnicodeDecodeError:
                 logger.error(f"Failed to decode text from S3 for analysis ID {analysis_id} as UTF-8.")
                 return Response(body={'error': 'Failed to decode analysis text.'}, status_code=500)


            # 3. Generate TTS audio and get the presigned URL
            voice_id = query_params.get('voice', 'Joanna') # Allow specifying voice via query param

            audio_url = tts_generator.generate_tts_audio(
                text=text_to_speak,
                analysis_id=analysis_id,
                user_id=user_id,
                voice_id=voice_id
            )

            if audio_url:
                return Response(
                    body={'audio_url': audio_url},
                    status_code=200,
                    headers={'Content-Type': 'application/json'}
                )
            else:
                # Use a more specific error if possible from TTSGenerator, otherwise generic
                logger.error(f"TTS generation failed for analysis ID: {analysis_id}")
                return Response(
                    body={'error': 'Failed to generate Text-to-Speech audio for this analysis.'},
                    status_code=500,
                    headers={'Content-Type': 'application/json'}
                )

        except NotFoundError as e:
            return Response(body={'error': str(e)}, status_code=404)
        except BadRequestError as e:
            return Response(body={'error': str(e)}, status_code=400)
        except (S3ServiceError, DynamoDBServiceError, PollyServiceError) as e:
             logger.error(f"Service error during TTS generation for analysis {analysis_id}: {e}")
             return Response(body={'error': 'A service error occurred while generating audio.'}, status_code=503) # Service Unavailable
        except Exception as e:
            logger.exception(f"Unexpected error generating TTS for analysis {analysis_id}: {e}")
            return Response(
                body={'error': f"An unexpected server error occurred."},
                status_code=500,
                headers={'Content-Type': 'application/json'}
            )

