#!/usr/bin/env python3
"""
Service Analyzer - A console application that generates comprehensive reports
about digital services and products using AI analysis.
"""

import os
import sys
import argparse
import json
from typing import Optional, Dict, Any
from pathlib import Path

try:
    from openai import OpenAI
except ImportError:
    print("OpenAI package not found. Please install it using: pip install openai")
    sys.exit(1)

try:
    from dotenv import load_dotenv
    load_dotenv()  # Load environment variables from .env file
except ImportError:
    # python-dotenv is optional, continue without it
    pass


class ServiceAnalyzer:
    """Main class for analyzing services and generating reports."""
    
    def __init__(self, api_key: Optional[str] = None, model: Optional[str] = None):
        """Initialize the service analyzer with OpenAI API key."""
        self.api_key = api_key or os.getenv('OPENAI_API_KEY')
        if not self.api_key:
            raise ValueError(
                "OpenAI API key not found. Please set the OPENAI_API_KEY environment variable "
                "or provide it as an argument."
            )
        
        # Model priority: use challenge-available models first
        self.model = model or os.getenv('OPENAI_MODEL', 'gpt-4.1-mini')
        self.client = OpenAI(api_key=self.api_key)
        
        # Known services database for enhanced analysis
        self.known_services = {
            'spotify': 'Spotify is a Swedish audio streaming and media service provider founded in 2006 by Daniel Ek and Martin Lorentzon.',
            'notion': 'Notion is an all-in-one workspace that combines note-taking, document storage, task management, and database functionality.',
            'netflix': 'Netflix is an American subscription-based streaming service and production company founded in 1997 by Reed Hastings and Marc Randolph.',
            'zoom': 'Zoom is a video communications platform that provides video conferencing, online meetings, chat, and mobile collaboration.',
            'slack': 'Slack is a cloud-based set of proprietary team collaboration tools and services founded in 2009 by Stewart Butterfield.',
            'airbnb': 'Airbnb is an online marketplace for arranging or offering lodging, primarily homestays, or tourism experiences.',
            'uber': 'Uber is a ride-hailing service that connects passengers with drivers through a mobile app, founded in 2009.',
            'discord': 'Discord is a voice, video, and text communication service designed for gaming communities and general use.',
            'figma': 'Figma is a collaborative web-based design tool for interface design, prototyping, and collaboration.',
            'github': 'GitHub is a code hosting platform for version control and collaboration using Git.',
        }
    
    def get_analysis_prompt(self, service_info: str, is_known_service: bool = False) -> str:
        """Generate the analysis prompt for OpenAI."""
        
        base_prompt = f"""
Please analyze the following service/product information and generate a comprehensive report in markdown format. 

Service Information:
{service_info}

Generate a detailed analysis report with the following sections in markdown format:

# Service Analysis Report

## Brief History
- Founding year and founders (if available)
- Key milestones in the company's development
- Major pivots or strategic changes

## Target Audience
- Primary user segments and demographics
- User personas and use cases
- Market positioning

## Core Features
- Top 2-4 key functionalities that define the service
- Main value propositions for users
- Primary user workflows

## Unique Selling Points
- Key differentiators from competitors
- Innovative aspects or unique approaches
- Competitive advantages

## Business Model
- Revenue streams (subscription, advertising, marketplace, etc.)
- Pricing strategy
- Monetization methods

## Tech Stack Insights
- Technologies likely used (based on service type and scale)
- Platform architecture insights
- Technical innovations or approaches

## Perceived Strengths
- Standout features mentioned by users
- Market advantages
- Positive aspects frequently cited

## Perceived Weaknesses
- Common user complaints or limitations
- Areas for improvement
- Competitive disadvantages

Instructions:
- Use proper markdown formatting with headers, bullet points, and emphasis
- Be specific and detailed while keeping each section concise
- If certain information is not available, make educated inferences based on industry standards
- Focus on actionable insights that would be valuable for product managers, investors, or users
- Maintain a professional, analytical tone throughout
"""
        
        if is_known_service:
            base_prompt += "\n- Since this is a well-known service, provide comprehensive details based on public knowledge"
        else:
            base_prompt += "\n- Analyze the provided text and extract relevant insights, making reasonable inferences where needed"
            
        return base_prompt
    
    def analyze_service(self, input_text: str, is_known_service: bool = False) -> str:
        """Analyze a service and generate a comprehensive report."""
        
        # List of models to try in order of compatibility (prioritizing challenge models)
        fallback_models = [self.model, 'gpt-4.1-mini', 'gpt-3.5-turbo', 'text-davinci-003', 'text-davinci-002']
        # Remove duplicates while preserving order
        models_to_try = []
        for model in fallback_models:
            if model not in models_to_try:
                models_to_try.append(model)
        
        last_error = None
        
        for model_to_try in models_to_try:
            try:
                prompt = self.get_analysis_prompt(input_text, is_known_service)
                
                # Use completions API for instruct models, chat API for chat models
                if 'instruct' in model_to_try or 'davinci' in model_to_try:
                    # Legacy completion API
                    response = self.client.completions.create(
                        model=model_to_try,
                        prompt=prompt,
                        max_tokens=2000,
                        temperature=0.7
                    )
                    return response.choices[0].text.strip()
                else:
                    # Chat completion API (default for gpt-4.1-mini and modern models)
                    response = self.client.chat.completions.create(
                        model=model_to_try,
                        messages=[
                            {
                                "role": "system", 
                                "content": "You are an expert business analyst and product strategist. Provide detailed, accurate, and insightful analysis of digital services and products."
                            },
                            {"role": "user", "content": prompt}
                        ],
                        max_tokens=2000,
                        temperature=0.7
                    )
                    return response.choices[0].message.content.strip()
                
            except Exception as e:
                last_error = str(e)
                if "403" in last_error or "model_not_found" in last_error:
                    print(f"⚠️  Model '{model_to_try}' not available, trying next...")
                    continue
                else:
                    # For non-403 errors, break and report
                    break
        
        # If all models failed
        return f"""Error generating analysis: {last_error}

🔧 SOLUTION: Model access issues detected.

Possible solutions:
1. Check your OpenAI account status: https://platform.openai.com/usage
2. Verify your API key is correct and active
3. For challenge tasks, ensure you're using the provided API key
4. Try updating your model selection

Models attempted: {', '.join(models_to_try)}

💡 TIP: Run the diagnostic tool to check model access:
   source service_analyzer_env/bin/activate
   python3 diagnose_openai.py"""
    
    def process_input(self, user_input: str) -> tuple[str, bool]:
        """Process user input to determine if it's a known service or raw text."""
        
        # Check if it's a known service (case-insensitive)
        service_key = user_input.lower().strip()
        
        if service_key in self.known_services:
            print(f"✓ Recognized service: {user_input.title()}")
            # For known services, provide both the basic info and let AI expand
            enhanced_info = f"{self.known_services[service_key]}\n\nService Name: {user_input.title()}"
            return enhanced_info, True
        else:
            print("→ Analyzing provided text/description")
            return user_input, False
    
    def save_report(self, report: str, filename: str) -> None:
        """Save the generated report to a file."""
        try:
            with open(filename, 'w', encoding='utf-8') as f:
                f.write(report)
            print(f"✓ Report saved to: {filename}")
        except Exception as e:
            print(f"✗ Error saving report: {str(e)}")
    
    def run_interactive(self) -> None:
        """Run the analyzer in interactive mode."""
        print("🔍 Service Analyzer - Interactive Mode")
        print("=" * 50)
        print(f"Using AI Model: {self.model}")
        if self.model == 'gpt-4.1-mini':
            print("✨ Using GPT-4.1-mini - High quality analysis available!")
        elif self.model in ['gpt-3.5-turbo', 'gpt-3.5-turbo-instruct']:
            print("💡 For higher quality analysis, consider using --model gpt-4.1-mini")
        print("\nEnter a service name (e.g., 'Spotify', 'Notion') or paste service description text.")
        print("Type 'quit' or 'exit' to stop.\n")
        
        while True:
            try:
                user_input = input("📝 Enter service name or description: ").strip()
                
                if user_input.lower() in ['quit', 'exit', 'q']:
                    print("👋 Goodbye!")
                    break
                
                if not user_input:
                    print("⚠️  Please enter some text.")
                    continue
                
                print("\n🔄 Analyzing... (this may take a moment)")
                
                service_info, is_known = self.process_input(user_input)
                report = self.analyze_service(service_info, is_known)
                
                print("\n" + "=" * 60)
                print(report)
                print("=" * 60)
                
                # Ask if user wants to save the report
                save_choice = input("\n💾 Save report to file? (y/n): ").strip().lower()
                if save_choice in ['y', 'yes']:
                    service_name = user_input.replace(' ', '_').lower()
                    filename = f"{service_name}_analysis_report.md"
                    self.save_report(report, filename)
                
                print("\n" + "-" * 50 + "\n")
                
            except KeyboardInterrupt:
                print("\n\n👋 Goodbye!")
                break
            except Exception as e:
                print(f"\n✗ Error: {str(e)}")


def main():
    """Main function to run the service analyzer."""
    
    parser = argparse.ArgumentParser(
        description="Service Analyzer - Generate comprehensive reports about digital services",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python service_analyzer.py --interactive
  python service_analyzer.py --service "Spotify"
  python service_analyzer.py --service "Notion" --model gpt-4.1-mini
  python service_analyzer.py --text "Our platform connects freelancers with clients..."
  python service_analyzer.py --service "Notion" --output notion_report.md
  python service_analyzer.py --list-models
        """
    )
    
    parser.add_argument('--interactive', '-i', action='store_true',
                       help='Run in interactive mode')
    parser.add_argument('--service', '-s', type=str,
                       help='Analyze a known service by name (e.g., "Spotify")')
    parser.add_argument('--text', '-t', type=str,
                       help='Analyze raw service description text')
    parser.add_argument('--output', '-o', type=str,
                       help='Save report to specified file')
    parser.add_argument('--api-key', type=str,
                       help='OpenAI API key (alternatively set OPENAI_API_KEY env var)')
    parser.add_argument('--model', type=str,
                       help='OpenAI model to use (default: gpt-4.1-mini, premium: gpt-4)')
    parser.add_argument('--list-models', action='store_true',
                       help='List available models and exit')
    
    args = parser.parse_args()
    
    # Handle list-models option
    if args.list_models:
        print("Available OpenAI models for challenge tasks:")
        print("  • gpt-4.1-mini (default) - High-quality, efficient analysis")
        print("  • whisper-1 - Audio transcription (not used by Service Analyzer)")
        print("\nFallback models (may not be available with challenge key):")
        print("  • gpt-3.5-turbo - Standard chat model")
        print("  • text-davinci-003 - Legacy completion model")
        print("\n💡 The challenge key provides access to gpt-4.1-mini for excellent results!")
        return
    
    # Check if no arguments provided, default to interactive
    if len(sys.argv) == 1:
        args.interactive = True
    
    try:
        analyzer = ServiceAnalyzer(api_key=args.api_key, model=args.model)
        
        if args.interactive:
            analyzer.run_interactive()
        elif args.service:
            print(f"🔍 Analyzing service: {args.service}")
            service_info, is_known = analyzer.process_input(args.service)
            report = analyzer.analyze_service(service_info, is_known)
            
            print("\n" + "=" * 60)
            print(report)
            print("=" * 60)
            
            if args.output:
                analyzer.save_report(report, args.output)
                
        elif args.text:
            print("🔍 Analyzing provided text...")
            report = analyzer.analyze_service(args.text, False)
            
            print("\n" + "=" * 60)
            print(report)
            print("=" * 60)
            
            if args.output:
                analyzer.save_report(report, args.output)
        else:
            print("⚠️  Please specify --interactive, --service, or --text option.")
            parser.print_help()
            
    except ValueError as e:
        print(f"✗ Configuration Error: {str(e)}")
        print("\n💡 Tip: Set your OpenAI API key as an environment variable:")
        print("   export OPENAI_API_KEY='your-api-key-here'")
        sys.exit(1)
    except Exception as e:
        print(f"✗ Unexpected Error: {str(e)}")
        sys.exit(1)


if __name__ == "__main__":
    main() 