#!/usr/bin/env node

/**
 * Test Runner for AI-Assisted Engineering Landing Page
 * Runs all test suites and reports results
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Test configuration
const tests = [
    {
        name: 'Core Functionality Tests',
        file: 'test-core-functionality.js',
        description: 'Tests project structure, configuration files, and basic setup'
    },
    {
        name: 'YouTube API Integration Tests',
        file: 'test-youtube-api.js',
        description: 'Tests YouTube Data API v3 integration, video ID extraction, and API key handling'
    },
    {
        name: 'Property-Based Tests',
        file: 'test-description-extraction.js',
        description: 'Property-based tests for video metadata processing and validation',
        isPBT: true
    },
    {
        name: 'Description Processing Tests',
        file: 'test-description-processing.js',
        description: 'Unit tests for description processing, truncation, and fallback logic'
    },
    {
        name: 'Date Sorting Property Tests',
        file: 'test-date-sorting.js',
        description: 'Property-based tests for date-based sorting and undated video placement',
        isPBT: true
    },
    {
        name: 'New Video Marking Property Tests',
        file: 'test-new-video-marking.js',
        description: 'Property-based tests for new video marking logic',
        isPBT: true
    },
    {
        name: 'Sorting Integration Tests',
        file: 'test-sorting-integration.js',
        description: 'Integration tests for the actual date-based sorting implementation'
    }
];

// Colors for output
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m'
};

function colorize(text, color) {
    return `${colors[color]}${text}${colors.reset}`;
}

function runTest(testFile) {
    return new Promise((resolve) => {
        const testPath = path.join(__dirname, testFile);
        
        if (!fs.existsSync(testPath)) {
            resolve({
                success: false,
                error: `Test file not found: ${testFile}`,
                output: '',
                duration: 0
            });
            return;
        }

        const startTime = Date.now();
        const child = spawn('node', [testPath], {
            stdio: ['pipe', 'pipe', 'pipe'],
            cwd: path.dirname(__dirname) // Run from project root
        });

        let stdout = '';
        let stderr = '';

        child.stdout.on('data', (data) => {
            stdout += data.toString();
        });

        child.stderr.on('data', (data) => {
            stderr += data.toString();
        });

        child.on('close', (code) => {
            const duration = Date.now() - startTime;
            resolve({
                success: code === 0,
                exitCode: code,
                output: stdout,
                error: stderr,
                duration: duration
            });
        });

        child.on('error', (error) => {
            const duration = Date.now() - startTime;
            resolve({
                success: false,
                error: error.message,
                output: stdout,
                duration: duration
            });
        });
    });
}

async function runAllTests() {
    console.log(colorize('🧪 AI-Assisted Engineering Test Suite', 'cyan'));
    console.log(colorize('=' .repeat(50), 'blue'));
    console.log();

    const results = [];
    let totalDuration = 0;

    for (let i = 0; i < tests.length; i++) {
        const test = tests[i];
        console.log(colorize(`📋 Running: ${test.name}`, 'bright'));
        console.log(colorize(`   ${test.description}`, 'blue'));
        
        if (test.isPBT) {
            console.log(colorize('   ⚠️  Property-based test - may take longer to run', 'yellow'));
        }
        
        console.log();

        const result = await runTest(test.file);
        results.push({ ...result, test });
        totalDuration += result.duration;

        if (result.success) {
            console.log(colorize(`✅ ${test.name} - PASSED`, 'green'));
            console.log(colorize(`   Duration: ${result.duration}ms`, 'blue'));
        } else {
            console.log(colorize(`❌ ${test.name} - FAILED`, 'red'));
            console.log(colorize(`   Duration: ${result.duration}ms`, 'blue'));
            if (result.error) {
                console.log(colorize(`   Error: ${result.error}`, 'red'));
            }
        }
        
        console.log();
    }

    // Summary
    console.log(colorize('=' .repeat(50), 'blue'));
    console.log(colorize('📊 Test Results Summary', 'cyan'));
    console.log();

    const passed = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;

    console.log(colorize(`Total Tests: ${tests.length}`, 'bright'));
    console.log(colorize(`Passed: ${passed}`, passed > 0 ? 'green' : 'yellow'));
    console.log(colorize(`Failed: ${failed}`, failed > 0 ? 'red' : 'green'));
    console.log(colorize(`Total Duration: ${totalDuration}ms`, 'blue'));
    console.log();

    // Detailed results for failed tests
    const failedTests = results.filter(r => !r.success);
    if (failedTests.length > 0) {
        console.log(colorize('❌ Failed Test Details:', 'red'));
        console.log();
        
        failedTests.forEach(result => {
            console.log(colorize(`• ${result.test.name}`, 'red'));
            if (result.error) {
                console.log(colorize(`  Error: ${result.error}`, 'red'));
            }
            if (result.output) {
                console.log(colorize('  Output:', 'yellow'));
                console.log(result.output.split('\n').map(line => `    ${line}`).join('\n'));
            }
            console.log();
        });
    }

    // Overall result
    if (failed === 0) {
        console.log(colorize('🎉 All tests passed!', 'green'));
        process.exit(0);
    } else {
        console.log(colorize(`💥 ${failed} test(s) failed!`, 'red'));
        process.exit(1);
    }
}

// Handle process signals
process.on('SIGINT', () => {
    console.log(colorize('\n⚠️  Test run interrupted', 'yellow'));
    process.exit(1);
});

process.on('SIGTERM', () => {
    console.log(colorize('\n⚠️  Test run terminated', 'yellow'));
    process.exit(1);
});

// Run tests
if (require.main === module) {
    runAllTests().catch(error => {
        console.error(colorize(`💥 Test runner error: ${error.message}`, 'red'));
        process.exit(1);
    });
}

module.exports = { runAllTests };