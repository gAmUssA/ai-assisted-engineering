# 🚀 AI-Assisted Engineering Landing Page

A modern, responsive landing page showcasing AI-powered development tools and video tutorials. Built with vanilla HTML, CSS, and JavaScript for optimal performance and easy deployment to GitHub Pages.

## ✨ Features

- **Modern Design**: Sleek, dark theme with gradient accents and smooth animations
- **Responsive Layout**: Mobile-first design that works on all devices
- **Video Gallery**: Configurable YouTube video showcase with modal playback
- **Smooth Scrolling**: Enhanced navigation with smooth scroll effects
- **Performance Optimized**: Fast loading with lazy loading and optimized assets
- **SEO Ready**: Proper meta tags and structured markup

## 🛠️ Tech Stack

- **HTML5**: Semantic markup with accessibility features
- **CSS3**: Modern styling with CSS Grid, Flexbox, and animations
- **Vanilla JavaScript**: No frameworks, pure performance
- **YouTube API**: Embedded video integration

## 📁 Project Structure

```
ai-assisted-engineering/
├── index.html          # Main landing page
├── styles.css          # All styling and responsive design
├── script.js           # Interactive functionality
├── config.js           # Video configuration (easily editable)
├── README.md           # This file
├── .github/
│   └── workflows/
│       └── deploy.yml  # GitHub Actions deployment
└── CNAME               # Custom domain configuration (optional)
```

## 🎥 Video Configuration

To update the video gallery, edit the `config.js` file:

```javascript
const videoConfig = [
    {
        id: "YOUR_YOUTUBE_VIDEO_ID",           // YouTube video ID from URL
        title: "Your Video Title",             // Display title
        description: "Video description...",   // Brief description
        thumbnail: "https://img.youtube.com/vi/YOUR_VIDEO_ID/maxresdefault.jpg"
    },
    // Add more videos...
];
```

### How to get YouTube Video ID:
From a YouTube URL like `https://www.youtube.com/watch?v=dQw4w9WgXcQ`, the video ID is `dQw4w9WgXcQ`.

## 🚀 Local Development

1. **Clone or download** the project files
2. **Open** `index.html` in your browser, or
3. **Serve locally** using a simple HTTP server:

```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (if you have http-server installed)
npx http-server

# Using PHP
php -S localhost:8000
```

4. **Visit** `http://localhost:8000` in your browser

## 📦 Deployment to GitHub Pages

### Method 1: GitHub Actions (Recommended)

1. **Create a new repository** on GitHub
2. **Push your code** to the repository:
```bash
git init
git add .
git commit -m "Initial commit: AI-assisted engineering landing page"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

3. **Enable GitHub Pages**:
   - Go to repository Settings → Pages
   - Source: "GitHub Actions"
   - The deployment workflow will run automatically

4. **Access your site** at: `https://YOUR_USERNAME.github.io/YOUR_REPO/`

### Method 2: Direct Deployment

1. **Push code** to your repository
2. **Go to Settings** → Pages
3. **Select source**: "Deploy from a branch"
4. **Choose branch**: `main` and folder `/ (root)`
5. **Save** and wait for deployment

## 🎨 Customization

### Colors and Branding
Edit the CSS custom properties in `styles.css`:

```css
:root {
    --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    --background-dark: #0a0a0a;
    --text-primary: #ffffff;
    --text-secondary: #b3b3b3;
}
```

### Content Updates
- **Hero section**: Edit text in `index.html` hero section
- **About section**: Update features and descriptions
- **Footer**: Add your contact information or social links

### Adding More Videos
Simply add more objects to the `videoConfig` array in `config.js`. The layout will automatically adjust.

## 🔧 Advanced Configuration

### Custom Domain
1. Add a `CNAME` file with your domain name
2. Configure DNS settings with your domain provider
3. Update GitHub Pages settings to use custom domain

### Analytics Integration
Add Google Analytics or other tracking by including the script in `index.html`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## 🐛 Troubleshooting

### Videos Not Loading
- Check that YouTube video IDs are correct
- Ensure videos are public and embeddable
- Verify thumbnail URLs are accessible

### Deployment Issues
- Check that all files are committed and pushed
- Verify GitHub Pages is enabled in repository settings
- Check GitHub Actions tab for deployment status

### Performance Issues
- Optimize images before adding them
- Consider using a CDN for better global performance
- Enable browser caching with proper headers

## 📱 Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

**Built with ❤️ for the AI development community**
