var express = require('express');
var fs = require('fs');
var app  = express();
var path = require('path');
var scraper = require('./src/scrape/taskrunner.js');

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


app.use('/', express.static(path.join(__dirname + '/public')));
app.use('/node_modules', express.static(__dirname + '/node_modules/'))

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
	//var allResults = appfolio.getResults().concat(craigslist.getResults()).concat(cap.getResults()).concat(princeton.getResults());
	res.send(scraper.getResults('all'));
});



app.listen('8081')
console.log('Listening on 8081');


