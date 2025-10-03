// Events Configuration
// Conference and event information
// Add your upcoming speaking engagements and events here

const eventsConfig = [
    {
        "name": "Devoxx Belgium 2025",
        "link": "https://devoxx.be",
        "country": "Belgium",
        "countryCode": "BE",
        "flag": "🇧🇪",
        "date": "2025-10-06",
        "displayDate": "October 6-10, 2025",
        "city": "Antwerp"
    },
    {
        "name": "Baselone 2025",
        "link": "https://baselone.org",
        "country": "Switzerland",
        "countryCode": "CH",
        "flag": "🇨🇭",
        "date": "2025-10-16",
        "displayDate": "October 16-18, 2025",
        "city": "Basel"
    },
    {
        "name": "DevFest Toulouse",
        "link": "https://devfesttoulouse.fr",
        "country": "France",
        "countryCode": "FR",
        "flag": "🇫🇷",
        "date": "2025-11-13",
        "displayDate": "November 13, 2025",
        "city": "Toulouse"
    },
    {
        "name": "AI By The Bay",
        "link": "https://ai.bythebay.io",
        "country": "United States",
        "countryCode": "US",
        "flag": "🇺🇸",
        "date": "2025-11-17",
        "displayDate": "November 17-19, 2025",
        "city": "San Francisco"
    }
];

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = eventsConfig;
}
