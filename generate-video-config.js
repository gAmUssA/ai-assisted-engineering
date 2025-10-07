#!/usr/bin/env node

/**
 * YouTube Video Configuration Generator
 * Automatically generates video config from YouTube URLs with metadata fetching
 */

const fs = require('fs');
const https = require('https');

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

// Fetch video description and publish date from YouTube page
async function fetchVideoDescription(videoId) {
    return new Promise((resolve) => {
        const url = `https://www.youtube.com/watch?v=${videoId}`;
        
        https.get(url, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                try {
                    // Extract description from meta tag
                    const descriptionMatch = data.match(/<meta name="description" content="([^"]*)"[^>]*>/);
                    let description = null;
                    if (descriptionMatch && descriptionMatch[1]) {
                        description = descriptionMatch[1];
                        // Decode HTML entities
                        description = description.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
                        // Truncate to reasonable length
                        description = description.length > 150 ? description.substring(0, 150) + '...' : description;
                    }
                    
                    // Extract publish date from uploadDate meta tag
                    const dateMatch = data.match(/"uploadDate":"([^"]*)"/) || data.match(/<meta itemprop="uploadDate" content="([^"]*)"[^>]*>/);
                    let publishDate = null;
                    if (dateMatch && dateMatch[1]) {
                        publishDate = dateMatch[1];
                    }
                    
                    resolve({ description, publishDate });
                } catch (error) {
                    console.warn(`Failed to parse description for ${videoId}:`, error.message);
                    resolve({ description: null, publishDate: null });
                }
            });
        }).on('error', (error) => {
            console.warn(`Failed to fetch description for ${videoId}:`, error.message);
            resolve({ description: null, publishDate: null });
        });
    });
}

// Fetch video metadata from YouTube oEmbed API
async function fetchVideoMetadata(videoId) {
    return new Promise(async (resolve, reject) => {
        try {
            // First try to get description and publish date
            const { description, publishDate } = await fetchVideoDescription(videoId);
            
            // Then get title from oEmbed API
            const oEmbedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
            
            https.get(oEmbedUrl, (res) => {
                let data = '';
                
                res.on('data', (chunk) => {
                    data += chunk;
                });
                
                res.on('end', () => {
                    try {
                        const parsed = JSON.parse(data);
                        resolve({
                            title: parsed.title || 'Untitled Video',
                            description: description || 'No description available',
                            thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
                            publishDate: publishDate
                        });
                    } catch (error) {
                        console.warn(`Failed to parse metadata for ${videoId}:`, error.message);
                        resolve({
                            title: 'Video Title Unavailable',
                            description: description || 'Description unavailable',
                            thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
                            publishDate: publishDate
                        });
                    }
                });
            }).on('error', (error) => {
                console.warn(`Failed to fetch oEmbed for ${videoId}:`, error.message);
                resolve({
                    title: 'Video Title Unavailable',
                    description: description || 'Description unavailable',
                    thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
                    publishDate: publishDate
                });
            });
        } catch (error) {
            console.warn(`Failed to fetch metadata for ${videoId}:`, error.message);
            resolve({
                title: 'Video Title Unavailable',
                description: 'Description unavailable',
                thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
                publishDate: null
            });
        }
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

// Generate video configuration with metadata
async function generateVideoConfig() {
    console.log('🎬 Generating video configuration with YouTube metadata...\n');
    
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
            const metadata = await fetchVideoMetadata(video.id);
            
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
                await new Promise(resolve => setTimeout(resolve, 200));
            }
        } catch (error) {
            console.error(`❌ Error processing ${video.id}:`, error.message);
            
            // Add fallback entry
            videoConfig.push({
                id: video.id,
                title: 'Video Title Unavailable',
                description: 'Description unavailable',
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
    for (let i = 0; i < Math.min(3, videoConfig.length); i++) {
        if (videoConfig[i].publishDate) {
            videoConfig[i].isNew = true;
            console.log(`   ${i + 1}. ${videoConfig[i].title} (${videoConfig[i].publishDate.split('T')[0]})`);
        }
    }
    
    // Remove publishDate from final config (we only needed it for sorting)
    videoConfig.forEach(video => {
        delete video.publishDate;
    });
    
    // Generate JavaScript config file
    const configContent = `// Video Configuration
// Generated automatically from YouTube URLs
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
    generateVideoConfig
};
