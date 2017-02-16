var request = require('request');
var cheerio = require('cheerio');

var craigslist = function(query) {
	this.results = []; 
	this.query = query; 
	this.coords = [];
}



function createCoordDict(query,dict,offset) {

	var url = query + ((!offset) ? '' : ('&s=' + offset))
	console.log('query: ' + url);
	console.log('offset: ' + offset + '\n');

	request(url, function(error, response, body){
		var parsed = JSON.parse(body);
		parsed[0].forEach(function(e){
			dict.push(e);
		});

		var resultsLen = parsed[0].length;
		console.log('checking len: ' + resultsLen);

		if ((resultsLen > offset) || (!offset) || (resultsLen == offset)) {
			createCoordDict(query,dict,resultsLen);
		} else {
			console.log('Craiglist coord created: ' + dict.length);
		}
	});
}


craigslist.prototype.scrape = function() {
	createCoordDict(this.query, this.coords);

	var results = this.results;

	request(this.query, function(error, response, html){

	    if(!error) {
      		var $ = cheerio.load(html);

      		$('.result-row').each(function(i, element){
      			var pic = "";
		    	var locs = {lat: 0, long: 0};
		        var bedba = ""
		        var bath = ""
		        var avail = "availability unknown"
		        var desc = ""
		        var amen = ""
		        var mapId = ""
		        var parsed = $('.housing',this).text().replace(/ /g,'').split('-');
		        var bed = parsed[0].replace('br','');
		        var sqft = parsed[1].split('ft')[0].replace('ft','');
		        var title = $('.result-title',this).text()
		        var link = $('.result-title',this).attr('href');
		        var rent = $('.result-price',this).text().replace('$','');
		        var postdate = $('.result-title',this).attr('datetime');
		        var address = $('.result-hood',this).text();

		        var result = {
		        	pic: pic,
		        	site: "craigslist",
		        	title: title,
		        	link: 'https://portland.craigslist.org' + link,
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
		        	long: locs.long,
		        	postdate: postdate
		        };

		        results.push(result);
      		});

	    }
	});
}

//expose results array
craigslist.prototype.getResults = function() {
	return this.results;
}


module.exports = craigslist;