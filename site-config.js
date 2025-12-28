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
            { text: "Experts", href: "#experts" },
            { text: "Events", href: "#events" },
            { text: "About", href: "#about" }
        ]
    },

    // Hero section
    hero: {
        title: "Master AI-Assisted",
        titleHighlight: "Engineering",
        subtitle: "Join thousands of developers who've already transformed their workflow. Learn the tools, techniques, and strategies that are reshaping software development in 2025.",
        description: "From GitHub Copilot to Windsurf and Cursor, master the AI tools that are becoming essential for modern development. Get hands-on tutorials, real-world examples, and expert insights.",
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

    // Why AI section (new)
    whyAI: {
        title: "Why AI-Assisted Engineering Matters",
        subtitle: "The development landscape is evolving rapidly. Stay ahead of the curve.",
        content: [
            {
                stat: "73%",
                description: "of developers report increased productivity with AI coding assistants"
            },
            {
                stat: "40%",
                description: "reduction in time spent on repetitive coding tasks"
            },
            {
                stat: "2025",
                description: "is the year AI becomes essential for competitive development"
            }
        ],
        callout: "Don't get left behind. The future of software development is AI-assisted, and the time to adapt is now."
    },

    // About section
    about: {
        title: "Master the Tools That Matter",
        subtitle: "From beginner-friendly introductions to advanced techniques, we cover it all",
        features: [
            {
                icon: "🚀",
                title: "Accelerate Development",
                description: "Cut development time in half with intelligent code suggestions, automated refactoring, and context-aware completions that understand your entire codebase."
            },
            {
                icon: "🧠",
                title: "Intelligent Problem Solving",
                description: "Get instant solutions to complex coding challenges. AI assistants analyze your code, suggest optimizations, and help debug issues before they become problems."
            },
            {
                icon: "📚",
                title: "Learn While You Code",
                description: "Discover new patterns, best practices, and modern techniques through AI recommendations. Turn every coding session into a learning opportunity."
            },
            {
                icon: "🔧",
                title: "Tool Mastery",
                description: "Master GitHub Copilot, Windsurf, Cursor, and other cutting-edge AI development tools through hands-on tutorials and real-world examples."
            },
            {
                icon: "⚡",
                title: "Instant Expertise",
                description: "Access expert-level knowledge instantly. Whether you're working with new frameworks or debugging complex systems, AI assistance levels the playing field."
            },
            {
                icon: "🎯",
                title: "Focus on What Matters",
                description: "Spend less time on boilerplate code and more time on creative problem-solving. Let AI handle the routine while you focus on innovation."
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

    // Meet the experts section (new)
    meetExperts: {
        title: "Meet the Experts",
        subtitle: "Learn from industry leaders who are shaping the future of AI-assisted development",
        experts: [
            {
                name: "Viktor Gamov",
                title: "Principal Developer Advocate",
                company: "Confluent",
                location: "New York City, NY",
                photo: "https://avatars.githubusercontent.com/u/433085?v=4",
                bio: "Viktor Gamov is a Principal Developer Advocate at Confluent, founded by the original creators of Apache Kafka®. With a rich background in implementing and advocating for distributed systems and cloud-native architectures, Viktor excels in open-source technologies. As a Java Champion and esteemed speaker, Viktor is known for his insightful presentations at top industry events like JavaOne, Devoxx, Kafka Summit, and QCon.",
                expertise: ["Distributed Systems", "Real-time Data Streaming", "JVM", "DevOps", "Apache Kafka"],
                achievements: [
                    "Java Champion",
                    "Co-author of «Enterprise Web Development»",
                    "Co-author of «Apache Kafka® in Action»",
                    "Speaker at JavaOne, Devoxx, Kafka Summit, QCon"
                ],
                social: {
                    twitter: "@gamussa",
                    sessionize: "https://sessionize.com/vikgamov/",
                    github: "https://github.com/gAmUssA"
                }
            },
            {
                name: "Baruch Sadogursky",
                title: "Head of DevRel",
                company: "TuxCare",
                location: "Nashville, TN",
                photo: "https://avatars.githubusercontent.com/u/247332?v=4",
                bio: "Baruch Sadogursky did Java before it had generics, DevOps before there was Docker, and DevRel before it had a name. He started DevRel at JFrog when it was ten people and took it all the way to a successful $6B IPO by helping engineers solve problems. He is a co-author of 'Liquid Software' and 'DevOps Tools for Java Developers' books.",
                expertise: ["DevOps", "Java Development", "Developer Relations", "Cloud Native", "Kubernetes"],
                achievements: [
                    "Java Champion",
                    "CNCF Ambassador Alumni",
                    "Co-author of «Liquid Software»",
                    "Co-author of «DevOps Tools for Java Developers»",
                    "Speaker at DevNexus, Devoxx, KubeCon, QCon"
                ],
                social: {
                    twitter: "@jbaruch",
                    sessionize: "https://sessionize.com/jbaruch/",
                    github: "https://github.com/jbaruch"
                }
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
