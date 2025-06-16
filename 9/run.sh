#!/bin/bash

# Service Analyzer - Convenient runner script
# This script automatically activates the virtual environment and runs the application

# Check if virtual environment exists
if [ ! -d "service_analyzer_env" ]; then
    echo "❌ Virtual environment not found. Please run setup.py first:"
    echo "   python3 setup.py"
    exit 1
fi

# Check if service_analyzer.py exists
if [ ! -f "service_analyzer.py" ]; then
    echo "❌ service_analyzer.py not found. Please ensure you're in the correct directory."
    exit 1
fi

# Activate virtual environment and run the application
echo "🚀 Starting Service Analyzer..."

# If no arguments provided, run in interactive mode
if [ $# -eq 0 ]; then
    echo "💡 No arguments provided, starting in interactive mode"
    source service_analyzer_env/bin/activate && python3 service_analyzer.py --interactive
else
    # Pass all arguments to the application
    echo "📝 Running with arguments: $@"
    source service_analyzer_env/bin/activate && python3 service_analyzer.py "$@"
fi

echo "👋 Service Analyzer finished" 