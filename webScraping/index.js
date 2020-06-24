// All files for scraping
const bazos = require("./bazos");
const idnes = require("./idnes");
const annonce = require("./annonce");
const sreality = require("./sreality");
const viareality = require("./viareality");
const hyperreality = require("./hyperreality");

const scraping = async (passedUrl) => {
	const url = new URL(passedUrl);
	let returnData = {};
	switch(url.hostname) {
		case "www.annonce.cz":
			returnData = await annonce.scraping(url);
			break;
		case "www.sreality.cz":
			returnData = await sreality.scraping(url);
			break;
		case "reality.idnes.cz":
			returnData = await idnes.scraping(url);
			break;
		case "reality.bazos.cz":
			returnData = await bazos.scraping(url);
			break;
		case "www.hyperreality.cz":
			returnData = await hyperreality.scraping(url);
			break;
		case "www.viareality.cz":
			returnData = await viareality.scraping(url);
			break;
	}
	return returnData;
}

module.exports = {
  scraping: scraping
}