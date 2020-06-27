// Required Libraries
const cheerio = require("cheerio");
const Nightmare = require("nightmare");

const scraping = (url) => {
	
	let baseURL = "https://www.annonce.cz";

	// All scraping will be done here
	let nightmare = new Nightmare({show: false});
	const nightmarePromise = new Promise( (resolve, reject) => {
		nightmare
			.goto(url)
			.wait("#page > div#content", 50000)
			.evaluate(() => {
				let html = document.querySelector("#page > div#content").innerHTML;
				return html;
			})
			.end()
			.then(response => {
				const html = response;
				var $ = cheerio.load(html);
				var json = { title: "", picture: "", price: "", description: "", customer: { name: "", email: "", phone: "" } };

				// extracting data
				$(".pane.detail-header > div.h1.line.sided > h1").filter(function() {
					var title = $(this).text();
					json.title = title;
				});
				$(".join.e-rside.with-similar > div.e-rside-l > div#reality-detail > div.r > div.x.w290 > div.padded > div > p.ad-desc > span.ad-detail-desc-container").filter(function() {
					if($(this).text()) {
						var desc = $(this).text().trim();
						json.description = desc;
					}
				});
				$(".join.e-rside.with-similar > div.e-rside-l > div#reality-detail > div.r > div.b.carousel-medium > div.thumbnail > div.m-align > div > img").filter(function() {
					var image = $(this).attr("src");
					json.picture = baseURL + image;
				});
				$(".join.e-rside.with-similar > div.e-rside-l > div#reality-detail > div.r > div.b.w290.shiny > table.attrs.p100 > tbody > tr.price-row > td").filter(function() {
					var price = $(this).text();
					price = price.replace(/\r?\n|\r/g, "");
					json.price = price;
				});
				$(".join.e-rside.with-similar > div.e-rside-l > div#reality-detail > div.r > div.x.w290 > div#contact-container").filter(function() {
					let data = $(this);
					if(data.find("h2").text()) {
						let customerName = data.find("h2").text().trim();
						json.customer.name = customerName;
					}
					if(data.find("div:nth-of-type(1)").text()) {
						let customerPhone = data.find("div:nth-of-type(1) > a").text().trim();
						json.customer.phone = customerPhone;
					}
					if(data.find("div:nth-of-type(2)").text()) {
						let customerEmail = data.find("div:nth-of-type(2) > a").text().trim();
						json.customer.email = customerEmail;
					}
				});

				resolve(json);
			}).catch(err => {
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