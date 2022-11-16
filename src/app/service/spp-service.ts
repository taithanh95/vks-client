import {Injectable} from '@angular/core';
import {BaseService} from '../shared/base-service/base-service.service';
import {Observable} from 'rxjs';
import {SearchUser} from '../model/searchUser.class';
import {UrlConstant} from '../shared/constants/url.class';
import {Constant} from '../shared/constants/constant.class';

@Injectable()
export class SppService  extends  BaseService {
  sppCase: any;
  register: any;
  sppCaseSplit: any;
  sppCaseJoin: any;
  getCurrentSppCase(): any {
    if (!this.sppCase) {
      this.sppCase = JSON.parse(localStorage.getItem(Constant.SPP_CASE));
    }
    return this.sppCase;
  }
  setCurrentSppCase(sppCase: any): void {
    localStorage.setItem(Constant.SPP_CASE, JSON.stringify(sppCase));
    this.sppCase = sppCase;
  }
  getCurrentSppRegister(): any {
    if (!this.register) {
      this.register = JSON.parse(localStorage.getItem(Constant.SPP_REGISTER));
    }
    return this.register;
  }
  setCurrentSppRegister(register: any): void {
    localStorage.setItem(Constant.SPP_REGISTER, JSON.stringify(register));
    this.register = register;
  }

  getCurrentSppCaseSplit(): any {
    if (!this.sppCaseSplit) {
      this.sppCaseSplit = JSON.parse(localStorage.getItem(Constant.SPP_CASE_SPLIT));
    }
    return this.sppCaseSplit;
  }
  setCurrentSppCaseSplit(sppCaseSplit: any): void {
    localStorage.setItem(Constant.SPP_CASE_SPLIT, JSON.stringify(sppCaseSplit));
    this.sppCaseSplit = sppCaseSplit;
  }

  getCurrentSppCaseJoin(): any {
    if (!this.sppCaseJoin) {
      this.sppCaseJoin = JSON.parse(localStorage.getItem(Constant.SPP_CASE_JOIN));
    }
    return this.sppCaseJoin;
  }
  setCurrentSppCaseJoin(sppCaseJoin: any): void {
    localStorage.setItem(Constant.SPP_CASE_JOIN, JSON.stringify(sppCaseJoin));
    this.sppCaseJoin = sppCaseJoin;
  }

}
