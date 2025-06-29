// Main JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    initializeSiteContent();
    initializeVideoGrid();
    updateVideosSection();
    initializeSmoothScrolling();
    initializeModal();
    initializeAnimations();
});

// Initialize site content from configuration
function initializeSiteContent() {
    if (typeof siteConfig === 'undefined') {
        console.warn('Site configuration not loaded, using default content');
        return;
    }

    // Update meta tags
    document.title = siteConfig.meta.title;
    updateMetaTag('description', siteConfig.meta.description);
    updateMetaTag('keywords', siteConfig.meta.keywords);
    updateMetaTag('author', siteConfig.meta.author);
    
    // Update Open Graph tags
    updateMetaTag('og:title', siteConfig.meta.title, 'property');
    updateMetaTag('og:description', siteConfig.meta.description, 'property');
    updateMetaTag('og:url', siteConfig.meta.url, 'property');
    
    // Update Twitter Card tags
    updateMetaTag('twitter:title', siteConfig.meta.title);
    updateMetaTag('twitter:description', siteConfig.meta.description);

    // Update navigation
    updateNavigation();
    
    // Update hero section
    updateHeroSection();
    
    // Update about section
    updateAboutSection();
    
    // Update footer
    updateFooter();
}

// Helper function to update meta tags
function updateMetaTag(name, content, attribute = 'name') {
    let meta = document.querySelector(`meta[${attribute}="${name}"]`);
    if (meta) {
        meta.setAttribute('content', content);
    } else {
        meta = document.createElement('meta');
        meta.setAttribute(attribute, name);
        meta.setAttribute('content', content);
        document.head.appendChild(meta);
    }
}

// Update navigation content
function updateNavigation() {
    const brandElement = document.querySelector('.navbar-brand');
    if (brandElement && siteConfig.nav.brand) {
        brandElement.textContent = siteConfig.nav.brand;
    }
    
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    siteConfig.nav.links.forEach((link, index) => {
        if (navLinks[index]) {
            navLinks[index].textContent = link.text;
            navLinks[index].setAttribute('href', link.href);
        }
    });
}

// Update hero section content
function updateHeroSection() {
    const titleElement = document.querySelector('.hero-title');
    const subtitleElement = document.querySelector('.hero-subtitle');
    const primaryBtn = document.querySelector('.btn-primary');
    const secondaryBtn = document.querySelector('.btn-outline-light');
    
    if (titleElement) {
        titleElement.innerHTML = `${siteConfig.hero.title} <span class="gradient-text">${siteConfig.hero.titleHighlight}</span>`;
    }
    
    if (subtitleElement) {
        subtitleElement.textContent = siteConfig.hero.subtitle;
    }
    
    if (primaryBtn) {
        primaryBtn.textContent = siteConfig.hero.primaryButton.text;
        primaryBtn.setAttribute('href', siteConfig.hero.primaryButton.href);
    }
    
    if (secondaryBtn) {
        secondaryBtn.textContent = siteConfig.hero.secondaryButton.text;
        secondaryBtn.setAttribute('href', siteConfig.hero.secondaryButton.href);
    }
    
    // Update code snippet
    const codeElement = document.querySelector('.code-snippet code');
    if (codeElement && siteConfig.hero.codeSnippet) {
        const codeContent = [
            siteConfig.hero.codeSnippet.comment,
            ...siteConfig.hero.codeSnippet.lines
        ].join('\n');
        codeElement.textContent = codeContent;
    }
}

// Update about section content
function updateAboutSection() {
    const aboutTitle = document.querySelector('#about h2');
    const aboutSubtitle = document.querySelector('#about .section-subtitle');
    
    if (aboutTitle) {
        aboutTitle.textContent = siteConfig.about.title;
    }
    
    if (aboutSubtitle) {
        aboutSubtitle.textContent = siteConfig.about.subtitle;
    }
    
    // Update features
    const featureCards = document.querySelectorAll('.feature-card');
    siteConfig.about.features.forEach((feature, index) => {
        if (featureCards[index]) {
            const icon = featureCards[index].querySelector('.feature-icon');
            const title = featureCards[index].querySelector('h4');
            const description = featureCards[index].querySelector('p');
            
            if (icon) icon.textContent = feature.icon;
            if (title) title.textContent = feature.title;
            if (description) description.textContent = feature.description;
        }
    });
    
    // Update stats
    const statNumbers = document.querySelectorAll('.stat-number');
    const statLabels = document.querySelectorAll('.stat-label');
    
    siteConfig.about.stats.forEach((stat, index) => {
        if (statNumbers[index]) statNumbers[index].textContent = stat.number;
        if (statLabels[index]) statLabels[index].textContent = stat.label;
    });
}

// Update footer content
function updateFooter() {
    const footerBrand = document.querySelector('.footer-brand h5');
    const footerTagline = document.querySelector('.footer-brand p');
    const copyright = document.querySelector('.footer-bottom p');
    
    if (footerBrand) {
        footerBrand.textContent = siteConfig.footer.brand.name;
    }
    
    if (footerTagline) {
        footerTagline.textContent = siteConfig.footer.brand.tagline;
    }
    
    if (copyright) {
        copyright.innerHTML = `${siteConfig.footer.copyright}<br><small class="text-muted">${siteConfig.footer.builtWith}</small>`;
    }
    
    // Update footer sections
    const footerSections = document.querySelectorAll('.footer-section');
    siteConfig.footer.sections.forEach((section, index) => {
        if (footerSections[index]) {
            const title = footerSections[index].querySelector('h6');
            const linksList = footerSections[index].querySelector('ul');
            
            if (title) {
                title.textContent = section.title;
            }
            
            if (linksList) {
                linksList.innerHTML = '';
                section.links.forEach(link => {
                    const li = document.createElement('li');
                    const a = document.createElement('a');
                    a.href = link.href;
                    a.textContent = link.text;
                    a.className = 'text-light text-decoration-none';
                    li.appendChild(a);
                    linksList.appendChild(li);
                });
            }
        }
    });
}

// Update videos section title
function updateVideosSection() {
    const videosTitle = document.querySelector('#videos h2');
    const videosSubtitle = document.querySelector('#videos .section-subtitle');
    
    if (videosTitle && siteConfig.videos) {
        videosTitle.textContent = siteConfig.videos.title;
    }
    
    if (videosSubtitle && siteConfig.videos) {
        videosSubtitle.textContent = siteConfig.videos.subtitle;
    }
}

// Video Grid Initialization
function initializeVideoGrid() {
    const videoGrid = document.getElementById('videoGrid');
    
    if (!videoGrid || !videoConfig) {
        console.error('Video grid or config not found');
        return;
    }

    // Clear existing content
    videoGrid.innerHTML = '';

    // Generate video cards
    videoConfig.forEach((video, index) => {
        const videoCard = createVideoCard(video, index);
        videoGrid.appendChild(videoCard);
    });
}

// Create individual video card
function createVideoCard(video, index) {
    const card = document.createElement('div');
    card.className = 'video-card';
    card.setAttribute('data-video-id', video.id);
    
    // Add staggered animation delay
    card.style.animationDelay = `${index * 0.1}s`;
    
    card.innerHTML = `
        <div class="video-thumbnail">
            <img src="${video.thumbnail}" alt="${video.title}" loading="lazy">
            <div class="play-button"></div>
        </div>
        <div class="video-info">
            <h3 class="video-title">${video.title}</h3>
            <p class="video-description">${video.description}</p>
        </div>
    `;

    // Add click event listener
    card.addEventListener('click', () => openVideoModal(video));
    
    return card;
}

// Smooth Scrolling for Navigation Links
function initializeSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed nav
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Hero CTA button smooth scroll
    const heroButton = document.querySelector('.btn-primary');
    if (heroButton) {
        heroButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetSection = document.querySelector('#videos');
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    }
}

// Modal Functionality
function initializeModal() {
    const modal = document.getElementById('videoModal');
    const modalClose = document.querySelector('.modal-close');
    const modalIframe = document.getElementById('modalIframe');

    // Close modal when clicking the X
    if (modalClose) {
        modalClose.addEventListener('click', closeVideoModal);
    }

    // Close modal when clicking outside
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeVideoModal();
            }
        });
    }

    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            closeVideoModal();
        }
    });
}

// Open video modal
function openVideoModal(video) {
    const modal = document.getElementById('videoModal');
    const modalIframe = document.getElementById('modalIframe');
    
    if (modal && modalIframe) {
        // Set iframe source to YouTube embed URL
        const embedUrl = `https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0`;
        modalIframe.src = embedUrl;
        
        // Show modal
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
        
        // Add fade-in animation
        setTimeout(() => {
            modal.style.opacity = '1';
        }, 10);
    }
}

// Close video modal
function closeVideoModal() {
    const modal = document.getElementById('videoModal');
    const modalIframe = document.getElementById('modalIframe');
    
    if (modal && modalIframe) {
        // Stop video playback
        modalIframe.src = '';
        
        // Hide modal
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Restore scrolling
        modal.style.opacity = '0';
    }
}

// Initialize Animations and Scroll Effects
function initializeAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.video-card, .feature, .stat');
    animateElements.forEach(el => {
        observer.observe(el);
    });

    // Navbar background on scroll
    window.addEventListener('scroll', handleNavbarScroll);
}

// Handle navbar background change on scroll
function handleNavbarScroll() {
    const nav = document.querySelector('.nav');
    const scrollY = window.scrollY;
    
    if (scrollY > 50) {
        nav.style.background = 'rgba(10, 10, 10, 0.98)';
        nav.style.backdropFilter = 'blur(20px)';
    } else {
        nav.style.background = 'rgba(10, 10, 10, 0.95)';
        nav.style.backdropFilter = 'blur(10px)';
    }
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Performance optimization for scroll events
const debouncedNavbarScroll = debounce(handleNavbarScroll, 10);
window.addEventListener('scroll', debouncedNavbarScroll);

// Error handling for missing elements
function safeQuerySelector(selector) {
    const element = document.querySelector(selector);
    if (!element) {
        console.warn(`Element not found: ${selector}`);
    }
    return element;
}

// Analytics tracking (placeholder for future implementation)
function trackVideoPlay(videoId, videoTitle) {
    // Placeholder for analytics tracking
    console.log(`Video played: ${videoTitle} (ID: ${videoId})`);
    
    // Example: Google Analytics event tracking
    // gtag('event', 'video_play', {
    //     'video_title': videoTitle,
    //     'video_id': videoId
    // });
}

// Add CSS animations dynamically
const style = document.createElement('style');
style.textContent = `
    .video-card {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s ease;
    }
    
    .video-card.animate-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    .feature {
        opacity: 0;
        transform: translateX(-30px);
        transition: all 0.6s ease;
    }
    
    .feature.animate-in {
        opacity: 1;
        transform: translateX(0);
    }
    
    .stat {
        opacity: 0;
        transform: scale(0.8);
        transition: all 0.6s ease;
    }
    
    .stat.animate-in {
        opacity: 1;
        transform: scale(1);
    }
    
    .modal {
        opacity: 0;
        transition: opacity 0.3s ease;
    }
`;
document.head.appendChild(style);
