# Sample Application Outputs

This document contains sample runs of the Product Search Tool demonstrating different types of queries and their results.

## Sample Run 1: Electronics with Price and Stock Filter

**User Query**: "I need electronics under $100 that are in stock"

**Application Output**:
```
=== Product Search Tool ===
Enter natural language queries to search for products.
Examples:
- 'I need a smartphone under $800'
- 'Show me fitness equipment with rating above 4.5'
- 'Find electronics that are in stock'
Type 'quit' to exit.

Enter your search query: I need electronics under $100 that are in stock

Searching products...

Filtered Products:
1. Wireless Headphones - $99.99, Rating: 4.5, In Stock
2. Bluetooth Speaker - $49.99, Rating: 4.4, In Stock
3. Gaming Mouse - $59.99, Rating: 4.3, In Stock
4. External Hard Drive - $89.99, Rating: 4.4, In Stock
5. Portable Charger - $29.99, Rating: 4.2, In Stock
--------------------------------------------------
```

**Explanation**: OpenAI's function calling identified the following parameters:
- `category`: "Electronics"
- `max_price`: 100
- `in_stock_only`: true

The system successfully filtered 5 electronics products under $100 that are currently in stock.

---

## Sample Run 2: High-Rating Fitness Equipment

**User Query**: "Show me fitness equipment with rating above 4.5"

**Application Output**:
```
Enter your search query: Show me fitness equipment with rating above 4.5

Searching products...

Filtered Products:
1. Treadmill - $899.99, Rating: 4.6, Out of Stock
2. Dumbbell Set - $149.99, Rating: 4.7, In Stock
--------------------------------------------------
```

**Explanation**: OpenAI's function calling identified the following parameters:
- `category`: "Fitness"
- `min_rating`: 4.5

The system found 2 fitness products with ratings above 4.5, including one that's out of stock.

---

## Sample Run 3: Specific Product Search

**User Query**: "I'm looking for headphones"

**Application Output**:
```
Enter your search query: I'm looking for headphones

Searching products...

Filtered Products:
1. Wireless Headphones - $99.99, Rating: 4.5, In Stock
2. Noise-Cancelling Headphones - $299.99, Rating: 4.8, In Stock
--------------------------------------------------
```

**Explanation**: OpenAI's function calling identified the following parameters:
- `product_names`: ["headphones"]

The system found 2 products containing "headphones" in their names.

---

## Sample Run 4: Kitchen Appliances with Price Range

**User Query**: "Find kitchen appliances between $50 and $150"

**Application Output**:
```
Enter your search query: Find kitchen appliances between $50 and $150

Searching products...

Filtered Products:
1. Air Fryer - $89.99, Rating: 4.6, In Stock
2. Microwave Oven - $129.99, Rating: 4.5, Out of Stock
3. Coffee Maker - $79.99, Rating: 4.3, In Stock
4. Rice Cooker - $59.99, Rating: 4.3, In Stock
5. Pressure Cooker - $99.99, Rating: 4.7, In Stock
--------------------------------------------------
```

**Explanation**: OpenAI's function calling identified the following parameters:
- `category`: "Kitchen"
- `min_price`: 50
- `max_price`: 150

The system found 5 kitchen appliances within the specified price range.

---

## Sample Run 5: Books Category Search

**User Query**: "Show me all programming books"

**Application Output**:
```
Enter your search query: Show me all programming books

Searching products...

Filtered Products:
1. Programming Guide - $49.99, Rating: 4.7, In Stock
--------------------------------------------------
```

**Explanation**: OpenAI's function calling identified the following parameters:
- `category`: "Books"
- `product_names`: ["programming"]

The system found 1 book containing "programming" in its name.

---

## Sample Run 6: No Results Found

**User Query**: "I need a laptop under $500"

**Application Output**:
```
Enter your search query: I need a laptop under $500

Searching products...

No products found matching your criteria.
--------------------------------------------------
```

**Explanation**: OpenAI's function calling identified the following parameters:
- `product_names`: ["laptop"]
- `max_price`: 500

The system couldn't find any laptops under $500 in the dataset (the Gaming Laptop costs $1299.99 and is out of stock).

---

## Sample Run 7: Exit Application

**User Query**: "quit"

**Application Output**:
```
Enter your search query: quit
Thank you for using Product Search Tool!
```

**Explanation**: The user can exit the application by typing "quit", "exit", or "q".

---

## Key Features Demonstrated

1. **Natural Language Understanding**: The application successfully interprets various query formats and extracts relevant filter criteria.

2. **Multiple Filter Types**: 
   - Category filtering (Electronics, Fitness, Kitchen, Books)
   - Price range filtering (min/max price)
   - Rating filtering (minimum rating)
   - Stock availability filtering
   - Product name/keyword matching

3. **OpenAI Function Calling**: Each query is processed through OpenAI's API, which returns structured parameters for filtering.

4. **Error Handling**: The application gracefully handles cases where no products match the criteria.

5. **User-Friendly Interface**: Clear prompts, formatted output, and easy exit options.

6. **Real-time Processing**: Each query is processed individually, allowing for interactive use.

## Technical Details

- **Model Used**: GPT-3.5-turbo with function calling
- **Function Schema**: Defines parameters for category, price range, rating, stock status, and product names
- **Dataset**: 50 products across 5 categories from `products.json`
- **Output Format**: Numbered list with product name, price, rating, and stock status 