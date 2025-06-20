#!/usr/bin/env python3
"""
Audio Transcription and Analysis Tool

This console application transcribes audio files using OpenAI's Whisper API,
summarizes the content using GPT, and provides detailed analytics.
"""

import os
import sys
import json
import argparse
import datetime
import re
from pathlib import Path
from collections import Counter
from typing import Dict, List, Tuple, Any

try:
    import openai
    from openai import OpenAI
    from dotenv import load_dotenv
except ImportError as e:
    print(f"❌ Missing required dependency: {e}")
    print("Please install requirements: pip install -r requirements.txt")
    sys.exit(1)

# Load environment variables
load_dotenv()

class AudioTranscriber:
    """Main class for audio transcription and analysis."""
    
    def __init__(self, api_key: str = None):
        """Initialize the transcriber with OpenAI API key."""
        self.api_key = api_key or os.getenv('OPENAI_API_KEY')
        if not self.api_key:
            raise ValueError(
                "OpenAI API key not found. Please set OPENAI_API_KEY in .env file "
                "or pass it as a parameter."
            )
        
        # Initialize OpenAI client (new v1.0+ format)
        self.client = OpenAI(api_key=self.api_key)
        
        # Configuration
        self.whisper_model = "whisper-1"
        self.gpt_model = os.getenv('OPENAI_MODEL', 'gpt-4.1-mini')
        
        print(f"🤖 Initialized Audio Transcriber")
        print(f"   Whisper Model: {self.whisper_model}")
        print(f"   GPT Model: {self.gpt_model}")
    
    def transcribe_audio(self, audio_file_path: str) -> str:
        """Transcribe audio file using OpenAI Whisper API."""
        audio_path = Path(audio_file_path)
        
        if not audio_path.exists():
            raise FileNotFoundError(f"Audio file not found: {audio_file_path}")
        
        if audio_path.stat().st_size == 0:
            raise ValueError(f"Audio file is empty: {audio_file_path}")
        
        print(f"🎵 Transcribing audio: {audio_file_path}")
        
        try:
            with open(audio_path, 'rb') as audio_file:
                response = self.client.audio.transcriptions.create(
                    model=self.whisper_model,
                    file=audio_file,
                    response_format="text"
                )
            
            transcription = response.strip()
            print(f"✅ Transcription completed ({len(transcription)} characters)")
            return transcription
            
        except Exception as e:
            raise Exception(f"Transcription failed: {str(e)}")
    
    def summarize_text(self, text: str) -> str:
        """Summarize text using OpenAI GPT API."""
        print("📝 Generating summary...")
        
        try:
            response = self.client.chat.completions.create(
                model=self.gpt_model,
                messages=[
                    {
                        "role": "system",
                        "content": "You are a professional summarizer. Create a clear, comprehensive summary of the provided text, highlighting key points and main themes."
                    },
                    {
                        "role": "user",
                        "content": f"Please summarize the following text:\n\n{text}"
                    }
                ],
                max_tokens=500,
                temperature=0.3
            )
            
            summary = response.choices[0].message.content.strip()
            print(f"✅ Summary generated ({len(summary)} characters)")
            return summary
            
        except Exception as e:
            raise Exception(f"Summarization failed: {str(e)}")
    
    def calculate_speaking_speed(self, text: str, audio_duration: float = None) -> float:
        """Calculate speaking speed in words per minute."""
        word_count = len(text.split())
        
        # If no duration provided, estimate based on average speaking speed
        if audio_duration is None:
            # Assume average speaking speed of 150 WPM for estimation
            estimated_duration_minutes = word_count / 150
            return 150.0
        
        duration_minutes = audio_duration / 60
        if duration_minutes == 0:
            return 0.0
        
        return word_count / duration_minutes
    
    def extract_topics(self, text: str, top_n: int = 5) -> List[Dict[str, Any]]:
        """Extract frequently mentioned topics from text."""
        print("🔍 Analyzing topics...")
        
        try:
            # Use GPT to identify topics
            response = self.client.chat.completions.create(
                model=self.gpt_model,
                messages=[
                    {
                        "role": "system",
                        "content": "You are a text analyst. Identify the most frequently mentioned topics, themes, or subjects in the provided text. Return only a JSON array of objects with 'topic' and 'mentions' fields, where 'mentions' is your estimate of how many times each topic is referenced (directly or indirectly)."
                    },
                    {
                        "role": "user",
                        "content": f"Analyze this text and identify the top {top_n} most frequently mentioned topics:\n\n{text}"
                    }
                ],
                max_tokens=300,
                temperature=0.1
            )
            
            topics_text = response.choices[0].message.content.strip()
            
            try:
                # Try to parse as JSON
                topics = json.loads(topics_text)
                if isinstance(topics, list):
                    return topics[:top_n]
            except json.JSONDecodeError:
                pass
            
            # Fallback: simple keyword extraction
            return self._fallback_topic_extraction(text, top_n)
            
        except Exception as e:
            print(f"⚠️ Topic extraction via GPT failed: {e}")
            return self._fallback_topic_extraction(text, top_n)
    
    def _fallback_topic_extraction(self, text: str, top_n: int) -> List[Dict[str, Any]]:
        """Fallback method for topic extraction using simple keyword analysis."""
        # Clean text and extract meaningful words
        words = re.findall(r'\b[a-zA-Z]{3,}\b', text.lower())
        
        # Filter out common stop words
        stop_words = {
            'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had',
            'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his',
            'how', 'man', 'new', 'now', 'old', 'see', 'two', 'way', 'who', 'boy',
            'did', 'its', 'let', 'put', 'say', 'she', 'too', 'use', 'will', 'with',
            'this', 'that', 'they', 'have', 'been', 'their', 'said', 'each', 'which',
            'what', 'there', 'from', 'would', 'could', 'should', 'were', 'when'
        }
        
        meaningful_words = [word for word in words if word not in stop_words and len(word) > 3]
        
        # Count word frequencies
        word_counts = Counter(meaningful_words)
        
        # Convert to topic format
        topics = []
        for word, count in word_counts.most_common(top_n):
            topics.append({
                "topic": word.title(),
                "mentions": count
            })
        
        return topics
    
    def analyze_transcript(self, transcript: str) -> Dict[str, Any]:
        """Perform comprehensive analysis of the transcript."""
        print("📊 Analyzing transcript...")
        
        # Calculate word count
        word_count = len(transcript.split())
        
        # Calculate speaking speed (using estimated duration)
        speaking_speed = self.calculate_speaking_speed(transcript)
        
        # Extract topics
        topics = self.extract_topics(transcript)
        
        analysis = {
            "word_count": word_count,
            "speaking_speed_wpm": round(speaking_speed, 1),
            "frequently_mentioned_topics": topics
        }
        
        print(f"✅ Analysis completed")
        return analysis
    
    def save_results(self, transcript: str, summary: str, analysis: Dict[str, Any]) -> Dict[str, str]:
        """Save results to separate files with timestamps."""
        timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
        
        files_created = {}
        
        # Save transcription
        transcription_file = f"transcription_{timestamp}.md"
        with open(transcription_file, 'w', encoding='utf-8') as f:
            f.write(f"# Audio Transcription\n\n")
            f.write(f"**Generated:** {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n")
            f.write(f"## Transcription\n\n{transcript}\n")
        files_created['transcription'] = transcription_file
        
        # Save summary
        summary_file = f"summary_{timestamp}.md"
        with open(summary_file, 'w', encoding='utf-8') as f:
            f.write(f"# Audio Summary\n\n")
            f.write(f"**Generated:** {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n")
            f.write(f"## Summary\n\n{summary}\n")
        files_created['summary'] = summary_file
        
        # Save analysis
        analysis_file = f"analysis_{timestamp}.json"
        with open(analysis_file, 'w', encoding='utf-8') as f:
            json.dump(analysis, f, indent=2, ensure_ascii=False)
        files_created['analysis'] = analysis_file
        
        return files_created
    
    def process_audio(self, audio_file_path: str) -> Dict[str, Any]:
        """Main method to process audio file end-to-end."""
        print(f"\n🚀 Starting audio processing pipeline")
        print(f"📁 Audio file: {audio_file_path}")
        
        try:
            # Step 1: Transcribe audio
            transcript = self.transcribe_audio(audio_file_path)
            
            # Step 2: Generate summary
            summary = self.summarize_text(transcript)
            
            # Step 3: Analyze transcript
            analysis = self.analyze_transcript(transcript)
            
            # Step 4: Save results
            files_created = self.save_results(transcript, summary, analysis)
            
            # Return complete results
            return {
                'transcript': transcript,
                'summary': summary,
                'analysis': analysis,
                'files_created': files_created
            }
            
        except Exception as e:
            print(f"❌ Error processing audio: {e}")
            raise

def main():
    """Main CLI function."""
    parser = argparse.ArgumentParser(
        description="Audio Transcription and Analysis Tool",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python3 audio_transcriber.py audio_file.mp3
  python3 audio_transcriber.py /path/to/audio.wav --api-key your_key_here
        """
    )
    
    parser.add_argument(
        'audio_file',
        help='Path to the audio file to transcribe'
    )
    
    parser.add_argument(
        '--api-key',
        help='OpenAI API key (alternatively set OPENAI_API_KEY env var)'
    )
    
    args = parser.parse_args()
    
    print("🎙️  Audio Transcription and Analysis Tool")
    print("=" * 50)
    
    try:
        # Initialize transcriber
        transcriber = AudioTranscriber(api_key=args.api_key)
        
        # Process audio
        results = transcriber.process_audio(args.audio_file)
        
        # Display results
        print("\n" + "=" * 50)
        print("📋 RESULTS SUMMARY")
        print("=" * 50)
        
        print(f"\n📊 **ANALYSIS**")
        analysis = results['analysis']
        print(f"   Word Count: {analysis['word_count']:,}")
        print(f"   Speaking Speed: {analysis['speaking_speed_wpm']} WPM")
        print(f"   Topics Found: {len(analysis['frequently_mentioned_topics'])}")
        
        print(f"\n🔍 **TOP TOPICS**")
        for i, topic in enumerate(analysis['frequently_mentioned_topics'], 1):
            print(f"   {i}. {topic['topic']} ({topic['mentions']} mentions)")
        
        print(f"\n📝 **SUMMARY**")
        summary_preview = results['summary'][:200] + "..." if len(results['summary']) > 200 else results['summary']
        print(f"   {summary_preview}")
        
        print(f"\n📁 **FILES CREATED**")
        for file_type, filename in results['files_created'].items():
            print(f"   {file_type.title()}: {filename}")
        
        print(f"\n✅ Processing completed successfully!")
        
        # Display analysis as JSON
        print(f"\n📊 **DETAILED ANALYSIS (JSON)**")
        print(json.dumps(analysis, indent=2, ensure_ascii=False))
        
    except KeyboardInterrupt:
        print("\n\n⏹️  Operation cancelled by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main() 