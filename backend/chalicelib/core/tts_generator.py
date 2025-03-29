import logging
import time
from botocore.exceptions import ClientError # Import ClientError
from chalicelib.services.polly import PollyService, PollyServiceError
from chalicelib.services.s3_client import S3Client, S3ServiceError

logger = logging.getLogger(__name__)

class TTSGenerator:
    def __init__(self, polly_service: PollyService, storage_service: S3Client):
        """
        Initializes the Text-to-Speech Generator.

        Args:
            polly_service (PollyService): Instance of PollyService.
            storage_service (S3Client): Instance of S3Client.
        """
        self.polly_service = polly_service
        self.storage_service = storage_service

    def generate_tts_audio(self, text: str, analysis_id: str, user_id: str, voice_id: str = 'Joanna') -> str or None:
        """
        Generates TTS audio for the given text, saves it to S3, and returns a presigned URL.
        Uses synchronous synthesis for simplicity here.

        Args:
            text (str): The text to convert to speech.
            analysis_id (str): The ID associated with the text analysis.
            user_id (str): The ID of the user requesting the TTS.
            voice_id (str): The Polly voice to use.

        Returns:
            str or None: A presigned URL to the generated audio file, or None if generation failed.
        """
        if not text or not text.strip():
            logger.warning("TTS generation requested with empty text.")
            return None

        # Truncate long text to avoid excessive Polly costs/limits if necessary
        max_length = 1500 # Approx limit for synthesize_speech
        truncated_text = text[:max_length] + ("..." if len(text) > max_length else "")

        s3_key = f"tts/{user_id}/{analysis_id}.mp3"

        try:
            # Check if audio already exists in S3
            existing_url = self.storage_service.generate_presigned_url(s3_key)
            if existing_url:
                 # Verify the object actually exists to avoid returning URL for non-existent file after initial failure
                 try:
                     self.storage_service.s3_client.head_object(Bucket=self.storage_service.bucket_name, Key=s3_key)
                     logger.info(f"Found existing TTS audio for analysis {analysis_id}. Returning URL.")
                     return existing_url
                 except ClientError as head_err:
                     if head_err.response['Error']['Code'] == '404':
                         logger.info(f"Presigned URL generated for {s3_key} but object not found. Generating new audio.")
                         # Proceed to generate below
                     else:
                         # Log other head_object errors but proceed cautiously
                         logger.warning(f"Error checking existence of {s3_key}: {head_err}. Attempting regeneration.")

            # If not found or check failed, generate new audio
            logger.info(f"Generating new TTS audio for analysis {analysis_id}...")
            audio_data = self.polly_service.synthesize_speech(
                text=truncated_text,
                voice_id=voice_id,
                output_format='mp3'
            )

            if not audio_data:
                logger.error(f"Polly did not return audio data for analysis {analysis_id}")
                return None

            # Store the audio data in S3
            self.storage_service.store_object(s3_key, audio_data, 'audio/mpeg')

            # Generate a presigned URL for the newly stored audio
            presigned_url = self.storage_service.generate_presigned_url(s3_key)

            if presigned_url:
                logger.info(f"Successfully generated TTS and presigned URL for analysis {analysis_id} at {s3_key}")
                return presigned_url
            else:
                logger.error(f"Failed to generate presigned URL after storing TTS audio {s3_key}")
                return None

        except (PollyServiceError, S3ServiceError, ValueError) as e:
            logger.error(f"Error generating TTS for analysis {analysis_id}: {e}")
            return None
        except Exception as e:
            logger.exception(f"Unexpected error during TTS generation for analysis {analysis_id}: {e}")
            return None
