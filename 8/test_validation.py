import unittest
import re
from code import (
    Schema, ValidationError, StringValidator, NumberValidator, 
    BooleanValidator, DateValidator, ObjectValidator, ArrayValidator
)


class TestStringValidator(unittest.TestCase):
    """Test cases for StringValidator functionality."""
    
    def test_valid_string(self):
        """Test validation of valid string values."""
        validator = Schema.string()
        self.assertEqual(validator.validate("hello"), "hello")
        self.assertEqual(validator.validate(""), "")
    
    def test_invalid_type(self):
        """Test validation fails for non-string types."""
        validator = Schema.string()
        with self.assertRaises(ValidationError):
            validator.validate(123)
        with self.assertRaises(ValidationError):
            validator.validate(True)
        with self.assertRaises(ValidationError):
            validator.validate([])
    
    def test_min_length_constraint(self):
        """Test minimum length constraint validation."""
        validator = Schema.string().min_length(3)
        self.assertEqual(validator.validate("hello"), "hello")
        self.assertEqual(validator.validate("abc"), "abc")
        
        with self.assertRaises(ValidationError):
            validator.validate("ab")
        with self.assertRaises(ValidationError):
            validator.validate("")
    
    def test_pattern_constraint(self):
        """Test regex pattern constraint validation."""
        email_validator = Schema.string().pattern(r'^[^\s@]+@[^\s@]+\.[^\s@]+$')
        self.assertEqual(email_validator.validate("test@example.com"), "test@example.com")
        
        with self.assertRaises(ValidationError):
            email_validator.validate("invalid-email")
        with self.assertRaises(ValidationError):
            email_validator.validate("@example.com")
    
    def test_optional_string(self):
        """Test optional string validation."""
        validator = Schema.string().optional()
        self.assertEqual(validator.validate("hello"), "hello")
        self.assertIsNone(validator.validate(None))
    
    def test_custom_error_message(self):
        """Test custom error message functionality."""
        validator = Schema.string().with_message("Custom string error")
        with self.assertRaises(ValidationError) as context:
            validator.validate(123)
        self.assertEqual(str(context.exception), "Custom string error")


class TestNumberValidator(unittest.TestCase):
    """Test cases for NumberValidator functionality."""
    
    def test_valid_numbers(self):
        """Test validation of valid numeric values."""
        validator = Schema.number()
        self.assertEqual(validator.validate(42), 42)
        self.assertEqual(validator.validate(3.14), 3.14)
        self.assertEqual(validator.validate(0), 0)
        self.assertEqual(validator.validate(-10), -10)
    
    def test_invalid_type(self):
        """Test validation fails for non-numeric types."""
        validator = Schema.number()
        with self.assertRaises(ValidationError):
            validator.validate("123")
        with self.assertRaises(ValidationError):
            validator.validate(True)
        with self.assertRaises(ValidationError):
            validator.validate([])
    
    def test_min_constraint(self):
        """Test minimum value constraint validation."""
        validator = Schema.number().min(0)
        self.assertEqual(validator.validate(0), 0)
        self.assertEqual(validator.validate(10), 10)
        
        with self.assertRaises(ValidationError):
            validator.validate(-1)
        with self.assertRaises(ValidationError):
            validator.validate(-10.5)
    
    def test_optional_number(self):
        """Test optional number validation."""
        validator = Schema.number().optional()
        self.assertEqual(validator.validate(42), 42)
        self.assertIsNone(validator.validate(None))


class TestBooleanValidator(unittest.TestCase):
    """Test cases for BooleanValidator functionality."""
    
    def test_valid_booleans(self):
        """Test validation of valid boolean values."""
        validator = Schema.boolean()
        self.assertTrue(validator.validate(True))
        self.assertFalse(validator.validate(False))
    
    def test_invalid_type(self):
        """Test validation fails for non-boolean types."""
        validator = Schema.boolean()
        with self.assertRaises(ValidationError):
            validator.validate(1)  # truthy but not boolean
        with self.assertRaises(ValidationError):
            validator.validate(0)  # falsy but not boolean
        with self.assertRaises(ValidationError):
            validator.validate("true")
        with self.assertRaises(ValidationError):
            validator.validate([])
    
    def test_optional_boolean(self):
        """Test optional boolean validation."""
        validator = Schema.boolean().optional()
        self.assertTrue(validator.validate(True))
        self.assertFalse(validator.validate(False))
        self.assertIsNone(validator.validate(None))


class TestArrayValidator(unittest.TestCase):
    """Test cases for ArrayValidator functionality."""
    
    def test_valid_string_array(self):
        """Test validation of valid string arrays."""
        validator = Schema.array(Schema.string())
        result = validator.validate(["hello", "world"])
        self.assertEqual(result, ["hello", "world"])
        
        # Empty array should be valid
        self.assertEqual(validator.validate([]), [])
    
    def test_invalid_array_type(self):
        """Test validation fails for non-array types."""
        validator = Schema.array(Schema.string())
        with self.assertRaises(ValidationError):
            validator.validate("not an array")
        with self.assertRaises(ValidationError):
            validator.validate(123)
        with self.assertRaises(ValidationError):
            validator.validate({})
    
    def test_array_item_validation_failure(self):
        """Test validation fails when array items don't match validator."""
        validator = Schema.array(Schema.string())
        with self.assertRaises(ValidationError) as context:
            validator.validate(["hello", 123, "world"])
        self.assertIn("Item 1", str(context.exception))
    
    def test_number_array(self):
        """Test validation of numeric arrays."""
        validator = Schema.array(Schema.number())
        result = validator.validate([1, 2, 3.14, -5])
        self.assertEqual(result, [1, 2, 3.14, -5])
    
    def test_optional_array(self):
        """Test optional array validation."""
        validator = Schema.array(Schema.string()).optional()
        self.assertEqual(validator.validate(["hello"]), ["hello"])
        self.assertIsNone(validator.validate(None))


class TestObjectValidator(unittest.TestCase):
    """Test cases for ObjectValidator functionality."""
    
    def test_valid_simple_object(self):
        """Test validation of valid simple objects."""
        schema = Schema.object({
            'name': Schema.string(),
            'age': Schema.number()
        })
        
        data = {'name': 'John', 'age': 30}
        result = schema.validate(data)
        self.assertEqual(result, {'name': 'John', 'age': 30})
    
    def test_invalid_object_type(self):
        """Test validation fails for non-object types."""
        schema = Schema.object({'name': Schema.string()})
        with self.assertRaises(ValidationError):
            schema.validate("not an object")
        with self.assertRaises(ValidationError):
            schema.validate([])
        with self.assertRaises(ValidationError):
            schema.validate(123)
    
    def test_missing_required_field(self):
        """Test validation fails for missing required fields."""
        schema = Schema.object({
            'name': Schema.string(),
            'age': Schema.number()
        })
        
        with self.assertRaises(ValidationError) as context:
            schema.validate({'name': 'John'})  # missing age
        self.assertIn("age", str(context.exception))
    
    def test_optional_fields(self):
        """Test validation with optional fields."""
        schema = Schema.object({
            'name': Schema.string(),
            'age': Schema.number().optional()
        })
        
        # With optional field
        result1 = schema.validate({'name': 'John', 'age': 30})
        self.assertEqual(result1, {'name': 'John', 'age': 30})
        
        # Without optional field
        result2 = schema.validate({'name': 'John'})
        self.assertEqual(result2, {'name': 'John', 'age': None})
    
    def test_extra_fields_allowed(self):
        """Test that extra fields are preserved."""
        schema = Schema.object({
            'name': Schema.string()
        })
        
        data = {'name': 'John', 'extra': 'value'}
        result = schema.validate(data)
        self.assertEqual(result, {'name': 'John', 'extra': 'value'})
    
    def test_nested_objects(self):
        """Test validation of nested object structures."""
        address_schema = Schema.object({
            'street': Schema.string(),
            'city': Schema.string()
        })
        
        user_schema = Schema.object({
            'name': Schema.string(),
            'address': address_schema
        })
        
        data = {
            'name': 'John',
            'address': {
                'street': '123 Main St',
                'city': 'Anytown'
            }
        }
        
        result = user_schema.validate(data)
        self.assertEqual(result, data)


class TestSchemaBuilder(unittest.TestCase):
    """Test cases for Schema builder functionality."""
    
    def test_schema_factory_methods(self):
        """Test that Schema factory methods return correct validator types."""
        self.assertIsInstance(Schema.string(), StringValidator)
        self.assertIsInstance(Schema.number(), NumberValidator)
        self.assertIsInstance(Schema.boolean(), BooleanValidator)
        self.assertIsInstance(Schema.date(), DateValidator)
        self.assertIsInstance(Schema.array(Schema.string()), ArrayValidator)
        self.assertIsInstance(Schema.object({}), ObjectValidator)
    
    def test_method_chaining(self):
        """Test that validators support method chaining."""
        validator = (Schema.string()
                    .min_length(2)
                    .max_length(10)
                    .pattern(r'^[a-zA-Z]+$')
                    .optional()
                    .with_message("Custom error"))
        
        self.assertIsInstance(validator, StringValidator)
        self.assertTrue(validator._optional)
        self.assertEqual(validator._custom_message, "Custom error")


class TestComplexScenarios(unittest.TestCase):
    """Test cases for complex validation scenarios."""
    
    def test_user_profile_schema(self):
        """Test comprehensive user profile validation schema."""
        address_schema = Schema.object({
            'street': Schema.string(),
            'city': Schema.string(),
            'postal_code': Schema.string().pattern(r'^\d{5}$'),
            'country': Schema.string()
        })
        
        user_schema = Schema.object({
            'id': Schema.string(),
            'name': Schema.string().min_length(2).max_length(50),
            'email': Schema.string().pattern(r'^[^\s@]+@[^\s@]+\.[^\s@]+$'),
            'age': Schema.number().min(0).max(120).optional(),
            'is_active': Schema.boolean(),
            'tags': Schema.array(Schema.string()),
            'address': address_schema.optional()
        })
        
        # Valid user data
        valid_user = {
            'id': 'user123',
            'name': 'John Doe',
            'email': 'john@example.com',
            'age': 30,
            'is_active': True,
            'tags': ['developer', 'python'],
            'address': {
                'street': '123 Main St',
                'city': 'Springfield',
                'postal_code': '12345',
                'country': 'USA'
            }
        }
        
        result = user_schema.validate(valid_user)
        self.assertEqual(result['name'], 'John Doe')
        self.assertEqual(result['age'], 30)
        self.assertEqual(len(result['tags']), 2)
    
    def test_validation_error_aggregation(self):
        """Test that multiple validation errors are properly aggregated."""
        schema = Schema.object({
            'name': Schema.string().min_length(5),
            'age': Schema.number().min(18),
            'email': Schema.string().pattern(r'^[^\s@]+@[^\s@]+\.[^\s@]+$')
        })
        
        invalid_data = {
            'name': 'Jo',      # too short
            'age': 15,         # too young
            'email': 'invalid' # bad format
        }
        
        with self.assertRaises(ValidationError) as context:
            schema.validate(invalid_data)
        
        error_msg = str(context.exception)
        self.assertIn("name", error_msg)
        self.assertIn("age", error_msg)
        self.assertIn("email", error_msg)


if __name__ == '__main__':
    # Run all tests with verbose output
    unittest.main(verbosity=2)
