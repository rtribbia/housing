var express = require('express');
var fs = require('fs');
var app  = express();
var path = require('path');

//scrape libaries
var Appfolio = require('./src/scrape/appfolio.js');
var Craigslist = require('./src/scrape/craigslist.js');
var Cap = require('./src/scrape/cap.js');

//scrape on startup
var appfolioArray = ['rmspdx','manifaust','fox','ascendpm','interwest','capitalpropertymgmt','rpmpdx','adi','realtysolutions','kbcmgmt','peak','propmhomes','realpronw','garciagrp','firstclassproperty','popm','gordonproperties','circum','profast','holland','sharpproperty','associatedpm','performance','alder','voss','gebhardtpm','mirrorpropertymanagement','dnpm','anchor','bbmgmt','sullivanmgmt','twentythird','milestonepropertymgmt','acornpm','jmre','agrentalmgmt','gridpm','livingroomproperty','regencypropertymgt','carefree'];
//var appfolioArray = ['manifaust'];
var appfolio = new Appfolio(appfolioArray);
//appfolio.scrape();

var craigslist = new Craigslist('https://portland.craigslist.org/search/apa?availabilityMode=0&bedrooms=1&laundry=1&laundry=4&max_price=1380&min_price=800&postal=97212&postedToday=1&search_distance=10');
craigslist.scrape();

var cap = new Cap('http://www.capmng.com/availability/details.php');
//cap.scrape();


app.use('/', express.static(path.join(__dirname + '/public')));
app.use('/node_modules', express.static(__dirname + '/node_modules/'))

app.get('/appfolio', function(req, res){
	res.send(appfolio.getResults());
});
app.get('/craigslist', function(req, res){
	res.send(craigslist.getResults());
});
app.get('/cap', function(req, res){
	res.send(cap.getResults());
});

app.listen('8081')
console.log('Listening on 8081');


