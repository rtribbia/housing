var request = require('request');
var cheerio = require('cheerio');

var cap = {
	results: [],
	urls: [],
	outstandingRequests: 0
}


function scrapeURL(listing,i) {
	cap.outstandingRequests++;
	request(listing, function(error, response, html){
		cap.outstandingRequests--;
		if (!error) {
			parseResult(html,listing);
		}
		if (cap.outstandingRequests == 0) {
			console.log(cap.results.length + ' Capital Property Mgmt listings found.');
		}

	});
}

function parseResult(html,listingURL) {
	
	var $ = cheerio.load(html);

	var pic = [];
	var locs = {lat: 0, long: 0};

	//Grab lat/lng from google maps js
	$('script').each(function(i,js) {
		if ($(js).html().indexOf('latitude') > -1) {
			var lat = $(js).html().split('*/')[1].split('\n')[1];
			var lng = $(js).html().split('*/')[1].split('\n')[2];
			locs.lat = parseFloat(lat.split('= ')[1].replace(';',''));
			locs.long = parseFloat(lng.split('= ')[1].replace(';',''));
		}

	});

	$('.rsImg').each(function(i,img) {
		var imgUrl = 'http://www.capmng.com' + $(img).attr('src');
		pic.push(imgUrl);
	});

	var details = $('.details-title').html().split('<br>');
	var bed = (details[0].indexOf('Studio') > -1) ? 0 : details[0].replace(' Bedroom','');
	var rent = parseInt(details[1].replace('$','').replace(',',''));
	var title = $('.aptcontent').children('h2').html();
	var address = $('.aptcontent').children('.address').html().replace('<br>',' ');
	var avail = $('.availdate').html();

	
	
	var body = "";
    var link = listingURL;
    var sqft = "";
    var bedba = "";
    var bath = "";
    var desc = "";
    var amen = "";

    var result = {
    	pic: pic,
    	site: "http://www.capmng.com/availability/details.php",
    	title: title,
    	link: link,
    	rent: parseInt(rent),
    	sqft: parseInt(sqft),
    	bedbath: bedba,
    	bed: parseInt(bed),
    	bath: parseFloat(bath),
    	address: address,
    	availability: avail,
    	description: desc,
    	amenities: amen,
    	lat: locs.lat,
    	long: locs.long
    };

    cap.results.push(result);

}

cap.scrape = function(url) {

   request(url, function(error, response, html){

   		if (!error) {
   			var $ = cheerio.load(html);

   			$('.sub-aptlist').each(function(i,section) {
   				if ($(this).attr('class').indexOf('hidden') == -1) {
   					$(this).children('li').each(function(j,listing) {
   						var listingURL = 'http://www.capmng.com/availability/details.php' + $(listing).children('a').attr('href');
   						cap.urls.push(listingURL);
   					});
   				}
   			});
   			
   			cap.urls.forEach(scrapeURL);
   		}
   });

}

// //expose results array
cap.getResults = function() {
	return cap.results;
}


module.exports = cap;

