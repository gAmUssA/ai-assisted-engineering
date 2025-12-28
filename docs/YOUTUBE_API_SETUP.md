# YouTube Data API v3 Setup Guide

The video configuration generator now uses the official YouTube Data API v3 for reliable metadata extraction. This eliminates the need for web scraping and provides accurate video descriptions, titles, and publish dates.

## Why YouTube Data API v3?

The previous web scraping approach had several issues:
- **Unreliable**: YouTube frequently changes their HTML structure
- **Rate limited**: YouTube blocks excessive scraping requests  
- **Incomplete data**: Many videos had missing or generic descriptions
- **Anti-scraping measures**: YouTube actively prevents automated scraping

The YouTube Data API v3 provides:
- **Reliable access** to video metadata
- **Official support** from Google/YouTube
- **Complete data** including descriptions, publish dates, thumbnails
- **Proper rate limiting** and error handling
- **No fallback logic needed** since data comes directly from the source

## Getting Your API Key

1. **Go to Google Cloud Console**: https://console.developers.google.com/
2. **Create a new project** or select an existing one
3. **Enable the YouTube Data API v3**:
   - Go to "APIs & Services" > "Library"
   - Search for "YouTube Data API v3"
   - Click "Enable"
4. **Create credentials**:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy your API key

## GitHub Actions Setup

For automated deployment with GitHub Actions, you need to add your YouTube API key as a repository secret:

### Setting Up Repository Secrets

1. **Go to your GitHub repository**
2. **Navigate to Settings** → **Secrets and variables** → **Actions**
3. **Click "New repository secret"**
4. **Add the secret**:
   - **Name**: `YOUTUBE_API_KEY`
   - **Value**: Your YouTube Data API v3 key
5. **Click "Add secret"**

### How It Works

The GitHub Actions workflow will:
- ✅ **Check for existing config.js** with video data
- ✅ **Use the API key** from repository secrets to fetch fresh metadata
- ✅ **Generate new config.js** if needed or if videos are outdated
- ✅ **Provide fallback** if API key is missing (with clear error message)
- ✅ **Deploy successfully** even if API calls fail

### Workflow Behavior

**With API Key (Recommended):**
- Fetches real video descriptions, titles, and publish dates
- Sorts videos chronologically (newest first)
- Marks recent videos as "new"
- Updates automatically on each deployment

**Without API Key (Fallback):**
- Creates placeholder config with error message
- Site deploys but videos won't work properly
- Clear instructions shown to add API key

### Security Notes

- ✅ **API keys are encrypted** in GitHub repository secrets
- ✅ **Not visible in logs** or to other users
- ✅ **Only accessible** during workflow execution
- ✅ **Separate from your local .env file**

## Usage

### Method 1: Environment Variable (Recommended)
```bash
export YOUTUBE_API_KEY="your-api-key-here"
node generate-video-config.js
```

### Method 2: Command Line Argument
```bash
node generate-video-config.js --api-key=your-api-key-here
```

### Method 3: Add to your shell profile
Add this line to your `~/.bashrc`, `~/.zshrc`, or equivalent:
```bash
export YOUTUBE_API_KEY="your-api-key-here"
```

## API Quotas and Limits

- **Free tier**: 10,000 units per day
- **Cost per video**: ~1-3 units per video (depending on parts requested)
- **Rate limiting**: Built-in delays between requests
- **Typical usage**: Can process hundreds of videos per day within free limits

## Benefits of the New Approach

1. **Accurate Descriptions**: Gets actual video descriptions, not generic placeholders
2. **Proper Dates**: Reliable publish dates for correct chronological sorting
3. **Better Thumbnails**: Access to multiple thumbnail sizes and qualities
4. **No Fallbacks Needed**: Eliminates complex fallback logic since API is reliable
5. **Future Proof**: Official API won't break when YouTube updates their website

## Troubleshooting

### "YouTube API key is required" Error
- Make sure you've set the API key using one of the methods above
- Verify the API key is correct (no extra spaces or characters)

### "YouTube API Error: The request cannot be completed because you have exceeded your quota"
- You've hit the daily API quota limit
- Wait until the next day or upgrade to a paid plan
- Reduce the number of videos being processed

### "Video not found" Error
- The video ID is invalid or the video has been deleted/made private
- Check that the URL in urls.txt is correct and the video is publicly accessible

### API Key Security
- **Never commit API keys to version control**
- Use environment variables in production
- Consider using Google Cloud IAM for more advanced security
- Rotate API keys periodically

## Migration from Web Scraping

The new implementation:
- ✅ **Removes** all HTML parsing and web scraping code
- ✅ **Eliminates** complex fallback strategies  
- ✅ **Provides** reliable video descriptions and metadata
- ✅ **Improves** sorting by publish date
- ✅ **Reduces** code complexity and maintenance burden

Your existing `urls.txt` file works exactly the same - no changes needed!