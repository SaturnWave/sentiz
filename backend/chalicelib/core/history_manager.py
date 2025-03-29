import logging
import json
import base64
import binascii
from botocore.exceptions import ClientError # Import ClientError
from chalicelib.services.dynamodb_client import DynamoDBClient, DynamoDBServiceError
from chalicelib.utils.formatters import format_dynamodb_item # Ensure formatter handles lists/nested items

logger = logging.getLogger(__name__)

class HistoryManager:
    def __init__(self, db_service: DynamoDBClient):
        """
        Initializes the History Manager.

        Args:
            db_service (DynamoDBClient): Instance of DynamoDBClient.
        """
        self.db_service = db_service

    def get_user_analysis_history(self, user_id: str, limit: int = 20, last_key_dict: dict = None) -> dict:
        """
        Retrieves a paginated list of analysis history for a specific user.

        Args:
            user_id (str): The ID of the user whose history is requested.
            limit (int): The maximum number of items to return per page.
            last_key_dict (dict): The last evaluated key dictionary from a previous request.

        Returns:
            dict: A dictionary containing 'items' (list of analysis records formatted for API)
                  and 'lastEvaluatedKey' (the dictionary key for the next page, if any).
        Raises:
            ValueError: If user_id is invalid.
            DynamoDBServiceError: If there's an issue querying DynamoDB.
        """
        if not user_id:
            raise ValueError("User ID cannot be empty")

        try:
            logger.info(f"Fetching history for user '{user_id}' with limit {limit} starting from key: {last_key_dict}")
            result = self.db_service.get_user_analyses(
                user_id=user_id,
                limit=limit,
                last_evaluated_key=last_key_dict
            )

            # Items are already formatted by get_user_analyses in the corrected DynamoDBClient
            return {
                'items': result.get('items', []),
                'lastEvaluatedKey': result.get('lastEvaluatedKey') # Key itself doesn't need formatting
            }
        except DynamoDBServiceError as e:
            logger.error(f"DynamoDB error fetching history for user {user_id}: {e}")
            raise # Re-raise the specific service error
        except Exception as e:
            logger.exception(f"Unexpected error fetching history for user {user_id}: {e}")
            # Wrap unexpected errors
            raise DynamoDBServiceError(f"An unexpected error occurred while fetching history: {str(e)}")


    def get_total_analyses_count(self, user_id: str) -> int:
        """
        Gets the approximate total number of analyses performed by a user.
        Note: This uses DynamoDB's DescribeTable ItemCount which is approximate
              and updated roughly every six hours. Not suitable for precise counts.
              This implementation currently returns a PLACEHOLDER value.
        """
        if not user_id:
             logger.error("Attempted to get total analyses count without user ID.")
             return 0
        try:
            # Ideally, maintain a separate counter item in DynamoDB per user.
            # Second best: Query with Count=True and ProjectionExpression, paginating through all. (Still costly)
            # Third best (APPROXIMATE & FOR ENTIRE TABLE): Use DescribeTable (shown below, commented out)
            # Current Placeholder: Matches dashboard example.

            # table_description = self.db_service.client.describe_table(TableName=self.db_service.analysis_table_name)
            # total_items_approx = table_description.get('Table', {}).get('ItemCount', 0)
            # logger.warning(f"get_total_analyses_count for user {user_id} returning approximate count for *entire* table: {total_items_approx}")
            # return total_items_approx # THIS IS NOT PER USER!

            # Using placeholder value from Dashboard.tsx
            placeholder_count = 12400
            logger.info(f"Returning placeholder total analyses count for user {user_id}: {placeholder_count}")
            return placeholder_count

        except ClientError as e:
            logger.error(f"DynamoDB DescribeTable error getting count for user {user_id}: {e}")
            return 0 # Return 0 on error
        except DynamoDBServiceError as e:
            logger.error(f"DynamoDB service error getting count for user {user_id}: {e}")
            return 0
        except Exception as e:
            logger.exception(f"Unexpected error getting count for user {user_id}: {e}")
            return 0
