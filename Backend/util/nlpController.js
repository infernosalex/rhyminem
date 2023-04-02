//Intialize Google Cloud API NLP
const NLP_CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL;
const NLP_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY;
const { LanguageServiceClient } = require('@google-cloud/language');
const NLPClient = new LanguageServiceClient({
	credentials: {
		client_email: NLP_CLIENT_EMAIL,
		private_key: NLP_PRIVATE_KEY
	}
});
//#endregion

// Take a poem and return a list of keywords
async function getKeywords(poem) {
	if (poem == null || poem === undefined) {
		return [];
	}

	const document = {
		content: poem,
		type: 'PLAIN_TEXT'
	};

	const [result] = await NLPClient.analyzeEntities({ document });
	const entities = result.entities;

	const keywords = [];
	entities.forEach((entity) => {
		keywords.push(entity.name);
	});
	return keywords;
}

module.exports = {
	getKeywords
};
