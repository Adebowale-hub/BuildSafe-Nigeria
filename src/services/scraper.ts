import axios from 'axios';
import * as cheerio from 'cheerio';
import { supabaseAdmin } from '@/lib/supabase-admin';

export interface ScrapedLand {
    title: string;
    description: string;
    location: string;
    price_per_plot: number;
    image_url: string;
    external_url: string;
}

export class LandScraperService {
    private static BASE_URL = 'https://www.privateproperty.ng/land-for-sale';
    private static USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36';

    static async scrapeLatestLands(pages: number = 1): Promise<ScrapedLand[]> {
        const allLands: ScrapedLand[] = [];

        for (let i = 1; i <= pages; i++) {
            const url = i === 1 ? this.BASE_URL : `${this.BASE_URL}?page=${i}`;
            try {
                const { data } = await axios.get(url, {
                    headers: { 'User-Agent': this.USER_AGENT }
                });

                const $ = cheerio.load(data);

                $('.similar-listings-item').each((_, el) => {
                    const title = $(el).find('h2 a').text().trim() || $(el).find('.media-body a').first().text().trim();
                    const priceText = $(el).find('.similar-listings-price h4 span').last().text().replace(/,/g, '').trim();
                    const price = parseFloat(priceText) || 0;
                    const location = $(el).find('.media-body p').first().text().trim();
                    const description = $(el).find('.media-body p').last().text().trim();
                    const imageUrl = $(el).find('img').attr('data-src') || $(el).find('img').attr('src') || '';
                    const externalUrl = 'https://www.privateproperty.ng' + ($(el).find('a').attr('href') || '');

                    if (title && price > 0) {
                        allLands.push({
                            title,
                            description,
                            location,
                            price_per_plot: price,
                            image_url: imageUrl,
                            external_url: externalUrl
                        });
                    }
                });
            } catch (error) {
                console.error(`Error scraping page ${i}:`, error);
            }
        }

        return allLands;
    }

    static async syncWithSupabase() {
        const scrapedData = await this.scrapeLatestLands(1);

        if (scrapedData.length === 0) return { success: false, message: 'No data scraped' };

        const formattedData = scrapedData.map(land => ({
            title: land.title,
            description: land.description || land.title,
            location: land.location,
            price_per_plot: land.price_per_plot,
            image_urls: [land.image_url],
            total_plots: 1,
            available_plots: 1,
            owner_id: null // System imported
        }));

        const { error } = await supabaseAdmin
            .from('lands')
            .upsert(formattedData, { onConflict: 'title,location' });

        if (error) {
            console.error('Error syncing with Supabase:', error);
            return { success: false, error: error.message };
        }

        return { success: true, count: formattedData.length };
    }
}
