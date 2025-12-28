// Events Configuration
// Conference and event information
// Add your upcoming speaking engagements and events here

const eventsConfig = [
    {
        "name": "Jfokus 2026",
        "link": "https://www.jfokus.se/",
        "country": "Sweden",
        "countryCode": "SE",
        "flag": "🇸🇪",
        "date": "2026-02-02",
        "displayDate": "February 2-4, 2026",
        "city": "Stockholm"
    },
    {
        "name": "DevNexus 2026",
        "link": "https://devnexus.com/",
        "country": "United States",
        "countryCode": "US",
        "flag": "🇺🇸",
        "date": "2026-03-04",
        "displayDate": "March 4-6, 2026",
        "city": "Atlanta"
    }
];

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = eventsConfig;
}
