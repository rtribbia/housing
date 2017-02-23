import { Pipe, PipeTransform } from '@angular/core';
import { Listing }                from './listing';

@Pipe({
  name: 'rent'
})

export class RentPipe implements PipeTransform {

  transform(value: any, minRent:any, maxRent:any, address:any): any {

    return value.filter((listing:Listing) => {
    	var addMatch = true;
    	var max = maxRent ? (listing.rent <= +maxRent) : true;
    	var min = minRent ? (listing.rent >= +minRent) : true;
    	if (address) {
    		var listingAdd = listing.address.toLowerCase();
    		addMatch = (listingAdd.indexOf(address.toLowerCase()) > -1);
    	}
      return (addMatch && min && max);
    });
  }
}