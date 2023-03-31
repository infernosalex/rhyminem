const mongoose = require('mongoose');

const url = 'mongodb://127.0.0.1:27017/rhyminem';

function connect() {
	mongoose
		.connect(url)
		.then(() => {
			console.log('Connected to MongoDB');
		})
		.catch((err) => {
			console.log('Error connecting to MongoDB', err);
		});
}

module.exports = { connect, url };
