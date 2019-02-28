// const rp = require("request-promise");
// const $ = require("cheerio");
// const url =
//   "https://www.cvs.com/shop/vitamins?WT.ac=SHOP-HOME-CATNAV-SLOT1-VITAMINS";

// rp(url)
//   .then(function(html) {
//     //success!
//     console.log(html);
//   })
//   .catch(function(err) {
//     //handle error
//     console.log(err);
//   });

// const rp = require("request-promise");
// const $ = require("cheerio");
// const url =
//   "https://en.wikipedia.org/wiki/List_of_Presidents_of_the_United_States";

// rp(url)
//   .then(function(html) {
//     //success!
//     const wikiUrls = [];
//     for (let i = 0; i < 45; i++) {
//       wikiUrls.push($("big > a", html)[i].attribs.href);
//     }
//     console.log(wikiUrls);
//   })
//   .catch(function(err) {
//     //handle error
//   });

const rp = require("request-promise");
var cheerio = require("cheerio"); // Basically jQuery for node.js

var options = {
  uri: "http://www.google.com",
  transform: function(body) {
    return cheerio.load(body);
  }
};

rp(options)
  .then(function($) {
    // Process html like you would with jQuery...
    console.log("options", options);
  })
  .catch(function(err) {
    // Crawling failed or Cheerio choked...
    console.log(err);
  });
