const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const poemSchema = new Schema({
	prompt: String,
	text: String,
	image: String,
	hashtags: [String]
});

const Poem = mongoose.model('Poem', poemSchema);

module.exports = Poem;
