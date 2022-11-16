import {Injectable} from '@angular/core';
import {formatDate} from '@angular/common';
import * as moment from 'moment';
import {NgbDateAdapter, NgbDateParserFormatter, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';

@Injectable()
export class DateService {
  constructor() {
  }
  VN_DATE_FORMAT = 'DD/MM/YYYY';

  convertDateToStringByPattern(value: any, patten: string) {
    return formatDate(value, patten, 'en-GB');
  }

  getFirstDayOfMonth() {
    const date = new Date(), y = date.getFullYear(), m = date.getMonth();
    const firstDay = new Date(y, m, 1);
    return firstDay;
  }

  getDayOfPreviousYear() {
    const date = new Date(), y = date.getFullYear(), m = date.getMonth(), d = date.getDate();
    const firstDay = new Date(y-1, m, d);
    return firstDay;
  }

  getFirstDayOfYear() {
    const date = new Date(), y = date.getFullYear(), m = date.getMonth();
    const firstDay = new Date(y, 0, 1);
    return firstDay;
  }

  getCurrentDate() {
    return new Date();
  }

  getFirstDayOfMonthInString(patten: string) {
    return (moment(this.getFirstDayOfMonth())).format(patten);
  }

  getCurrentDateInString(patten: string) {
    return (moment(this.getCurrentDate())).format(patten);
  }

  dateToString(inputdate: Date, formatDate: string) {
    return (moment(inputdate)).format(formatDate);
  }

  stringToDate(inputString: string, patten?: string) {
    return moment(inputString, 'DD/MM/YYYY').toDate()
  }
}

@Injectable()
export class CustomAdapter extends NgbDateAdapter<string> {

  readonly DELIMITER = '/';

  fromModel(value: string | null): NgbDateStruct | null {
    if (value) {
      const date = value.split(this.DELIMITER);
      return {
        day: parseInt(date[0], 10),
        month: parseInt(date[1], 10),
        year: parseInt(date[2], 10)
      };
    }
    return null;
  }

  toModel(date: NgbDateStruct | null): string | null {
    return date ? date.day + this.DELIMITER + date.month + this.DELIMITER + date.year : null;
  }
}

@Injectable()
export class CustomDateParserFormatter extends NgbDateParserFormatter {

  readonly DELIMITER = '/';

  parse(value: string): NgbDateStruct | null {
    if (value) {
      const date = value.split(this.DELIMITER);
      return {
        day: parseInt(date[0], 10),
        month: parseInt(date[1], 10),
        year: parseInt(date[2], 10)
      };
    }
    return null;
  }

  format(date: NgbDateStruct | null): string {
    return date ? date.day + this.DELIMITER + date.month + this.DELIMITER + date.year : '';
  }

  ngbDateStructToDate(date: NgbDateStruct | null): Date {
    return date ? new Date(date.year, date.month - 1, date.day) : null;
  }

}
