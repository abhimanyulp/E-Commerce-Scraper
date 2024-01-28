# E-Commerce-Scraper

- Overall Approach and Methodology:
Created an AmazonScraper class to encapsulate the scraping logic.
Implemented methods to scrape laptops from the search results page and detailed information from individual product pages.
Ensured error handling to gracefully handle cases where data extraction fails.
Saved the scraped data to a compressed ndjson file.

- Challenges Faced:
Ensuring robustness in data extraction due to variations in the page structure.
Handling errors encountered during the scraping process.

- Improvements or Optimizations:
Implementing retry mechanisms for failed requests to enhance robustness.
Enhancing error handling to provide more detailed logging and troubleshooting information.
Incorporating caching mechanisms to avoid unnecessary requests for previously scraped data.
Adding support for asynchronous processing to improve scraping efficiency.

Overall, the scraper successfully extracts laptop data from Amazon India, handling variations in page structure and ensuring data quality through quality control measures.