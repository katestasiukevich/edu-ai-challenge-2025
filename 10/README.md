# Product Search Tool

A console-based product search application that uses OpenAI's Function Calling API to filter products based on natural language queries.

## Features

- **Natural Language Processing**: Enter search queries in plain English
- **OpenAI Function Calling**: Leverages OpenAI's API to understand and process user preferences
- **Multiple Filter Criteria**: Supports filtering by category, price range, rating, and stock availability
- **Interactive Console Interface**: Easy-to-use command-line interface
- **Structured Output**: Clean, formatted product listings

## Prerequisites

- Python 3.7 or higher
- OpenAI API key
- Internet connection

## Installation

1. **Clone the repository** (if not already done):
   ```bash
   git clone <repository-url>
   cd <repository-name>/10
   ```

2. **Install required dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Set up your OpenAI API key**:
   
   **Option 1: Using .env file (Recommended)**
   
   Create a `.env` file in the `10/` directory:
   ```bash
   touch .env
   ```
   
   Add your OpenAI API key to the `.env` file:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```
   
   **Option 2: Using environment variable**
   
   Set the environment variable directly:
   ```bash
   export OPENAI_API_KEY=your_openai_api_key_here
   ```

4. **Verify the setup**:
   Make sure `products.json` is in the same directory as `product_search.py`.

## How to Get an OpenAI API Key

1. Visit [OpenAI's website](https://platform.openai.com/)
2. Sign up for an account or log in
3. Navigate to the API section
4. Generate a new API key
5. Copy the key and use it in your `.env` file

## Usage

1. **Run the application**:
   ```bash
   python3 product_search.py
   ```
   
   Note: Use `python3` on Linux/Mac systems, or `python` on Windows if Python 3 is your default.

2. **Enter natural language queries**:
   The application will prompt you to enter search queries. You can use natural language to describe what you're looking for.

3. **Example queries**:
   - "I need a smartphone under $800"
   - "Show me fitness equipment with rating above 4.5"
   - "Find electronics that are in stock"
   - "I want books about programming"
   - "Show me kitchen appliances under $100"

4. **Exit the application**:
   Type `quit`, `exit`, or `q` to close the application, or use `Ctrl+C`.

## How It Works

1. **User Input**: You enter a natural language query describing your product preferences
2. **OpenAI Processing**: The application sends your query to OpenAI's API along with the product dataset
3. **Function Calling**: OpenAI uses function calling to extract structured filter parameters from your query
4. **Product Filtering**: The application applies these filters to the product dataset
5. **Results Display**: Matching products are displayed in a structured format

## Supported Filter Criteria

- **Category**: Electronics, Fitness, Kitchen, Books, Clothing
- **Price Range**: Maximum and minimum price limits
- **Rating**: Minimum rating requirement (0-5 scale)
- **Stock Status**: In-stock or out-of-stock items
- **Product Names**: Specific product names or keywords

## Dataset

The application uses a predefined dataset (`products.json`) containing 50 products across 5 categories:
- Electronics (10 products)
- Fitness (10 products)
- Kitchen (10 products)
- Books (10 products)
- Clothing (10 products)

Each product includes:
- Name
- Category
- Price
- Rating (1-5 scale)
- Stock availability

## Error Handling

The application includes comprehensive error handling for:
- Missing or invalid OpenAI API key
- Network connectivity issues
- Invalid JSON data
- API rate limits
- User input validation

## Security Notes

- **Never commit your API key to version control**
- Use environment variables or `.env` files to store sensitive information
- Add `.env` to your `.gitignore` file
- Regularly rotate your API keys

## Troubleshooting

### Common Issues

1. **"OPENAI_API_KEY environment variable not set"**
   - Make sure you've created the `.env` file with your API key
   - Verify the API key is correct and active

2. **"products.json file not found"**
   - Ensure `products.json` is in the same directory as `product_search.py`

3. **API connection errors**
   - Check your internet connection
   - Verify your OpenAI API key is valid and has sufficient credits
   - Check if you've exceeded API rate limits

4. **No products found**
   - Try more general queries
   - Check if your criteria are too restrictive
   - Verify the dataset contains products matching your criteria

### Dependencies Issues

If you encounter issues with dependencies:

```bash
pip install --upgrade pip
pip install -r requirements.txt --force-reinstall
```

## Examples

See `sample_outputs.md` for detailed examples of the application in action.

## License

This project is part of the AI Challenge 2025 educational program.

## Support

For issues or questions, please refer to the challenge documentation or contact the course instructors. 