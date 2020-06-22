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
					var desc = $(this).text().trim();
					json.description = desc;
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
					let customerName = data.find("div:nth-of-type(1)").text().trim();
					let customerPhone = data.find("div:nth-of-type(2)").text().trim();
					let customerEmail = data.find("div:nth-of-type(5)").text().trim();
					json.customer.name = customerName.split(":")[1].trim();
					json.customer.phone = customerPhone.split(":")[1].trim();
					json.customer.email = customerEmail.split(":")[1].trim();
				});
				// $(".ng-isolate-scope[answer-form='resource']").filter(function() {
				// 	var data = $($(this)+" > div.answer-form > div.contacts > div.seller-contact");
				// 	let name = data.children().find(".seller-name > a.link.name").text().trim();
				// 	let phone = data.children().find("div.contacts > ul.contact-list > li.contact-item.phone > span").text().trim();
				// 	let email = data.children().find("div.contacts > ul.contact-list > li.contact-item.email > a").text().trim();
				// 	json.customer.name = name;
				// 	json.customer.phone = phone;
				// 	json.customer.email = email;
				// });

				nightmare = null;
				resolve(json);
			}).catch(err => {
				reject(err);
			});
	});

	nightmarePromise.catch( (err) => {
		nightmare = null;
		return err;
	});

	return nightmarePromise.then( (jsonObj) => {
		nightmare = null;
		return jsonObj;
	});
	
}

module.exports = {
  scraping: scraping
}