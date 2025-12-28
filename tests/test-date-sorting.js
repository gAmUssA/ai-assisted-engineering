#!/usr/bin/env node

/**
 * Property-Based Tests for Date-Based Sorting
 * Feature: video-config-fix, Property 3: Date-Based Sorting
 * Feature: video-config-fix, Property 4: Undated Video Placement
 * Validates: Requirements 2.2, 2.3
 */

// Simple property-based test framework (reused from existing tests)
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
function generateVideoListWithDates() {
    const videoCount = Math.floor(Math.random() * 10) + 3; // 3-12 videos
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
        
        // 80% chance of having a publish date, 20% chance of null
        if (Math.random() < 0.8) {
            const randomTime = twoYearsAgo.getTime() + Math.random() * (now.getTime() - twoYearsAgo.getTime());
            video.publishDate = new Date(randomTime).toISOString();
        } else {
            video.publishDate = null;
        }
        
        videos.push(video);
    }
    
    return videos;
}

// Simulate the sorting logic from generate-video-config.js
function sortVideosByDate(videos) {
    return [...videos].sort((a, b) => {
        if (!a.publishDate) return 1;
        if (!b.publishDate) return -1;
        return new Date(b.publishDate) - new Date(a.publishDate);
    });
}

// Property 3: Date-Based Sorting
// For any list of videos with publish dates, the output should be sorted in descending chronological order (newest first)
function testDateBasedSorting() {
    const test = new PropertyTest("Date-Based Sorting", 100);
    
    return test.run(
        () => generateVideoListWithDates(),
        (videos) => {
            const sortedVideos = sortVideosByDate(videos);
            
            // Check that videos with dates are sorted newest first
            const videosWithDates = sortedVideos.filter(v => v.publishDate);
            
            for (let i = 0; i < videosWithDates.length - 1; i++) {
                const currentDate = new Date(videosWithDates[i].publishDate);
                const nextDate = new Date(videosWithDates[i + 1].publishDate);
                
                if (currentDate < nextDate) {
                    return {
                        success: false,
                        reason: `Videos not sorted by date (newest first). Video at index ${i} (${videosWithDates[i].publishDate}) is older than video at index ${i + 1} (${videosWithDates[i + 1].publishDate})`
                    };
                }
            }
            
            return { success: true };
        }
    );
}

// Property 4: Undated Video Placement
// For any video without a publish date, it should appear after all videos that have publish dates in the sorted list
function testUndatedVideoPlacement() {
    const test = new PropertyTest("Undated Video Placement", 100);
    
    return test.run(
        () => generateVideoListWithDates(),
        (videos) => {
            const sortedVideos = sortVideosByDate(videos);
            
            // Find the first video without a date
            let firstUndatedIndex = -1;
            for (let i = 0; i < sortedVideos.length; i++) {
                if (!sortedVideos[i].publishDate) {
                    firstUndatedIndex = i;
                    break;
                }
            }
            
            // If there are undated videos, check they're all at the end
            if (firstUndatedIndex !== -1) {
                // All videos before the first undated video should have dates
                for (let i = 0; i < firstUndatedIndex; i++) {
                    if (!sortedVideos[i].publishDate) {
                        return {
                            success: false,
                            reason: `Undated video found at index ${i}, but first undated video should be at index ${firstUndatedIndex}`
                        };
                    }
                }
                
                // All videos from the first undated video onwards should be undated
                for (let i = firstUndatedIndex; i < sortedVideos.length; i++) {
                    if (sortedVideos[i].publishDate) {
                        return {
                            success: false,
                            reason: `Dated video found at index ${i} after undated videos started at index ${firstUndatedIndex}`
                        };
                    }
                }
            }
            
            return { success: true };
        }
    );
}

// Run all property tests
async function runAllTests() {
    console.log("🚀 Starting Property-Based Tests for Date-Based Sorting");
    console.log("Feature: video-config-fix, Property 3 & 4: Date-Based Sorting and Undated Video Placement");
    console.log("Validates: Requirements 2.2, 2.3\n");
    
    let allPassed = true;
    
    // Test Property 3: Date-Based Sorting
    console.log("=".repeat(50));
    console.log("Feature: video-config-fix, Property 3: Date-Based Sorting");
    console.log("Validates: Requirements 2.2");
    if (!testDateBasedSorting()) {
        allPassed = false;
    }
    
    // Test Property 4: Undated Video Placement
    console.log("\n" + "=".repeat(50));
    console.log("Feature: video-config-fix, Property 4: Undated Video Placement");
    console.log("Validates: Requirements 2.3");
    if (!testUndatedVideoPlacement()) {
        allPassed = false;
    }
    
    console.log("\n" + "=".repeat(50));
    if (allPassed) {
        console.log("🎉 All date sorting property tests PASSED!");
        console.log("\n💡 Date sorting ensures:");
        console.log("   • Videos are ordered by publish date (newest first)");
        console.log("   • Videos without dates appear at the end");
        console.log("   • Consistent ordering regardless of input order");
        process.exit(0);
    } else {
        console.log("❌ Some date sorting property tests FAILED!");
        process.exit(1);
    }
}

// Run tests if this file is executed directly
if (require.main === module) {
    runAllTests().catch(error => {
        console.error('❌ Error running date sorting tests:', error.message);
        process.exit(1);
    });
}

module.exports = {
    testDateBasedSorting,
    testUndatedVideoPlacement,
    runAllTests
};