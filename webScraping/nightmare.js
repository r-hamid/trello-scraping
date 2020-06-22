// Required Libraries
const cheerio = require("cheerio");
const Nightmare = require("nightmare");

const scraping = (url) => {
	
	// All scraping will be done here
	let nightmare = new Nightmare({show: false});
	const nightmarePromise = new Promise( (resolve, reject) => {
		nightmare
			.goto(url)
			.wait("#page-layout > div.content-cover > div.content-inner > div.transcluded-content > div.ng-scope > div.property-detail > div.content > div > div.ng-isolate-scope[answer-form='resource'] > div.answer-form > div.contacts")
			.wait(20000)
			.click("#page-layout > div.content-cover > div.content-inner > div.transcluded-content > div.ng-scope > div.property-detail > div.content > div > div.ng-isolate-scope[answer-form='resource'] > div.answer-form > div.contacts > div.seller-contact > div.contacts > ul.contact-list > li.contact-item.phone > button.value.interactive")
			.click("#page-layout > div.content-cover > div.content-inner > div.transcluded-content > div.ng-scope > div.property-detail > div.content > div > div.ng-isolate-scope[answer-form='resource'] > div.answer-form > div.contacts > div.seller-contact > div.contacts > ul.contact-list > li.contact-item.email > button.value.interactive")
			.evaluate(() => {
				let html = document.querySelector("#page-layout > div.content-cover > div.content-inner > div.transcluded-content > div.ng-scope > div.property-detail > div.content > div").innerHTML;
				return html;
			})
			.end()
			.then(response => {
				const html = response;
				var $ = cheerio.load(html);
				var json = { title: "", picture: "", price: "", description: "", release: "", customer: { name: "", email: "", phone: "" } };

				// extracting data
				$(".property-title").filter(function() {
					var data = $(this);
					var title = data.children().first().text().trim();
					title = title.replace(/\n/g, "");
					title = title.replace(/\t/g, "");
					json.title = title;
	
					var price = $(".property-title > span.price > span.norm-price").text();
					price = price.replace(/\n/g, "");
					price = price.replace(/\t/g, "");
					json.price = price;
				});
				$(".description > p").filter(function() {
					var desc = $(this).text().trim();
					json.description = desc;
				});
				$("div.gallery > div.detail-images > div.image-cover > div.image.active > img").filter(function() {
					var image = $(this).attr("src");
					json.picture = image;
				});
				$(".params > ul.params1 > li:nth-child(4)").filter(function() {
					var data = $(this).children().last().text().trim();
					json.release = data;
				});
				$(".ng-isolate-scope[answer-form='resource']").filter(function() {
					var data = $($(this)+" > div.answer-form > div.contacts > div.seller-contact");
					let name = data.children().find(".seller-name > a.link.name").text().trim();
					let phone = data.children().find("div.contacts > ul.contact-list > li.contact-item.phone > span").text().trim();
					let email = data.children().find("div.contacts > ul.contact-list > li.contact-item.email > a").text().trim();
					json.customer.name = name;
					json.customer.phone = phone;
					json.customer.email = email;
				});

				nightmare = null;
				resolve(json);
			}).catch(err => {
				reject(err);
			});
	});

	nightmarePromise.catch( (err) => {
		nightmare = null;
		console.log(err);
	});

	return nightmarePromise.then( (jsonObj) => {
		nightmare = null;
		return jsonObj;
	});
	
}

module.exports = {
  scraping: scraping
}