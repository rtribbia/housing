var express = require('express');
var fs = require('fs');
var app  = express();
var path = require('path');

//scrape libaries
var Appfolio = require('./scrape/appfolio.js');
var Craigslist = require('./scrape/craigslist.js');

//scrape on startup
//var appfolioArray = ['manifaust','fox','ascendpm','interwest','capitalpropertymgmt','rpmpdx','adi','realtysolutions','kbcmgmt','peak','propmhomes','realpronw','garciagrp','firstclassproperty','popm','gordonproperties','circum','profast','holland','sharpproperty','associatedpm','performance','alder','voss','gebhardtpm','mirrorpropertymanagement','dnpm','anchor','bbmgmt','sullivanmgmt','twentythird','milestonepropertymgmt','acornpm'];
var appfolioArray = ['manifaust'];
var appfolio = new Appfolio(appfolioArray);
appfolio.scrape();

var craigslist = new Craigslist('https://portland.craigslist.org/search/apa?availabilityMode=0&bedrooms=1&laundry=1&laundry=4&max_price=1380&min_price=800&postal=97212&postedToday=1&search_distance=10');
craigslist.scrape();


app.use('/', express.static(path.join(__dirname + '/public')));

app.get('/appfolio', function(req, res){
	res.send(appfolio.getResults());
});
app.get('/craigslist', function(req, res){
	res.send(craigslist.getResults());
});


app.listen('8081')
console.log('Listening on 8081');


