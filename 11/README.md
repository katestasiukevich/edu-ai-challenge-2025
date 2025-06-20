# Audio Transcription and Analysis Tool

A powerful console application that transcribes audio files using OpenAI's Whisper API, generates summaries using GPT, and provides detailed analytics including word count, speaking speed, and frequently mentioned topics.

## 🚀 Quick Start

### Step 1: Clone the Repository

```bash
# Clone the repository to your local machine
git clone https://github.com/katestasiukevich/edu-ai-challenge-2025.git

# Navigate to the project directory
cd edu-ai-challenge-2025/11
```

### Step 2: Install Dependencies

```bash
# Install required Python packages
pip install -r requirements.txt

# Alternative: Use --break-system-packages if you encounter externally-managed-environment error
pip install --break-system-packages -r requirements.txt
```

### Step 3: Set Up OpenAI API Key

**Get Your OpenAI API Key:**
1. Go to [OpenAI API Keys](https://platform.openai.com/api-keys)
2. Sign in or create an OpenAI account
3. Click "Create new secret key"
4. Copy the generated API key (starts with `sk-`)

**Create the .env file:**
```bash
# Create the environment configuration file
cat > .env << 'EOF'
# Audio Transcription and Analysis Tool - Environment Configuration
OPENAI_API_KEY=your_api_key_here
OPENAI_MODEL=gpt-4.1-mini
EOF

# Edit the file and replace 'your_api_key_here' with your actual API key
nano .env  # or use your preferred editor (vim, code, gedit, etc.)
```

**Your .env file should look like this:**
```env
# Audio Transcription and Analysis Tool - Environment Configuration
OPENAI_API_KEY=sk-proj-your-actual-key-here
OPENAI_MODEL=gpt-4.1-mini
```

⚠️ **IMPORTANT**: Never share your API key publicly or commit the `.env` file to version control!

### Step 4: Set Up Audio File

**Option A: Use the provided sample audio**
1. Download `CAR0004.mp3` from: [SharePoint Link](https://ventionteamsinc-my.sharepoint.com/personal/mikita_sauko_ventionteams_com/_layouts/15/stream.aspx?id=%2Fpersonal%2Fmikita%5Fsauko%5Fventionteams%5Fcom%2FDocuments%2FEDU%20AI%20Challenge%20%2D%20Tasks%2Ftask%5F11%2FCAR0004%2Emp3)
2. Replace the `audio.mp3` file:
   ```bash
   # Copy the downloaded file
   cp ~/Downloads/CAR0004.mp3 audio.mp3
   ```

**Option B: Use your own audio file**
```bash
# Copy your audio file and rename it
cp /path/to/your/audio/file.mp3 audio.mp3
```

### Step 5: Run the Application

```bash
# Run the transcription and analysis
python3 audio_transcriber.py audio.mp3
```

That's it! The application will process your audio file and generate transcription, summary, and analysis results.

## 📋 Features

- 🎵 **Audio Transcription**: Uses OpenAI's Whisper-1 model for accurate speech-to-text conversion
- 📝 **AI-Powered Summarization**: Generates comprehensive summaries using GPT-4.1-mini
- 📊 **Advanced Analytics**: Calculates word count, speaking speed (WPM), and identifies top topics
- 💾 **File Management**: Automatically saves results in separate timestamped files
- 🔒 **Secure**: Uses environment variables for API key management
- 🎯 **Flexible**: Supports various audio formats (MP3, WAV, M4A, FLAC, OGG, etc.)

## 🛠️ Detailed Installation Guide

### Prerequisites

- **Python 3.7 or higher** - Check with `python3 --version`
- **Git** - For cloning the repository
- **OpenAI API key** - You need to get your own API key from OpenAI
- **Internet connection** - For API calls to OpenAI services

### Complete Setup Instructions

1. **Clone the Repository**
   ```bash
   # Clone from GitHub
   git clone https://github.com/katestasiukevich/edu-ai-challenge-2025.git
   
   # Navigate to the task 11 directory
   cd edu-ai-challenge-2025/11
   ```

2. **Verify Files**
   ```bash
   # Check that all required files are present
   ls -la
   
   # You should see:
   # - audio_transcriber.py (main application)
   # - requirements.txt (dependencies)
   # - README.md (this file)
   # - setup.py (optional setup script)
   # Note: .env file is NOT included - you'll create it in the next step
   ```

3. **Install Dependencies**
   ```bash
   # Method 1: Standard installation
   pip install -r requirements.txt
   
   # Method 2: If you get "externally-managed-environment" error (Ubuntu/Debian)
   pip install --break-system-packages -r requirements.txt
   
   # Method 3: Using virtual environment (recommended)
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

4. **Create .env File and Add Your API Key**
   ```bash
   # Create the environment configuration file
   cat > .env << 'EOF'
   OPENAI_API_KEY=your_api_key_here
   OPENAI_MODEL=gpt-4.1-mini
   EOF
   
   # Edit the file and add your actual OpenAI API key
   nano .env  # Replace 'your_api_key_here' with your actual key from OpenAI
   ```
   
   **Get your API key:**
   - Go to [OpenAI API Keys](https://platform.openai.com/api-keys)
   - Sign in or create an account
   - Click "Create new secret key"
   - Copy the key (starts with `sk-`) and paste it in the .env file

5. **Test Installation**
   ```bash
   # Run the application with help flag to verify setup
   python3 audio_transcriber.py --help
   ```

## 🎯 Usage Guide

### Basic Usage

```bash
# Process an MP3 file
python3 audio_transcriber.py audio.mp3

# Process any audio file
python3 audio_transcriber.py /path/to/your/audio/file.wav

# Use custom API key (optional)
python3 audio_transcriber.py audio.mp3 --api-key your_api_key_here
```

### Command Line Options

```bash
# Show help
python3 audio_transcriber.py --help

# Process with custom API key
python3 audio_transcriber.py audio.mp3 --api-key sk-your-key-here
```

### Expected Output

When you run the application, you'll see:

```
🎙️  Audio Transcription and Analysis Tool
==================================================
🤖 Initialized Audio Transcriber
   Whisper Model: whisper-1
   GPT Model: gpt-4.1-mini

🚀 Starting audio processing pipeline
📁 Audio file: audio.mp3
🎵 Transcribing audio: audio.mp3
✅ Transcription completed (4785 characters)
📝 Generating summary...
✅ Summary generated (1510 characters)
📊 Analyzing transcript...
🔍 Analyzing topics...
✅ Analysis completed

==================================================
📋 RESULTS SUMMARY
==================================================

📊 **ANALYSIS**
   Word Count: 968
   Speaking Speed: 150.0 WPM
   Topics Found: 5

🔍 **TOP TOPICS**
   1. chest pain (20 mentions)
   2. symptoms (15 mentions)
   3. heart attack (10 mentions)
   4. medical history (8 mentions)
   5. diagnostic tests (5 mentions)

📝 **SUMMARY**
   The text is a detailed medical interview between a healthcare provider and a 25-year-old...

📁 **FILES CREATED**
   Transcription: transcription_20250620_124227.md
   Summary: summary_20250620_124227.md
   Analysis: analysis_20250620_124227.json

✅ Processing completed successfully!
```

## 📁 Output Files

The application creates three types of files:

### 1. Transcription File (`transcription.md`)
- Complete speech-to-text conversion
- Formatted in Markdown
- Contains the full audio transcription

### 2. Summary File (`summary.md`)
- AI-generated summary of the content
- Highlights key points and themes
- Created using GPT-4.1-mini

### 3. Analysis File (`analysis.json`)
- Detailed analytics in JSON format
- Contains word count, speaking speed, and topic analysis

**Sample `analysis.json`:**
```json
{
  "word_count": 968,
  "speaking_speed_wpm": 150.0,
  "frequently_mentioned_topics": [
    {
      "topic": "chest pain",
      "mentions": 20
    },
    {
      "topic": "symptoms",
      "mentions": 15
    },
    {
      "topic": "heart attack",
      "mentions": 10
    },
    {
      "topic": "medical history",
      "mentions": 8
    },
    {
      "topic": "diagnostic tests",
      "mentions": 5
    }
  ]
}
```

## 🔧 Configuration

### API Key Configuration

The application uses your OpenAI API key stored in the `.env` file:

```env
# Audio Transcription and Analysis Tool - Environment Configuration
OPENAI_API_KEY=sk-proj-your-actual-key-here
OPENAI_MODEL=gpt-4.1-mini
```

🔑 **Getting Your API Key:**
- Visit [OpenAI API Keys](https://platform.openai.com/api-keys)
- Create an account or sign in
- Generate a new secret key
- Copy it to your `.env` file

### Available Models

- **`whisper-1`** - Audio transcription (automatically used)
- **`gpt-4.1-mini`** - Text summarization and topic analysis (default)

## 🎵 Supported Audio Formats

The application supports all formats compatible with OpenAI Whisper API:

- **MP3** (recommended)
- **WAV**
- **M4A**
- **FLAC**
- **OGG**
- **MP4** (audio track)
- **MPEG**
- **MPGA**
- **WEBM**

## 🔍 Troubleshooting

### Common Issues and Solutions

#### 1. **"Audio file is empty"**
```bash
# Check file size
ls -lh audio.mp3

# If empty, download the sample audio or use your own file
cp ~/Downloads/CAR0004.mp3 audio.mp3
```

#### 2. **"OpenAI API key not found"**
```bash
# Check if .env file exists
ls -la .env

# If .env doesn't exist, create it:
cat > .env << 'EOF'
OPENAI_API_KEY=your_api_key_here
OPENAI_MODEL=gpt-4.1-mini
EOF

# Edit the file and add your actual API key
nano .env

# Verify API key format (should start with 'sk-')
head -3 .env
```

**Get your API key from:**
- [OpenAI API Keys](https://platform.openai.com/api-keys)
- Sign up/sign in → Create new secret key → Copy the key

#### 3. **"Transcription failed"**
- Check internet connection
- Verify audio file format is supported
- Ensure API key has sufficient credits

#### 4. **"externally-managed-environment" error**
```bash
# Use the --break-system-packages flag
pip install --break-system-packages -r requirements.txt

# Or use virtual environment
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

#### 5. **"python3 command not found"**
```bash
# Check Python installation
python --version
python3 --version

# Install Python 3 if needed (Ubuntu/Debian)
sudo apt update
sudo apt install python3 python3-pip
```

### Getting Help

If you encounter issues:

1. **Check the console output** for specific error messages
2. **Verify all requirements** are properly installed
3. **Test with a small audio file** first
4. **Check OpenAI API status** at https://status.openai.com/

## 📂 Project Structure

```
edu-ai-challenge-2025/11/
├── audio_transcriber.py     # Main console application
├── requirements.txt         # Python dependencies
├── README.md               # This comprehensive guide
├── setup.py                # Optional setup script
├── .env                    # API key configuration (YOU CREATE THIS)
├── audio.mp3               # Sample audio file (2.3MB)
├── transcription.md        # Generated transcription
├── summary.md              # AI-generated summary
└── analysis.json           # Analytics results
```

**Note:** The `.env` file is not included in the repository for security reasons. You must create it yourself with your own OpenAI API key.

## 🚀 Advanced Usage

### Processing Multiple Files

```bash
# Process multiple audio files
for file in *.mp3; do
    python3 audio_transcriber.py "$file"
done
```

### Batch Processing Script

```bash
#!/bin/bash
# Create a batch processing script
echo '#!/bin/bash' > batch_process.sh
echo 'for file in "$@"; do' >> batch_process.sh
echo '    echo "Processing: $file"' >> batch_process.sh
echo '    python3 audio_transcriber.py "$file"' >> batch_process.sh
echo 'done' >> batch_process.sh
chmod +x batch_process.sh

# Use it
./batch_process.sh audio1.mp3 audio2.wav audio3.m4a
```

## 📊 Sample Results

Based on the provided CAR0004.mp3 sample audio (medical consultation):

- **Duration**: ~6.5 minutes
- **Word Count**: 968 words
- **Speaking Speed**: 150 WPM
- **Top Topics**: Medical consultation about chest pain, heart attack concerns, symptoms assessment
- **File Sizes**: 
  - Transcription: ~4.8KB
  - Summary: ~1.5KB
  - Analysis: ~417 bytes

## 🔗 Repository Information

- **GitHub Repository**: https://github.com/katestasiukevich/edu-ai-challenge-2025
- **Task Directory**: `/11/`
- **License**: EDU AI Challenge 2025
- **Author**: Katsiaryna Stasiukevich

## 🎯 Key Benefits

1. **Easy Setup**: Simple git clone and pip install
2. **Comprehensive Results**: Transcription + Summary + Analytics
3. **Production Ready**: Error handling and validation
4. **Flexible Input**: Supports multiple audio formats
5. **Secure**: API key management via environment variables
6. **Detailed Output**: Clear console feedback and file generation

---

**Ready to get started?** Simply run these commands:

```bash
# 1. Clone the repository
git clone https://github.com/katestasiukevich/edu-ai-challenge-2025.git
cd edu-ai-challenge-2025/11

# 2. Install dependencies
pip install -r requirements.txt

# 3. Set up your OpenAI API key
# Get your key from: https://platform.openai.com/api-keys
cat > .env << 'EOF'
OPENAI_API_KEY=your_api_key_here
OPENAI_MODEL=gpt-4.1-mini
EOF
nano .env  # Edit and add your actual API key

# 4. Run the application
python3 audio_transcriber.py audio.mp3
```

🔑 **Don't forget**: You need your own OpenAI API key from [platform.openai.com](https://platform.openai.com/api-keys)

Enjoy transcribing and analyzing your audio files! 🎉 