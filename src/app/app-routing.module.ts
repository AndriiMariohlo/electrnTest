import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './shared/components';
import {HomeComponent} from './home/home.component';
import {AppComponent} from "./app.component";


const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {}),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
