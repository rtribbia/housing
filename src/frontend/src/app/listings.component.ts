import { Component, OnInit } from '@angular/core';
import { Router }            from '@angular/router';
import { Listing }                from './listing';
import { ListingService }         from './listing.service';
import { RentPipe } from './rent.pipe';
import mapGlobals = require('./globals');
import { Pipe } from '@angular/core';



@Component({
  moduleId: module.id,
  selector: 'listing-results',
  templateUrl: './listings.component.html',
  styleUrls: [ './listings.component.css' ]
})
export class ListingsComponent implements OnInit {
  lat: number = 45.5275364;
  lng: number = -122.6707299;
  listings: Listing[] = [];
  selectedListing: Listing;
  minRentFilter:number = 0;
  maxRentFilter:number = 5000;
  addressFilter:string = "";

  constructor(
    private listingService: ListingService,
    private router: Router) { }
  getListings(): void {
    this.listingService
        .getListings()
        .then(listings => {
          this.listings = listings;
        });
  }
  ngOnInit(): void {
    this.getListings();
  }
  onSelect(listing: Listing): void {
    this.selectedListing = listing;
  }
  goToListing(listing: Listing): void {
    window.open(listing.link);
  }

}
