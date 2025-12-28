#!/usr/bin/env node

/**
 * Core Functionality Tests
 * Tests basic project structure and configuration
 */

const fs = require('fs');
const path = require('path');

// Test configuration
const requiredFiles = [
    'index.html',
    'styles.css', 
    'script.js',
    'config.js',
    'generate-video-config.js',
    'urls.txt'
];

const requiredDirs = [
    '.github/workflows',
    'tests'
];

// Detect if we're running from tests directory or root directory
function getProjectRoot() {
    // If we're in tests directory, go up one level
    if (process.cwd().endsWith('tests')) {
        return '..';
    }
    // If we're in root directory, stay here
    return '.';
}

const projectRoot = getProjectRoot();

function testFileStructure() {
    console.log('🧪 Testing Core File Structure\n');
    
    let passed = 0;
    let total = 0;
    
    // Test required files
    console.log('📁 Checking required files:');
    requiredFiles.forEach(file => {
        total++;
        const filePath = path.join(projectRoot, file);
        if (fs.existsSync(filePath)) {
            console.log(`✅ ${file} - exists`);
            passed++;
        } else {
            console.log(`❌ ${file} - missing`);
        }
    });
    
    console.log();
    
    // Test required directories
    console.log('📂 Checking required directories:');
    requiredDirs.forEach(dir => {
        total++;
        const dirPath = path.join(projectRoot, dir);
        if (fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory()) {
            console.log(`✅ ${dir}/ - exists`);
            passed++;
        } else {
            console.log(`❌ ${dir}/ - missing`);
        }
    });
    
    return { passed, total };
}

function testConfigStructure() {
    console.log('\n🧪 Testing Configuration Structure\n');
    
    let passed = 0;
    let total = 0;
    
    // Test config.js structure
    total++;
    const configPath = path.join(projectRoot, 'config.js');
    if (fs.existsSync(configPath)) {
        const configContent = fs.readFileSync(configPath, 'utf8');
        
        if (configContent.includes('videoConfig')) {
            console.log('✅ config.js contains videoConfig');
            passed++;
            
            // Test for video properties
            const hasTitle = configContent.includes('"title"');
            const hasDescription = configContent.includes('"description"');
            const hasThumbnail = configContent.includes('"thumbnail"');
            const hasId = configContent.includes('"id"');
            
            console.log(`   ${hasTitle ? '✅' : '❌'} Has title property`);
            console.log(`   ${hasDescription ? '✅' : '❌'} Has description property`);
            console.log(`   ${hasThumbnail ? '✅' : '❌'} Has thumbnail property`);
            console.log(`   ${hasId ? '✅' : '❌'} Has id property`);
            
            if (hasTitle && hasDescription && hasThumbnail && hasId) {
                console.log('✅ All required video properties present');
            } else {
                console.log('❌ Missing required video properties');
            }
        } else {
            console.log('❌ config.js missing videoConfig');
        }
    } else {
        console.log('❌ config.js not found');
    }
    
    return { passed, total };
}

function testHtmlStructure() {
    console.log('\n🧪 Testing HTML Structure\n');
    
    let passed = 0;
    let total = 0;
    
    const htmlPath = path.join(projectRoot, 'index.html');
    if (fs.existsSync(htmlPath)) {
        const htmlContent = fs.readFileSync(htmlPath, 'utf8');
        
        // Test HTML5 doctype
        total++;
        if (htmlContent.includes('<!DOCTYPE html>')) {
            console.log('✅ HTML5 doctype present');
            passed++;
        } else {
            console.log('❌ Missing HTML5 doctype');
        }
        
        // Test viewport meta tag
        total++;
        if (htmlContent.includes('viewport')) {
            console.log('✅ Viewport meta tag present');
            passed++;
        } else {
            console.log('❌ Missing viewport meta tag');
        }
        
        // Test CSS link
        total++;
        if (htmlContent.includes('styles.css')) {
            console.log('✅ CSS stylesheet linked');
            passed++;
        } else {
            console.log('❌ CSS stylesheet not linked');
        }
        
        // Test JavaScript link
        total++;
        if (htmlContent.includes('script.js')) {
            console.log('✅ JavaScript file linked');
            passed++;
        } else {
            console.log('❌ JavaScript file not linked');
        }
        
        // Test config.js link
        total++;
        if (htmlContent.includes('config.js')) {
            console.log('✅ Config file linked');
            passed++;
        } else {
            console.log('❌ Config file not linked');
        }
    } else {
        console.log('❌ index.html not found');
        total += 5; // All HTML tests failed
    }
    
    return { passed, total };
}

function testGitHubActions() {
    console.log('\n🧪 Testing GitHub Actions Configuration\n');
    
    let passed = 0;
    let total = 0;
    
    const workflowPath = path.join(projectRoot, '.github', 'workflows', 'deploy.yml');
    
    total++;
    if (fs.existsSync(workflowPath)) {
        console.log('✅ GitHub Actions workflow exists');
        passed++;
        
        const workflowContent = fs.readFileSync(workflowPath, 'utf8');
        
        // Test for YouTube API key usage
        total++;
        if (workflowContent.includes('YOUTUBE_API_KEY')) {
            console.log('✅ Workflow uses YOUTUBE_API_KEY');
            passed++;
        } else {
            console.log('❌ Workflow missing YOUTUBE_API_KEY');
        }
        
        // Test for video config generation
        total++;
        if (workflowContent.includes('generate-video-config.js')) {
            console.log('✅ Workflow generates video config');
            passed++;
        } else {
            console.log('❌ Workflow missing video config generation');
        }
        
        // Test for GitHub Pages deployment
        total++;
        if (workflowContent.includes('deploy-pages')) {
            console.log('✅ Workflow deploys to GitHub Pages');
            passed++;
        } else {
            console.log('❌ Workflow missing GitHub Pages deployment');
        }
    } else {
        console.log('❌ GitHub Actions workflow not found');
        total += 3; // All workflow tests failed
    }
    
    return { passed, total };
}

async function runAllTests() {
    console.log('🚀 Core Functionality Test Suite\n');
    
    const results = [];
    
    // Run all test categories
    results.push(testFileStructure());
    results.push(testConfigStructure());
    results.push(testHtmlStructure());
    results.push(testGitHubActions());
    
    // Calculate totals
    const totalPassed = results.reduce((sum, result) => sum + result.passed, 0);
    const totalTests = results.reduce((sum, result) => sum + result.total, 0);
    
    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('📊 Core Functionality Test Results');
    console.log('='.repeat(50));
    console.log(`Total Tests: ${totalTests}`);
    console.log(`Passed: ${totalPassed}`);
    console.log(`Failed: ${totalTests - totalPassed}`);
    console.log(`Success Rate: ${Math.round((totalPassed / totalTests) * 100)}%`);
    
    if (totalPassed === totalTests) {
        console.log('\n🎉 All core functionality tests passed!');
        process.exit(0);
    } else {
        console.log(`\n❌ ${totalTests - totalPassed} core functionality test(s) failed!`);
        process.exit(1);
    }
}

// Run tests if this file is executed directly
if (require.main === module) {
    runAllTests().catch(error => {
        console.error('❌ Error running core functionality tests:', error.message);
        process.exit(1);
    });
}

module.exports = { runAllTests };