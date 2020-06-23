// Required Libraries
const cheerio = require("cheerio");
const Nightmare = require("nightmare");

const scraping = (url) => {

	// All scraping will be done here
	let nightmare = new Nightmare({show: false});
	const nightmarePromise = new Promise( (resolve, reject) => {
		nightmare
			.goto(url)
			.wait("vre-app > div > property-detail-page > div.property-detail > vre-property-detail > div.container > div.row")
			.evaluate(() => {
				let html = document.querySelector("vre-app > div > property-detail-page > div.property-detail > vre-property-detail > div.container > div.row").innerHTML;
				return html;
			})
			.end()
			.then(response => {
				const html = response;
				var $ = cheerio.load(html);
				var json = { title: "", picture: "", price: "", description: "", customer: { name: "", email: "", phone: "" } };
				
				// extracting data
				$(".main-info > h1").filter(function() {
					var title = $(this).text();
					json.title = title;
				});
				$(".additional-info > div.description").filter(function() {
					var desc = $(this).text().trim();
					json.description = desc;
				});
				$(".additional-info > div.carousel.slide > div#carousel-detail-photos > div.slick-list.draggable > div.slick-track > div.item.active > a > vre-thumbnail > div").filter(function() {
					var image = $(this).attr("style");
					image = image.substring(image.indexOf("h"), (image.indexOf(")")-1));
					json.picture = image;
				});
				$(".main-info > h3:first-of-type").filter(function() {
					var price = $(this).text().trim();
					json.price = price;
				});
				$(".main-info:last-of-type > div.contact > div.row > div.col-xs-12 > vre-modal > div.modal > div.modal-dialog > div.modal-content > div.modal-body > div > div.broker-modal-body > div.broker-modal-block > div.row:first-of-type > div.broker-info").filter(function() {
					let data = $(this);
					let customerName = data.find(".broker-name").text().trim();
					let customerPhone = data.find(".phone").text().trim();
					console.log("Phone: ", customerPhone);
					json.customer.name = customerName;
					json.customer.phone = customerPhone;
				});

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