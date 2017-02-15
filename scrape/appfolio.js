var request = require('request');
var cheerio = require('cheerio');

var appfolio = function(siteArray) {this.siteArray = siteArray; this.results = []; }

//main scrape method
appfolio.prototype.scrape = function() {

	var outstandingRequests = 0;

	var urls = [];
	var json = [];

	this.siteArray.forEach(function(app,i) {
		var url = 'https://' + app + '.appfolio.com/listings/listings';
	    urls.push(url);
	});

	var results = this.results;


	urls.forEach(function(url,i) {

		outstandingRequests++;

		request(url, function(error, response, html){

			outstandingRequests--;

		    if(!error) {
		        var $ = cheerio.load(html);
		        var locationArray;

		        //cycle through <scripts> to find googleMaps script
			    $('script').each(function(i,element) {
			    		var rawScript = $(this).html();

			    		//markers[] array contains all lat/long data.
				     	if (rawScript.indexOf('markers:') > -1) {
				     		var rawJSON = rawScript.substring(rawScript.indexOf('['),rawScript.indexOf(']')+1);
				     		locationArray = JSON.parse(rawJSON);
				     	}
			    });
			   

			    //Parse each div.result
			    $('.result').each(function(i, element){
			    	var locs = {lat: 0, long: 0};
			    	var pic = $('.js-listing-image',this).attr('data-original');
			    	var body = $(this).children().eq(1);
			        var link = $('.js-hand-hidden-link-to-detail',this).attr('href');
			        var title = $('.js-listing-title',this).text()
			        var rent = $(body).children().eq(0).children().eq(0).children().eq(1).text().replace('$','').replace(',','');
			        var sqft = $(body).children().eq(0).children().eq(1).children().eq(1).text();
			        var bedba = $(body).children().eq(0).children().eq(2).children().eq(1).text();
			        var parsed = bedba.replace(/ /g,'').replace('bd','').replace('ba','').split('/');
			        var bed = parsed[0];
			        var bath = parsed[1];
			        var address = $('.js-listing-address',this).text();
			        var avail = $('.js-listing-available',this).text();
			        var desc = $('.js-listing-description',this).text();
			        var amen = $(body).children().eq(5).text();
			        var mapId = $('.js-listing-map-view-link',this).attr('data-listing-id');

			        if (mapId && locationArray.length) {
			        	locs = findLocs(locationArray,mapId);
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


			        results.push(result);
			    });

			}

	        if (outstandingRequests == 0) {	
	       		console.log(urls.length + ' appfolio sites scraped');
	   		}
		});
	});
}

//expose results array
appfolio.prototype.getResults = function() {
	return this.results;
}

//Search google maps array for lat/long
function findLocs (larray,id) {
	for (var i = 0; i < larray.length; i++) {
		if (larray[i].listing_id == id) {
			return {lat: larray[i].latitude, long: larray[i].longitude};
		}
	}
	return {lat: 0, long: 0};
}	


module.exports = appfolio;