// All files for scraping
const bazos = require("./bazos");
const idnes = require("./idnes")
const annonce = require("./annonce");
const sreality = require("./sreality");
const hyperreality = require("./hyperreality");

const identifyURL = (passedUrl) => {
	const url = new URL(passedUrl);
	console.log(url.hostname);
	switch(url.hostname) {
		case "www.annonce.cz":
			console.log("Annonce");
			break;
		case "www.sreality.cz":
			console.log("sreality");
			break;
		case "reality.idnes.cz":
			console.log("idnes");
			break;
		case "reality.bazos.cz":
			console.log("bazos");
			break;
		case "www.hyperreality.cz":
			console.log("hyper reality");
			break;
		default:
			console.log("No match found");
			break;
	}
}

module.exports = {
  identifyURL: identifyURL
}