// Required Libraries
const cheerio = require("cheerio");
const Nightmare = require("nightmare");

const scraping = (url) => {

	// All scraping will be done here
	let nightmare = new Nightmare({show: false});
	const nightmarePromise = new Promise( (resolve, reject) => {
		nightmare
			.goto(url)
			.wait(".nette-snippet-body > div#wrapper")
			.evaluate(() => {
				let html = document.querySelector(".nette-snippet-body > div#wrapper > div.mother > div.mother__content > main.main > div#snippet-s- > div#snippet-s-result > div#snippet-s-result- > article").innerHTML;
				return html;
			})
			.end()
			.then(response => {
				const html = response;
				var $ = cheerio.load(html);
				var json = { title: "", picture: "", price: "", description: "", customer: { name: "", email: "", phone: "" } };

				let core = ".pt-20 > div.row-main > div.m-auto.mw-860";
				// extracting data
				$(core + " > header.b-detail > h1.b-detail__title").filter(function() {
					var title = $(this).text();
					title = title.replace(/\r?\n|\r/g, "");
					json.title = title;
				});
				$(core + " > div.b-desc > p:nth-of-type(1) ").filter(function() {
					var desc = $(this).text().trim();
					json.description = desc;
				});
				$(".b-gallery.carousel > div.b-gallery__img-lg > div.carousel__list > div.slick-list > div.slick-track > a.slick-active").filter(function() {
					let image = $(this).attr("href");
					json.picture = image;
				});
				$(core + " > header.b-detail > p.b-detail__price > strong").filter(function() {
					var price = $(this).text();
					json.price = price;
				});
				$(core + " > div.b-detail-contact > div.grid.grid--wider > div.grid__cell > div.b-author > div.b-author__content").filter(function() {
					let data = $(this);
					let customerName = data.find("h2.b-author__title > a").text().trim();
					let customerEmail = data.find("p.b-author__info:nth-of-type(2) > span > strong > span > a").text().trim();
					let customerPhone = data.find("p.b-author__info:nth-of-type(3) > span > strong > span > a").text().trim();
					json.customer.name = customerName;
					json.customer.phone = customerPhone;
					json.customer.email = customerEmail;
					console.log("Executed");
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