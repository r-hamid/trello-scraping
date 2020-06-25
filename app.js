// Required Libraries
const express = require("express");
const trello = require("./trello/trello");
const nightmare = require("./webScraping");

// Defining variables and setting others to kick start the server
const app = express();

app.get("/", function(req, res) {
	
	let allCards = trello.getCards();
	allCards.then( (allCards) => {
		if(allCards) {
			let promise = trello.saveAllCards(allCards);
			promise.then( () => {
				res.send(" Cards Updated Successfully");
			});
		}
		else res.send("Something went wrong");
	});

});

app.get("/sreality", async function(req, res) {
	let scrappedData = {};
	scrappedData = await nightmare.scraping("https://www.sreality.cz/detail/prodej/byt/1+kk/most-most-k--h--borovskeho/2581212764#img=0&fullscreen=false");
	res.send(scrappedData);
});

//Starting server
let port = 3000;
app.listen(port, () => {
	console.log(`Express server started. Listening to port: ${port}`);
});
