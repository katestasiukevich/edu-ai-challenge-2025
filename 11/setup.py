#!/usr/bin/env python3
"""
Setup script for Audio Transcription and Analysis Tool
"""

import os
import sys
import subprocess
from pathlib import Path

def run_command(command, description):
    """Run a command and return success status."""
    print(f"🔧 {description}...")
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print(f"✅ {description} completed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ {description} failed: {e}")
        if e.stdout:
            print(f"stdout: {e.stdout}")
        if e.stderr:
            print(f"stderr: {e.stderr}")
        return False

def check_python_version():
    """Check if Python version is compatible."""
    version = sys.version_info
    if version.major < 3 or (version.major == 3 and version.minor < 7):
        print(f"❌ Python 3.7+ required, but you have {version.major}.{version.minor}")
        return False
    print(f"✅ Python {version.major}.{version.minor}.{version.micro} detected")
    return True

def install_dependencies():
    """Install required Python packages."""
    requirements_file = Path("requirements.txt")
    if not requirements_file.exists():
        print("❌ requirements.txt not found")
        return False
    
    return run_command("pip install -r requirements.txt", "Installing dependencies")

def check_env_file():
    """Check if .env file exists and has required variables."""
    env_file = Path(".env")
    if not env_file.exists():
        print("❌ .env file not found")
        return False
    
    try:
        with open(env_file, 'r') as f:
            content = f.read()
        
        if "OPENAI_API_KEY" not in content:
            print("❌ OPENAI_API_KEY not found in .env file")
            return False
        
        print("✅ .env file exists with API key")
        return True
    except Exception as e:
        print(f"❌ Error reading .env file: {e}")
        return False

def test_application():
    """Test the application with help command."""
    return run_command("python3 audio_transcriber.py --help", "Testing application")

def main():
    """Main setup function."""
    print("🎙️  Audio Transcription and Analysis Tool - Setup")
    print("=" * 50)
    
    success = True
    
    # Check Python version
    if not check_python_version():
        success = False
    
    # Install dependencies
    if success and not install_dependencies():
        success = False
    
    # Check environment file
    if success and not check_env_file():
        success = False
    
    # Test application
    if success and not test_application():
        success = False
    
    print("\n" + "=" * 50)
    if success:
        print("✅ Setup completed successfully!")
        print("\nNext steps:")
        print("1. Download the audio file from the SharePoint link in README.md")
        print("2. Replace the empty 'audio' file with the downloaded CAR0004.mp3")
        print("3. Run: python3 audio_transcriber.py audio")
    else:
        print("❌ Setup failed. Please check the errors above.")
    
    return success

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1) 