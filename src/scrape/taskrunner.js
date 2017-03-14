var fs = require('fs');

var appfolio = require('./appfolio.js');
var craigslist = require('./craigslist.js');
var cap = require('./cap.js');
var princeton = require('./princeton.js');

var defaultOpts = {
	appfolio: false,
	cap: false,
	craislist: false,
	princeton: false
}

//scrape config
var appfolioArray = ['rmspdx','manifaust','fox','ascendpm','interwest','capitalpropertymgmt','rpmpdx','adi','realtysolutions','kbcmgmt','peak','propmhomes','realpronw','garciagrp','firstclassproperty','popm','gordonproperties','circum','profast','holland','sharpproperty','associatedpm','performance','alder','voss','gebhardtpm','mirrorpropertymanagement','dnpm','anchor','bbmgmt','sullivanmgmt','twentythird','milestonepropertymgmt','acornpm','jmre','agrentalmgmt','gridpm','livingroomproperty','regencypropertymgt','carefree'];
var craigslistURL = 'https://portland.craigslist.org/search/apa?availabilityMode=0&bedrooms=1&laundry=1&laundry=4&max_price=1380&min_price=800&postal=97212&postedToday=1&search_distance=10';
var capURL = ('http://www.capmng.com/availability/details.php');
var princetonURL = 'http://www.princetonproperty.com/map_view/';

var taskRunner = {
	opts: defaultOpts,
	completeStatus: {
		appfolio: false,
		cap: false,
		craislist: false,
		princeton: false
	},
	compiledResults: []
}

taskRunner.start = function(opts) {
	taskRunner.opts = opts;

	if (taskRunner.opts.appfolio) {
		console.log('scrape start appfolio...');
		appfolio.scrape(appfolioArray, taskRunner);
	}
	if (taskRunner.opts.craigslist) {
		console.log('scrape start craigslist...');
		craigslist.scrape(craigslistURL, taskRunner);
	}
	if (taskRunner.opts.cap) {
		console.log('scrape start capitap property mgmt...');
		cap.scrape(capURL, taskRunner);
	}
	if (taskRunner.opts.princeton) {
		console.log('scrape start princeton...');
		princeton.scrape(princetonURL, taskRunner);
	}
}

taskRunner.setComplete = function(site) {
	taskRunner.completeStatus[site] = true;
	if (allComplete()) {
		Object.keys(taskRunner.opts).forEach(function(csite) {
			if (taskRunner.opts[csite])
				taskRunner.compiledResults = taskRunner.compiledResults.concat(taskRunner.getResults(csite));
		});
		writeDBfile(taskRunner.compiledResults,'db.json');
	}
}

function allComplete() {
	var complete = true;

	Object.keys(taskRunner.opts).forEach(function(site) {
		if (taskRunner.opts[site] != taskRunner.completeStatus[site])
			complete = false;
	});

	return complete;
}

taskRunner.getResults = function(site) {
	switch(site) {
		case 'appfolio':
			return appfolio.getResults();
			break;
		case 'craigslist':
			return craigslist.getResults();
			break;
		case 'cap':
			return cap.getResults();
			break;
		case 'princeton':
			return princeton.getResults();
			break;
		case 'all':
			return taskRunner.compiledResults;
			break;
		default:
			return ["site not found"];
	}
}

taskRunner.readDBfile = function(file) {
	fs.readFile(file, function (err, data) {
		if (err) throw err;
		taskRunner.compiledResults = JSON.parse(data);
		console.log(file + ' - ' + taskRunner.compiledResults.length + ' results loaded');
	});

}

function writeDBfile(json,file) {

	fs.writeFile(file,JSON.stringify(json),function(err){
		if (err) {
			throw err;
		} else {
			console.log(file + ' written.');
		}
	});

}



module.exports = taskRunner;