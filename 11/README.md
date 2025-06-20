# Audio Transcription and Analysis Tool

A powerful console application that transcribes audio files using OpenAI's Whisper API, generates summaries using GPT, and provides detailed analytics including word count, speaking speed, and frequently mentioned topics.

## Features

- 🎵 **Audio Transcription**: Uses OpenAI's Whisper-1 model for accurate speech-to-text conversion
- 📝 **AI-Powered Summarization**: Generates comprehensive summaries using GPT-4.1-mini
- 📊 **Advanced Analytics**: Calculates word count, speaking speed (WPM), and identifies top topics
- 💾 **File Management**: Automatically saves results in separate timestamped files
- 🔒 **Secure**: Uses environment variables for API key management
- 🎯 **Flexible**: Supports various audio formats (MP3, WAV, M4A, etc.)

## Requirements

- Python 3.7 or higher
- OpenAI API key with access to Whisper-1 and GPT-4.1-mini models
- Audio file in supported format

## Installation

1. **Navigate to the project directory:**
   ```bash
   cd 11
   ```

2. **Install required dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Verify your API key is set:**
   The `.env` file should already contain your OpenAI API key:
   ```
   OPENAI_API_KEY=your_api_key_here
   OPENAI_MODEL=gpt-4.1-mini
   ```

## Usage

### Basic Usage

```bash
python3 audio_transcriber.py path/to/your/audio/file.mp3
```

### With Custom API Key

```bash
python3 audio_transcriber.py audio_file.mp3 --api-key your_api_key_here
```

### Examples

```bash
# Transcribe the provided sample audio
python3 audio_transcriber.py audio

# Transcribe any audio file
python3 audio_transcriber.py /path/to/meeting_recording.mp3

# Use custom API key
python3 audio_transcriber.py audio --api-key sk-your-key-here
```

## Getting the Sample Audio File

The sample audio file (`CAR0004.mp3`) is available at:
[SharePoint Link](https://ventionteamsinc-my.sharepoint.com/personal/mikita_sauko_ventionteams_com/_layouts/15/stream.aspx?id=%2Fpersonal%2Fmikita%5Fsauko%5Fventionteams%5Fcom%2FDocuments%2FEDU%20AI%20Challenge%20%2D%20Tasks%2Ftask%5F11%2FCAR0004%2Emp3)

**To use the sample audio:**
1. Download `CAR0004.mp3` from the SharePoint link above
2. Replace the empty `audio` file with the downloaded MP3 file:
   ```bash
   # Remove the empty file
   rm audio
   
   # Copy the downloaded file
   cp ~/Downloads/CAR0004.mp3 audio
   ```

## Output Files

The application creates three types of output files, each with a timestamp:

1. **`transcription_YYYYMMDD_HHMMSS.md`** - Complete transcription of the audio
2. **`summary_YYYYMMDD_HHMMSS.md`** - AI-generated summary of the content
3. **`analysis_YYYYMMDD_HHMMSS.json`** - Detailed analytics in JSON format

### Sample Analysis Output

```json
{
  "word_count": 1280,
  "speaking_speed_wpm": 132,
  "frequently_mentioned_topics": [
    { "topic": "Customer Onboarding", "mentions": 6 },
    { "topic": "Q4 Roadmap", "mentions": 4 },
    { "topic": "AI Integration", "mentions": 3 }
  ]
}
```

## Console Output

The application provides real-time feedback and displays:

- Processing status and progress
- Analysis summary (word count, speaking speed, top topics)
- Generated summary preview
- List of created files
- Complete analysis in JSON format

## Supported Audio Formats

The application supports various audio formats including:
- MP3
- WAV
- M4A
- FLAC
- OGG
- And other formats supported by OpenAI Whisper API

## Error Handling

The application includes comprehensive error handling for:
- Missing or invalid audio files
- API key issues
- Network connectivity problems
- File permission errors
- API rate limiting

## Configuration

### Environment Variables

- `OPENAI_API_KEY` - Your OpenAI API key (required)
- `OPENAI_MODEL` - GPT model to use (default: gpt-4.1-mini)

### Available Models

With your API key, you can use:
- `whisper-1` - For audio transcription (automatically used)
- `gpt-4.1-mini` - For summarization and topic analysis (default)

## Troubleshooting

### Common Issues

1. **"Audio file is empty"**
   - Make sure you've downloaded the actual audio file from SharePoint
   - Verify the file size is greater than 0 bytes

2. **"OpenAI API key not found"**
   - Check that the `.env` file exists and contains your API key
   - Verify the API key format starts with `sk-`

3. **"Transcription failed"**
   - Check your internet connection
   - Verify your API key has sufficient credits
   - Ensure the audio file is in a supported format

4. **Python command not found**
   - Use `python3` instead of `python` on Linux systems
   - Make sure Python 3.7+ is installed

### Getting Help

If you encounter issues:
1. Check the error message for specific details
2. Verify all requirements are installed
3. Test with a small audio file first
4. Check OpenAI API status if network errors occur

## File Structure

```
11/
├── audio_transcriber.py    # Main application
├── requirements.txt        # Python dependencies
├── README.md              # This file
├── .env                   # Environment variables
├── audio                  # Sample audio file (replace with actual file)
├── transcription_*.md     # Generated transcriptions
├── summary_*.md           # Generated summaries
└── analysis_*.json        # Generated analytics
```

## License

This project is part of the EDU AI Challenge 2025.

## Version History

- **v1.0.0** - Initial release with full transcription, summarization, and analytics features 