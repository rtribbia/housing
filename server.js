var express = require('express');
var fs = require('fs');
var app  = express();
var path = require('path');

//sample dataset for dev
var dev = require('./output.json');

//scrape libaries
var Appfolio = require('./scrape/appfolio.js');
var Craigslist = require('./scrape/craigslist.js');
var Cap = require('./scrape/cap.js');
var Princeton = require('./scrape/princeton.js');

//scrape config
var appfolioArray = ['rmspdx','manifaust','fox','ascendpm','interwest','capitalpropertymgmt','rpmpdx','adi','realtysolutions','kbcmgmt','peak','propmhomes','realpronw','garciagrp','firstclassproperty','popm','gordonproperties','circum','profast','holland','sharpproperty','associatedpm','performance','alder','voss','gebhardtpm','mirrorpropertymanagement','dnpm','anchor','bbmgmt','sullivanmgmt','twentythird','milestonepropertymgmt','acornpm','jmre','agrentalmgmt','gridpm','livingroomproperty','regencypropertymgt','carefree'];
var appfolio = new Appfolio(appfolioArray);
var craigslist = new Craigslist('https://portland.craigslist.org/search/apa?availabilityMode=0&bedrooms=1&laundry=1&laundry=4&max_price=1380&min_price=800&postal=97212&postedToday=1&search_distance=10');
var cap = new Cap('http://www.capmng.com/availability/details.php');
var princeton = new Princeton('http://www.princetonproperty.com/map_view/');


//scrape execute
appfolio.scrape();
craigslist.scrape();
cap.scrape();
princeton.generateQuery();

app.use('/', express.static(path.join(__dirname + '/public')));

app.get('/appfolio', function(req, res){
	res.send(appfolio.getResults());
});
app.get('/craigslist', function(req, res){
	res.send(craigslist.getResults());
});
app.get('/cap', function(req, res){
	res.send(cap.getResults());
});
app.get('/princeton', function(req, res){
	res.send(princeton.getResults());
});
app.get('/all', function(req, res){
	var allResults = appfolio.getResults().concat(craigslist.getResults()).concat(cap.getResults()).concat(princeton.getResults());
	res.send(allResults);
});


app.get('/dev', function(req, res){
	res.send(dev);
});


app.listen('8081')
console.log('Listening on 8081');


