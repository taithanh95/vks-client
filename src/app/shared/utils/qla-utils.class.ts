import {isDevMode} from '@angular/core';
import {Constant} from '../constants/constant.class';

export class WebUtilities {
  static toLowercaseFields(data) {
    return !data ? null : Object.keys(data).reduce((c, k) => (c[k.toLowerCase()] = data[k] === 'N' ? false : data[k] === 'Y' ? true : data[k], c), {});
  }
  static toLowercaseFieldsWithoutConvertBoolean(data) {
    return !data ? null : Object.keys(data).reduce((c, k) => (c[k.toLowerCase()] = data[k], c), {});
  }
  static toUppercaseFields(data) {
    return !data ? null : Object.keys(data).reduce((c, k) => (c[k.toUpperCase()] = data[k], c), {});
  }
  static calculateDiff(fromDate, toDate){
    return Math.floor((Date.UTC(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate()) - Date.UTC(toDate.getFullYear(), toDate.getMonth(), toDate.getDate()) ) /(1000 * 60 * 60 * 24));
  }
  static getLoggedSppId(){
    return localStorage.getItem(Constant.SPPID);
  }
  static getBeginSppId(){
    return localStorage.getItem(Constant.SPPID_LOGIN);
  }
  static getLoggedSpp(){
    return  this.toLowercaseFieldsWithoutConvertBoolean(JSON.parse(localStorage.getItem(Constant.SPP)));
  }
}
