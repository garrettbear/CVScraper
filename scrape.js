const puppeteer = require("puppeteer");

(async () => {
  //Get Partners on Page and check if there are more on next page
  const extractPartners = async url => {
    const page = await browser.newPage();
    await page.goto(url);
    console.log(`Scraping Page: ${url}`);

    // scrape data
    const partnersOnPage = await page.evaluate(() =>
      Array.from(document.querySelectorAll("div.compact")).map(compact => ({
        title: compact.querySelector("h3.title").innerText.trim(),
        logo: compact.querySelector(".logo img").src
      }))
    );

    await page.close();

    // Recursive
    if (partnersOnPage.length < 10) {
      console.log(`End Recursion: ${url}`);
      // If no items on page end recursive item
      return partnersOnPage;
    } else {
      // get next page
      const nextPageNumber = parseInt(url.match(/page=(\d+)$/)[1], 10) + 1;
      const nextUrl = `https://marketingplatform.google.com/about/partners/find-a-partner?page=${nextPageNumber}`;
      return partnersOnPage.concat(await extractPartners(nextUrl));
    }
  };
  const browser = await puppeteer.launch();
  const firstUrl =
    "https://marketingplatform.google.com/about/partners/find-a-partner?page=48";

  const partners = await extractPartners(firstUrl);
  console.log(partners);

  await browser.close();
})();
