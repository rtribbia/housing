var express = require('express');
var fs = require('fs');
var app  = express();
var path = require('path');
var scraper = require('./src/scrape/taskrunner.js');
var router = express.Router();


if (process.argv[2] == 'scrape') {
	scraper.start({
		appfolio: true,
		cap: true,
		craigslist: true,
		princeton: false
	});
} else {
	scraper.readDBfile('db.json');
}



router.use(function(req, res, next) {
	console.log('request received');
    next();
});

router.route('/')
.get(function(req, res) {
	res.json(scraper.getResults('all'));
});

router.route('/filter')
.get(function(req, res) {

	//possible values: maxrent, minrent, address

	var rawResults = scraper.getResults('all').slice();
	var filteredResults = [];
	var resultJSON = {
		results: []
	}

	for (var i = 0; i < rawResults.length; i++) {
		var match = true;
		if (req.query.minrent && (rawResults[i].rent < (+req.query.minrent))) {
			match = false;
		}
		if (req.query.maxrent && (rawResults[i].rent > (+req.query.maxrent))) {
			match = false;
		}
		if (req.query.address && (rawResults[i].address.toLowerCase().indexOf(req.query.address.toLowerCase()) == -1)) {
			match = false;
		}

		if (match)
			filteredResults.push(rawResults[i])

	}

	var limit = req.query.limit ? (+req.query.limit) : 100;
	var offset = req.query.offset ? (+req.query.offset) : 0;
	
	limit = (limit > filteredResults.length) ? filteredResults.length : limit;
	resultJSON.results = filteredResults.slice(offset, offset+limit);

	resultJSON.total = filteredResults.length;
	res.json(resultJSON);
});



app.use('/', express.static(path.join(__dirname + '/public')));
app.use('/node_modules', express.static(__dirname + '/node_modules/'))
app.use('/api', router);
app.get('/appfolio', function(req, res){
	res.send(scraper.getResults('appfolio'));
});
app.get('/craigslist', function(req, res){
	res.send(scraper.getResults('craigslist'));
});
app.get('/cap', function(req, res){
	res.send(scraper.getResults('cap'));
});
app.get('/princeton', function(req, res){
	res.send(scraper.getResults('princeton'));
});
app.get('/all', function(req, res){
	res.send(scraper.getResults('all'));
});



app.listen('8081')
console.log('Listening on 8081');


