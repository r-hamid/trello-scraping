// Global variables
const APP_KEY = "29e61fba6f452ee9ff92c1e697c12454";
const USER_TOKEN = "878a29d179dc1d85d005237011d85d1666e2c7ce997422101d80b73ae5fe16ea";
let OUTPUT_LIST = "";

// All libraries
const Trello = require("trello");
const nightmare = require("../webScraping/nightmare");

// Create trello class object
const trello = new Trello(APP_KEY, USER_TOKEN);

function getCards() {
	const getCardPromise = new Promise( (resolve, reject) => {
		trello.getListsOnBoard("5ebc74677f398346f79f2361", (error, boardList) => {
			if(!error) {
				inputBoard = boardList.filter( board => board.name == "Input" );
				OUTPUT_LIST = boardList.filter( board => board.name == "Output" );
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

function saveAllCards(allCards) {
	let promise = new Promise( (resolve, reject) => {
		allCards.forEach( (card, index) => {
			if(card.scrappedData) {
				let returnedPromise = updateCard(card);
				returnedPromise.then( () => {
					if( (allCards.length -1) === index ) resolve();
				});
			}
			
		});
	});
	return promise;
}

function updateCard(card) {

	let price = card.scrappedData.price.replace(/\s/g, '');
	price = price.replace(/\D/g,'');
	let name = card.scrappedData.title+"("+(price/1000)+")";
	let desc = card.scrappedData.description+"\n\n"+card.scrappedData.customer.name+"\n"+"Mail: "+card.scrappedData.customer.email+"\n"+"Phone: " + card.scrappedData.customer.phone;
	query = "name="+name+"&desc="+desc;
	let promise = new Promise ( (resolve, reject) => {
		trello.updateCardName(card.id, name, () => {
			trello.addAttachmentToCard(card.id, card.desc, () => {
				trello.updateCardDescription(card.id, desc, () => {
					trello.addAttachmentToCard(card.id, card.scrappedData.picture, () => {
						trello.updateCardList(card.id, OUTPUT_LIST[0].id, () => {
							resolve();
						});
					});
				});
			});
		});
	});

	return promise;
}

module.exports = {
	getCards: getCards,
	saveAllCards: saveAllCards
};