//#region Imports
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const methodOverride = require('method-override');
const session = require('express-session');
const MongoStore = require('connect-mongo');

require('dotenv').config();
const db = require('./util/db');
db.connect();
//#endregion

const app = express();
// #region middleware
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(methodOverride());
app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
		cookie: {
			maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
		},
		store: MongoStore.create({ mongoUrl: db.url })
	})
);
app.use(
	cors({
		credentials: true
	})
);
// #endregion

// #region routes
app.use('/generate', require('./routes/generate'));

//#endregion

// #region error handling
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).send('Internal server error');
});

app.use((req, res, next) => {
	res.status(404).send('Not found');
});
// #endregion

const port = process.env.PORT || 5000;
app.listen(port, () => {
	console.log(`Server listening on port ${port}`);
});
