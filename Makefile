# 🚀 AI-Assisted Engineering Landing Page Makefile
# Using emoji and ASCII colors for better readability

# Colors
RED = \033[0;31m
GREEN = \033[0;32m
YELLOW = \033[0;33m
BLUE = \033[0;34m
PURPLE = \033[0;35m
CYAN = \033[0;36m
WHITE = \033[0;37m
RESET = \033[0m

.PHONY: help serve build deploy clean setup test config

# Default target
help: ## 📋 Show this help message
	@echo "$(CYAN)🚀 AI-Assisted Engineering Landing Page$(RESET)"
	@echo "$(WHITE)Available commands:$(RESET)"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(GREEN)%-12s$(RESET) %s\n", $$1, $$2}'

serve: ## 🌐 Start local development server
	@echo "$(BLUE)🌐 Starting local development server...$(RESET)"
	@if command -v python3 >/dev/null 2>&1; then \
		echo "$(GREEN)✅ Using Python 3 HTTP server$(RESET)"; \
		python3 -m http.server 8000; \
	elif command -v python >/dev/null 2>&1; then \
		echo "$(GREEN)✅ Using Python 2 HTTP server$(RESET)"; \
		python -m SimpleHTTPServer 8000; \
	elif command -v php >/dev/null 2>&1; then \
		echo "$(GREEN)✅ Using PHP built-in server$(RESET)"; \
		php -S localhost:8000; \
	else \
		echo "$(RED)❌ No suitable HTTP server found$(RESET)"; \
		echo "$(YELLOW)💡 Install Python or PHP to run local server$(RESET)"; \
		exit 1; \
	fi

setup: ## ⚙️ Initialize git repository and setup project
	@echo "$(PURPLE)⚙️ Setting up project...$(RESET)"
	@if [ ! -d .git ]; then \
		echo "$(BLUE)📦 Initializing git repository...$(RESET)"; \
		git init; \
		git add .; \
		git commit -m "🎉 Initial commit: AI-assisted engineering landing page"; \
		echo "$(GREEN)✅ Git repository initialized$(RESET)"; \
	else \
		echo "$(YELLOW)⚠️  Git repository already exists$(RESET)"; \
	fi
	@echo "$(GREEN)✅ Project setup complete!$(RESET)"

deploy: ## 🚀 Deploy to GitHub Pages (requires git remote)
	@echo "$(PURPLE)🚀 Deploying to GitHub Pages...$(RESET)"
	@if git remote get-url origin >/dev/null 2>&1; then \
		echo "$(BLUE)📤 Pushing to GitHub...$(RESET)"; \
		git add .; \
		git commit -m "🚀 Deploy: $(shell date '+%Y-%m-%d %H:%M:%S')" || true; \
		git push origin main; \
		echo "$(GREEN)✅ Deployed successfully!$(RESET)"; \
		echo "$(CYAN)🌐 Your site will be available at: https://$(shell git config --get remote.origin.url | sed 's/.*github.com[:/]\([^/]*\)\/\([^.]*\).*/\1.github.io\/\2/')$(RESET)"; \
	else \
		echo "$(RED)❌ No git remote found$(RESET)"; \
		echo "$(YELLOW)💡 Add a GitHub remote first:$(RESET)"; \
		echo "$(WHITE)   git remote add origin https://github.com/USERNAME/REPO.git$(RESET)"; \
		exit 1; \
	fi

test: ## 🧪 Run basic tests and validation
	@echo "$(PURPLE)🧪 Running tests and validation...$(RESET)"
	@echo "$(BLUE)📋 Checking file structure...$(RESET)"
	@for file in index.html styles.css script.js config.js README.md; do \
		if [ -f $$file ]; then \
			echo "$(GREEN)✅ $$file exists$(RESET)"; \
		else \
			echo "$(RED)❌ $$file missing$(RESET)"; \
		fi; \
	done
	@echo "$(BLUE)🔍 Validating HTML structure...$(RESET)"
	@if grep -q "<!DOCTYPE html>" index.html; then \
		echo "$(GREEN)✅ Valid HTML5 doctype$(RESET)"; \
	else \
		echo "$(RED)❌ Missing HTML5 doctype$(RESET)"; \
	fi
	@if grep -q "viewport" index.html; then \
		echo "$(GREEN)✅ Responsive viewport meta tag found$(RESET)"; \
	else \
		echo "$(YELLOW)⚠️  Missing viewport meta tag$(RESET)"; \
	fi
	@echo "$(BLUE)📱 Checking JavaScript configuration...$(RESET)"
	@if grep -q "videoConfig" config.js; then \
		echo "$(GREEN)✅ Video configuration found$(RESET)"; \
	else \
		echo "$(RED)❌ Video configuration missing$(RESET)"; \
	fi
	@echo "$(GREEN)🎉 Tests completed!$(RESET)"

build: ## 📦 Prepare for production (minify, optimize)
	@echo "$(PURPLE)📦 Building for production...$(RESET)"
	@echo "$(BLUE)🗜️  Minifying CSS...$(RESET)"
	@if command -v csso >/dev/null 2>&1; then \
		csso styles.css -o styles.min.css; \
		echo "$(GREEN)✅ CSS minified$(RESET)"; \
	else \
		echo "$(YELLOW)⚠️  csso not found, skipping CSS minification$(RESET)"; \
		echo "$(WHITE)   Install with: npm install -g csso-cli$(RESET)"; \
	fi
	@echo "$(BLUE)🗜️  Minifying JavaScript...$(RESET)"
	@if command -v uglifyjs >/dev/null 2>&1; then \
		uglifyjs script.js -o script.min.js -c -m; \
		echo "$(GREEN)✅ JavaScript minified$(RESET)"; \
	else \
		echo "$(YELLOW)⚠️  uglifyjs not found, skipping JS minification$(RESET)"; \
		echo "$(WHITE)   Install with: npm install -g uglify-js$(RESET)"; \
	fi
	@echo "$(GREEN)📦 Build completed!$(RESET)"

clean: ## 🧹 Clean up generated files
	@echo "$(PURPLE)🧹 Cleaning up...$(RESET)"
	@rm -f styles.min.css script.min.js
	@echo "$(GREEN)✅ Cleanup completed!$(RESET)"

config: ## 🎥 Generate config.js from YouTube URLs file
	@echo "$(PURPLE)🎥 Generating config.js from YouTube URLs...$(RESET)"
	@if [ ! -f "urls.txt" ] && [ ! -f "sample-urls.txt" ]; then \
		echo "$(YELLOW)📝 Creating sample URLs file...$(RESET)"; \
		node generate-config.js --sample; \
		echo "$(BLUE)💡 Edit sample-urls.txt with your YouTube URLs, then run 'make config' again$(RESET)"; \
	elif [ -f "urls.txt" ]; then \
		echo "$(BLUE)🔍 Processing urls.txt...$(RESET)"; \
		node generate-config.js urls.txt; \
	else \
		echo "$(BLUE)🔍 Processing sample-urls.txt...$(RESET)"; \
		node generate-config.js sample-urls.txt; \
	fi
	@echo "$(GREEN)✅ Config generation complete!$(RESET)"

update-videos: ## 🎥 Update video configuration (interactive)
	@echo "$(PURPLE)🎥 Video Configuration Helper$(RESET)"
	@echo "$(BLUE)📝 Edit config.js to update your video list$(RESET)"
	@echo "$(WHITE)Current videos:$(RESET)"
	@grep -A 1 "title:" config.js | grep -v "^--$$" || echo "$(YELLOW)⚠️  No videos configured$(RESET)"
	@echo "$(CYAN)💡 YouTube Video ID format: https://www.youtube.com/watch?v=VIDEO_ID$(RESET)"

status: ## 📊 Show project status
	@echo "$(CYAN)📊 Project Status$(RESET)"
	@echo "$(WHITE)Files:$(RESET)"
	@ls -la *.html *.css *.js *.md 2>/dev/null || echo "$(YELLOW)⚠️  Some files missing$(RESET)"
	@if [ -d .git ]; then \
		echo "$(WHITE)Git Status:$(RESET)"; \
		git status --porcelain | head -5; \
		if git remote get-url origin >/dev/null 2>&1; then \
			echo "$(GREEN)✅ Git remote configured$(RESET)"; \
		else \
			echo "$(YELLOW)⚠️  No git remote configured$(RESET)"; \
		fi; \
	else \
		echo "$(RED)❌ Not a git repository$(RESET)"; \
	fi

# Default target when no arguments provided
.DEFAULT_GOAL := help
