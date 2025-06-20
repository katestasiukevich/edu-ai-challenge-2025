import re
from typing import Any, Dict, List, Optional, Union, Callable
from abc import ABC, abstractmethod


class ValidationError(Exception):
    """Custom exception raised when data validation fails."""
    pass


class Validator(ABC):
    """
    Abstract base class for all validators in the validation library.
    
    This class defines the common interface and behavior that all validators
    must implement, including support for optional fields and custom error messages.
    """
    
    def __init__(self):
        """Initialize validator with default settings."""
        self._optional = False  # Flag to indicate if this field is optional
        self._custom_message = None  # Custom error message override
    
    @abstractmethod
    def _validate(self, value: Any) -> Any:
        """
        Abstract method that subclasses must implement to define validation logic.
        
        Args:
            value: The value to validate
            
        Returns:
            The validated value (potentially transformed)
            
        Raises:
            ValidationError: If validation fails
        """
        pass
    
    def validate(self, value: Any) -> Any:
        """
        Main validation method that handles optional fields and custom messages.
        
        This method wraps the specific validation logic in _validate() and handles
        common concerns like optional fields and custom error messages.
        
        Args:
            value: The value to validate
            
        Returns:
            The validated value if validation succeeds
            
        Raises:
            ValidationError: If validation fails
        """
        # Handle optional fields - if value is None and field is optional, return None
        if value is None and self._optional:
            return None
        
        try:
            return self._validate(value)
        except ValidationError as e:
            # If a custom message is set, use it instead of the original error
            if self._custom_message:
                raise ValidationError(self._custom_message)
            raise e
    
    def optional(self):
        """
        Mark this validator as optional, allowing None values.
        
        Returns:
            Self for method chaining
        """
        self._optional = True
        return self
    
    def with_message(self, message: str):
        """
        Set a custom error message for validation failures.
        
        Args:
            message: Custom error message to display on validation failure
            
        Returns:
            Self for method chaining
        """
        self._custom_message = message
        return self


class StringValidator(Validator):
    """
    Validator for string values with support for length and pattern constraints.
    
    This validator ensures values are strings and can enforce minimum/maximum
    length requirements as well as regex pattern matching.
    """
    
    def __init__(self):
        """Initialize string validator with no constraints."""
        super().__init__()
        self._min_length = None  # Minimum required string length
        self._max_length = None  # Maximum allowed string length
        self._pattern = None     # Compiled regex pattern for validation
    
    def _validate(self, value: Any) -> str:
        """
        Validate that value is a string and meets all constraints.
        
        Args:
            value: Value to validate
            
        Returns:
            The string value if validation passes
            
        Raises:
            ValidationError: If value is not a string or fails constraints
        """
        # Type check - ensure value is a string
        if not isinstance(value, str):
            raise ValidationError(f"Expected string, got {type(value).__name__}")
        
        # Length validation - check minimum length requirement
        if self._min_length is not None and len(value) < self._min_length:
            raise ValidationError(f"String must be at least {self._min_length} characters long")
        
        # Length validation - check maximum length requirement
        if self._max_length is not None and len(value) > self._max_length:
            raise ValidationError(f"String must be at most {self._max_length} characters long")
        
        # Pattern validation - check regex pattern match
        if self._pattern is not None and not self._pattern.match(value):
            raise ValidationError(f"String does not match required pattern")
        
        return value
    
    def min_length(self, length: int):
        """
        Set minimum length constraint for the string.
        
        Args:
            length: Minimum number of characters required
            
        Returns:
            Self for method chaining
        """
        self._min_length = length
        return self
    
    def max_length(self, length: int):
        """
        Set maximum length constraint for the string.
        
        Args:
            length: Maximum number of characters allowed
            
        Returns:
            Self for method chaining
        """
        self._max_length = length
        return self
    
    def pattern(self, regex_pattern: Union[str, re.Pattern]):
        """
        Set regex pattern constraint for the string.
        
        Args:
            regex_pattern: Either a regex string or compiled Pattern object
            
        Returns:
            Self for method chaining
        """
        if isinstance(regex_pattern, str):
            self._pattern = re.compile(regex_pattern)
        else:
            self._pattern = regex_pattern
        return self


class NumberValidator(Validator):
    """
    Validator for numeric values (int or float) with range constraints.
    
    This validator ensures values are numeric and can enforce minimum/maximum
    value requirements.
    """
    
    def __init__(self):
        """Initialize number validator with no constraints."""
        super().__init__()
        self._min_value = None  # Minimum allowed numeric value
        self._max_value = None  # Maximum allowed numeric value
    
    def _validate(self, value: Any) -> Union[int, float]:
        """
        Validate that value is numeric and meets range constraints.
        
        Args:
            value: Value to validate
            
        Returns:
            The numeric value if validation passes
            
        Raises:
            ValidationError: If value is not numeric or fails range constraints
        """
        # Type check - ensure value is a number (int or float)
        if not isinstance(value, (int, float)):
            raise ValidationError(f"Expected number, got {type(value).__name__}")
        
        # Range validation - check minimum value requirement
        if self._min_value is not None and value < self._min_value:
            raise ValidationError(f"Number must be at least {self._min_value}")
        
        # Range validation - check maximum value requirement
        if self._max_value is not None and value > self._max_value:
            raise ValidationError(f"Number must be at most {self._max_value}")
        
        return value
    
    def min(self, value: Union[int, float]):
        """
        Set minimum value constraint for the number.
        
        Args:
            value: Minimum allowed numeric value
            
        Returns:
            Self for method chaining
        """
        self._min_value = value
        return self
    
    def max(self, value: Union[int, float]):
        """
        Set maximum value constraint for the number.
        
        Args:
            value: Maximum allowed numeric value
            
        Returns:
            Self for method chaining
        """
        self._max_value = value
        return self


class BooleanValidator(Validator):
    """
    Validator for boolean values (True/False).
    
    This validator ensures values are strictly boolean types, not truthy/falsy values.
    """
    
    def _validate(self, value: Any) -> bool:
        """
        Validate that value is a boolean.
        
        Args:
            value: Value to validate
            
        Returns:
            The boolean value if validation passes
            
        Raises:
            ValidationError: If value is not a boolean
        """
        # Type check - ensure value is exactly a boolean (not truthy/falsy)
        if not isinstance(value, bool):
            raise ValidationError(f"Expected boolean, got {type(value).__name__}")
        return value


class DateValidator(Validator):
    """
    Validator for date values with basic string format validation.
    
    This validator accepts date strings in YYYY-MM-DD format or datetime objects.
    In a production environment, you might want more sophisticated date parsing.
    """
    
    def _validate(self, value: Any) -> Any:
        """
        Validate date values with basic format checking.
        
        Args:
            value: Value to validate (string or datetime object)
            
        Returns:
            The date value if validation passes
            
        Raises:
            ValidationError: If date format is invalid
        """
        # For string dates, validate basic YYYY-MM-DD format
        if isinstance(value, str):
            if not re.match(r'^\d{4}-\d{2}-\d{2}', value):
                raise ValidationError("Date must be in YYYY-MM-DD format")
        # Accept datetime objects as-is (could add more validation here)
        return value


class ObjectValidator(Validator):
    """
    Validator for object/dictionary structures with nested field validation.
    
    This validator validates dictionary objects against a schema definition,
    ensuring each field meets its specific validation requirements.
    """
    
    def __init__(self, schema: Dict[str, Validator]):
        """
        Initialize object validator with field schema.
        
        Args:
            schema: Dictionary mapping field names to their validators
        """
        super().__init__()
        self.schema = schema  # Schema defining expected fields and their validators
    
    def _validate(self, value: Any) -> Dict[str, Any]:
        """
        Validate object structure against the defined schema.
        
        Args:
            value: Dictionary object to validate
            
        Returns:
            Validated dictionary with all fields processed
            
        Raises:
            ValidationError: If object structure or field validation fails
        """
        # Type check - ensure value is a dictionary
        if not isinstance(value, dict):
            raise ValidationError(f"Expected object, got {type(value).__name__}")
        
        result = {}
        errors = []
        
        # Validate each field defined in the schema
        for field_name, validator in self.schema.items():
            try:
                field_value = value.get(field_name)  # Get field value (None if missing)
                result[field_name] = validator.validate(field_value)
            except ValidationError as e:
                errors.append(f"{field_name}: {str(e)}")
        
        # Handle extra fields not defined in schema (allows flexibility)
        extra_fields = set(value.keys()) - set(self.schema.keys())
        if extra_fields:
            # Copy extra fields to result (like metadata fields)
            for field in extra_fields:
                result[field] = value[field]
        
        # If any field validation failed, raise combined error
        if errors:
            raise ValidationError(f"Object validation failed: {'; '.join(errors)}")
        
        return result


class ArrayValidator(Validator):
    """
    Validator for array/list structures with item-level validation.
    
    This validator ensures values are lists and validates each item
    against a specified item validator.
    """
    
    def __init__(self, item_validator: Validator):
        """
        Initialize array validator with item validator.
        
        Args:
            item_validator: Validator to apply to each array item
        """
        super().__init__()
        self.item_validator = item_validator  # Validator for individual array items
    
    def _validate(self, value: Any) -> List[Any]:
        """
        Validate array structure and all items.
        
        Args:
            value: List/array to validate
            
        Returns:
            Validated list with all items processed
            
        Raises:
            ValidationError: If value is not a list or item validation fails
        """
        # Type check - ensure value is a list
        if not isinstance(value, list):
            raise ValidationError(f"Expected array, got {type(value).__name__}")
        
        result = []
        errors = []
        
        # Validate each item in the array
        for i, item in enumerate(value):
            try:
                result.append(self.item_validator.validate(item))
            except ValidationError as e:
                errors.append(f"Item {i}: {str(e)}")
        
        # If any item validation failed, raise combined error
        if errors:
            raise ValidationError(f"Array validation failed: {'; '.join(errors)}")
        
        return result


class Schema:
    """
    Schema builder class providing static factory methods for creating validators.
    
    This class serves as the main entry point for the validation library,
    providing a clean, fluent API for building complex validation schemas.
    """
    
    @staticmethod
    def string() -> StringValidator:
        """
        Create a new string validator.
        
        Returns:
            StringValidator instance for method chaining
        """
        return StringValidator()
    
    @staticmethod
    def number() -> NumberValidator:
        """
        Create a new number validator.
        
        Returns:
            NumberValidator instance for method chaining
        """
        return NumberValidator()
    
    @staticmethod
    def boolean() -> BooleanValidator:
        """
        Create a new boolean validator.
        
        Returns:
            BooleanValidator instance for method chaining
        """
        return BooleanValidator()
    
    @staticmethod
    def date() -> DateValidator:
        """
        Create a new date validator.
        
        Returns:
            DateValidator instance for method chaining
        """
        return DateValidator()
    
    @staticmethod
    def object(schema: Dict[str, Validator]) -> ObjectValidator:
        """
        Create a new object validator with specified field schema.
        
        Args:
            schema: Dictionary mapping field names to validators
            
        Returns:
            ObjectValidator instance for the schema
        """
        return ObjectValidator(schema)
    
    @staticmethod
    def array(item_validator: Validator) -> ArrayValidator:
        """
        Create a new array validator with specified item validator.
        
        Args:
            item_validator: Validator to apply to each array item
            
        Returns:
            ArrayValidator instance for method chaining
        """
        return ArrayValidator(item_validator)


# Example usage and schema definitions
if __name__ == "__main__":
    # Define a complex nested schema for address validation
    address_schema = Schema.object({
        'street': Schema.string(),
        'city': Schema.string(),
        'postal_code': Schema.string().pattern(r'^\d{5}$').with_message('Postal code must be 5 digits'),
        'country': Schema.string()
    })

    # Define a comprehensive user schema with various field types
    user_schema = Schema.object({
        'id': Schema.string().with_message('ID must be a string'),
        'name': Schema.string().min_length(2).max_length(50),
        'email': Schema.string().pattern(r'^[^\s@]+@[^\s@]+\.[^\s@]+$'),
        'age': Schema.number().optional(),
        'is_active': Schema.boolean(),
        'tags': Schema.array(Schema.string()),
        'address': address_schema.optional(),
        'metadata': Schema.object({}).optional()
    })

    # Sample data for validation testing
    user_data = {
        'id': "12345",
        'name': "John Doe",
        'email': "john@example.com",
        'is_active': True,
        'tags': ["developer", "designer"],
        'address': {
            'street': "123 Main St",
            'city': "Anytown",
            'postal_code': "12345",
            'country': "USA"
        }
    }

    # Perform validation and handle results
    try:
        result = user_schema.validate(user_data)
        print("Validation successful!")
        print("Validated data:", result)
    except ValidationError as e:
        print(f"Validation failed: {e}") 