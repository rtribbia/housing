var request = require('request');
var cheerio = require('cheerio');

var craigslist = {
	results: [],
	coords: [],
	taskRunner: null
}


//requests for both JSON and HTML are async, so these booleans are used to keep track of status.
var HTMLcomplete = false;
var JSONcomplete = false;

function log(msg) {
	console.log(msg);
}

function getJSONdata(id) {
	var json = {lat: 0, long: 0, pic: ""};

	for (var i = 0; i < craigslist.coords.length; i++) {

		var str = craigslist.coords[i].PostingID.toString();

		if (str.indexOf(id) > -1) {
			json.lat = craigslist.coords[i].Latitude;
			json.long = craigslist.coords[i].Longitude;
			json.pic = craigslist.coords[i].ImageThumb ? craigslist.coords[i].ImageThumb : "";
			break;
		}

	}

	return json;
}

function pairResults() {
	//async scrape of HTML and JSON done?
	if (HTMLcomplete && JSONcomplete)  {
		

		craigslist.results.forEach(function(result) {
			var id = result.link.split('/')[5].replace('.html','');
			var json = getJSONdata(id);
			
			result.lat = json.lat;
			result.long = json.long;
					
			if (json.pic.length > 0) {
				var images = [];
				var imgArr = json.pic.replace('https://images.craigslist.org/','').split(',');
				imgArr.forEach(function(imgid) {
					var imgUrl = "https://images.craigslist.org/" + imgid.replace('1:','').replace('_50x50c.jpg','') + '_600x450.jpg';
					images.push(imgUrl);
				});
				result.pic = images;
			}
		});

		log(craigslist.results.length + ' Craigslist listings found.');
		craigslist.taskRunner.setComplete('craigslist');
	}
}

function scrapeJSON(query,offset) {

	var url = query + ((!offset) ? '' : ('&s=' + offset));

	//convert provided HTML query copied from browser, to query returning json
	url = url.replace('/search/','/jsonsearch/');

	request(url, function(error, response, body){
		var parsed = JSON.parse(body);
		parsed[0].forEach(function(e){
			craigslist.coords.push(e);
		});

		var resultsLen = parsed[0].length;

		if ((resultsLen > offset) || (!offset) || (resultsLen == offset)) {
			scrapeJSON(query,resultsLen);
		} else {
			JSONcomplete = true;
			pairResults();
		}
	});
}

function scrapeHTML(query,offset){

	var url = query + ((!offset) ? '' : ('&s=' + offset));
	request(url, function(error, response, html){
	    if(!error) {

      		var $ = cheerio.load(html);
      		var resultsLen = $('.result-row').length;

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

		        craigslist.results.push(result);
      		});

      		//results are no clearly paginated -- recursively scrape until end of the line
			if ((resultsLen > offset) || (!offset) || (resultsLen == offset)) {
				scrapeHTML(query,resultsLen);
			} else {
				HTMLcomplete = true;
				pairResults();
			}
	    }
	});

}


craigslist.scrape = function(query, taskRunner) {
	craigslist.taskRunner = taskRunner;
	scrapeJSON(query);
	scrapeHTML(query);

}

//expose HTML array
craigslist.getResults = function() {
	return craigslist.results;
}

//espose JSON array
craigslist.getJSON = function() {
	return craigslist.coords;
}


module.exports = craigslist;