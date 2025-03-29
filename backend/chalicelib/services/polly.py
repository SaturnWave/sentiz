import boto3
import logging
from botocore.exceptions import ClientError
from config import config # Assuming your config is in backend/config.py

logger = logging.getLogger(__name__)

class PollyServiceError(Exception):
    """Raised when Polly service encounters an error."""
    pass

class PollyService:
    def __init__(self, region_name=None):
        """
        Initializes the Polly client.

        Args:
            region_name (str): AWS region name. Defaults to config.REGION.
        """
        self.region_name = region_name or config.REGION
        self.polly_client = boto3.client('polly', region_name=self.region_name)
        # S3 client will be injected into TTSGenerator, not needed directly here
        # self.s3_client = S3Client(region_name=self.region_name)
        # self.bucket_name = config.BUCKET_NAME

    def synthesize_speech(self, text: str, voice_id: str = 'Joanna', output_format: str = 'mp3', engine: str = 'neural') -> bytes or None:
        """
        Synthesizes speech from text directly using synchronous API.

        Args:
            text (str): The text to synthesize.
            voice_id (str): The Polly voice ID to use (e.g., 'Joanna', 'Matthew').
            output_format (str): The desired audio format ('mp3', 'ogg_vorbis', 'pcm').
            engine (str): Polly engine ('standard' or 'neural'). Neural is generally higher quality.

        Returns:
            bytes or None: The audio stream as bytes, or None if Polly returns no stream.

        Raises:
            PollyServiceError: If there's an error during synthesis.
            ValueError: If text is empty.
        """
        if not text or not text.strip():
            raise ValueError("Text for speech synthesis cannot be empty.")

        # Check text length against synthesize_speech limits (approx 1500 chars plain text)
        # This should ideally be handled by the caller (TTSGenerator)
        # if len(text) > 1500:
        #     logger.warning("Text may be too long for synchronous synthesis, consider using synthesize_to_s3.")
        #     # Optionally truncate here, but better handled upstream
        #     # text = text[:1500]

        try:
            response = self.polly_client.synthesize_speech(
                Text=text,
                OutputFormat=output_format,
                VoiceId=voice_id,
                Engine=engine
            )

            if 'AudioStream' in response:
                audio_data = response['AudioStream'].read()
                logger.info(f"Successfully synthesized {len(audio_data)} bytes of speech using {voice_id} ({engine})")
                return audio_data
            else:
                logger.error("Polly synthesize_speech response did not contain AudioStream.")
                # This case is unlikely according to docs if the call succeeds, but good to handle
                return None

        except ClientError as e:
            error_code = e.response.get("Error", {}).get("Code")
            if error_code == 'TextLengthExceededException':
                 logger.error(f"Text length exceeded for Polly synthesize_speech: {len(text)} chars. Use start_speech_synthesis_task instead.")
                 raise PollyServiceError(f"Text too long for synchronous synthesis. Limit approx 1500 chars.")
            else:
                 logger.error(f"Error synthesizing speech: {e}")
                 raise PollyServiceError(f"Failed to synthesize speech: {e}")
        except Exception as e:
             logger.exception(f"Unexpected error during Polly synthesize_speech: {e}")
             raise PollyServiceError(f"An unexpected error occurred during speech synthesis: {str(e)}")

    def start_speech_synthesis_task(self, text: str, s3_bucket_name: str, s3_key_prefix: str, voice_id: str = 'Joanna', output_format: str = 'mp3', engine: str = 'neural') -> str:
        """
        Starts an asynchronous speech synthesis task saving output to S3.

        Args:
            text (str): The text to synthesize (can be longer than sync limit).
            s3_bucket_name (str): The destination S3 bucket.
            s3_key_prefix (str): The prefix (folder path) within the bucket where the output file will be saved.
                                Polly will append the TaskID and format (e.g., prefix/taskid.mp3).
            voice_id (str): The Polly voice ID.
            output_format (str): The desired audio format ('mp3', 'ogg_vorbis', 'pcm', 'json' for speech marks).
            engine (str): Polly engine ('standard' or 'neural').

        Returns:
            str: The Task ID of the asynchronous synthesis task.

        Raises:
            PollyServiceError: If there's an error starting the synthesis task.
            ValueError: If required arguments are missing.
        """
        if not all([text, s3_bucket_name, s3_key_prefix is not None]): # Allow empty prefix
            raise ValueError("Text, S3 bucket name, and S3 key prefix are required for async synthesis.")

        try:
            response = self.polly_client.start_speech_synthesis_task(
                Text=text,
                OutputFormat=output_format,
                OutputS3BucketName=s3_bucket_name,
                OutputS3KeyPrefix=s3_key_prefix,
                Engine=engine,
                # SnsTopicArn='string', # Optional: Add SNS topic ARN for task completion notifications
                VoiceId=voice_id
            )
            task = response.get('SynthesisTask', {})
            task_id = task.get('TaskId')
            if task_id:
                logger.info(f"Started Polly synthesis task '{task_id}' to S3 bucket '{s3_bucket_name}' prefix '{s3_key_prefix}'")
                return task_id
            else:
                logger.error("Polly start_speech_synthesis_task did not return a Task.")
                raise PollyServiceError("Failed to start Polly synthesis task (no TaskId received).")

        except ClientError as e:
            logger.error(f"Error starting speech synthesis task: {e}")
            raise PollyServiceError(f"Failed to start speech synthesis task: {e}")
        except Exception as e:
            logger.exception(f"Unexpected error during Polly start_speech_synthesis_task: {e}")
            raise PollyServiceError(f"An unexpected error occurred starting speech synthesis task: {str(e)}")

    # Method to get presigned URL moved to S3Client or called via S3Client instance.
    # def get_synthesized_audio_url(...)
