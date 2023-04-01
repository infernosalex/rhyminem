const express = require('express');
const router = express.Router();

const generate = require('../util/aiController').generate;
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
  language: string,
  model: string
}
*/
router.post('/', async (req, res) => {
	let { userPrompt, lines, language, model } = req.body;
	lines = parseInt(lines);
	model = parseInt(model);

	// validate input
	if (
		userPrompt === undefined ||
		lines === undefined ||
		language === undefined ||
		model === undefined
	) {
		res.status(400).json({ error: 'Invalid input' });
		return;
	}

	const { poem, imagePromise } = await generate({
		userPrompt,
		lines,
		language,
		model
	});

	// generate audio line by line
	const audio = [];
	const audioLines = poem.split('\n');
	for (const line of audioLines) {
		const lineAudio = await generateTTS(line, language);
		audio.push(lineAudio);
	}

	res.json({
		poem,
		image: await imagePromise,
		audio
	});
});

module.exports = router;
