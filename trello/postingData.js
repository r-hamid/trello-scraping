// All required Packages
const fs = require("fs");
const https = require("https");
const Stream = require("stream").Transform;

const getProcessedDataToTrello = (allCardsData) => {
	allCardsData.forEach( (card, index) => {

		https.request(card.scrappedData.picture, function(response) {
			var data = new Stream();
			response.on('data', (chunk) => {
				data.push(chunk);
			 });
			response.on('end', () => {
				fs.writeFileSync("public/images/image.jpg", data.read());
			});
		}).end();

		

	});
}

module.exports = {
	getProcessedDataToTrello: getProcessedDataToTrello
}