const puppeteer = require("puppeteer");
const fs = require("fs");

(async () => {
  //Get Partners on Page and check if there are more on next page
  const extractPartners = async url => {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2" });
    console.log(`Scraping Page: ${url}`);

    // scrape data
    const partnersOnPage = await page.evaluate(() =>
      Array.from(
        document.querySelectorAll("gb-product div.gbcvs-c-productTile__content")
      ).map(compact => ({
        productTitle: compact
          .querySelector(
            "div.gbcvs-c-productTile__title a.gbcvs-c-productTile__link"
          )
          .innerText.trim(),
        price: compact
          .querySelector("div.gbcvs-c-productTilePrice__actual")
          .innerText.trim()
      }))
    );

    await page.close();

    const nextPageNumber = parseInt(url.match(/page=(\d+)$/)[1], 10) + 1;
    const nextUrl = `https://www.cvs.com/shop/all?page=${nextPageNumber}`;
    if (nextPageNumber < 25) {
      fs.readFile("results.json", function(err, data) {
        var json = JSON.parse(data);
        json.push(partnersOnPage);
        if (err) console.log(err);
        fs.writeFile("results.json", JSON.stringify(json), function(err) {
          if (err) throw err;
          console.log("Data Added");
        });
      });

      return partnersOnPage.concat(await extractPartners(nextUrl));
    } else {
      fs.readFile("results.json", function(err, data) {
        var json = JSON.parse(data);
        json.push(partnersOnPage);
        if (err) console.log(err);
        fs.writeFile("results.json", JSON.stringify(json), function(err) {
          if (err) throw err;
          console.log("End of Data Added");
        });
      });
      return partnersOnPage;
    }
  };
  const browser = await puppeteer.launch();
  const firstUrl = "https://www.cvs.com/shop/all?page=1";

  const partners = await extractPartners(firstUrl);
  console.log(partners);

  await browser.close();
})();
