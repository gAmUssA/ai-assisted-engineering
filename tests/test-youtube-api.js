#!/usr/bin/env node

/**
 * Test for YouTube Data API v3 Integration
 * Tests the new API-based approach for fetching video metadata
 */

const { 
    extractVideoId, 
    getYouTubeApiKey,
    fetchVideoMetadata 
} = require('../generate-video-config.js');

function testVideoIdExtraction() {
    console.log('🧪 Testing Video ID Extraction\n');
    
    const testCases = [
        { url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', expected: 'dQw4w9WgXcQ' },
        { url: 'https://youtu.be/dQw4w9WgXcQ', expected: 'dQw4w9WgXcQ' },
        { url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', expected: 'dQw4w9WgXcQ' },
        { url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=30s', expected: 'dQw4w9WgXcQ' },
        { url: 'invalid-url', expected: null }
    ];
    
    let passed = 0;
    let total = testCases.length;
    
    testCases.forEach((testCase, index) => {
        const result = extractVideoId(testCase.url);
        if (result === testCase.expected) {
            console.log(`✅ Test ${index + 1}: ${testCase.url} -> ${result}`);
            passed++;
        } else {
            console.log(`❌ Test ${index + 1}: ${testCase.url} -> Expected: ${testCase.expected}, Got: ${result}`);
        }
    });
    
    console.log(`\n📊 Video ID Extraction: ${passed}/${total} tests passed\n`);
    return passed === total;
}

function testApiKeyDetection() {
    console.log('🧪 Testing API Key Detection\n');
    
    // Save original environment
    const originalApiKey = process.env.YOUTUBE_API_KEY;
    const originalArgv = process.argv;
    
    let passed = 0;
    let total = 0;
    
    // Test 1: Environment variable
    total++;
    process.env.YOUTUBE_API_KEY = 'test-env-key';
    const envResult = getYouTubeApiKey();
    if (envResult === 'test-env-key') {
        console.log('✅ Test 1: Environment variable detection - PASSED');
        passed++;
    } else {
        console.log('❌ Test 1: Environment variable detection - FAILED');
    }
    
    // Test 2: Command line argument
    total++;
    delete process.env.YOUTUBE_API_KEY;
    process.argv = ['node', 'script.js', '--api-key=test-cli-key'];
    const cliResult = getYouTubeApiKey();
    if (cliResult === 'test-cli-key') {
        console.log('✅ Test 2: Command line argument detection - PASSED');
        passed++;
    } else {
        console.log('❌ Test 2: Command line argument detection - FAILED');
    }
    
    // Test 3: No API key
    total++;
    process.argv = ['node', 'script.js'];
    const noKeyResult = getYouTubeApiKey();
    if (noKeyResult === null) {
        console.log('✅ Test 3: No API key detection - PASSED');
        passed++;
    } else {
        console.log('❌ Test 3: No API key detection - FAILED');
    }
    
    // Restore original environment
    if (originalApiKey) {
        process.env.YOUTUBE_API_KEY = originalApiKey;
    } else {
        delete process.env.YOUTUBE_API_KEY;
    }
    process.argv = originalArgv;
    
    console.log(`\n📊 API Key Detection: ${passed}/${total} tests passed\n`);
    return passed === total;
}

async function testDescriptionTruncation() {
    console.log('🧪 Testing Description Truncation Logic\n');
    
    // Mock API response for testing truncation
    const mockLongDescription = "This is a very long description that should be truncated properly at word boundaries to avoid cutting words in the middle and making the text look awkward when displayed to users. This description is intentionally longer than 150 characters to test the truncation functionality.";
    const mockShortDescription = "This is a short description.";
    
    let passed = 0;
    let total = 0;
    
    // Test 1: Long description truncation
    total++;
    let processedLong = mockLongDescription;
    if (processedLong.length > 150) {
        const lastSpace = processedLong.lastIndexOf(' ', 150);
        const truncateAt = lastSpace > 130 ? lastSpace : 150;
        processedLong = processedLong.substring(0, truncateAt) + '...';
    }
    
    if (processedLong.length <= 153 && processedLong.endsWith('...')) {
        console.log('✅ Test 1: Long description truncation - PASSED');
        console.log(`   Result: "${processedLong.substring(0, 50)}..." (${processedLong.length} chars)`);
        passed++;
    } else {
        console.log('❌ Test 1: Long description truncation - FAILED');
        console.log(`   Result length: ${processedLong.length}, ends with '...': ${processedLong.endsWith('...')}`);
    }
    
    // Test 2: Short description unchanged
    total++;
    let processedShort = mockShortDescription;
    if (processedShort.length > 150) {
        const lastSpace = processedShort.lastIndexOf(' ', 150);
        const truncateAt = lastSpace > 130 ? lastSpace : 150;
        processedShort = processedShort.substring(0, truncateAt) + '...';
    }
    
    if (processedShort === mockShortDescription) {
        console.log('✅ Test 2: Short description unchanged - PASSED');
        passed++;
    } else {
        console.log('❌ Test 2: Short description unchanged - FAILED');
    }
    
    console.log(`\n📊 Description Truncation: ${passed}/${total} tests passed\n`);
    return passed === total;
}

async function testApiIntegration() {
    console.log('🧪 Testing YouTube API Integration\n');
    
    const apiKey = getYouTubeApiKey();
    
    if (!apiKey) {
        console.log('⚠️  Skipping API integration test - no API key provided');
        console.log('   Set YOUTUBE_API_KEY environment variable to run this test');
        return true; // Don't fail the test suite if no API key
    }
    
    // Test with a known public video (Rick Astley - Never Gonna Give You Up)
    const testVideoId = 'dQw4w9WgXcQ';
    
    try {
        console.log(`🔄 Testing API call for video: ${testVideoId}`);
        const metadata = await fetchVideoMetadata(testVideoId, apiKey);
        
        if (metadata.title && metadata.description && metadata.thumbnail) {
            console.log('✅ API Integration test - PASSED');
            console.log(`   Title: ${metadata.title}`);
            console.log(`   Description: ${metadata.description.substring(0, 50)}...`);
            console.log(`   Has thumbnail: ${!!metadata.thumbnail}`);
            console.log(`   Has publish date: ${!!metadata.publishDate}`);
            return true;
        } else {
            console.log('❌ API Integration test - FAILED (missing required fields)');
            return false;
        }
    } catch (error) {
        console.log(`❌ API Integration test - FAILED: ${error.message}`);
        return false;
    }
}

// Run all tests
async function runAllTests() {
    console.log('🚀 Starting YouTube Data API v3 Integration Tests\n');
    
    const results = [];
    
    results.push(testVideoIdExtraction());
    results.push(testApiKeyDetection());
    results.push(await testDescriptionTruncation());
    results.push(await testApiIntegration());
    
    const passed = results.filter(r => r).length;
    const total = results.length;
    
    console.log('='.repeat(50));
    if (passed === total) {
        console.log('🎉 All YouTube API tests PASSED!');
        process.exit(0);
    } else {
        console.log(`❌ ${total - passed}/${total} YouTube API tests FAILED!`);
        process.exit(1);
    }
}

// Run tests if this file is executed directly
if (require.main === module) {
    runAllTests().catch(error => {
        console.error('❌ Error running tests:', error.message);
        process.exit(1);
    });
}

module.exports = {
    testVideoIdExtraction,
    testApiKeyDetection,
    testDescriptionTruncation,
    testApiIntegration,
    runAllTests
};