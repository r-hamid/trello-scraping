// Required Libraries
const cheerio = require("cheerio");
const Nightmare = require("nightmare");

const scraping = (url) => {

	// All scraping will be done here
	let nightmare = new Nightmare({show: false});
	const nightmarePromise = new Promise( (resolve, reject) => {
		nightmare
			.goto(url)
			.wait("#wrap > div#detailSection")
			.evaluate(() => {
				console.log("Got here");
				let html = document.querySelector("#wrap > div#detailSection > div#detailSectionInside").innerHTML;
				return html;
			})
			.end()
			.then(response => {
				const html = response;
				var $ = cheerio.load(html);
				var json = { title: "", picture: "", price: "", description: "", customer: { name: "", email: "", phone: "" } };
				let baseURL = "https://www.hyperreality.cz";

				// extracting data
				$(".row > div.skyscraper-placeholder > h1.detail__title").filter(function() {
					var title = $(this).text();
					title = title.replace(/  +/g, " ");
					json.title = title;
				});
				$("#detail > div.forText > div.detail__text > p").filter(function() {
					var desc = $(this).text().trim();
					json.description = desc;
				});
				$(".detail__gallery__left > div#detail__carousel > div.carousel-inner > div.item:first-of-type > div > a").filter(function() {
					let image = $(this).attr("href");
					json.picture = baseURL + image;
				});
				$("#detail > div.forText > div.row > div.col-sm-8 > h2.detail__price").filter(function() {
					var price = $(this).text();
					price = price.replace(/\r?\n|\r|\t/g, "");
					json.price = price;
				});
				$(".row:last-of-type > div.col-sm-6 > div.detail__contact").filter(function() {
					let data = $(this);
					let customerName = data.children().find("div.detail__contact__name > a").text().trim();
					let phoneEmail = data.children().find("div.detail__contact__text > span.hide-contact").text().trim();
					phoneEmail = phoneEmail.replace(/\r?\n|\r|\t/g, " ");
					phoneEmail = phoneEmail.replace(/  +/g, " ");
					customerPhone = phoneEmail.split(" ")[0] + " " + phoneEmail.split(" ")[1];
					customerEmail = phoneEmail.split(" ")[2];
					json.customer.name = customerName;
					json.customer.phone = customerPhone;
					json.customer.email = customerEmail;
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