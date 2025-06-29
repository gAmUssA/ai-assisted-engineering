#!/usr/bin/env python3
"""
🎥 YouTube Config Generator for AI-Assisted Engineering Landing Page

This script takes a text file with YouTube URLs and generates a config.js file
with video IDs, titles, descriptions, and direct thumbnail links.

Usage:
    python generate-config.py urls.txt
    python generate-config.py urls.txt --output custom-config.js
"""

import re
import sys
import json
import argparse
from urllib.parse import urlparse, parse_qs
from urllib.request import urlopen, Request
from urllib.error import URLError, HTTPError
import html

def extract_video_id(url):
    """Extract YouTube video ID from various URL formats"""
    patterns = [
        r'(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)',
        r'youtube\.com\/watch\?.*v=([^&\n?#]+)',
    ]
    
    for pattern in patterns:
        match = re.search(pattern, url)
        if match:
            return match.group(1)
    
    return None

def get_video_info(video_id):
    """Get video title and description from YouTube (using oEmbed API)"""
    try:
        # Use YouTube oEmbed API to get video info
        oembed_url = f"https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v={video_id}&format=json"
        
        req = Request(oembed_url)
        req.add_header('User-Agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36')
        
        with urlopen(req, timeout=10) as response:
            data = json.loads(response.read().decode())
            
        title = data.get('title', f'YouTube Video {video_id}')
        author = data.get('author_name', 'Unknown')
        
        # Generate a description based on the title and author
        description = f"Learn from {author}'s tutorial on {title.lower()}. Master AI-powered development techniques."
        
        return title, description
        
    except (URLError, HTTPError, json.JSONDecodeError, KeyError) as e:
        print(f"⚠️  Warning: Could not fetch info for video {video_id}: {e}")
        return f"AI Development Tutorial {video_id}", "Discover AI-powered development techniques and tools."

def get_thumbnail_url(video_id, quality='maxresdefault'):
    """Generate direct YouTube thumbnail URL"""
    # YouTube thumbnail URL patterns
    thumbnail_urls = {
        'maxresdefault': f'https://img.youtube.com/vi/{video_id}/maxresdefault.jpg',
        'hqdefault': f'https://img.youtube.com/vi/{video_id}/hqdefault.jpg',
        'mqdefault': f'https://img.youtube.com/vi/{video_id}/mqdefault.jpg',
        'sddefault': f'https://img.youtube.com/vi/{video_id}/sddefault.jpg'
    }
    
    return thumbnail_urls.get(quality, thumbnail_urls['maxresdefault'])

def process_urls_file(file_path):
    """Process a text file containing YouTube URLs"""
    videos = []
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            urls = [line.strip() for line in f if line.strip() and not line.startswith('#')]
    except FileNotFoundError:
        print(f"❌ Error: File '{file_path}' not found")
        return []
    except Exception as e:
        print(f"❌ Error reading file: {e}")
        return []
    
    print(f"🔍 Processing {len(urls)} URLs...")
    
    for i, url in enumerate(urls, 1):
        print(f"📹 Processing video {i}/{len(urls)}: {url[:50]}...")
        
        video_id = extract_video_id(url)
        if not video_id:
            print(f"⚠️  Warning: Could not extract video ID from: {url}")
            continue
        
        title, description = get_video_info(video_id)
        thumbnail = get_thumbnail_url(video_id)
        
        video_config = {
            'id': video_id,
            'title': html.unescape(title),
            'description': description,
            'thumbnail': thumbnail
        }
        
        videos.append(video_config)
        print(f"✅ Added: {title[:50]}...")
    
    return videos

def generate_config_js(videos, output_file='config.js'):
    """Generate the config.js file"""
    
    js_content = '''// Video Configuration
// Generated automatically from YouTube URLs
// Add your YouTube video IDs and details here
const videoConfig = '''
    
    # Convert to JSON with proper formatting
    json_content = json.dumps(videos, indent=4, ensure_ascii=False)
    
    js_content += json_content + ''';

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = videoConfig;
}'''
    
    try:
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(js_content)
        print(f"✅ Generated {output_file} with {len(videos)} videos")
        return True
    except Exception as e:
        print(f"❌ Error writing config file: {e}")
        return False

def create_sample_urls_file():
    """Create a sample URLs file for demonstration"""
    sample_content = """# YouTube URLs for AI-Assisted Engineering
# Add one URL per line, comments start with #

# Example URLs (replace with your actual videos):
https://www.youtube.com/watch?v=dQw4w9WgXcQ
https://youtu.be/dQw4w9WgXcQ
https://www.youtube.com/watch?v=dQw4w9WgXcQ

# You can also add comments to organize your videos:
# GitHub Copilot tutorials:
https://www.youtube.com/watch?v=dQw4w9WgXcQ

# Windsurf IDE tutorials:
https://www.youtube.com/watch?v=dQw4w9WgXcQ
"""
    
    with open('sample-urls.txt', 'w') as f:
        f.write(sample_content)
    print("📝 Created sample-urls.txt with example format")

def main():
    parser = argparse.ArgumentParser(
        description='Generate config.js from YouTube URLs',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog='''
Examples:
  python generate-config.py urls.txt
  python generate-config.py my-videos.txt --output custom-config.js
  python generate-config.py --sample  # Create sample URLs file
        '''
    )
    
    parser.add_argument('input_file', nargs='?', help='Text file containing YouTube URLs')
    parser.add_argument('-o', '--output', default='config.js', help='Output config file (default: config.js)')
    parser.add_argument('--sample', action='store_true', help='Create a sample URLs file')
    
    args = parser.parse_args()
    
    print("🎥 YouTube Config Generator for AI-Assisted Engineering")
    print("=" * 55)
    
    if args.sample:
        create_sample_urls_file()
        return
    
    if not args.input_file:
        print("❌ Error: Please provide an input file with YouTube URLs")
        print("Use --help for usage information")
        print("Use --sample to create a sample URLs file")
        sys.exit(1)
    
    # Process the URLs
    videos = process_urls_file(args.input_file)
    
    if not videos:
        print("❌ No valid videos found")
        sys.exit(1)
    
    # Generate config.js
    if generate_config_js(videos, args.output):
        print(f"\n🎉 Success! Generated {args.output}")
        print(f"📊 Total videos: {len(videos)}")
        print("\n💡 Next steps:")
        print("1. Review the generated config.js file")
        print("2. Update video descriptions if needed")
        print("3. Refresh your landing page to see the new videos")
    else:
        sys.exit(1)

if __name__ == '__main__':
    main()
