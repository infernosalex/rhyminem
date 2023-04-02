const express = require('express');
const router = express.Router();
const Poem = require('../models/poem');

const generate = require('../util/aiController').generate;
const getKeywords = require('../util/nlpController').getKeywords;
const textToSpeech = require('@google-cloud/text-to-speech');
const TTS_CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL;
const TTS_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY;
const TTSClient = new textToSpeech.TextToSpeechClient({
	credentials: {
		client_email: TTS_CLIENT_EMAIL,
		private_key: TTS_PRIVATE_KEY
	}
});

async function generateTTS(poem, language = 'en') {
	let languageCode;
	switch (language) {
		case 'en':
			languageCode = 'en-US';
			break;
		case 'ro':
			languageCode = 'ro-RO';
			break;
		default:
			languageCode = 'en-US';
	}

	const request = {
		input: { text: poem },
		voice: { languageCode, ssmlGender: 'NEUTRAL' },
		audioConfig: { audioEncoding: 'MP3' }
	};

	const [response] = await TTSClient.synthesizeSpeech(request);
	const audio = response.audioContent;

	return audio;
}

// POST /api/generate
/* 
Request body:
{
  userPrompt: string,
  lines: number,
	word: string,
  language: string,
  model: 0 | 1,
	style: string,
	temperature: number,
	frequencyPenalty: number
}
*/
router.post('/', async (req, res) => {
	let {
		userPrompt,
		lines,
		word,
		language,
		model,
		style,
		temperature,
		frequencyPenalty
	} = req.body;
	lines = parseInt(lines);
	model = parseInt(model);
	temperature = parseFloat(temperature);
	frequencyPenalty = parseFloat(frequencyPenalty);

	// validate input
	if (!userPrompt) {
		res.status(400).json({ error: 'Invalid input' });
		return;
	}

	const { poem, imagePromise } = await generate({
		userPrompt,
		lines,
		word,
		language,
		model,
		style,
		temperature,
		frequencyPenalty
	});

	// generate 3 hashtags
	const keywords = await getKeywords(poem);
	const hashtags = keywords.slice(0, 3);

	// save poem to database
	const newPoem = await new Poem({
		prompt: userPrompt,
		text: poem,
		image: await imagePromise,
		hashtags
	}).save();

	res.json({
		poem,
		image: await imagePromise,
		id: newPoem._id
	});
});

// GET /api/generate/:id
// Get poem by id
router.get('/:id', async (req, res) => {
	const { id } = req.params;
	const poem = await Poem.findById(id);
	if (!poem) {
		res.status(404).json({ error: 'Poem not found' });
		return;
	}
	res.json(poem);
});

// GET /api/generate/:id/audio
// Get audio by id
router.get('/:id/audio', async (req, res) => {
	const { id } = req.params;
	const poem = await Poem.findById(id);
	if (!poem || poem.text.length === 0) {
		res.status(404).json({ error: 'Poem not found' });
		return;
	}

	// generate audio line by line
	const audio = [];
	const textLines = poem.text.split('\n');
	for (const line of textLines) {
		const lineAudio = await generateTTS(line, poem.language);
		audio.push(lineAudio);
	}

	res.json(audio);
});

module.exports = router;
