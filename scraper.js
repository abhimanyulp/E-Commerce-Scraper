const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const zlib = require('zlib');
const ndjson = require('ndjson');

class AmazonScraper {
  constructor() {
    // Base URL for Amazon India
    this.baseUrl = 'https://www.amazon.in/s?k=laptops';
    // Output file for storing scraped data
    this.outputFile = 'laptops.ndjson.gz';
  }

  // Method to scrape detailed information of a laptop from its product page
  async scrapeLaptopData(url) {
    try {
      const response = await axios.get(url);
      const $ = cheerio.load(response.data);

      // Extracting data
      const skuId = $('span[data-asin]').attr('data-asin');
      const productName = $('span[id="productTitle"]').text().trim();
      const productTitle = $('span[id="productTitle"]').text().trim();
      const description = $('#productDescription p').text().trim();
      const category = $('span[class="a-list-item"]').first().text().trim();
      const mrp = $('#price .priceBlockStrikePriceString').text().trim();
      const sellingPrice = $('#priceblock_ourprice').text().trim();
      const discount = $('#regularprice_savings .priceBlockSavingsString').text().trim();
      const weight = $('th:contains("Weight")').next().text().trim();
      const brandName = $('th:contains("Brand")').next().text().trim();
      const imageUrl = $('#landingImage').attr('data-old-hires');
      const laptopSpecification = $('div[class*="techD"]').text().trim();

      return {
        skuId,
        productName,
        productTitle,
        description,
        category,
        mrp,
        sellingPrice,
        discount,
        weight,
        brandName,
        imageUrl,
        laptopSpecification
      };
    } catch (error) {
      console.error('Error scraping laptop data:', error);
      return {};
    }
  }

  // Method to scrape laptops from the search results page
  async scrapeLaptops(url) {
    try {
      const response = await axios.get(url);
      const $ = cheerio.load(response.data);

      const laptopUrls = [];
      // Find laptop elements and extract URLs
      $('div[data-component-type="s-search-result"]').each((index, element) => {
        const url = $(element).find('a.a-link-normal').attr('href');
        if (url) {
          laptopUrls.push(this.baseUrl + url);
        }
      });

      const laptopsData = [];
      // Iterate through each laptop URL and scrape detailed data
      for (const url of laptopUrls) {
        const laptopData = await this.scrapeLaptopData(url);
        if (Object.keys(laptopData).length !== 0) {
          laptopsData.push(laptopData);
        }
      }

      return laptopsData;
    } catch (error) {
      console.error('Error scraping laptops:', error);
      return [];
    }
  }

  // Method to save scraped data to a file
  async saveToFile(laptops) {
    const outputStream = fs.createWriteStream(this.outputFile);
    const gzip = zlib.createGzip();
    const jsonStream = ndjson.stringify();

    jsonStream.pipe(gzip).pipe(outputStream);

    laptops.forEach(laptop => jsonStream.write(laptop));

    jsonStream.end(() => console.log('Scraping completed'));
  }

  // Method to execute the scraping process
  async run() {
    const url = 'https://www.amazon.in/s?k=laptops';
    const laptops = await this.scrapeLaptops(url);
    await this.saveToFile(laptops);
  }
}

// Usage
const scraper = new AmazonScraper();
scraper.run();
