from chalice import Chalice, Response, BadRequestError, NotFoundError
from chalicelib.core.history_manager import HistoryManager
from chalicelib.services.dynamodb_client import DynamoDBClient, DynamoDBServiceError
from botocore.exceptions import ClientError # Import ClientError
import logging
import json # For handling lastEvaluatedKey if passed as JSON string
import base64
import binascii

logger = logging.getLogger(__name__)

# Initialize services
dynamodb_client = DynamoDBClient()
history_manager = HistoryManager(dynamodb_client)

def register_routes(app: Chalice):

    @app.route('/history', methods=['GET'], cors=True)
    def get_history():
        """
        Retrieves the analysis history for the logged-in user (or specified user).
        Supports pagination via 'limit' and 'lastKey' query parameters.
        'lastKey' should be the JSON string representation of the LastEvaluatedKey dictionary, base64 encoded.
        Requires 'user_id' query parameter.
        """
        try:
            query_params = app.current_request.query_params or {}
            user_id = query_params.get('user_id')
            if not user_id:
                 raise BadRequestError('user_id query parameter is required')

            limit_str = query_params.get('limit', '20')
            last_key_b64 = query_params.get('lastKey') # Expects base64 encoded JSON string

            try:
                limit = int(limit_str)
                if not 1 <= limit <= 100:
                    raise ValueError("Limit must be between 1 and 100")
            except ValueError:
                raise BadRequestError("Invalid 'limit' parameter. Must be an integer between 1 and 100.")

            # Decode lastKey if provided
            last_key_dict = None
            if last_key_b64:
                try:
                    last_key_json = base64.b64decode(last_key_b64.encode('utf-8')).decode('utf-8')
                    last_key_dict = json.loads(last_key_json)
                    # Basic validation: check if it's a dictionary
                    if not isinstance(last_key_dict, dict):
                        raise ValueError("Decoded lastKey is not a dictionary.")
                    # Further validation: Check for expected keys like 'userId', 'analysisId'
                    if not all(k in last_key_dict for k in ['userId', 'analysisId']):
                         raise ValueError("Decoded lastKey missing required keys.")

                except (TypeError, ValueError, binascii.Error, json.JSONDecodeError) as e:
                     logger.warning(f"Invalid base64/JSON format for lastKey: {last_key_b64}. Error: {e}")
                     raise BadRequestError(f"Invalid 'lastKey' format: {e}")

            # Call the history manager
            result = history_manager.get_user_analysis_history(
                user_id=user_id,
                limit=limit,
                last_key_dict=last_key_dict # Pass the dictionary
            )

            # Encode the next key for the response
            next_last_key_b64 = None
            if result.get('lastEvaluatedKey'):
                try:
                    # Convert Decimals in the key to standard numbers before encoding
                    serializable_key = format_dynamodb_item(result['lastEvaluatedKey'])
                    next_last_key_json = json.dumps(serializable_key)
                    next_last_key_b64 = base64.b64encode(next_last_key_json.encode('utf-8')).decode('utf-8')
                except (TypeError, ValueError) as e:
                    logger.error(f"Failed to encode next lastEvaluatedKey: {result['lastEvaluatedKey']}. Error: {e}")
                    # Decide how to handle this - maybe return null or log and continue

            # Prepare response
            response_body = {
                'items': result.get('items', []), # Items are already formatted
                'lastEvaluatedKey': next_last_key_b64 # Send back base64 encoded string for next request
            }

            return Response(
                body=response_body,
                status_code=200,
                headers={'Content-Type': 'application/json'}
            )

        except (BadRequestError, ValueError) as e:
             logger.warning(f"Bad request for history: {e}")
             return Response(body={'error': str(e)}, status_code=400)
        except DynamoDBServiceError as e:
             logger.error(f"Service error fetching history: {e}")
             return Response(body={'error': 'Failed to retrieve history due to a service error.'}, status_code=500)
        except Exception as e:
            logger.exception(f"Unexpected error retrieving history: {e}")
            return Response(body={'error': 'An unexpected error occurred.'}, status_code=500)

    @app.route('/history/summary', methods=['GET'], cors=True)
    def get_history_summary():
        """
        Retrieves summary statistics for the user's history.
        Requires 'user_id' query parameter.
        """
        try:
            user_id = app.current_request.query_params.get('user_id')
            if not user_id:
                 raise BadRequestError('user_id query parameter is required')

            total_analyses = history_manager.get_total_analyses_count(user_id)
            # Fetch recent analyses for dashboard gauge (already done in historySlice, but could be done here too)
            recent_analyses_result = history_manager.get_user_analysis_history(user_id, limit=5) # Get latest 5

            summary = {
                'total_analyses': total_analyses,
                'recent_analyses_preview': recent_analyses_result.get('items', []) # Send recent items too if needed
            }

            return Response(
                body=summary,
                status_code=200,
                headers={'Content-Type': 'application/json'}
            )

        except BadRequestError as e:
             logger.warning(f"Bad request for history summary: {e}")
             return Response(body={'error': str(e)}, status_code=400)
        except DynamoDBServiceError as e:
             logger.error(f"Service error fetching history summary: {e}")
             return Response(body={'error': 'Failed to retrieve history summary due to a service error.'}, status_code=500)
        except Exception as e:
            logger.exception(f"Unexpected error retrieving history summary: {e}")
            return Response(body={'error': 'An unexpected error occurred.'}, status_code=500)
