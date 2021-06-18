import {Component, OnInit} from '@angular/core';
import members from '../data/members.json';
import memberTypes from '../data/memberTypes.json';
import {CommonDataService} from '../../services/common-data.service';


@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.scss']
})
export class MembersComponent implements OnInit {

  usingMemberTypes: any;
  memberList: [] = members;
  updatedMemberList: any;
  memberMobileNum = '';
  memberName = '';
  memberType = false;
  memberTypeValue = '';
  mobileNumberExist: any;
  mobNumberPattern = true;
  memberNameValid = true;


  constructor(private _dataService: CommonDataService) {
  }

  ngOnInit() {
    //initiate the member list
    this.updatedMemberList = this.memberList;
    this.usingMemberTypes = memberTypes;
  }

  // Add new member and it will show in the member list
  addNewMember() {

    this.memberTypeValue = this.memberType ? 'Premium' : 'Basic';
    // this.memberType ? this.memberTypeValue = 'Premium' : this.memberTypeValue = 'Basic';

    //validate mobile number
    this.mobNumberPattern = this._dataService.validateMobileNumberPattern(this.memberMobileNum);

    //member name validation
    this.isNameValid(this.memberName);

    // check mobile number already exist
    this.isMobileNumberExist(this.memberMobileNum);


    if (this.mobNumberPattern && !this.mobileNumberExist) {

      //create new member object
      const member = {
        memberID: Math.floor(Math.random() * 100),
        memberName: this.memberName,
        memberMobileNo: this.memberMobileNum,
        memberType: this.memberTypeValue
      };

      // add new member member list
      this.updatedMemberList = [member, ...this.updatedMemberList];

      //call for clear inputs
      this.clearInputs();
    }
  }

  // Check existence of the mobile number
  isMobileNumberExist(enteredMobileNum) {
    //filter the mobile  numbers of the list and get the member list which has the entered mobile number
    this.mobileNumberExist = this._dataService.isMobileNumberExist(enteredMobileNum, this.updatedMemberList);
  }

  //check name has more than 2 characters
  isNameValid(enteredName) {
    this.memberNameValid = enteredName.trim().length > 2;
    // enteredName.trim().length > 2 ? this.memberNameValid = true : this.memberNameValid = false;
  }

  // Clear Input fields
  clearInputs() {
    this.memberMobileNum = '';
    this.memberName = '';
    this.memberType = false;
  }

  //clear validation while editing input
  onChangeMobileNumber() {
    this.mobileNumberExist = false;
    this.mobNumberPattern = true;
  }
  //while editing inputs remove validation messages
  onChangeName() {
    this.memberNameValid = true;
  }
}
