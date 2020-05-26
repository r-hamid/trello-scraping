// Required Libraries
const express = require("express");
const trello = require("./trello/trello");
const nightmare = require("./webScraping/nightmare");

// Defining variables and setting others to kick start the server
const app = express();

app.get("/", function(req, res) {
	let allCards = trello.getCards();
	allCards.then( (allCards) => {
		if(allCards) {

			let cardsData = [];
			for (let index = 0; index < allCards.length; index++) {
				cardsData.push({
					URL: allCards[index].desc,
					scrapingResult: allCards[index].scrappedData
				});
			}
			res.send(cardsData);
		}
		else res.send("Something went wrong");
	});
});

app.get("/scrape", async function(req, res) {
	let scrappedData = [];
	scrappedData.push(await nightmare.scraping("https://www.sreality.cz/detail/prodej/byt/1+1/chomutov-chomutov-holesicka/1528512092#img=0&fullscreen=false"));
	res.send(scrappedData);
});

app.get("/connectToTrello", function(req, res) {
	let allCards = trello.getCards();
	allCards.then( (allCards) => {
		
		let saveCardPromise = trello.saveDataToCard(allCards);

		saveCardPromise.then( () => {
			(allCards) ? res.send(allCards) : res.send("Check console for errors");
		});

	});
});

app.get("/puppet", async function(req, res) {
	let scrappedData = [];
	scrappedData.push(await puppeteer.scraping("https://www.sreality.cz/detail/prodej/byt/1+1/chomutov-chomutov-holesicka/1528512092#img=0&fullscreen=false"));
	res.send(scrappedData);
});

//Starting server
let port = 3001;
app.listen(port, () => {
	console.log(`Express server started. Listening to port: ${port}`);
});
