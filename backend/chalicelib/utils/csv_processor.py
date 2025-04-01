import csv
import io
from typing import List, Dict, Any, Optional, Union


class CSVProcessor:
    """
    Utility class for processing CSV files for batch operations.
    Handles CSV parsing, validation, and conversion to formats
    suitable for processing by the batch processor.
    """
    
    def __init__(self):
        pass
        
    def parse_csv_data(self, csv_content: Union[str, bytes], has_header: bool = True) -> List[Dict[str, str]]:
        """
        Parse CSV content into a list of dictionaries
        
        Args:
            csv_content: String or bytes containing CSV data
            has_header: Whether the CSV has a header row
        
        Returns:
            List of dictionaries representing CSV rows
        """
        if isinstance(csv_content, bytes):
            csv_content = csv_content.decode('utf-8')
            
        # Create a file-like object from the string
        csv_file = io.StringIO(csv_content)
        
        result = []
        
        if has_header:
            # Use the CSV DictReader to automatically parse into dictionaries
            reader = csv.DictReader(csv_file)
            for row in reader:
                result.append(dict(row))
        else:
            # If no header, create numbered field names
            reader = csv.reader(csv_file)
            for row in reader:
                result.append({f"field_{i}": value for i, value in enumerate(row)})
                
        return result
    
    def validate_csv_structure(self, csv_data: List[Dict[str, str]], 
                              required_fields: Optional[List[str]] = None) -> Dict[str, Any]:
        """
        Validates that the CSV data has the required structure
        
        Args:
            csv_data: List of dictionaries representing CSV rows
            required_fields: List of field names that must be present
            
        Returns:
            Dict with 'valid' boolean and 'errors' list if any
        """
        if not csv_data:
            return {
                'valid': False,
                'errors': ['CSV data is empty']
            }
            
        if required_fields:
            # Check the first row for required fields
            first_row = csv_data[0]
            missing_fields = [field for field in required_fields if field not in first_row]
            
            if missing_fields:
                return {
                    'valid': False,
                    'errors': [f'Missing required fields: {", ".join(missing_fields)}']
                }
                
        return {'valid': True}
    
    def extract_text_column(self, csv_data: List[Dict[str, str]], 
                           text_column: str = 'text') -> List[Dict[str, str]]:
        """
        Extracts the text column from CSV data for processing
        
        Args:
            csv_data: List of dictionaries representing CSV rows
            text_column: Name of the column containing text to analyze
            
        Returns:
            List of dictionaries with text values and any metadata
        """
        result = []
        
        for i, row in enumerate(csv_data):
            if text_column not in row:
                # Skip rows missing the text column or add placeholder
                continue
                
            # Include the text and original row number for reference
            item = {
                'text': row[text_column],
                'row_number': i + 1,  # +1 for human-readable row numbers
            }
            
            # Add any other fields that might be useful metadata
            for key, value in row.items():
                if key != text_column:
                    item[f'metadata_{key}'] = value
                    
            result.append(item)
            
        return result
    
    def format_results_as_csv(self, results: List[Dict[str, Any]]) -> str:
        """
        Format batch processing results back into CSV format
        
        Args:
            results: List of result dictionaries
            
        Returns:
            CSV formatted string
        """
        if not results:
            return ""
            
        # Determine all possible fields from results
        all_fields = set()
        for result in results:
            # Extract fields from input
            if 'input' in result:
                all_fields.update(result['input'].keys())
                
            # Add sentiment fields if available
            if 'sentiment' in result:
                all_fields.add('sentiment')
                
            if 'sentimentScore' in result:
                if isinstance(result['sentimentScore'], dict):
                    for score_key in result['sentimentScore'].keys():
                        all_fields.add(f'score_{score_key}')
                else:
                    all_fields.add('sentimentScore')
                    
        # Create header and setup CSV writer
        output = io.StringIO()
        header = sorted(all_fields)
        header.extend(['success', 'error'])  # Add processing status fields
        
        writer = csv.DictWriter(output, fieldnames=header)
        writer.writeheader()
        
        # Write each result row
        for result in results:
            row_data = {}
            
            # Add input fields
            if 'input' in result:
                for key, value in result['input'].items():
                    row_data[key] = value
                    
            # Add sentiment results
            if 'sentiment' in result:
                row_data['sentiment'] = result['sentiment']
                
            if 'sentimentScore' in result:
                if isinstance(result['sentimentScore'], dict):
                    for score_key, score_value in result['sentimentScore'].items():
                        row_data[f'score_{score_key}'] = score_value
                else:
                    row_data['sentimentScore'] = result['sentimentScore']
                    
            # Add processing status
            row_data['success'] = result.get('success', False)
            row_data['error'] = result.get('error', '')
            
            writer.writerow(row_data)
            
        return output.getvalue()