# 🚀 AI-Assisted Engineering Landing Page Makefile
# Using emoji and ASCII colors for better readability
# Compatible with GNU Make 3.81+

SHELL := bash
.SHELLFLAGS := -eu -o pipefail -c
.DELETE_ON_ERROR:
MAKEFLAGS += --warn-undefined-variables
MAKEFLAGS += --no-builtin-rules

.PHONY: help serve build deploy clean setup test test-all test-api test-pbt config

# Default target
help: ## 📋 Show this help message
	@echo "🚀 AI-Assisted Engineering Landing Page"
	@echo "Available commands:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  %-12s %s\n", $$1, $$2}'

serve: ## 🌐 Start local development server
	@echo "🌐 Starting local development server..."
	@if command -v node >/dev/null 2>&1; then \
		echo "✅ Using Node.js HTTP server"; \
		echo "📦 Installing http-server if needed..."; \
		npx http-server -p 8000 -o --silent; \
	elif command -v python3 >/dev/null 2>&1; then \
		echo "✅ Using Python 3 HTTP server (fallback)"; \
		python3 -m http.server 8000; \
	elif command -v python >/dev/null 2>&1; then \
		echo "✅ Using Python 2 HTTP server (fallback)"; \
		python -m SimpleHTTPServer 8000; \
	elif command -v php >/dev/null 2>&1; then \
		echo "✅ Using PHP built-in server (fallback)"; \
		php -S localhost:8000; \
	else \
		echo "❌ No suitable HTTP server found"; \
		echo "💡 Install Node.js and http-server will be auto-installed"; \
		echo "💡 Or install Python to use as fallback"; \
		exit 1; \
	fi

setup: ## ⚙️ Initialize git repository and setup project
	@echo "⚙️ Setting up project..."
	@if [ ! -d .git ]; then \
		echo "📦 Initializing git repository..."; \
		git init; \
		git add .; \
		git commit -m "🎉 Initial commit: AI-assisted engineering landing page"; \
		echo "✅ Git repository initialized"; \
	else \
		echo "⚠️  Git repository already exists"; \
	fi
	@echo "✅ Project setup complete!"

deploy: ## 🚀 Deploy to GitHub Pages (requires git remote)
	@echo "🚀 Deploying to GitHub Pages..."
	@if git remote get-url origin >/dev/null 2>&1; then \
		echo "📤 Pushing to GitHub..."; \
		git add .; \
		git commit -m "🚀 Deploy: $(shell date '+%Y-%m-%d %H:%M:%S')" || true; \
		git push origin main; \
		echo "✅ Deployed successfully!"; \
		echo "🌐 Your site will be available at: https://$(shell git config --get remote.origin.url | sed 's/.*github.com[:/]\([^/]*\)\/\([^.]*\).*/\1.github.io\/\2/')"; \
	else \
		echo "❌ No git remote found"; \
		echo "💡 Add a GitHub remote first:"; \
		echo "   git remote add origin https://github.com/USERNAME/REPO.git"; \
		exit 1; \
	fi

# Test targets
test: ## 🧪 Run core functionality tests
	@echo "🧪 Running core functionality tests..."
	@if [ -f "tests/test-core-functionality.js" ]; then \
		if node tests/test-core-functionality.js; then \
			echo "✅ Core functionality tests passed"; \
		else \
			echo "❌ Core functionality tests failed"; \
			exit 1; \
		fi; \
	else \
		echo "❌ Core functionality tests not found"; \
		exit 1; \
	fi

test-all: ## 🧪 Run all test suites
	@echo "🧪 Running all test suites..."
	@if [ -f "tests/run-all-tests.js" ]; then \
		node tests/run-all-tests.js; \
	else \
		echo "❌ Test runner not found"; \
		exit 1; \
	fi

test-api: ## 🧪 Run YouTube API integration tests
	@echo "🧪 Running YouTube API tests..."
	@if [ -f "tests/test-youtube-api.js" ]; then \
		if node tests/test-youtube-api.js; then \
			echo "✅ YouTube API tests passed"; \
		else \
			echo "❌ YouTube API tests failed"; \
			exit 1; \
		fi; \
	else \
		echo "❌ YouTube API tests not found"; \
		exit 1; \
	fi

test-pbt: ## 🧪 Run property-based tests
	@echo "🧪 Running property-based tests..."
	@echo "⚠️  Property-based tests may take longer to run"
	@if [ -f "tests/test-description-extraction.js" ]; then \
		if node tests/test-description-extraction.js; then \
			echo "✅ Property-based tests passed"; \
		else \
			echo "❌ Property-based tests failed"; \
			exit 1; \
		fi; \
	else \
		echo "❌ Property-based tests not found"; \
		exit 1; \
	fi

build: ## 📦 Prepare for production (minify, optimize)
	@echo "📦 Building for production..."
	@echo "🗜️  Minifying CSS..."
	@if command -v csso >/dev/null 2>&1; then \
		csso styles.css -o styles.min.css; \
		echo "✅ CSS minified"; \
	else \
		echo "⚠️  csso not found, skipping CSS minification"; \
		echo "   Install with: npm install -g csso-cli"; \
	fi
	@echo "�️   Minifying JavaScript..."
	@if command -v uglifyjs >/dev/null 2>&1; then \
		uglifyjs script.js -o script.min.js -c -m; \
		echo "✅ JavaScript minified"; \
	else \
		echo "⚠️  uglifyjs not found, skipping JS minification"; \
		echo "   Install with: npm install -g uglify-js"; \
	fi
	@echo "📦 Build completed!"

clean: ## 🧹 Clean up generated files
	@echo "🧹 Cleaning up..."
	@rm -f styles.min.css script.min.js
	@echo "✅ Cleanup completed!"

config: ## 🎥 Generate config.js from YouTube URLs with YouTube Data API v3
	@echo "🎥 Generating video config with YouTube Data API v3..."
	@if [ -f "urls.txt" ]; then \
		echo "� ProcessiBng urls.txt with YouTube Data API v3..."; \
		if [ -z "$$YOUTUBE_API_KEY" ]; then \
			echo "⚠️  No YOUTUBE_API_KEY environment variable found"; \
			echo "💡 Set your API key: export YOUTUBE_API_KEY='your-key'"; \
			echo "💡 Or use: make config YOUTUBE_API_KEY='your-key'"; \
		fi; \
		node generate-video-config.js; \
		if [ $$? -eq 0 ]; then \
			echo "✅ Video config updated with real YouTube metadata!"; \
		else \
			echo "❌ Failed to generate config - check API key"; \
		fi; \
	else \
		echo "❌ urls.txt not found"; \
		echo "💡 Create urls.txt with your YouTube URLs"; \
		exit 1; \
	fi

update-videos: ## 🎥 Update video configuration (interactive)
	@echo "🎥 Video Configuration Helper"
	@echo "📝 Edit config.js to update your video list"
	@echo "Current videos:"
	@grep -A 1 "title:" config.js | grep -v "^--$$" || echo "⚠️  No videos configured"
	@echo "💡 YouTube Video ID format: https://www.youtube.com/watch?v=VIDEO_ID"

status: ## 📊 Show project status
	@echo "📊 Project Status"
	@echo "Files:"
	@ls -la *.html *.css *.js *.md 2>/dev/null || echo "⚠️  Some files missing"
	@if [ -d .git ]; then \
		echo "Git Status:"; \
		git status --porcelain | head -5; \
		if git remote get-url origin >/dev/null 2>&1; then \
			echo "✅ Git remote configured"; \
		else \
			echo "⚠️  No git remote configured"; \
		fi; \
	else \
		echo "❌ Not a git repository"; \
	fi

# Default target when no arguments provided
.DEFAULT_GOAL := help