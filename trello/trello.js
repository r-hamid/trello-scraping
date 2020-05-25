// Global variables
const APP_KEY = "29e61fba6f452ee9ff92c1e697c12454";
const USER_TOKEN = "878a29d179dc1d85d005237011d85d1666e2c7ce997422101d80b73ae5fe16ea";

// All libraries
const Trello = require("trello");
const nightmare = require("../webScraping/nightmare");
const postingData = require("./postingData");

// Create trello class object
const trello = new Trello(APP_KEY, USER_TOKEN);

function getCards() {
	const getCardPromise = new Promise( (resolve, reject) => {
		trello.getListsOnBoard("5ebc74677f398346f79f2361", (error, boardList) => {
			if(!error) {
				inputBoard = boardList.filter( board => board.name == "Input" );
				trello.getCardsOnList(inputBoard[0].id, (error, allCards) => {
					if(!error) {
						var forEachPromise = new Promise( (resolveForEach, rejectForEach) => {
							allCards.forEach( async (card, index) => {
								if( ( allCards.length - 1) === index ){ 
									allCards[index].scrappedData = await nightmare.scraping(card.desc);
									resolveForEach();
								}
								allCards[index].scrappedData = await nightmare.scraping(card.desc);
							});
						});
	
						forEachPromise.then(() => {
							resolve(allCards);
						});
						
					}
				});
			}
		});
	});
	return getCardPromise;
}

function saveDataToCard(allCards) {
	var forEachPromise = new Promise( (resolveForEach, rejectForEach) => {
		allCards.forEach( async (card, index) => {
			let name = card.scrappedData.title;
			let desc = card.scrappedData.description+"\n"+card.scrappedData.customer.name+"\n"+"Mail: "+card.scrappedData.customer.email+"\n"+"Phone: " + card.scrappedData.customer.phone;
			if( ( allCards.length - 1) === index ){
				// trello.updateCard(card.id, ["name", "desc"], [name, desc], (error, response) => {
				// 	console.log("First Card has been updated");
				// });
				resolveForEach();
				// trello.updateCardName(card.id, name, () => console.log("Name Updated"));
				// trello.updateCardDescription(card.id, desc, () => console.log("Description Updated"));
			}
			await trello.updateCard(card.id, ["name", "desc"], [name, desc]);
			// trello.updateCardName(card.id, name, () => console.log("Name Updated"));
			// trello.updateCardDescription(card.id, desc, () => console.log("Description Updated"));
		});
	});

	return forEachPromise;
}

module.exports = {
	getCards: getCards,
	saveDataToCard: saveDataToCard
};