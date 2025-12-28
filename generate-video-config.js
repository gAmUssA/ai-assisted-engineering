#!/usr/bin/env node

/**
 * YouTube Video Configuration Generator
 * Automatically generates video config from YouTube URLs using YouTube Data API v3
 */

const fs = require('fs');
const https = require('https');
const path = require('path');

// Load environment variables from .env file if it exists
function loadEnvFile() {
    try {
        const envPath = path.join(process.cwd(), '.env');
        if (fs.existsSync(envPath)) {
            const envContent = fs.readFileSync(envPath, 'utf8');
            const lines = envContent.split('\n');
            
            for (const line of lines) {
                const trimmed = line.trim();
                if (trimmed && !trimmed.startsWith('#')) {
                    const [key, ...valueParts] = trimmed.split('=');
                    if (key && valueParts.length > 0) {
                        const value = valueParts.join('=').replace(/^["']|["']$/g, ''); // Remove quotes
                        process.env[key.trim()] = value.trim();
                    }
                }
            }
        }
    } catch (error) {
        // Silently ignore .env loading errors
    }
}

// Load .env file at startup
loadEnvFile();

// YouTube Data API v3 configuration
const YOUTUBE_API_BASE_URL = 'https://www.googleapis.com/youtube/v3/videos';

// Get YouTube API key from environment variable or command line argument
function getYouTubeApiKey() {
    // Check environment variable first
    if (process.env.YOUTUBE_API_KEY) {
        return process.env.YOUTUBE_API_KEY;
    }
    
    // Check command line arguments
    const apiKeyArg = process.argv.find(arg => arg.startsWith('--api-key='));
    if (apiKeyArg) {
        return apiKeyArg.split('=')[1];
    }
    
    return null;
}

// Extract YouTube video ID from various URL formats
function extractVideoId(url) {
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
        /youtube\.com\/watch\?.*v=([^&\n?#]+)/
    ];
    
    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) {
            return match[1];
        }
    }
    return null;
}

// Fetch video metadata from YouTube Data API v3
async function fetchVideoMetadata(videoId, apiKey) {
    return new Promise((resolve, reject) => {
        if (!apiKey) {
            reject(new Error('YouTube API key is required. Set YOUTUBE_API_KEY environment variable or use --api-key=YOUR_KEY'));
            return;
        }

        const url = `${YOUTUBE_API_BASE_URL}?id=${videoId}&key=${apiKey}&part=snippet,contentDetails`;
        
        https.get(url, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                try {
                    const response = JSON.parse(data);
                    
                    if (response.error) {
                        reject(new Error(`YouTube API Error: ${response.error.message}`));
                        return;
                    }
                    
                    if (!response.items || response.items.length === 0) {
                        reject(new Error(`Video not found: ${videoId}`));
                        return;
                    }
                    
                    const video = response.items[0];
                    const snippet = video.snippet;
                    
                    // Process description with proper truncation
                    let description = snippet.description || '';
                    if (description.length > 150) {
                        // Find the last space before or at position 150 to avoid cutting words
                        const lastSpace = description.lastIndexOf(' ', 150);
                        const truncateAt = lastSpace > 130 ? lastSpace : 150;
                        description = description.substring(0, truncateAt) + '...';
                    }
                    
                    // If description is empty or too short, create a meaningful fallback
                    if (!description || description.trim().length < 10) {
                        description = `Watch "${snippet.title}" for detailed insights and information. Click to view the full video content.`;
                    }
                    
                    resolve({
                        title: snippet.title,
                        description: description,
                        thumbnail: snippet.thumbnails.maxres?.url || 
                                 snippet.thumbnails.high?.url || 
                                 snippet.thumbnails.medium?.url ||
                                 `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
                        publishDate: snippet.publishedAt,
                        channelTitle: snippet.channelTitle
                    });
                } catch (error) {
                    reject(new Error(`Failed to parse YouTube API response: ${error.message}`));
                }
            });
        }).on('error', (error) => {
            reject(new Error(`Failed to fetch from YouTube API: ${error.message}`));
        });
    });
}

// Parse URLs file and extract video information
function parseUrlsFile(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const lines = content.split('\n');
        const videos = [];
        
        for (const line of lines) {
            const trimmed = line.trim();
            
            // Skip comments and empty lines
            if (trimmed.startsWith('#') || !trimmed) {
                continue;
            }
            
            const videoId = extractVideoId(trimmed);
            if (videoId) {
                videos.push({
                    id: videoId,
                    url: trimmed
                });
            }
        }
        
        return videos;
    } catch (error) {
        console.error('Error reading URLs file:', error.message);
        return [];
    }
}

// Generate video configuration with metadata from YouTube Data API v3
async function generateVideoConfig() {
    console.log('🎬 Generating video configuration with YouTube Data API v3...\n');
    
    const apiKey = getYouTubeApiKey();
    if (!apiKey) {
        console.error('❌ YouTube API key is required!');
        console.log('💡 Set your API key using one of these methods:');
        console.log('   • Environment variable: export YOUTUBE_API_KEY="your-api-key"');
        console.log('   • Command line argument: node generate-video-config.js --api-key=your-api-key');
        console.log('   • Get your API key at: https://console.developers.google.com/');
        process.exit(1);
    }
    
    const videos = parseUrlsFile('./urls.txt');
    
    if (videos.length === 0) {
        console.log('❌ No valid YouTube URLs found in urls.txt');
        return;
    }
    
    console.log(`📹 Found ${videos.length} videos to process:`);
    videos.forEach((video, index) => {
        console.log(`   ${index + 1}. ${video.id}`);
    });
    console.log();
    
    const videoConfig = [];
    
    for (let i = 0; i < videos.length; i++) {
        const video = videos[i];
        console.log(`🔄 Fetching metadata for video ${i + 1}/${videos.length}: ${video.id}`);
        
        try {
            const metadata = await fetchVideoMetadata(video.id, apiKey);
            
            videoConfig.push({
                id: video.id,
                title: metadata.title,
                description: metadata.description,
                thumbnail: metadata.thumbnail,
                publishDate: metadata.publishDate
            });
            
            console.log(`✅ ${metadata.title}${metadata.publishDate ? ' (' + metadata.publishDate.split('T')[0] + ')' : ''}`);
            
            // Add delay to avoid rate limiting
            if (i < videos.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
        } catch (error) {
            console.error(`❌ Error processing ${video.id}:`, error.message);
            
            // Add fallback entry for failed videos
            videoConfig.push({
                id: video.id,
                title: 'Video Title Unavailable',
                description: 'Video content available on YouTube. Click to watch.',
                thumbnail: `https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`,
                publishDate: null
            });
        }
    }
    
    // Sort videos by publish date (most recent first)
    videoConfig.sort((a, b) => {
        if (!a.publishDate) return 1;
        if (!b.publishDate) return -1;
        return new Date(b.publishDate) - new Date(a.publishDate);
    });
    
    // Mark the 3 most recent videos as new
    console.log('\n🆕 Marking the 3 most recent videos as new:');
    let newCount = 0;
    for (let i = 0; i < videoConfig.length && newCount < 3; i++) {
        if (videoConfig[i].publishDate) {
            videoConfig[i].isNew = true;
            newCount++;
            console.log(`   ${newCount}. ${videoConfig[i].title} (${videoConfig[i].publishDate.split('T')[0]})`);
        }
    }
    
    // Remove publishDate from final config (we only needed it for sorting)
    videoConfig.forEach(video => {
        delete video.publishDate;
    });
    
    // Generate JavaScript config file
    const configContent = `// Video Configuration
// Generated automatically from YouTube URLs using YouTube Data API v3
// Add your YouTube video IDs and details here
const videoConfig = ${JSON.stringify(videoConfig, null, 4)};

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = videoConfig;
}`;
    
    // Write to config.js
    fs.writeFileSync('./config.js', configContent);
    
    console.log(`\n🎉 Successfully generated config.js with ${videoConfig.length} videos!`);
    console.log('📄 Configuration saved to: ./config.js');
    
    // Display summary
    console.log('\n📋 Video Summary:');
    videoConfig.forEach((video, index) => {
        console.log(`   ${index + 1}. ${video.title}`);
    });
}

// Run the generator
if (require.main === module) {
    generateVideoConfig().catch(error => {
        console.error('❌ Error generating video config:', error.message);
        process.exit(1);
    });
}

module.exports = {
    extractVideoId,
    fetchVideoMetadata,
    parseUrlsFile,
    generateVideoConfig,
    getYouTubeApiKey
};