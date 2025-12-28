# GitHub Actions Setup for YouTube Data API v3

This guide explains how to configure GitHub Actions to automatically generate video configurations using the YouTube Data API v3 during deployment.

## Overview

The GitHub Actions workflow automatically:
- ✅ **Checks for existing video configuration**
- ✅ **Generates fresh metadata** from YouTube Data API v3 if needed
- ✅ **Handles API key securely** through repository secrets
- ✅ **Provides graceful fallbacks** if API is unavailable
- ✅ **Deploys successfully** regardless of API status

## Required Setup

### 1. Add YouTube API Key to Repository Secrets

1. **Navigate to your GitHub repository**
2. **Go to Settings** → **Secrets and variables** → **Actions**
3. **Click "New repository secret"**
4. **Create the secret**:
   - **Name**: `YOUTUBE_API_KEY`
   - **Value**: Your YouTube Data API v3 key (from Google Cloud Console)
5. **Click "Add secret"**

### 2. Verify Workflow File

Ensure `.github/workflows/deploy.yml` exists and contains the updated workflow that:
- Uses `YOUTUBE_API_KEY` from secrets
- Calls `node generate-video-config.js` with the API key
- Provides fallback behavior if API key is missing

## Workflow Behavior

### With API Key (Recommended) ✅

```bash
🔑 YouTube API key found, using YouTube Data API v3...
🔄 Generating video configuration from urls.txt...
✅ Successfully generated config.js with 12 videos
```

**Results:**
- Real video descriptions from YouTube
- Proper chronological sorting (newest first)
- Automatic "new" video marking
- High-quality thumbnails
- Reliable metadata

### Without API Key (Fallback) ⚠️

```bash
⚠️ No YouTube API key found in secrets
💡 Please add YOUTUBE_API_KEY to repository secrets
🔄 Creating fallback config with placeholder data...
```

**Results:**
- Placeholder video configuration
- Site deploys successfully
- Clear error message for users
- Instructions to add API key

## Security Features

- 🔒 **API keys are encrypted** in GitHub repository secrets
- 🔒 **Not visible in workflow logs** or to repository viewers
- 🔒 **Only accessible during workflow execution**
- 🔒 **Separate from local development** (.env file)

## Troubleshooting

### "No YouTube API key found in secrets"

**Problem:** The workflow can't find the API key in repository secrets.

**Solution:**
1. Verify the secret name is exactly `YOUTUBE_API_KEY`
2. Check that you added it to the correct repository
3. Ensure you have admin access to the repository

### "YouTube API Error: quota exceeded"

**Problem:** The API key has exceeded its daily quota.

**Solutions:**
1. **Wait for quota reset** (daily at midnight Pacific Time)
2. **Request quota increase** in Google Cloud Console
3. **Use a different API key** if available
4. **Workflow will use fallback** and deploy successfully

### "Failed to generate config.js with API"

**Problem:** API call failed for other reasons.

**Check:**
1. API key is valid and not expired
2. YouTube Data API v3 is enabled in Google Cloud Console
3. No billing issues with Google Cloud account
4. Network connectivity (rare in GitHub Actions)

### Workflow Still Uses Old Approach

**Problem:** Deployment doesn't use the new YouTube Data API v3.

**Solution:**
1. Ensure `.github/workflows/deploy.yml` is updated
2. Check that `generate-video-config.js` is the new version
3. Verify the workflow file is in the main branch

## Manual Testing

You can test the API integration locally:

```bash
# Set your API key
export YOUTUBE_API_KEY="your-api-key-here"

# Test single video
node test-single-video.js

# Generate full config
node generate-video-config.js
```

## Monitoring

### Successful Deployment

Look for these indicators in GitHub Actions logs:
- ✅ "Successfully generated config.js with X videos"
- ✅ Video titles and dates shown in logs
- ✅ "Deploy to GitHub Pages" completes successfully

### API Issues

Watch for these warnings:
- ⚠️ "No YouTube API key found in secrets"
- ❌ "YouTube API Error: quota exceeded"
- ⚠️ "Created fallback config - site will deploy but videos won't work properly"

## Best Practices

1. **Monitor API Usage**: Check Google Cloud Console for quota usage
2. **Keep API Key Secure**: Never commit API keys to code
3. **Test Locally First**: Verify API key works before adding to secrets
4. **Regular Updates**: Regenerate config periodically for fresh metadata
5. **Backup Strategy**: Keep a working config.js in the repository as fallback

## Migration from Old Approach

If you're migrating from the web scraping approach:

1. ✅ **Update workflow file** (already done)
2. ✅ **Add API key to secrets** (follow steps above)
3. ✅ **Test deployment** (push to main branch)
4. ✅ **Verify video metadata** (check deployed site)

The new approach is much more reliable and provides better video metadata than the previous web scraping method.