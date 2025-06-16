#!/usr/bin/env python3
"""
OpenAI Account Diagnostic Tool
Helps identify account access issues and available models.
"""

import os
import sys
from openai import OpenAI

def load_env():
    """Load environment variables from .env file"""
    try:
        from dotenv import load_dotenv
        load_dotenv()
    except ImportError:
        pass

def diagnose_openai_account():
    """Diagnose OpenAI account access and available models."""
    
    print("🔍 OpenAI Account Diagnostic Tool")
    print("=" * 50)
    
    # Load API key
    load_env()
    api_key = os.getenv('OPENAI_API_KEY')
    
    if not api_key:
        print("❌ No OpenAI API key found!")
        print("Solutions:")
        print("1. Set OPENAI_API_KEY environment variable")
        print("2. Add OPENAI_API_KEY to .env file")
        print("3. Get API key from: https://platform.openai.com/api-keys")
        return
    
    print(f"✅ API key found: {api_key[:8]}...{api_key[-4:]}")
    
    try:
        client = OpenAI(api_key=api_key)
        print("✅ OpenAI client initialized successfully")
    except Exception as e:
        print(f"❌ Failed to initialize OpenAI client: {e}")
        return
    
    # Test different model categories - prioritize challenge models
    models_to_test = [
        # Challenge available models first
        ('gpt-4.1-mini', 'Challenge model - high quality, efficient'),
        ('whisper-1', 'Challenge model - audio transcription'),
        
        # Other common models
        ('gpt-4o-mini', 'Efficient new model'),
        ('gpt-3.5-turbo', 'Standard chat model'),
        ('gpt-4', 'Premium model'),
        ('gpt-3.5-turbo-instruct', 'Instruct-tuned model'),
        
        # Legacy models
        ('text-davinci-003', 'Legacy completion model'),
        ('text-davinci-002', 'Legacy completion model'),
        ('text-curie-001', 'Basic completion model'),
        ('text-babbage-001', 'Simple completion model'),
    ]
    
    available_models = []
    unavailable_models = []
    
    print("\n🧪 Testing model access...")
    print("-" * 30)
    
    for model, description in models_to_test:
        try:
            # Try a minimal request to test access
            if model == 'whisper-1':
                # Skip whisper test for now (requires audio file)
                print(f"⏭️  {model} - Skipping (requires audio file)")
                continue
            elif 'gpt-' in model and 'instruct' not in model:
                # Chat completion API
                response = client.chat.completions.create(
                    model=model,
                    messages=[{"role": "user", "content": "Hello"}],
                    max_tokens=1
                )
            else:
                # Completion API
                response = client.completions.create(
                    model=model,
                    prompt="Hello",
                    max_tokens=1
                )
            print(f"✅ {model} - {description}")
            available_models.append((model, description))
            
        except Exception as e:
            error_str = str(e)
            if "403" in error_str or "model_not_found" in error_str:
                print(f"❌ {model} - No access")
                unavailable_models.append((model, description, "No access"))
            elif "rate_limit" in error_str.lower():
                print(f"⚠️  {model} - Rate limited (but accessible)")
                available_models.append((model, description))
            else:
                print(f"⚠️  {model} - Error: {error_str[:50]}...")
                unavailable_models.append((model, description, error_str[:50]))
    
    # Summary
    print("\n" + "=" * 50)
    print("📊 DIAGNOSTIC SUMMARY")
    print("=" * 50)
    
    if available_models:
        print(f"✅ AVAILABLE MODELS ({len(available_models)})")
        for model, desc in available_models:
            print(f"   • {model} - {desc}")
    else:
        print("❌ NO MODELS AVAILABLE")
    
    if unavailable_models:
        print(f"\n❌ UNAVAILABLE MODELS ({len(unavailable_models)})")
        for item in unavailable_models[:5]:  # Show first 5
            model, desc, reason = item
            print(f"   • {model} - {reason}")
    
    # Recommendations
    print("\n🔧 RECOMMENDATIONS")
    print("-" * 20)
    
    # Check if challenge models are available
    challenge_models = [model for model, desc in available_models if model in ['gpt-4.1-mini', 'whisper-1']]
    
    if 'gpt-4.1-mini' in [model for model, desc in available_models]:
        print("✅ EXCELLENT: Challenge model gpt-4.1-mini is available!")
        print("Your Service Analyzer is ready to use with high-quality analysis.")
        print("\nRecommended usage:")
        print("  ./run.sh --service 'Spotify'")
        print("  ./run.sh --interactive")
        print("\nCurrent .env configuration should work perfectly!")
        
    elif not available_models:
        print("❌ CRITICAL ISSUE: No models available!")
        print("\nFor challenge tasks, possible solutions:")
        print("1. Ensure you're using the provided challenge API key")
        print("2. Check that the API key is correctly set in .env file")
        print("3. Verify account status at https://platform.openai.com/account")
        
    elif len(available_models) < 2:
        print("⚠️  LIMITED ACCESS: Few models available")
        print("Consider checking your API key and account status")
        print("For challenge tasks, you should have access to gpt-4.1-mini")
        
    else:
        print("✅ GOOD ACCESS: Multiple models available")
        print(f"Recommended model for Service Analyzer: {available_models[0][0]}")
        print(f"\nTo use this model:")
        print(f"  ./run.sh --service 'Spotify' --model {available_models[0][0]}")
        print(f"\nTo set as default, update .env file:")
        print(f"  OPENAI_MODEL={available_models[0][0]}")

if __name__ == "__main__":
    diagnose_openai_account() 