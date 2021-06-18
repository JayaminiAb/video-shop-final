import {Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import moviesData from '../data/videos.json';
import languages from '../data/movieLanguages.json';
import {Movie} from '../../modals/MoviesModel';
import index from '@angular/cli/lib/cli';
import {CommonDataService} from '../../services/common-data.service';
import {MovieRentComponent} from '../movie-rent/movie-rent.component';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.scss']
})
export class MoviesComponent implements OnInit {
  movieList: any[] = moviesData;
  languagesList: any[] = languages;
  filteredMovieList: any;
  nameFilter: string = '';
  languageFilter: string = 'Choose...';
  showFilter: boolean = true;
  selectMovieList: Movie [] = [];
  @ViewChild(MovieRentComponent) child: MovieRentComponent;
  @ViewChildren('checkboxes') checkboxes: QueryList<ElementRef>;


  constructor(private _dataService: CommonDataService) {
  }

  ngOnInit() {
    this.filteredMovieList = this.movieList;
  }

  //clear filter values
  clearFilters() {
    this.languageFilter = 'Choose...';
    this.nameFilter = '';
  }

  //change button text according to click
  toggleFilters() {
    this.showFilter = !this.showFilter;
  }

  /*
  function call due to change in checkbox
  accept selected movie object
   */
  onChangeMovieSelect(selectedMovie, movieID) {
    //if the selectedMovieList is empty selected movie will add to the selectedMovieList
    if (this.selectMovieList.length === 0) {
      this.selectMovieList.push(selectedMovie);
    }

    //if the selected movie list is not empty
    else if (this.selectMovieList.length > 0) {

      //to remove selected movie check whether the movie is in the selectedMovieList
      let movieExist = this.selectMovieList.find(movie =>
        movie.movieID == selectedMovie.movieID
      );

      //if movieExist is false movie will add to selectedMovieList
      //if movieExist is true removing the movie from selectedMovieList
      if (!movieExist) {
        this.selectMovieList.push(selectedMovie);
      } else {
        this.selectMovieList = this.selectMovieList.filter(movie => movie.movieID != selectedMovie.movieID);

      }
    }

  }

//when the cancel button clicked all the data will go to initial state
  cancelClicked() {
    //initiating the movie list without updating and removing selected movies
    for (let i = 0; i < this._dataService.updatedMovieList.length; i++) {
      for (let j = 0; j < this.filteredMovieList.length; j++) {
        if (this.filteredMovieList[j].movieID == this._dataService.updatedMovieList[i].movieID) {
          this.filteredMovieList[j].isAvailable = true;
        }
      }
    }
    this.filteredMovieList = this.filteredMovieList;
    //clearing check boxes after cancelling
    this.checkboxes.forEach((element) => {
      element.nativeElement.checked = false;
    });
    //removing selected movie list and selected input values from child component
    this.child.refreshComponent();
    this.selectMovieList = [];
    this._dataService.updatedMovieList = [];
  }

//after purchasing the selected movies, the movie list will be updated
  saveChanges() {

    for (let i = 0; i < this._dataService.updatedMovieList.length; i++) {
      for (let j = 0; j < this.filteredMovieList.length; j++) {
        if (this._dataService.updatedMovieList[i].movieID == this.filteredMovieList[j].movieID) {
          this.filteredMovieList[j].isAvailable = false;
          this.filteredMovieList[j].availableDate = this._dataService.updatedMovieList[i].returnDate;
        }
      }
    }
    this.child.refreshComponent();
    this.selectMovieList = [];
  }

}
