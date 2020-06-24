// Required Libraries
const express = require("express");
const trello = require("./trello/trello");

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

//Starting server
let port = 3000;
app.listen(port, () => {
	console.log(`Express server started. Listening to port: ${port}`);
});
