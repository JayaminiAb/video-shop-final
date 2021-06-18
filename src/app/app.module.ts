import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import {RouterModule} from '@angular/router';
import { MembersComponent } from './components/members/members.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MoviesComponent } from './components/movies/movies.component';
import { MovieRentComponent } from './components/movie-rent/movie-rent.component';
import { NameFilterPipe } from './pipes/name-filter.pipe';
import { LanguageFilterPipe } from './pipes/language-filter.pipe';
import {DatePipe} from '@angular/common';



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MembersComponent,
    MoviesComponent,
    MovieRentComponent,
    NameFilterPipe,
    LanguageFilterPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,


  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
