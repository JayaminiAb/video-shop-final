import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonDataService {
  public updatedMovieList: any;

  constructor() {
  }

  //mobile number validate
  validateMobileNumberPattern(mobileNumber) {
    return (/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im.test(mobileNumber));
  }

  isMobileNumberExist(enteredMobileNum, memberList) {
    //filter the mobile  numbers of the list and get the member list which has the entered mobile number
    return memberList.filter(member =>
      member.memberMobileNo.includes(enteredMobileNum)).length != 0;
  }


}
