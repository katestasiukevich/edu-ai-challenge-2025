# Python Data Validation Library

A robust, type-safe validation library for Python that provides comprehensive data validation capabilities for primitive types, complex objects, arrays, and nested structures.

## Features

- ✅ **Type-Safe Validators**: Complete validators for strings, numbers, booleans, dates, objects, and arrays
- ✅ **Method Chaining**: Fluent API with chainable validation constraints
- ✅ **Optional Fields**: Support for optional fields with `.optional()` method
- ✅ **Custom Error Messages**: Override default error messages with `.with_message()`
- ✅ **Nested Validation**: Validate complex nested object structures
- ✅ **Constraint Support**: Min/max lengths, ranges, regex patterns, and more
- ✅ **Comprehensive Testing**: Full test coverage with edge case handling

## Installation

No external dependencies required! The library uses only Python standard library modules.

```bash
# Clone or download the validation library files
# Ensure you have Python 3.6+ installed
python3 --version
```

## Quick Start

```python
from code import Schema, ValidationError

# Create a simple string validator
name_validator = Schema.string().min_length(2).max_length(50)

try:
    result = name_validator.validate("John Doe")
    print(f"Valid name: {result}")
except ValidationError as e:
    print(f"Validation failed: {e}")
```

## Core Validators

### String Validator

```python
# Basic string validation
Schema.string().validate("hello")  # Returns: "hello"

# With length constraints
Schema.string().min_length(3).max_length(10).validate("hello")

# With regex pattern
email_validator = Schema.string().pattern(r'^[^\s@]+@[^\s@]+\.[^\s@]+$')
email_validator.validate("user@example.com")

# Optional string
Schema.string().optional().validate(None)  # Returns: None
```

### Number Validator

```python
# Basic number validation
Schema.number().validate(42)      # Returns: 42
Schema.number().validate(3.14)    # Returns: 3.14

# With range constraints
Schema.number().min(0).max(100).validate(50)

# Optional number
Schema.number().optional().validate(None)  # Returns: None
```

### Boolean Validator

```python
# Strict boolean validation (not truthy/falsy)
Schema.boolean().validate(True)   # Returns: True
Schema.boolean().validate(False)  # Returns: False

# This will fail (strict type checking)
# Schema.boolean().validate(1)  # Raises ValidationError
```

### Date Validator

```python
# Basic date string validation (YYYY-MM-DD format)
Schema.date().validate("2023-12-25")           # Returns: "2023-12-25"
Schema.date().validate("2023-12-25T10:30:00")  # Returns: "2023-12-25T10:30:00"

# Invalid format will fail
# Schema.date().validate("25-12-2023")  # Raises ValidationError
```

### Array Validator

```python
# Array of strings
string_array = Schema.array(Schema.string())
string_array.validate(["hello", "world"])  # Returns: ["hello", "world"]

# Array of numbers with constraints
number_array = Schema.array(Schema.number().min(0))
number_array.validate([1, 2, 3, 4, 5])

# Nested arrays
nested_array = Schema.array(Schema.array(Schema.string()))
nested_array.validate([["a", "b"], ["c", "d"]])

# Empty arrays are valid
string_array.validate([])  # Returns: []
```

### Object Validator

```python
# Simple object schema
user_schema = Schema.object({
    'name': Schema.string(),
    'age': Schema.number(),
    'active': Schema.boolean()
})

user_data = {
    'name': 'John Doe',
    'age': 30,
    'active': True
}

result = user_schema.validate(user_data)
print(result)  # Returns validated object
```

## Advanced Usage

### Complex Nested Schema

```python
# Define nested address schema
address_schema = Schema.object({
    'street': Schema.string(),
    'city': Schema.string(),
    'postal_code': Schema.string().pattern(r'^\d{5}$'),
    'country': Schema.string()
})

# Define comprehensive user schema
user_schema = Schema.object({
    'id': Schema.string(),
    'name': Schema.string().min_length(2).max_length(50),
    'email': Schema.string().pattern(r'^[^\s@]+@[^\s@]+\.[^\s@]+$'),
    'age': Schema.number().min(0).max(120).optional(),
    'is_active': Schema.boolean(),
    'tags': Schema.array(Schema.string()),
    'address': address_schema.optional(),
    'preferences': Schema.object({
        'theme': Schema.string().optional(),
        'notifications': Schema.boolean().optional()
    }).optional()
})

# Validate complex user data
user_data = {
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
    },
    'preferences': {
        'theme': 'dark',
        'notifications': True
    }
}

try:
    validated_user = user_schema.validate(user_data)
    print("User validation successful!")
except ValidationError as e:
    print(f"Validation failed: {e}")
```

### Custom Error Messages

```python
# Set custom error messages
validator = (Schema.string()
    .min_length(8)
    .pattern(r'^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)')
    .with_message("Password must be at least 8 characters with uppercase, lowercase, and digit"))

try:
    validator.validate("weak")
except ValidationError as e:
    print(e)  # Prints: "Password must be at least 8 characters with uppercase, lowercase, and digit"
```

### Method Chaining

```python
# Chain multiple validation constraints
validator = (Schema.string()
    .min_length(3)
    .max_length(20)
    .pattern(r'^[a-zA-Z0-9_]+$')
    .optional()
    .with_message("Username must be 3-20 alphanumeric characters or underscore"))
```

## Running the Application

### Basic Usage

```bash
# Run the main application to see example validation
python3 code.py
```

### Running Tests

```bash
# Run all tests with verbose output
python3 -m unittest test_validation.py -v

# Run specific test class
python3 -m unittest test_validation.TestStringValidator -v

# Run specific test method
python3 -m unittest test_validation.TestStringValidator.test_pattern_constraint -v
```

### Generate Test Coverage Report

```bash
# Install coverage tool (if not already installed)
pip3 install coverage

# Run tests with coverage
python3 -m coverage run -m unittest test_validation.py

# Generate coverage report
python3 -m coverage report -m

# Generate HTML coverage report
python3 -m coverage html
```

## Error Handling

The library raises `ValidationError` exceptions when validation fails:

```python
from code import ValidationError

try:
    result = Schema.string().min_length(5).validate("hi")
except ValidationError as e:
    print(f"Validation error: {e}")
    # Handle the error appropriately
```

### Error Message Examples

- **Type errors**: `"Expected string, got int"`
- **Constraint errors**: `"String must be at least 5 characters long"`
- **Pattern errors**: `"String does not match required pattern"`
- **Object errors**: `"Object validation failed: name: Expected string, got int"`
- **Array errors**: `"Array validation failed: Item 1: Expected string, got int"`

## API Reference

### Schema Factory Methods

- `Schema.string()` → `StringValidator`
- `Schema.number()` → `NumberValidator`
- `Schema.boolean()` → `BooleanValidator`
- `Schema.date()` → `DateValidator`
- `Schema.object(schema_dict)` → `ObjectValidator`
- `Schema.array(item_validator)` → `ArrayValidator`

### Common Validator Methods

- `.validate(value)` → Validates and returns the value
- `.optional()` → Marks field as optional (allows None)
- `.with_message(msg)` → Sets custom error message

### String Validator Methods

- `.min_length(n)` → Minimum string length
- `.max_length(n)` → Maximum string length
- `.pattern(regex)` → Regex pattern constraint

### Number Validator Methods

- `.min(n)` → Minimum numeric value
- `.max(n)` → Maximum numeric value

## Examples Directory Structure

```
validation-library/
├── code.py              # Main validation library
├── test_validation.py   # Comprehensive test suite
├── README.md           # This guide
└── test_report.txt     # Coverage report
```

## Contributing

The library is designed to be extensible. To add new validator types:

1. Inherit from the `Validator` base class
2. Implement the `_validate(self, value)` method
3. Add factory method to `Schema` class
4. Write comprehensive tests

## License

This validation library is provided as-is for educational purposes as part of the EDU AI Challenge.

## Support

For questions or issues related to this validation library, please refer to the comprehensive test suite in `test_validation.py` which demonstrates all features and edge cases.