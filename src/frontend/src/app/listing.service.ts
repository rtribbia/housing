import { Injectable }    from '@angular/core';
import { Headers, Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { Listing } from './listing';


@Injectable()
export class ListingService {

  private listingsUrl = '/craigslist';  // URL to web api

  constructor(private http: Http) { }
  getListings(): Promise<Listing[]> {
    return this.http.get(this.listingsUrl)
               .toPromise()
               .then(response => response.json() as Listing[])
               .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
