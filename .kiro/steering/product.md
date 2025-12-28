---
inclusion: always
---

# Product Guidelines

## AI-Assisted Engineering Landing Page

A performance-focused, vanilla JavaScript landing page showcasing AI development tools and educational content. This is a single-page application with no frameworks or external dependencies.

## Core Product Principles

### Performance First

- **Zero Framework Dependencies**: Use only vanilla HTML5, CSS3, and JavaScript
- **Lazy Loading**: Implement for images, videos, and non-critical content
- **Minimal Bundle Size**: Keep all assets lightweight and optimized
- **SEO Optimized**: Semantic HTML with proper meta tags and structured data

### Configuration-Driven Architecture

- **Separation of Content and Code**: All content managed through `*-config.js` files
- **Auto-Generated Video Data**: Use `generate-video-config.js` to fetch YouTube metadata
- **Manual Event Curation**: Events managed through `events-config.js`
- **Centralized Site Content**: All text, navigation, and metadata in `site-config.js`

### Content Standards

- **Educational Focus**: AI development tools, coding productivity, live demonstrations
- **Professional Tone**: Technical but accessible content for developers
- **Video-Centric**: YouTube embeds with modal playback, thumbnails, descriptions
- **Event Listings**: Conference talks, workshops, speaking engagements with dates and locations

## Development Guidelines

### Code Style

- **Modular Functions**: Each feature should have dedicated initialization and utility functions
- **Event-Driven**: Use DOM events, intersection observers, and scroll handlers
- **Error Handling**: Implement graceful fallbacks for missing elements or API failures
- **Accessibility**: Ensure keyboard navigation, screen reader support, and semantic markup

### Content Management Workflow

1. **Video Updates**: Add YouTube URLs to `urls.txt`, run `make config` to regenerate metadata
2. **Event Updates**: Manually edit `events-config.js` with new conferences and dates
3. **Site Content**: Update text, navigation, and metadata in `site-config.js`
4. **Styling**: Use CSS custom properties for theming, maintain mobile-first responsive design

### Quality Standards

- **Mobile-First**: Design and test for mobile devices first, then enhance for desktop
- **Cross-Browser**: Ensure compatibility with modern browsers (ES6+ support assumed)
- **Performance Budget**: Keep initial page load under 2MB, optimize images and assets
- **Semantic HTML**: Use proper heading hierarchy, landmarks, and ARIA labels where needed

## Technical Constraints

- **No Build Process**: Files should work directly in browsers without compilation
- **GitHub Pages Compatible**: Static hosting with optional custom domain via CNAME
- **YouTube API Limitations**: Handle rate limiting and quota restrictions gracefully
- **Makefile Automation**: Use provided Makefile targets for all development tasks
