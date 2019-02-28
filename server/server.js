const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const Transaction = require('./transactions');

const app = express();
app.use(cors());
app.use(bodyParser.json());
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/history');

app.listen(3000, () => {
	console.log('App listening on port 3000.');
});

app.get('/', (req, res) => {
	res.send('Hello world!');
});

app.get('/history', (req, res) => {
	Transaction.find({}, (err, item) => {
		if (err) res.send(err);
		res.send(item);
	});
});

app.post('/clear-history', (req, res) => {
	mongoose.connection.db.dropDatabase();
	res.send('History cleared.');
});

app.post('/remove-item', (req, res) => {
	Transaction.deleteOne( {'_id': req.body._id}, (err) => {
		if (err) res.send(err);
	});
})

app.post('/new-trans', (req, res) => {
	const trans = new Transaction(req.body);
	trans.save((err) => {
		if (err) res.send(err);
		res.send('Transaction recorded.');
	});
});
