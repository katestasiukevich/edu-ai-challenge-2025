#!/usr/bin/env python3
"""
Setup script for Service Analyzer
Helps users install dependencies and configure the application.
"""

import os
import sys
import subprocess
from pathlib import Path

def run_command(command, description):
    """Run a command and handle errors."""
    print(f"📦 {description}...")
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print(f"✅ {description} completed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ {description} failed: {e.stderr}")
        return False

def check_python_version():
    """Check if Python version is compatible."""
    version = sys.version_info
    if version.major < 3 or (version.major == 3 and version.minor < 7):
        print("❌ Python 3.7 or higher is required")
        print(f"   Current version: {version.major}.{version.minor}.{version.micro}")
        return False
    print(f"✅ Python version {version.major}.{version.minor}.{version.micro} is compatible")
    return True

def create_virtual_environment():
    """Create a virtual environment if it doesn't exist."""
    venv_path = Path("service_analyzer_env")
    if venv_path.exists():
        print("✅ Virtual environment already exists")
        return True
    
    return run_command("python3 -m venv service_analyzer_env", "Creating virtual environment")

def install_dependencies():
    """Install required Python packages in virtual environment."""
    venv_pip = Path("service_analyzer_env/bin/pip")
    if not venv_pip.exists():
        print("❌ Virtual environment not found")
        return False
    
    command = f"{venv_pip} install -r requirements.txt"
    return run_command(command, "Installing dependencies in virtual environment")

def create_env_template():
    """Create .env template file."""
    env_content = """# Service Analyzer Environment Configuration
# Add your OpenAI API key below

# OpenAI API Key - Get yours at https://platform.openai.com/api-keys
OPENAI_API_KEY=your-openai-api-key-here

# AI Model Selection - Choose based on your OpenAI account access
# gpt-3.5-turbo-instruct: Most compatible, works with basic accounts (default)
# gpt-3.5-turbo: Chat model, may require higher access level
# gpt-4: Premium quality, requires GPT-4 access (paid accounts only)
OPENAI_MODEL=gpt-3.5-turbo-instruct

# Optional: Uncomment to set a custom timeout (in seconds)
# API_TIMEOUT=30
"""
    
    env_file = Path(".env")
    if env_file.exists():
        print("⚠️  .env file already exists, skipping creation")
        return True
    
    try:
        with open(env_file, 'w') as f:
            f.write(env_content)
        print("✅ Created .env template file")
        print("   Please edit .env and add your OpenAI API key")
        return True
    except Exception as e:
        print(f"❌ Failed to create .env file: {e}")
        return False

def make_executable():
    """Make the main script executable on Unix systems."""
    if os.name == 'posix':  # Unix-like systems
        try:
            os.chmod('service_analyzer.py', 0o755)
            print("✅ Made service_analyzer.py executable")
            return True
        except Exception as e:
            print(f"⚠️  Could not make script executable: {e}")
            return False
    return True

def test_installation():
    """Test if the installation works."""
    print("🧪 Testing installation...")
    try:
        venv_python = Path("service_analyzer_env/bin/python3")
        if not venv_python.exists():
            print("❌ Virtual environment Python not found")
            return False
            
        result = subprocess.run([str(venv_python), 'service_analyzer.py', '--help'], 
                              capture_output=True, text=True, timeout=10)
        if result.returncode == 0:
            print("✅ Installation test passed")
            return True
        else:
            print(f"❌ Installation test failed: {result.stderr}")
            return False
    except Exception as e:
        print(f"❌ Installation test error: {e}")
        return False

def main():
    """Main setup function."""
    print("🚀 Service Analyzer Setup")
    print("=" * 40)
    
    success = True
    
    # Check Python version
    if not check_python_version():
        success = False
    
    # Create virtual environment
    if success and not create_virtual_environment():
        success = False
    
    # Install dependencies
    if success and not install_dependencies():
        success = False
    
    # Create .env template
    if success and not create_env_template():
        success = False
    
    # Make script executable
    if success:
        make_executable()
    
    # Test installation
    if success and not test_installation():
        success = False
    
    print("\n" + "=" * 40)
    if success:
        print("🎉 Setup completed successfully!")
        print("\nNext steps:")
        print("1. Edit .env file and add your OpenAI API key")
        print("2. Activate the virtual environment:")
        print("   source service_analyzer_env/bin/activate")
        print("3. Run the application:")
        print("   python3 service_analyzer.py --interactive")
        print("   OR python3 service_analyzer.py --service 'Spotify'")
        print("\n💡 Tip: You can also use the run.sh script for easier execution")
    else:
        print("❌ Setup encountered some issues")
        print("Please check the error messages above and try again")
    
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main()) 