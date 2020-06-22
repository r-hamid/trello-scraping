// Required Libraries
const express = require("express");
const trello = require("./trello/trello");
const annonce = require("./webScraping/annonce");
const idnes = require("./webScraping/idnes")
const nightmare = require("./webScraping/nightmare");
const hyperreality = require("./webScraping/hyperreality");

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

app.get("/annonce", async function(req, res) {
	let scrappedData = {};
	scrappedData = await annonce.scraping("https://www.annonce.cz/inzerat/prodej-byt-2-1-sokolov-49765983-wudyrm.html");
	res.send(scrappedData);
});

app.get("/scrape", async function(req, res) {
	let scrappedData = [];
	scrappedData.push(await nightmare.scraping("https://www.sreality.cz/detail/prodej/byt/1+1/chomutov-chomutov-holesicka/1528512092#img=0&fullscreen=false"));
	res.send(scrappedData);
});

app.get("/idnes", async function(req, res) {
	let scrappedData = [];
	scrappedData.push(await idnes.scraping("https://reality.idnes.cz/detail/prodej/byt/sokolov-sokolovska/5ee3360c558f0707a50f2e27/?page=1287"));
	res.send(scrappedData);
});

app.get("/hyperreality", async function(req, res) {
	let scrappedData = [];
	scrappedData.push(await hyperreality.scraping("https://www.hyperreality.cz/inzerat/detail/7696467-prodej-byt-2-1-54-m-sokolov-ul-sokolovska"));
	res.send(scrappedData);
});

//Starting server
let port = 3000;
app.listen(port, () => {
	console.log(`Express server started. Listening to port: ${port}`);
});
