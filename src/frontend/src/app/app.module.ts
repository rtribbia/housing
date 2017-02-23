import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import { HttpModule, JsonpModule }    from '@angular/http';

import { AppRoutingModule } from './app-routing.module';
// Imports for loading & configuring the in-memory web api

import { AppComponent } from './app.component';
import { ListingsComponent } from './listings.component';
import { ListingService } from './listing.service';
import { MdCardModule } from '@angular2-material/card';
import { MdButtonModule } from '@angular2-material/button';
import { MdIconModule } from '@angular2-material/icon';
import { MdIconRegistry } from '@angular2-material/icon';
import { MdInputModule } from '@angular2-material/input';
import { AgmCoreModule } from "angular2-google-maps/core";
import { RentPipe } from './rent.pipe';



@NgModule({
  imports: [
    AgmCoreModule.forRoot({
      apiKey: "AIzaSyBAhqhV92y805_riwBj3eqRBaVjTK3vwAU"
    }),
    BrowserModule,
    MdCardModule,
    MdButtonModule,
    MdIconModule,
    MdInputModule,
    FormsModule,
    HttpModule,
    AppRoutingModule
  ],
  declarations: [
    AppComponent,
    ListingsComponent,
    RentPipe
  ],
  providers: [ ListingService, MdIconRegistry ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
