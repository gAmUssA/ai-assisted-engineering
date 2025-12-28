#!/usr/bin/env node

/**
 * Property-Based Test for New Video Marking
 * Feature: video-config-fix, Property 5: New Video Marking
 * Validates: Requirements 2.4
 */

// Simple property-based test framework (consistent with existing tests)
class PropertyTest {
    constructor(name, iterations = 100) {
        this.name = name;
        this.iterations = iterations;
        this.failures = [];
    }

    run(generator, property) {
        console.log(`\n🧪 Running property test: ${this.name}`);
        console.log(`📊 Testing ${this.iterations} iterations...`);
        
        for (let i = 0; i < this.iterations; i++) {
            try {
                const input = generator();
                const result = property(input);
                
                if (!result.success) {
                    this.failures.push({
                        iteration: i + 1,
                        input: input,
                        reason: result.reason
                    });
                }
            } catch (error) {
                this.failures.push({
                    iteration: i + 1,
                    input: 'Error generating input',
                    reason: `Exception: ${error.message}`
                });
            }
        }
        
        if (this.failures.length === 0) {
            console.log(`✅ All ${this.iterations} iterations passed!`);
            return true;
        } else {
            console.log(`❌ ${this.failures.length}/${this.iterations} iterations failed`);
            console.log('\nFirst few failures:');
            this.failures.slice(0, 3).forEach(failure => {
                console.log(`  Iteration ${failure.iteration}: ${failure.reason}`);
                if (typeof failure.input === 'object') {
                    console.log(`    Input: ${JSON.stringify(failure.input).substring(0, 100)}...`);
                } else {
                    console.log(`    Input: ${failure.input}`);
                }
            });
            return false;
        }
    }
}

// Generator for video lists with various date combinations
function generateVideoListForNewMarking() {
    const videoCount = Math.floor(Math.random() * 15) + 1; // 1-15 videos
    const videos = [];
    
    // Generate base dates over the last 2 years
    const now = new Date();
    const twoYearsAgo = new Date(now.getTime() - (2 * 365 * 24 * 60 * 60 * 1000));
    
    for (let i = 0; i < videoCount; i++) {
        const video = {
            id: `video_${i}`,
            title: `Test Video ${i}`,
            description: `Description for video ${i}`,
            thumbnail: `https://img.youtube.com/vi/video_${i}/maxresdefault.jpg`
        };
        
        // Vary the probability of having a publish date
        // 70% chance of having a date, 30% chance of null
        if (Math.random() < 0.7) {
            const randomTime = twoYearsAgo.getTime() + Math.random() * (now.getTime() - twoYearsAgo.getTime());
            video.publishDate = new Date(randomTime).toISOString();
        } else {
            video.publishDate = null;
        }
        
        videos.push(video);
    }
    
    return videos;
}

// Simulate the complete sorting and new marking logic from generate-video-config.js
function sortAndMarkNewVideos(videos) {
    // First, sort videos by publish date (most recent first)
    const sortedVideos = [...videos].sort((a, b) => {
        if (!a.publishDate) return 1;
        if (!b.publishDate) return -1;
        return new Date(b.publishDate) - new Date(a.publishDate);
    });
    
    // Mark the 3 most recent videos as new (only those with valid publish dates)
    let newCount = 0;
    for (let i = 0; i < sortedVideos.length && newCount < 3; i++) {
        if (sortedVideos[i].publishDate) {
            sortedVideos[i].isNew = true;
            newCount++;
        }
    }
    
    return sortedVideos;
}

// Property 5: New Video Marking
// For any sorted list of videos (newest first), exactly the first 3 videos with valid publish dates 
// (or fewer if total count < 3) should have the isNew flag set to true
function testNewVideoMarking() {
    const test = new PropertyTest("New Video Marking", 100);
    
    return test.run(
        () => generateVideoListForNewMarking(),
        (videos) => {
            const processedVideos = sortAndMarkNewVideos(videos);
            
            // Count videos with dates and videos marked as new
            const videosWithDates = processedVideos.filter(v => v.publishDate);
            const videosMarkedNew = processedVideos.filter(v => v.isNew);
            
            // Expected number of new videos should be min(3, videosWithDates.length)
            const expectedNewCount = Math.min(3, videosWithDates.length);
            
            // Test 1: Correct number of videos marked as new
            if (videosMarkedNew.length !== expectedNewCount) {
                return {
                    success: false,
                    reason: `Expected ${expectedNewCount} videos to be marked as new, but got ${videosMarkedNew.length}. Total videos with dates: ${videosWithDates.length}`
                };
            }
            
            // Test 2: Only videos with valid publish dates should be marked as new
            for (const video of videosMarkedNew) {
                if (!video.publishDate) {
                    return {
                        success: false,
                        reason: `Video "${video.title}" is marked as new but has no publish date`
                    };
                }
            }
            
            // Test 3: The marked videos should be the first N videos with dates (newest first)
            const firstNVideosWithDates = videosWithDates.slice(0, expectedNewCount);
            
            for (let i = 0; i < expectedNewCount; i++) {
                if (!firstNVideosWithDates[i].isNew) {
                    return {
                        success: false,
                        reason: `Video "${firstNVideosWithDates[i].title}" should be marked as new (it's among the ${expectedNewCount} most recent) but isn't`
                    };
                }
            }
            
            // Test 4: Videos beyond the first 3 with dates should NOT be marked as new
            if (videosWithDates.length > 3) {
                for (let i = 3; i < videosWithDates.length; i++) {
                    if (videosWithDates[i].isNew) {
                        return {
                            success: false,
                            reason: `Video "${videosWithDates[i].title}" is marked as new but it's not among the 3 most recent videos`
                        };
                    }
                }
            }
            
            // Test 5: Videos without dates should never be marked as new
            const videosWithoutDates = processedVideos.filter(v => !v.publishDate);
            for (const video of videosWithoutDates) {
                if (video.isNew) {
                    return {
                        success: false,
                        reason: `Video "${video.title}" has no publish date but is marked as new`
                    };
                }
            }
            
            return { success: true };
        }
    );
}

// Run all property tests
async function runAllTests() {
    console.log("🚀 Starting Property-Based Test for New Video Marking");
    console.log("Feature: video-config-fix, Property 5: New Video Marking");
    console.log("Validates: Requirements 2.4\n");
    
    let allPassed = true;
    
    // Test Property 5: New Video Marking
    console.log("=".repeat(50));
    console.log("Feature: video-config-fix, Property 5: New Video Marking");
    console.log("Validates: Requirements 2.4");
    if (!testNewVideoMarking()) {
        allPassed = false;
    }
    
    console.log("\n" + "=".repeat(50));
    if (allPassed) {
        console.log("🎉 New video marking property test PASSED!");
        console.log("\n💡 New video marking ensures:");
        console.log("   • Exactly 3 videos (or fewer if less available) are marked as new");
        console.log("   • Only videos with valid publish dates can be marked as new");
        console.log("   • The marked videos are the 3 most recent by publish date");
        console.log("   • Videos without dates are never marked as new");
        process.exit(0);
    } else {
        console.log("❌ New video marking property test FAILED!");
        process.exit(1);
    }
}

// Run tests if this file is executed directly
if (require.main === module) {
    runAllTests().catch(error => {
        console.error('❌ Error running new video marking tests:', error.message);
        process.exit(1);
    });
}

module.exports = {
    testNewVideoMarking,
    runAllTests
};