var request = require('request');
var cheerio = require('cheerio');

var princeton = {
	results: [],
	coords: [],
	taskRunner: null
}


princeton.scrape = function(URL, taskRunner) {
   princeton.taskRunner = taskRunner;
   request(URL, function(error, response, html){

   		if (!error) {
   			var $ = cheerio.load(html);
   			var query = 'http://www.princetonproperty.com/ajax/get_all_points/' + $('.q').html();
   			scrapeJSON(query);
   		}
   });

}

function scrapeJSON(query) {
	console.log(query);
	
	request(query, function(error, response, html){
		if (!error) {

			var json = JSON.parse(html);

			json.forEach(function(res) {
				var rent = 0;
				var bath;

				//some rents are listed at 0?
				if (res.rent_low && res.rent_high)
					rent = (parseInt(res.rent_low) + parseInt(res.rent_high)) / 2;

				//some bathroom values look like this: "1, 1.5, 2"
				if (res.bathrooms.indexOf(',') > -1) {
					bath = res.bathrooms;
				} else {
					bath = parseFloat(res.bathrooms);
				}
			
				var result = {
			    	pic: ['http://www.princetonproperty.com/uploads/complexes/' + res.id + '/' + res.preview_image.image],
			    	site: 'http://www.princetonproperty.com/map_view/',
			    	title: res.name,
			    	link: 'http://www.princetonproperty.com/complex/' + res.short_name,
			    	rent: rent,
			    	sqft: null,
			    	bedbath: null,
			    	bed: null,
			    	bath: bath,
			    	address: res.address + ', ' + res.city + ', ' + res.state,
			    	availability: null,
			    	description: null,
			    	amenities: null,
			    	mapId: null,
			    	lat: parseFloat(res.lat),
			    	long: parseFloat(res.long)
  			    };

  			    princeton.results.push(result);
			});
			console.log(princeton.results.length + ' Princeton listings found.');
			princeton.taskRunner.setComplete('princeton');
		}
	});

}


// //expose results array
princeton.getResults = function() {
	return results;
}


module.exports = princeton;

