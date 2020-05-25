// Required Libraries
const express = require("express");
const trello = require("./trello/trello");
const nightmare = require("./webScraping/nightmare");

// Defining variables and setting others to kick start the server
const app = express();

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
app.listen("3000", () => {
	console.log(`Express server started. Listening to port: 3000`);
});