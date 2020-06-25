// Required Libraries
const cheerio = require("cheerio");
const Nightmare = require("nightmare");

const scraping = (url) => {

	// All scraping will be done here
	let nightmare = new Nightmare({show: false});
	const nightmarePromise = new Promise( (resolve, reject) => {
		nightmare
			.goto(url)
			.wait(".sirka")
			.evaluate(() => {
				let html = document.querySelector(".sirka > table > tbody > tr > td[width='*']").innerHTML;
				return html;
			})
			.end()
			.then(response => {
				const html = response;
				var $ = cheerio.load(html);
				var json = { title: "", picture: "", price: "", description: "", customer: { name: "", email: "", phone: "" } };

				// extracting data
				$("table.listainzerat > tbody > tr > td > h1.nadpis").filter(function() {
					var title = $(this).text();
					json.title = title;
				});
				$("table:nth-of-type(2) > tbody > tr > td > div.popis").filter(function() {
					var desc = $(this).text().trim();
					json.description = desc;
				});
				$(".fliobal > div.carousel.flickity-enabled > div.flickity-viewport > div.flickity-slider > div.carousel-cell.is-selected > img").filter(function() {
					var image = $(this).attr("src");
					json.picture = image;
				});
				$("table:nth-of-type(3) > tbody > tr > td.listadvlevo > table > tbody > tr:last-of-type").filter(function() {
					var price = $(this).text().trim();
					json.price = price.split(":")[1].trim();
				});
				$("table:nth-of-type(3) > tbody > tr > td.listadvlevo > table > tbody > tr:first-of-type").filter(function() {
					var customerName = $(this).text().trim();
					json.customer.name = customerName.split(":")[1];
				});

				resolve(json);
			}).catch(err => {
				console.log(err.message);
				resolve("");
			});
	});

	return nightmarePromise.then( (jsonObj) => {
		nightmare = null;
		return jsonObj;
	});
	
}

module.exports = {
  scraping: scraping
}