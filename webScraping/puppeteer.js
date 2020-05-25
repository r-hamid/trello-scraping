// All required libraries
const cheerio = require("cheerio");
// const puppeteer = require("puppeteer");

const scraping = (url) => {
	let puppeteer = require("puppeteer");
	const puppeteerPromise = new Promise( (resolve, reject) => {

		puppeteer
      .launch()
      .then(browser => browser.newPage())
      .then( async(page) => {
				await page.setDefaultNavigationTimeout(50000);
        return await page.goto(url).then(function() {
          return page.content();
        });
			})
			.then( page => {
				const json = { title: "", picture: "", price: "", description: "", release: "", customerName: "" };
				const $ = cheerio.load(page);
				let html = $("#page-layout > div.content-cover > div.content-inner > div.transcluded-content > div.ng-scope > div.property-detail > div.content > div > div.ng-isolate-scope:nth-child(1) > div.answer-form > div.contacts").html();
				// console.log(html);
				// extracting data
				// $(".property-title").filter(function() {
				// 	var data = $(this);
				// 	var title = data.children().first().text().trim();
				// 	title = title.replace(/\n/g, "");
				// 	title = title.replace(/\t/g, "");
				// 	json.title = title;
	
				// 	var price = $(".property-title > span.price > span.norm-price").text();
				// 	price = price.replace(/\n/g, "");
				// 	price = price.replace(/\t/g, "");
				// 	json.price = price;
				// });
				// $(".description > p").filter(function() {
				// 	var desc = $(this).text().trim();
				// 	json.description = desc;
				// });
				// $("div.gallery > div.detail-images").filter(function() {
				// 	console.log("Not a fucking clue");
				// 	// var image = $(this).attr("src");
				// 	// json.picture = image;
				// 	// https.request(image, function(response) {
				// 	// 	var data = new Stream();
				// 	// 	response.on('data', (chunk) => {
				// 	// 		data.push(chunk);
				// 	//  	});
				// 	// 	response.on('end', () => {
				// 	// 		fs.writeFileSync("public/images/image.jpg", data.read());
				// 	// 	});
				// 	// }).end();
				// 	// json.picture = "public/images/image.jpg";
				// });
				// $(".params > ul.params1 > li:nth-child(4)").filter(function() {
				// 	var data = $(this).children().last().text().trim();
				// 	json.release = data;
				// });
				$(".ng-isolate-scope[answer-form='resource']").filter(function() {
					var data = $($(this)+" > div.answer-form > div.contacts > div.seller-contact");
					let name = data.children().find(".seller-name > a.link.name").text();
					json.customerName = name;
				});

				resolve(json);
			});

	});

	return puppeteerPromise.then( json => {
		puppeteer = null;
		return json;
	});

}

module.exports = {
  scraping: scraping
}