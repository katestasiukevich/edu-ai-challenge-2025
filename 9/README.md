# Service Analyzer

A lightweight console application that generates comprehensive, markdown-formatted reports about digital services and products using AI analysis. The application can analyze both known services (like Spotify, Notion) and custom service descriptions to provide multi-perspective insights from business, technical, and user-focused viewpoints.

## Features

- **Dual Input Support**: Accept either known service names or raw service description text
- **Comprehensive Analysis**: Generate reports with 8 key sections covering business, technical, and user perspectives
- **AI-Powered**: Uses OpenAI's GPT-4 for intelligent analysis and report generation
- **Multiple Modes**: Interactive mode for continuous analysis or single-command execution
- **Export Options**: Save reports to markdown files for documentation and sharing
- **Secure API Key Handling**: Environment variable support for API key security

## Generated Report Sections

Each analysis includes the following sections:

1. **Brief History** - Founding information, milestones, and strategic changes
2. **Target Audience** - User segments, demographics, and market positioning
3. **Core Features** - Key functionalities and value propositions
4. **Unique Selling Points** - Competitive differentiators and advantages
5. **Business Model** - Revenue streams, pricing, and monetization
6. **Tech Stack Insights** - Technology architecture and innovations
7. **Perceived Strengths** - Market advantages and standout features
8. **Perceived Weaknesses** - Limitations and areas for improvement

## Installation

### Prerequisites

- Python 3.7 or higher
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

### Setup Steps

#### Option A: Automated Setup (Recommended)

1. **Navigate to the project directory**
   ```bash
   cd 9/  # Navigate to the project directory
   ```

2. **Run the automated setup script**
   ```bash
   python3 setup.py
   ```
   This will:
   - Check Python version compatibility
   - Create a virtual environment
   - Install all required dependencies
   - Create a .env template file
   - Test the installation

3. **Configure your API key**
   - Edit the `.env` file and add your OpenAI API key:
   ```bash
   nano .env  # or use your preferred editor
   ```
   
   The `.env` file should look like this:
   ```
   # Service Analyzer Environment Configuration
   OPENAI_API_KEY=sk-your-actual-api-key-here
   
   # AI Model Selection - Choose based on your OpenAI account
   OPENAI_MODEL=gpt-3.5-turbo
   ```
   
   Replace `sk-your-actual-api-key-here` with your real OpenAI API key from [platform.openai.com](https://platform.openai.com/api-keys)
   
   **Model Selection:**
   - `gpt-3.5-turbo` (default): Works with all OpenAI accounts, fast and cost-effective
   - `gpt-4`: Higher quality analysis, requires paid OpenAI account with GPT-4 access

4. **Start using the application**
   ```bash
   ./run.sh  # Easy way - automatically handles virtual environment
   # OR manually:
   source service_analyzer_env/bin/activate
   python3 service_analyzer.py --interactive
   ```

#### Option B: Manual Setup

1. **Navigate to the project directory**
   ```bash
   cd 9/
   ```

2. **Create a virtual environment** (Required on modern Ubuntu/Debian systems)
   ```bash
   python3 -m venv service_analyzer_env
   ```

3. **Activate the virtual environment**
   ```bash
   source service_analyzer_env/bin/activate
   ```

4. **Install required dependencies**
   ```bash
   pip install -r requirements.txt
   ```

5. **Set up your OpenAI API key** (Choose one method)

   **Method 1: Environment Variable (Recommended)**
   ```bash
   export OPENAI_API_KEY='your-api-key-here'
   ```
   
   **Method 2: Create a .env file**
   ```bash
   echo "OPENAI_API_KEY=your-api-key-here" > .env
   ```
   
   **Method 3: Pass as command line argument**
   ```bash
   python3 service_analyzer.py --api-key "your-api-key-here" --service "Spotify"
   ```

## Usage

### Method 1: Using the Convenient Run Script (Easiest)

The `run.sh` script automatically handles virtual environment activation:

**Interactive Mode:**
```bash
./run.sh
```

**Analyze a known service:**
```bash
./run.sh --service "Spotify"
```

**Analyze custom service description:**
```bash
./run.sh --text "Our platform connects freelancers with clients..."
```

**Save output to file:**
```bash
./run.sh --service "Notion" --output notion_analysis.md
```

**Use specific AI model:**
```bash
./run.sh --service "Spotify" --model gpt-4  # Premium analysis
./run.sh --list-models                       # Show available models
```

### Method 2: Manual Virtual Environment Activation

If you prefer manual control or the run script doesn't work:

1. **Activate the virtual environment:**
   ```bash
   source service_analyzer_env/bin/activate
   ```

2. **Run the application:**

   **Interactive Mode (Recommended):**
   ```bash
   python3 service_analyzer.py --interactive
   ```

   **Analyze a known service:**
   ```bash
   python3 service_analyzer.py --service "Spotify"
   ```

   **Analyze custom service description:**
   ```bash
   python3 service_analyzer.py --text "Our platform connects freelancers with clients through an AI-powered matching system. We offer project management tools, secure payments, and skill verification."
   ```

   **Save output to file:**
   ```bash
   python3 service_analyzer.py --service "Notion" --output notion_analysis.md
   ```

   **Get help:**
   ```bash
   python3 service_analyzer.py --help
   ```

3. **Deactivate when done (optional):**
   ```bash
   deactivate
   ```

### Interactive Mode Features

In interactive mode, you can:
- Enter service names (e.g., "Spotify", "Notion", "Netflix")
- Paste service description text
- Generate multiple reports in one session
- Save reports to files when prompted
- Type 'quit' or 'exit' to stop

### Command Line Options

| Option | Short | Description |
|--------|-------|-------------|
| `--interactive` | `-i` | Run in interactive mode |
| `--service` | `-s` | Analyze a known service by name |
| `--text` | `-t` | Analyze raw service description text |
| `--output` | `-o` | Save report to specified file |
| `--model` | | Choose AI model (gpt-3.5-turbo, gpt-4) |
| `--list-models` | | Show available models and exit |
| `--api-key` | | Provide OpenAI API key directly |
| `--help` | `-h` | Show help message |

## Supported Services

The application has built-in knowledge of these popular services:

- **Spotify** - Music streaming platform
- **Notion** - All-in-one workspace
- **Netflix** - Video streaming service
- **Zoom** - Video conferencing platform
- **Slack** - Team collaboration tools
- **Airbnb** - Accommodation marketplace
- **Uber** - Ride-hailing service
- **Discord** - Communication platform
- **Figma** - Collaborative design tool
- **GitHub** - Code hosting platform

For other services, simply provide the service name or description text, and the AI will generate a comprehensive analysis.

## Example Workflows

### Scenario 1: Product Manager Research
```bash
# Quick analysis of a competitor
./run.sh --service "Slack" --output competitor_analysis.md

# Custom service analysis
./run.sh --text "Our new SaaS platform helps remote teams..." --output our_service_analysis.md
```

### Scenario 2: Investment Research
```bash
# Interactive mode for multiple service comparisons
./run.sh
# Enter: "Zoom"
# Enter: "Microsoft Teams description..."
# Save both reports for comparison
```

### Scenario 3: User Research
```bash
# Analyze a service from user perspective
./run.sh --service "Netflix"
```

## Troubleshooting

### Common Issues

**1. "externally-managed-environment" error**
This is common on modern Ubuntu/Debian systems. The solution:
```bash
# Use the automated setup (recommended)
python3 setup.py

# OR create virtual environment manually
python3 -m venv service_analyzer_env
source service_analyzer_env/bin/activate
pip install -r requirements.txt
```

**2. "OpenAI package not found"**
Ensure you're using the virtual environment:
```bash
source service_analyzer_env/bin/activate
pip install -r requirements.txt
# OR use the run script: ./run.sh
```

**3. "OpenAI API key not found"**
- Edit the `.env` file and add your API key
- OR set as environment variable: `export OPENAI_API_KEY='your-key'`
- OR pass directly: `./run.sh --api-key "your-key" --service "Spotify"`
- Check that your API key is valid and has credits

**3a. Diagnose OpenAI Account Issues**
If you're getting 403 errors, run the diagnostic tool:
```bash
source service_analyzer_env/bin/activate
python3 diagnose_openai.py
```
This will check your account access and provide specific recommendations.

**4. "Error code: 403 - model not found" or "does not have access to model gpt-4"**
This means your OpenAI account doesn't have GPT-4 access:
```bash
# Solution 1: Use default model (works for all accounts)
./run.sh --service "Spotify"

# Solution 2: Explicitly specify gpt-3.5-turbo
./run.sh --service "Spotify" --model gpt-3.5-turbo

# Solution 3: Update your .env file
# Edit .env and change: OPENAI_MODEL=gpt-3.5-turbo
```

**5. "Error generating analysis"**
- Check your internet connection
- Verify your OpenAI API key has sufficient credits
- Try again in a few moments (API rate limiting)

**6. "Virtual environment not found"**
Run the setup script to create it:
```bash
python3 setup.py
```

**7. Run script permission denied**
Make the script executable:
```bash
chmod +x run.sh
```

**8. Python version issues**
- Ensure you're using Python 3.7 or higher
- Check version: `python3 --version`

### Getting Help

If you encounter issues:

1. **Use the automated setup first**: `python3 setup.py`
2. Check the error message for specific guidance above
3. Verify your OpenAI API key is in the `.env` file
4. Ensure you're using the virtual environment or run script
5. Try a simple test: `./run.sh --service "Spotify"`

## Security Notes

- **Never commit your API key to version control**
- Use environment variables or secure key management
- The application doesn't store or transmit your API key except to OpenAI
- Generated reports may contain publicly available information about services

## API Usage and Costs

- **Default Model**: GPT-3.5-turbo for cost-effectiveness and broad compatibility
- **Premium Option**: GPT-4 for higher quality analysis (requires GPT-4 access)
- **Typical Costs**:
  - GPT-3.5-turbo: ~$0.002-0.01 USD per analysis
  - GPT-4: ~$0.02-0.06 USD per analysis
- **Model Selection**: Use `--model gpt-4` or set `OPENAI_MODEL=gpt-4` in .env
- Monitor your OpenAI usage at [platform.openai.com](https://platform.openai.com/usage)

## License

This project is provided as-is for educational and practical use. Ensure compliance with OpenAI's usage policies when using their API. 