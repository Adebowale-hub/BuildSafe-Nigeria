const axios = require('axios');
const cheerio = require('cheerio');

async function testScrape() {
    try {
        console.log("Fetching land listings...");
        const response = await axios.get('https://www.privateproperty.ng/land-for-sale', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        const $ = cheerio.load(response.data);
        const properties = [];

        // Based on typical privateproperty.ng structure
        $('.similar-listings-item, .listing-property, div[id^="property-"], .result-card').each((i, el) => {
            const title = $(el).find('h2, .title, .listing-title').text().trim();
            const price = $(el).find('.price, .listing-price').text().trim();
            const location = $(el).find('.location, .listing-location, .region').text().trim();
            const image = $(el).find('img').attr('data-src') || $(el).find('img').attr('src');

            if (title) {
                properties.push({ title, price, location, image });
            }
        });

        if (properties.length === 0) {
            // Try another attempt if generic classes fail
            $('.listing-card').each((i, el) => {
                const title = $(el).find('.title').text().trim();
                properties.push({ title });
            });
        }

        console.log("Found", properties.length, "properties.");
        console.log("Sample Data:", properties.slice(0, 3));

    } catch (error) {
        console.error("Scrape failed:", error.message);
    }
}

testScrape();
