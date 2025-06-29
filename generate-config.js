#!/usr/bin/env node
/**
 * 🎥 YouTube Config Generator (Node.js version)
 * 
 * This script takes a text file with YouTube URLs and generates a config.js file
 * with video IDs, titles, descriptions, and direct thumbnail links.
 * 
 * Usage:
 *   node generate-config.js urls.txt
 *   node generate-config.js urls.txt custom-config.js
 */

const fs = require('fs');
const https = require('https');
const path = require('path');

// Extract YouTube video ID from various URL formats
function extractVideoId(url) {
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
        /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
    ];
    
    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) {
            return match[1];
        }
    }
    
    return null;
}

// Get video info using YouTube oEmbed API
function getVideoInfo(videoId) {
    return new Promise((resolve) => {
        const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
        
        const req = https.get(oembedUrl, { timeout: 10000 }, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                try {
                    const videoData = JSON.parse(data);
                    const title = videoData.title || `YouTube Video ${videoId}`;
                    const author = videoData.author_name || 'Unknown';
                    const description = `Learn from ${author}'s tutorial on ${title.toLowerCase()}. Master AI-powered development techniques.`;
                    
                    resolve({ title, description });
                } catch (error) {
                    console.log(`⚠️  Warning: Could not parse info for video ${videoId}`);
                    resolve({
                        title: `AI Development Tutorial ${videoId}`,
                        description: 'Discover AI-powered development techniques and tools.'
                    });
                }
            });
        });
        
        req.on('error', (error) => {
            console.log(`⚠️  Warning: Could not fetch info for video ${videoId}: ${error.message}`);
            resolve({
                title: `AI Development Tutorial ${videoId}`,
                description: 'Discover AI-powered development techniques and tools.'
            });
        });
        
        req.on('timeout', () => {
            req.destroy();
            console.log(`⚠️  Warning: Timeout fetching info for video ${videoId}`);
            resolve({
                title: `AI Development Tutorial ${videoId}`,
                description: 'Discover AI-powered development techniques and tools.'
            });
        });
    });
}

// Generate direct YouTube thumbnail URL
function getThumbnailUrl(videoId, quality = 'maxresdefault') {
    const thumbnailUrls = {
        'maxresdefault': `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
        'hqdefault': `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
        'mqdefault': `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
        'sddefault': `https://img.youtube.com/vi/${videoId}/sddefault.jpg`
    };
    
    return thumbnailUrls[quality] || thumbnailUrls['maxresdefault'];
}

// Process URLs file
async function processUrlsFile(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const urls = content
            .split('\n')
            .map(line => line.trim())
            .filter(line => line && !line.startsWith('#'));
        
        console.log(`🔍 Processing ${urls.length} URLs...`);
        
        const videos = [];
        
        for (let i = 0; i < urls.length; i++) {
            const url = urls[i];
            console.log(`📹 Processing video ${i + 1}/${urls.length}: ${url.substring(0, 50)}...`);
            
            const videoId = extractVideoId(url);
            if (!videoId) {
                console.log(`⚠️  Warning: Could not extract video ID from: ${url}`);
                continue;
            }
            
            const { title, description } = await getVideoInfo(videoId);
            const thumbnail = getThumbnailUrl(videoId);
            
            const videoConfig = {
                id: videoId,
                title: title.replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>'),
                description,
                thumbnail
            };
            
            videos.push(videoConfig);
            console.log(`✅ Added: ${title.substring(0, 50)}...`);
        }
        
        return videos;
        
    } catch (error) {
        if (error.code === 'ENOENT') {
            console.log(`❌ Error: File '${filePath}' not found`);
        } else {
            console.log(`❌ Error reading file: ${error.message}`);
        }
        return [];
    }
}

// Generate config.js file
function generateConfigJs(videos, outputFile = 'config.js') {
    const jsContent = `// Video Configuration
// Generated automatically from YouTube URLs
// Add your YouTube video IDs and details here
const videoConfig = ${JSON.stringify(videos, null, 4)};

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = videoConfig;
}`;
    
    try {
        fs.writeFileSync(outputFile, jsContent, 'utf8');
        console.log(`✅ Generated ${outputFile} with ${videos.length} videos`);
        return true;
    } catch (error) {
        console.log(`❌ Error writing config file: ${error.message}`);
        return false;
    }
}

// Create sample URLs file
function createSampleUrlsFile() {
    const sampleContent = `# YouTube URLs for AI-Assisted Engineering
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
`;
    
    fs.writeFileSync('sample-urls.txt', sampleContent);
    console.log('📝 Created sample-urls.txt with example format');
}

// Main function
async function main() {
    const args = process.argv.slice(2);
    
    console.log('🎥 YouTube Config Generator for AI-Assisted Engineering');
    console.log('='.repeat(55));
    
    if (args.includes('--sample')) {
        createSampleUrlsFile();
        return;
    }
    
    if (args.length === 0) {
        console.log('❌ Error: Please provide an input file with YouTube URLs');
        console.log('Usage: node generate-config.js urls.txt [output-file.js]');
        console.log('Use --sample to create a sample URLs file');
        process.exit(1);
    }
    
    const inputFile = args[0];
    const outputFile = args[1] || 'config.js';
    
    // Process the URLs
    const videos = await processUrlsFile(inputFile);
    
    if (videos.length === 0) {
        console.log('❌ No valid videos found');
        process.exit(1);
    }
    
    // Generate config.js
    if (generateConfigJs(videos, outputFile)) {
        console.log(`\n🎉 Success! Generated ${outputFile}`);
        console.log(`📊 Total videos: ${videos.length}`);
        console.log('\n💡 Next steps:');
        console.log('1. Review the generated config.js file');
        console.log('2. Update video descriptions if needed');
        console.log('3. Refresh your landing page to see the new videos');
    } else {
        process.exit(1);
    }
}

// Run the script
if (require.main === module) {
    main().catch(console.error);
}
