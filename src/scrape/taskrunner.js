var appfolio = require('./appfolio.js');
var craigslist = require('./craigslist.js');
var cap = require('./cap.js');
var Princeton = require('./princeton.js');

var defaultOpts = {
	appfolio: false,
	cap: false,
	craislist: false,
	princeton: false
}

//scrape config
//var appfolioArray = ['rmspdx','manifaust','fox','ascendpm','interwest','capitalpropertymgmt','rpmpdx','adi','realtysolutions','kbcmgmt','peak','propmhomes','realpronw','garciagrp','firstclassproperty','popm','gordonproperties','circum','profast','holland','sharpproperty','associatedpm','performance','alder','voss','gebhardtpm','mirrorpropertymanagement','dnpm','anchor','bbmgmt','sullivanmgmt','twentythird','milestonepropertymgmt','acornpm','jmre','agrentalmgmt','gridpm','livingroomproperty','regencypropertymgt','carefree'];
var appfolioArray = ['rmspdx','manifaust'];
var craigslistURL = 'https://portland.craigslist.org/search/apa?availabilityMode=0&bedrooms=1&laundry=1&laundry=4&max_price=1380&min_price=800&postal=97212&postedToday=1&search_distance=10';
var capURL = ('http://www.capmng.com/availability/details.php');
var princeton = new Princeton('http://www.princetonproperty.com/map_view/');

var taskrunner = {
	opts: defaultOpts,
	completeStatus: {
		appfolio: false,
		cap: false,
		craislist: false,
		princeton: false
	}
}

taskrunner.start = function(opts) {
	taskrunner.opts = opts;

	if (taskrunner.opts.appfolio) {
		console.log('taskrunner start appfolio...');
		appfolio.scrape(appfolioArray, taskrunner);
	}
	if (taskrunner.opts.craigslist) {
		console.log('taskrunner start craigslist...');
		craigslist.scrape(craigslistURL, taskrunner);
	}
	if (taskrunner.opts.cap) {
		console.log('taskrunner start capitap property mgmt...');
		cap.scrape(capURL);
	}
	if (taskrunner.opts.princeton) {
		console.log('taskrunner start princeton...');
		princeton.generateQuery();
	}
}

taskrunner.setComplete = function(site) {
	taskrunner.completeStatus[site] = true;
	if (allComplete()) {
		console.log('done!')
	}
}

function allComplete() {
	var complete = true;

	Object.keys(taskrunner.opts).forEach(function(site) {
		if (taskrunner.opts[site] != taskrunner.completeStatus[site])
			complete = false;
	});

	return complete;
}

taskrunner.getResults = function(site) {
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
		default:
			return ["site not found"];
	}
}


module.exports = taskrunner;