// Site Configuration
// All text content for the AI-Assisted Engineering landing page
// Edit this file to customize your site's content

const siteConfig = {
    // Site metadata
    meta: {
        title: "AI-Assisted Engineering",
        description: "Master AI-powered development tools and techniques. Learn GitHub Copilot, Windsurf, Cursor, and more through expert tutorials and hands-on examples.",
        keywords: "AI development, GitHub Copilot, Windsurf IDE, Cursor AI, AI programming, machine learning, artificial intelligence, coding tools",
        author: "AI-Assisted Engineering",
        url: "https://ai-assisted.engineering"
    },

    // Navigation
    nav: {
        brand: "AI-Assisted Engineering",
        links: [
            { text: "Home", href: "#home" },
            { text: "Videos", href: "#videos" },
            { text: "Events", href: "#events" },
            { text: "About", href: "#about" }
        ]
    },

    // Hero section
    hero: {
        title: "Master AI-Assisted",
        titleHighlight: "Engineering",
        subtitle: "Unlock the power of AI development tools and transform your coding workflow with expert tutorials and hands-on examples.",
        primaryButton: {
            text: "Watch Tutorials",
            href: "#videos"
        },
        secondaryButton: {
            text: "Meet Us Live",
            href: "#events"
        },
        codeSnippet: {
            comment: "// AI-powered code generation",
            lines: [
                "const aiAssisted = new Developer({",
                "  tools: ['copilot', 'windsurf', 'cursor'],",
                "  productivity: 'exponential',",
                "  learning: 'accelerated'",
                "});"
            ]
        }
    },

    // Videos section
    videos: {
        title: "Featured Tutorials",
        subtitle: "Learn from expert developers and master AI-powered development tools"
    },

    // Events section
    events: {
        title: "Upcoming Events",
        subtitle: "Join us at these conferences and meetups around the world"
    },

    // About section
    about: {
        title: "Why AI-Assisted Engineering?",
        subtitle: "Transform your development workflow with intelligent tools and techniques",
        features: [
            {
                icon: "🚀",
                title: "Boost Productivity",
                description: "Accelerate your coding speed with AI-powered suggestions, auto-completion, and intelligent code generation."
            },
            {
                icon: "🧠",
                title: "Smart Assistance",
                description: "Get context-aware help, bug fixes, and optimization suggestions tailored to your specific codebase."
            },
            {
                icon: "📚",
                title: "Continuous Learning",
                description: "Stay updated with the latest AI development tools, techniques, and best practices through expert tutorials."
            }
        ],
        stats: [
            {
                number: "10x",
                label: "Faster Development"
            },
            {
                number: "90%",
                label: "Fewer Bugs"
            },
            {
                number: "50+",
                label: "AI Tools Covered"
            }
        ]
    },

    // Footer
    footer: {
        brand: {
            name: "AI-Assisted Engineering",
            tagline: "Empowering developers with AI-powered tools and techniques"
        },
        sections: [
            {
                title: "Resources",
                links: [
                    { text: "GitHub Copilot", href: "https://github.com/features/copilot" },
                    { text: "Windsurf IDE", href: "https://codeium.com/windsurf" },
                    { text: "Cursor AI", href: "https://cursor.sh" },
                    { text: "Documentation", href: "#" }
                ]
            },
            {
                title: "AI Tools",
                links: [
                    { text: "Code Generation", href: "#" },
                    { text: "Auto-completion", href: "#" },
                    { text: "Bug Detection", href: "#" },
                    { text: "Refactoring", href: "#" }
                ]
            },
            {
                title: "Community",
                links: [
                    { text: "Discord", href: "#" },
                    { text: "Twitter", href: "#" },
                    { text: "YouTube", href: "#" },
                    { text: "Blog", href: "#" }
                ]
            }
        ],
        copyright: "© 2025 AI-Assisted Engineering. All rights reserved.",
        builtWith: "Built by Viktor Gamov with ❤️ and AI assistance"
    }
};

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = siteConfig;
}
