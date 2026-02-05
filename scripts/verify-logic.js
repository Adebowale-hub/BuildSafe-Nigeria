const axios = require('axios');
const cheerio = require('cheerio');

async function testLogic() {
    try {
        const url = 'https://www.privateproperty.ng/land-for-sale';
        const { data } = await axios.get(url, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36' }
        });

        const $ = cheerio.load(data);
        const lands = [];

        $('.similar-listings-item').each((_, el) => {
            const title = $(el).find('h2 a').text().trim() || $(el).find('.media-body a').first().text().trim();
            const priceText = $(el).find('.similar-listings-price h4 span').last().text().replace(/₦/g, '').replace(/,/g, '').trim();
            const location = $(el).find('.media-body p').first().text().trim();
            const img = $(el).find('img').attr('data-src') || $(el).find('img').attr('src');

            if (title) lands.push({ title, priceText, location, img });
        });

        console.log("LOGIC TEST FOUND:", lands.length);
        if (lands.length > 0) {
            console.log("FIRST LAND:", lands[0]);
        }
    } catch (e) {
        console.error(e);
    }
}

testLogic();
