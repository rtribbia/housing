import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListingsComponent }      from './listings.component';

const routes: Routes = [
  { path: '', component: ListingsComponent }
];
@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
