import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Movie} from '../../modals/MoviesModel';
import {MemberModel} from '../../modals/MemberModel';
import members from '../data/members.json';
import memberTypeData from '../data/memberTypes.json';
import {CommonDataService} from '../../services/common-data.service';
import {DatePipe} from '@angular/common';


@Component({
  selector: 'app-movie-rent',
  templateUrl: './movie-rent.component.html',
  styleUrls: ['./movie-rent.component.scss']
})

export class MovieRentComponent implements OnInit {
  memberList: MemberModel[] = members;
  memberTypeData = memberTypeData;
  enteredMobileNumber: string = '';
  @Input() selectedMovieList: Movie[] = [];
  @Output() cancelClicked: EventEmitter<any> = new EventEmitter<any>();
  @Output() goBackClicked: EventEmitter<any> = new EventEmitter<any>();

  memberOfMobileNumber: any;
  isNumberValid: boolean = true;
  isNumberExist: boolean = true;
  returnDate = new Date();
  rentType: any;
  selectedRentTypes: any;
  selectedReturnDates: any;
  updatedSelectedMovieObject: any;
  getCurrentDate: Date = new Date();
  hideUpdatedTable = true;
  hideAddToCart = true;
  hideWarning = false;
  hideAddMore = false;
  hideSave = true;
  inputDisabled: boolean;

  totalAmount: number = 0;
  today = new Date(this.datePipe.transform(this.getCurrentDate, 'yyyy-MM-dd'));
  todayForInput = '';


  constructor(private _dataService: CommonDataService, public datePipe: DatePipe) {
  }

  ngOnInit() {
    //setting a minimum date(today) to date input
    this.todayForInput = this.datePipe.transform(this.today, 'yyyy-MM-dd');
  }

  //generate click event in parent component to cancel the process
  clickCancel() {
    this._dataService.updatedMovieList = this.updatedSelectedMovieObject;
    this.cancelClicked.emit();
  }

  //search member from the member lis
  searchMember() {

    //check number is valid from a method in the service file
    this.isNumberValid = this._dataService.validateMobileNumberPattern(this.enteredMobileNumber);

    //check number is existing from a method in the service file
    this.isNumberValid ? this.isNumberExist = this._dataService.isMobileNumberExist(this.enteredMobileNumber, this.memberList) : true;

    //if the above conditions are met filtering the member list to observe member
    if (this.isNumberValid && this.isNumberExist) {
      this.memberOfMobileNumber = this.memberList.filter(member => member.memberMobileNo == this.enteredMobileNumber);
    }
    this.checkInputCompletion();

  }

  //while editing mobile number clear validations and hide member data
  onChangeMobileNumber() {
    this.isNumberExist = this.isNumberValid = true;
    this.memberOfMobileNumber = [];
  }

  //generate list which has renting type for each movie
  onChangeRentType(movieId, rentType) {
    this.selectedRentTypes = this.onChangeValuesRentType(movieId, rentType);
    this.checkInputCompletion();
  }

  //generate list which has returning date for each movie
  onChangeDateValues(movieId, date) {
    this.selectedReturnDates = this.onChangeValuesReturnDate(movieId, date);
    this.checkInputCompletion();
  }

  onChangeValuesReturnDate(movieId, date) {
    //add first item to the list after checking undefined
    if (this.selectedReturnDates == undefined) {
      //if list is empty add 1st element
      this.selectedReturnDates = [{movieID: movieId, returnDate: date}];
    }
    //if there is one element in the list
    else if (this.selectedReturnDates.length == 1) {
      //check if the same element values are entered
      if (this.selectedReturnDates.filter(item => item.movieID == movieId).length > 0) {
        //if the values are same for the existing element, element will be updated
        this.selectedReturnDates = [{movieID: movieId, returnDate: date}];
      }
      //if the entered values are not same adding new values to the existing list
      else {
        this.selectedReturnDates = [{movieID: movieId, returnDate: date}, ...this.selectedReturnDates];
      }
    }
    //if there are more than one element
    else {
      //check entered values are exists in the list
      if (this.selectedReturnDates.find(item => item.movieID == movieId)) {
        //if exist filtering other elements
        let filteredList = this.selectedReturnDates.filter(item => item.movieID != movieId);
        //then updating existing element and adding it to the list
        this.selectedReturnDates = [{movieID: movieId, returnDate: date}, ...filteredList];
      }
      //adding new element to existing list
      else {
        this.selectedReturnDates = [{movieID: movieId, returnDate: date}, ...this.selectedReturnDates];
      }
    }
    //returning relevant list for each method call
    return this.selectedReturnDates;
  }

  onChangeValuesRentType(movieId, rentType) {
    //add first item to the list after checking undefined
    if (this.selectedRentTypes == undefined) {
      //if list is empty add 1st element
      this.selectedRentTypes = [{movieID: movieId, rentType: rentType}];
    }
    //if there is one element in the list
    else if (this.selectedRentTypes.length == 1) {
      //check if the same element values are entered
      if (this.selectedRentTypes.filter(item => item.movieID == movieId).length > 0) {
        //if the values are same for the existing element, element will be updated
        this.selectedRentTypes = [{movieID: movieId, rentType: rentType}];
      }
      //if the entered values are not same adding new values to the existing list
      else {
        this.selectedRentTypes = [{movieID: movieId, rentType: rentType}, ...this.selectedRentTypes];
      }
    }
    //if there are more than one element
    else {
      //check entered values are exists in the list
      if (this.selectedRentTypes.find(item => item.movieID == movieId)) {
        //if exist filtering other elements
        let filteredList = this.selectedRentTypes.filter(item => item.movieID != movieId);
        //then updating existing element and adding it to the list
        this.selectedRentTypes = [{movieID: movieId, rentType: rentType}, ...filteredList];
      }
      //adding new element to existing list
      else {
        this.selectedRentTypes = [{movieID: movieId, rentType: rentType}, ...this.selectedRentTypes];
      }
    }
    //returning relevant list for each method call
    return this.selectedRentTypes;
  }

  //creating new item list with amount to show the list after adding cart
  generateNewListWithAmount() {
    //sorting the list according to movieID
    this.selectedReturnDates = this.selectedReturnDates.sort((a, b) => a.movieID - b.movieID);
    this.selectedRentTypes = this.selectedRentTypes.sort((a, b) => a.movieID - b.movieID);
    this.selectedMovieList = this.selectedMovieList.sort((a, b) => a.movieID - b.movieID);

    //loop through selectedMovieList
    for (let i = 0; i < this.selectedMovieList.length; i++) {

      //creating a new list updatedSelectedMovieObject
      //adding first item to list
      if (this.updatedSelectedMovieObject == undefined) {
        this.updatedSelectedMovieObject = [{
          movieID: this.selectedMovieList[i].movieID,
          movieName: this.selectedMovieList[i].movieName,
          movieType: this.selectedMovieList[i].movieType,
          rentType: this.selectedRentTypes[i].rentType,
          returnDate: this.selectedReturnDates[i].returnDate,
          status: false,
          //calling calculateAmount method to calculate amount for each movie
          amount: this.calculateAmount(this.memberOfMobileNumber[0].memberType, this.selectedReturnDates[i].returnDate, this.selectedRentTypes[i].rentType)
        }];
      }
      //adding other items to the list
      else {
        this.updatedSelectedMovieObject = [{
          movieID: this.selectedMovieList[i].movieID,
          movieName: this.selectedMovieList[i].movieName,
          movieType: this.selectedMovieList[i].movieType,
          rentType: this.selectedRentTypes[i].rentType,
          returnDate: this.selectedReturnDates[i].returnDate,
          status: false,
          amount: this.calculateAmount(this.memberOfMobileNumber[0].memberType, this.selectedReturnDates[i].returnDate, this.selectedRentTypes[i].rentType)
        }, ...this.updatedSelectedMovieObject];
      }
    }

  }

//calculate amount for each element in the selected movie list
  calculateAmount(selectedMemberType, returnDate, rentType) {


    // creating date object from the input returnDate
    let returnDateVal = new Date(returnDate);
    //calculate number of days and roundup
    let numberOfDays = Math.ceil((returnDateVal.getTime() - this.today.getTime()) / (1000 * 3600 * 24));
    //calculate number of weeks and roundup
    let numberOfWeeks = Math.ceil(numberOfDays / 7);
    let amount;
    //observing the memberType data for the selected member type
    let memberType = this.memberTypeData.filter(item => item.memberType == selectedMemberType);

    //check the conditions for calculate amount
    if (rentType == 'Daily' && selectedMemberType == 'Premium') {
      amount = memberType[0].dailyRent * numberOfDays;
    }
    if (rentType == 'Weekly' && selectedMemberType == 'Premium') {
      amount = memberType[0].weeklyRent * numberOfWeeks;
    }
    if (rentType == 'Daily' && selectedMemberType == 'Basic') {
      amount = memberType[0].dailyRent * numberOfDays;
    }
    if (rentType == 'Weekly' && selectedMemberType == 'Basic') {
      amount = memberType[0].weeklyRent * numberOfWeeks;
    }

    return amount;
  }

  //after selecting rent type and return date add to cart will appear
  addToCart() {
    this.inputDisabled = true;
    this.hideUpdatedTable = false;
    //calling method to generate new updated list with amount
    this.generateNewListWithAmount();
    this.hideAddToCart = true;
    this.hideAddMore = true;
    this.hideSave = false;

    //calculate the total amount
    for (let i = 0; i < this.updatedSelectedMovieObject.length; i++) {
      this.totalAmount += this.updatedSelectedMovieObject[i].amount;
    }
    //assigning the updated movie list data for global usage
    this._dataService.updatedMovieList = this.updatedSelectedMovieObject;
  }

  //check all the inputs are completed to show add to card
  checkInputCompletion() {
    if (this.memberOfMobileNumber == undefined
      || this.memberOfMobileNumber.length == 0
      || this.selectedRentTypes == undefined
      || this.selectedReturnDates == undefined
      || this.selectedMovieList.length > this.selectedRentTypes.length
      || this.selectedMovieList.length > this.selectedReturnDates.length
      || !this.isNumberExist
      || !this.isNumberValid) {
      this.hideAddToCart = true;
    } else {
      this.hideAddToCart = false;
      this.hideWarning = true;
    }

  }

//set values to initial state after saving
  refreshComponent() {
    this.selectedMovieList = [];
    this.updatedSelectedMovieObject = [];
    this.hideUpdatedTable = true;
    this.inputDisabled = false;
    this.hideAddToCart = true;
    this.hideSave = true;
    this.hideAddMore = false;
    this.hideWarning = false;
    this.isNumberValid = true;
    this.isNumberExist = true;
    this.memberOfMobileNumber = [];
    this.enteredMobileNumber = '';
    this.selectedReturnDates = [];
    this.selectedRentTypes = [];
    this.totalAmount = 0;

  }

  //calling a parent component method to save data
  onSaveChanges() {
    this.goBackClicked.emit();
    this.hideSave = true;
  }
}
