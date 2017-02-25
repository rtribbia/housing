var request = require('request');
var cheerio = require('cheerio');

var appfolio = {
	results: [],
	urls: [],
	outstandingRequests: 0,
	googleMapLocs: []
}


//main scrape method
appfolio.scrape = function(siteArray) {

		siteArray.forEach(function(app,i) {
			var url = 'https://' + app + '.appfolio.com/listings/listings';
		    appfolio.urls.push(url);
		});

		appfolio.urls.forEach(scrapeURL);

}

//expose results array
appfolio.getResults = function() {
	return appfolio.results;
}


function findLocs (id) {
	for (var i = 0; i < appfolio.googleMapLocs.length; i++) {
		if (appfolio.googleMapLocs[i].listing_id == id) {
			return {lat: appfolio.googleMapLocs[i].latitude, long: appfolio.googleMapLocs[i].longitude};
		}
	}
	return {lat: 0, long: 0};
}	

function scrapeURL (url,i) {

	appfolio.outstandingRequests++;

	request(url, function(error, response, html){

		appfolio.outstandingRequests--;

	    if(!error) {
	        var $ = cheerio.load(html);

	        //cycle through <scripts> to find googleMaps script
		    $('script').each(function(element,i){
				var rawScript = $(this).html();
				//markers[] array contains all lat/long data.
			 	if (rawScript.indexOf('markers:') > -1) {
			 		var rawJSON = rawScript.substring(rawScript.indexOf('['),rawScript.indexOf(']')+1);
			 		appfolio.googleMapLocs = JSON.parse(rawJSON);
			 	}
		    });
		   
		    //Parse each div.result
		    $('.result').each(function(i,element){
		    	parseResult(element,url);
		    });

		}

        if (appfolio.outstandingRequests == 0) {	
       		console.log(appfolio.urls.length + ' Appfolio sites scraped.');
       		console.log(appfolio.results.length + ' Appfolio listings found.');
       		//return resolve(results.length);
   		}
	});
}

function parseResult(element,url) {

	var $ = cheerio.load(element);


	var locs = {lat: 0, long: 0};
	var pic = [$('.js-listing-image',element).attr('data-original')];
	var body = $(element).children().eq(1);
    var link = $('.js-hand-hidden-link-to-detail',element).attr('href');
    var title = $('.js-listing-title',element).text()
    var rent = $(body).children().eq(0).children().eq(0).children().eq(1).text().replace('$','').replace(',','');
    var sqft = $(body).children().eq(0).children().eq(1).children().eq(1).text();
    var bedba = $(body).children().eq(0).children().eq(2).children().eq(1).text();
    var parsed = bedba.replace(/ /g,'').replace('bd','').replace('ba','').split('/');
    var bed = parsed[0];
    var bath = parsed[1];
    var address = $('.js-listing-address',element).text();
    var avail = $('.js-listing-available',element).text();
    var desc = $('.js-listing-description',element).text();
    var amen = $(body).children().eq(5).text();
    var mapId = $('.js-listing-map-view-link',element).attr('data-listing-id');

    if (mapId && appfolio.googleMapLocs.length) {
    	locs = findLocs(mapId);
    }

    var result = {
    	pic: pic,
    	site: url,
    	title: title,
    	link: url.replace('/listings/listings',link),
    	rent: parseInt(rent),
    	sqft: parseInt(sqft),
    	bedbath: bedba,
    	bed: parseInt(bed),
    	bath: parseFloat(bath),
    	address: address,
    	availability: avail,
    	description: desc,
    	amenities: amen,
    	mapId: mapId,
    	lat: locs.lat,
    	long: locs.long
    };

    if (result.rent > 700) {
   		appfolio.results.push(result);
    }

}


module.exports = appfolio;