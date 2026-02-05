const axios = require('axios');
const cheerio = require('cheerio');

async function testScrape() {
    try {
        const response = await axios.get('https://www.privateproperty.ng/land-for-sale', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        const $ = cheerio.load(response.data);

        // Find the first property container
        const firstProp = $('.similar-listings-item, .listing-property, div[id^="property-"]').first();
        console.log("HTML OF FIRST PROPERTY:");
        console.log(firstProp.html());

    } catch (error) {
        console.error("Scrape failed:", error.message);
    }
}

testScrape();
