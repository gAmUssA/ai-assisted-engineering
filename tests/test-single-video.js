#!/usr/bin/env node

/**
 * Test a single YouTube API call to diagnose quota issues
 */

const fs = require('fs');
const https = require('https');
const path = require('path');

// Load environment variables from .env file
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
                        const value = valueParts.join('=').replace(/^["']|["']$/g, '');
                        process.env[key.trim()] = value.trim();
                    }
                }
            }
        }
    } catch (error) {
        console.error('Error loading .env file:', error.message);
    }
}

loadEnvFile();

async function testSingleVideo() {
    const apiKey = process.env.YOUTUBE_API_KEY;
    
    if (!apiKey) {
        console.error('❌ No YouTube API key found in environment');
        return;
    }
    
    console.log('🔑 API Key found (first 10 chars):', apiKey.substring(0, 10) + '...');
    
    // Test with a well-known public video (Rick Astley - Never Gonna Give You Up)
    const videoId = 'dQw4w9WgXcQ';
    const url = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${apiKey}&part=snippet`;
    
    console.log('🔄 Testing single API call...');
    console.log('📹 Video ID:', videoId);
    console.log('🌐 API URL:', url.replace(apiKey, 'API_KEY_HIDDEN'));
    
    return new Promise((resolve) => {
        https.get(url, (res) => {
            let data = '';
            
            console.log('📊 HTTP Status:', res.statusCode);
            console.log('📋 Response Headers:');
            Object.keys(res.headers).forEach(key => {
                if (key.toLowerCase().includes('quota') || key.toLowerCase().includes('limit')) {
                    console.log(`   ${key}: ${res.headers[key]}`);
                }
            });
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                try {
                    const response = JSON.parse(data);
                    
                    if (response.error) {
                        console.log('\n❌ API Error Response:');
                        console.log('   Code:', response.error.code);
                        console.log('   Message:', response.error.message);
                        
                        if (response.error.errors) {
                            console.log('   Details:');
                            response.error.errors.forEach((err, index) => {
                                console.log(`     ${index + 1}. Domain: ${err.domain}`);
                                console.log(`        Reason: ${err.reason}`);
                                console.log(`        Message: ${err.message}`);
                            });
                        }
                    } else if (response.items && response.items.length > 0) {
                        const video = response.items[0];
                        console.log('\n✅ API Call Successful!');
                        console.log('   Title:', video.snippet.title);
                        console.log('   Channel:', video.snippet.channelTitle);
                        console.log('   Published:', video.snippet.publishedAt);
                        console.log('   Description length:', video.snippet.description.length);
                    } else {
                        console.log('\n⚠️  API call succeeded but no video found');
                        console.log('   Response:', JSON.stringify(response, null, 2));
                    }
                } catch (error) {
                    console.log('\n❌ Failed to parse JSON response:');
                    console.log('   Error:', error.message);
                    console.log('   Raw response:', data);
                }
                
                resolve();
            });
        }).on('error', (error) => {
            console.log('\n❌ Network Error:');
            console.log('   Message:', error.message);
            resolve();
        });
    });
}

testSingleVideo().then(() => {
    console.log('\n🏁 Test completed');
});