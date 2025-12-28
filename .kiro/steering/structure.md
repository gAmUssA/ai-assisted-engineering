---
inclusion: always
---

# Project Structure & Architecture Guidelines

## Critical File Relationships

### Core Application Files (NEVER modify simultaneously)

- **`index.html`**: Single-page application structure, semantic HTML5
- **`styles.css`**: Complete styling system with CSS custom properties, mobile-first responsive design
- **`script.js`**: Main application logic, DOM manipulation, event handling, modal functionality

### Configuration System (Content-driven architecture)

- **`config.js`**: AUTO-GENERATED - Never edit manually, regenerate via `make config`
- **`events-config.js`**: Manual event listings with dates, locations, links
- **`site-config.js`**: Centralized content management for all text, meta tags, navigation
- **`urls.txt`**: Input file for video URL processing - edit this to add new videos

### Generation & Build

- **`generate-video-config.js`**: YouTube metadata fetcher - handles API calls and rate limiting
- **`Makefile`**: Primary build system - use `make` commands for all tasks
- **`generate-config.js`**: DEPRECATED - do not use

## Architecture Patterns

### JavaScript Code Organization

- **Function Naming**: Use descriptive names like `initializeVideoGallery()`, `handleModalClose()`
- **Event Handling**: Attach listeners in dedicated init functions, use event delegation
- **Configuration Loading**: Always check if config objects exist before accessing properties
- **Error Handling**: Implement try-catch blocks for API calls and DOM manipulation
- **Modular Structure**: Each major feature (videos, events, modals) has its own init function

### CSS Architecture Rules

- **Custom Properties**: Define all colors, spacing, and breakpoints as CSS variables in `:root`
- **Component Classes**: Use `.component-name` pattern (e.g., `.video-card`, `.event-item`)
- **State Classes**: Use `.is-active`, `.is-hidden`, `.is-loading` for dynamic states
- **Responsive Design**: Mobile-first with `min-width` media queries
- **Animation**: Use `transform` and `opacity` for performance, trigger with intersection observers

### Content Management Workflow

1. **Video Updates**: Add YouTube URLs to `urls.txt` → Run `make config` → Commit generated `config.js`
2. **Event Updates**: Edit `events-config.js` directly → Test with `make serve`
3. **Site Content**: Update `site-config.js` for text changes → No regeneration needed
4. **Styling**: Modify CSS custom properties first, then component styles

## File Modification Rules

### NEVER Edit Directly

- `config.js` - Always regenerate via `make config`
- `.history/` files - IDE-generated, ignore completely

### Edit With Caution

- `script.js` - Test thoroughly, affects entire site functionality
- `styles.css` - Changes affect all components, test responsive behavior
- `Makefile` - Follow exact preamble format, test all targets

### Safe to Edit

- `*-config.js` files (except `config.js`)
- `urls.txt` - Just add new YouTube URLs
- Documentation files (`README.md`, `docs/`)

## Development Commands

```bash
make serve    # Start local development server
make config   # Regenerate video configuration from urls.txt
make test     # Run all tests and validation
make deploy   # Deploy to GitHub Pages
make clean    # Clean generated files
```

## Naming Conventions

### Files & Directories

- HTML/CSS: `kebab-case.html`, `kebab-case.css`
- JavaScript: `camelCase.js` for utilities, `kebab-case.js` for configs
- Directories: `kebab-case/`

### Code Conventions

- **CSS Classes**: `.component-name__element--modifier` (BEM-inspired)
- **JavaScript Functions**: `camelCase` with descriptive verbs (`initializeGallery`, `handleClick`)
- **JavaScript Variables**: `camelCase` with clear intent (`videoElements`, `isModalOpen`)
- **Configuration Objects**: Descriptive keys matching UI elements (`heroTitle`, `navigationLinks`)

## Performance Requirements

- No external frameworks or libraries
- Lazy load images and videos
- Use intersection observers for animations
- Minimize DOM queries with caching
- Implement graceful fallbacks for missing elements
