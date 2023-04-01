/* eslint-disable no-template-curly-in-string */
const axios = require('axios');

//#region Initialize OpenAI API
const APIKEY = process.env.OPENAI_KEY;
const ORGANIZATIONKEY = process.env.OPENAI_ORGANIZATION;

const openai = axios.create({
	baseURL: 'https://api.openai.com/v1/',
	headers: {
		'Content-Type': 'application/json',
		Authorization: `Bearer ${APIKEY}`,
		'OpenAI-Organization': ORGANIZATIONKEY
	}
});
//#endregion

//#region ChatGPT
const GPT4 = 'gpt-4';
const GPT3 = 'gpt-3.5-turbo';

const prompts = {
	en: 'Write a ${0} line poem about "${1}"',
	ro: 'Scrie o poezie de ${0} rânduri despre "${1}"'
};
async function generatePoem(
	userPrompt,
	lines = 8,
	language = 'en',
	model = GPT3
) {
	const prompt = prompts[language]
		.replace('${0}', lines)
		.replace('${1}', userPrompt);

	let response;
	try {
		response = await openai.post('/chat/completions', {
			model,
			messages: [
				{
					role: 'user',
					content: prompt
				}
			]
		});
	} catch (error) {
		console.log(error);
	}

	return response.data.choices[0].message.content;
}
async function generateGPT4(userPrompt, lines = 8, language = 'en') {
	return generatePoem(userPrompt, lines, language, GPT4);
}

const summaryPrompts = {
	en: 'Give me a description of an image that would represent the following poem in a few words: "${0}"',
	ro: 'Scrie o descriere a imaginii care ar reprezenta poezia următoare în câteva cuvinte: "${0}"'
};
async function generateSummary(poem, language = 'en') {
	const prompt = summaryPrompts[language].replace('${0}', poem);

	let response;
	try {
		response = await openai.post('/chat/completions', {
			model: GPT3,
			messages: [
				{
					role: 'user',
					content: prompt
				}
			]
		});
	} catch (error) {
		console.log(error);
	}

	return response.data.choices[0].message.content;
}
//#endregion

//#region DALL-E
async function generateDALLE(prompt) {
	let response;
	try {
		response = await openai.post('/images/generations', {
			prompt,
			n: 1,
			size: '256x256'
		});
	} catch (error) {
		console.log(error);
	}

	return response.data.data[0].url;
}
//#endregion

//#region NLP Moderation
async function moderate(prompt) {
	let response;
	try {
		response = await openai.post('/moderations', {
			input: prompt
		});
	} catch (error) {
		console.log(error);
	}

	console.log(response.data.results);
	return { flagged: response.data.flagged };
}
//#endregion

async function generate({ userPrompt, lines = 8, language = 'en', model = 0 }) {
	let poem = null;

	// check if prompt is flagged
	const flagged = await (await moderate(userPrompt)).flagged;
	if (flagged) return { flagged: true };

	if (model === 0) {
		// GPT3
		poem = await generatePoem(userPrompt, lines, language);
	} else if (model === 1) {
		// GPT4
		poem = await generateGPT4(userPrompt, lines, language);
	}

	const image = generateSummary(poem, language).then((summary) => {
		return generateDALLE(summary);
	});

	return {
		poem,
		imagePromise: image
	};
}

// test function
/* async function generate({ userPrompt, lines = 8, language = 'en', model = 0 }) {
	// return predefined poem and image after 1 second
	const poem = `A daring duck approached the spines,
	Amidst the sand, where sun reclines.
	With beaked resolve, embraced the bite,
	Of prickly, tough, green food despite.
	In desert bloom, a moment's bliss,
	A duck and cactus, strange amiss.`;
	const image = 'https://picsum.photos/200';

	// wait 1 second before returning poem
	const poemPromise = new Promise((resolve) => {
		setTimeout(() => {
			resolve(poem);
		}, 1000);
	});

	// wait 2 seconds before returning image
	const imagePromise = new Promise((resolve) => {
		setTimeout(() => {
			resolve(image);
		}, 2000);
	});

	// await the poem
	const poemResult = await poemPromise;

	// return the poem and the image promise
	return {
		poem: poemResult,
		imagePromise
	};
} */

module.exports = {
	generate
};
