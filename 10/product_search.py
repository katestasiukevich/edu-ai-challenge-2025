#!/usr/bin/env python3
"""
Product Search Tool using OpenAI Function Calling
A console application that searches products based on natural language queries.
"""

import json
import os
import sys
from typing import List, Dict, Any
from openai import OpenAI
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class ProductSearchTool:
    def __init__(self):
        """Initialize the Product Search Tool."""
        self.client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
        self.products = self.load_products()
        
        if not os.getenv('OPENAI_API_KEY'):
            print("Error: OPENAI_API_KEY environment variable not set.")
            print("Please set your OpenAI API key in a .env file or as an environment variable.")
            sys.exit(1)
    
    def load_products(self) -> List[Dict[str, Any]]:
        """Load products from the JSON file."""
        try:
            with open('products.json', 'r') as file:
                return json.load(file)
        except FileNotFoundError:
            print("Error: products.json file not found.")
            sys.exit(1)
        except json.JSONDecodeError:
            print("Error: Invalid JSON format in products.json.")
            sys.exit(1)
    
    def search_products(self, user_query: str) -> List[Dict[str, Any]]:
        """
        Search products using OpenAI function calling.
        
        Args:
            user_query: Natural language search query from user
            
        Returns:
            List of filtered products
        """
        # Define the function schema for OpenAI
        function_schema = {
            "name": "filter_products",
            "description": "Filter products based on user preferences including category, price range, rating, and stock availability",
            "parameters": {
                "type": "object",
                "properties": {
                    "category": {
                        "type": "string",
                        "description": "Product category (Electronics, Fitness, Kitchen, Books, Clothing)",
                        "enum": ["Electronics", "Fitness", "Kitchen", "Books", "Clothing"]
                    },
                    "max_price": {
                        "type": "number",
                        "description": "Maximum price limit"
                    },
                    "min_price": {
                        "type": "number",
                        "description": "Minimum price limit"
                    },
                    "min_rating": {
                        "type": "number",
                        "description": "Minimum rating requirement (0-5 scale)"
                    },
                    "in_stock_only": {
                        "type": "boolean",
                        "description": "Whether to show only in-stock items"
                    },
                    "product_names": {
                        "type": "array",
                        "items": {"type": "string"},
                        "description": "Specific product names mentioned by the user"
                    }
                },
                "required": []
            }
        }
        
        # Create the system message with product data
        system_message = f"""
        You are a product search assistant. You have access to the following products:
        {json.dumps(self.products, indent=2)}
        
        Based on the user's natural language query, you should call the filter_products function 
        with appropriate parameters to filter the products. Then return the matching products.
        """
        
        try:
            # Make the API call with function calling
            # Try different models in order of preference
            # Check if user specified a preferred model in environment
            preferred_model = os.getenv('OPENAI_MODEL', 'gpt-4.1-mini')
            models_to_try = [preferred_model, "gpt-4.1-mini", "gpt-4o-mini", "gpt-4o", "gpt-4", "gpt-3.5-turbo"]
            # Remove duplicates while preserving order
            models_to_try = list(dict.fromkeys(models_to_try))
            
            for model in models_to_try:
                try:
                    response = self.client.chat.completions.create(
                        model=model,
                        messages=[
                            {"role": "system", "content": system_message},
                            {"role": "user", "content": user_query}
                        ],
                        functions=[function_schema],
                        function_call={"name": "filter_products"}
                    )
                    print(f"Using model: {model}")
                    break
                except Exception as model_error:
                    if "model_not_found" in str(model_error) or "does not have access" in str(model_error):
                        continue
                    else:
                        raise model_error
            else:
                raise Exception("No accessible models found. Please check your OpenAI account and model access.")
            
            # Extract function call arguments
            function_call = response.choices[0].message.function_call
            if function_call and function_call.name == "filter_products":
                filter_params = json.loads(function_call.arguments)
                return self.apply_filters(filter_params)
            else:
                print("Error: No function call received from OpenAI API.")
                return []
                
        except Exception as e:
            print(f"Error calling OpenAI API: {e}")
            return []
    
    def apply_filters(self, filter_params: Dict[str, Any]) -> List[Dict[str, Any]]:
        """
        Apply the filters returned by OpenAI function calling.
        
        Args:
            filter_params: Dictionary containing filter parameters
            
        Returns:
            List of filtered products
        """
        filtered_products = self.products[:]
        
        # Apply category filter
        if 'category' in filter_params and filter_params['category']:
            filtered_products = [p for p in filtered_products 
                               if p['category'] == filter_params['category']]
        
        # Apply price range filters
        if 'max_price' in filter_params and filter_params['max_price']:
            filtered_products = [p for p in filtered_products 
                               if p['price'] <= filter_params['max_price']]
        
        if 'min_price' in filter_params and filter_params['min_price']:
            filtered_products = [p for p in filtered_products 
                               if p['price'] >= filter_params['min_price']]
        
        # Apply rating filter
        if 'min_rating' in filter_params and filter_params['min_rating']:
            filtered_products = [p for p in filtered_products 
                               if p['rating'] >= filter_params['min_rating']]
        
        # Apply stock filter
        if 'in_stock_only' in filter_params and filter_params['in_stock_only']:
            filtered_products = [p for p in filtered_products if p['in_stock']]
        
        # Apply specific product name filter
        if 'product_names' in filter_params and filter_params['product_names']:
            product_names = [name.lower() for name in filter_params['product_names']]
            filtered_products = [p for p in filtered_products 
                               if any(name in p['name'].lower() for name in product_names)]
        
        return filtered_products
    
    def format_output(self, products: List[Dict[str, Any]]) -> str:
        """
        Format the filtered products for display.
        
        Args:
            products: List of filtered products
            
        Returns:
            Formatted string for display
        """
        if not products:
            return "No products found matching your criteria."
        
        output = "Filtered Products:\n"
        for i, product in enumerate(products, 1):
            stock_status = "In Stock" if product['in_stock'] else "Out of Stock"
            output += f"{i}. {product['name']} - ${product['price']:.2f}, Rating: {product['rating']}, {stock_status}\n"
        
        return output
    
    def run(self):
        """Run the console application."""
        print("=== Product Search Tool ===")
        print("Enter natural language queries to search for products.")
        print("Examples:")
        print("- 'I need a smartphone under $800'")
        print("- 'Show me fitness equipment with rating above 4.5'")
        print("- 'Find electronics that are in stock'")
        print("Type 'quit' to exit.\n")
        
        while True:
            try:
                user_input = input("Enter your search query: ").strip()
                
                if user_input.lower() in ['quit', 'exit', 'q']:
                    print("Thank you for using Product Search Tool!")
                    break
                
                if not user_input:
                    print("Please enter a valid search query.")
                    continue
                
                print("\nSearching products...")
                filtered_products = self.search_products(user_input)
                result = self.format_output(filtered_products)
                print(f"\n{result}")
                print("-" * 50)
                
            except KeyboardInterrupt:
                print("\n\nThank you for using Product Search Tool!")
                break
            except Exception as e:
                print(f"An error occurred: {e}")
                print("Please try again.")

if __name__ == "__main__":
    app = ProductSearchTool()
    app.run() 