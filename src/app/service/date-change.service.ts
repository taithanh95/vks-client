import {Injectable} from '@angular/core';
import * as moment from 'moment';
import {Constant} from '../shared/constants/constant.class';
import {NotificationService} from './notification.service';
import {DatePipe} from '@angular/common';

@Injectable()
export class DateChangeService {

  constructor(
    private notificationService: NotificationService,
    private datePipe: DatePipe) {
  }

  onDateValueChange(event: any): any {
    const value = event.target.value;
    if ((value.includes('/') && value.length >= 10) || (!value.includes('/') && value.length >= 8)) {
      if (!value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/) && (value.includes('/') && value.length >= 10)) {
        this.notificationService.showNotification(Constant.ERROR, `Sai định dạng ngày tháng ${Constant.DATE_FMT}.`);
        return;
      }
      const date: Date = this.stringToDateWithFormat(value, 'DDMMYYYY');
      if (isNaN(date.getTime())) {
        this.notificationService.showNotification(Constant.ERROR, 'Ngày tháng không hợp lệ.');
        return;
      } else {
        return date;
      }
    }
  }

  dateToString(date: Date | string): string {
    if (date instanceof Date) {
      return this.datePipe.transform(date, Constant.DATE_FMT);
    } else {
      return this.datePipe.transform(this.convertTimeToBeginningOfTheDay(date), Constant.DATE_FMT)
    }
  }

  convertTimeToBeginningOfTheDay(date: Date | string): Date {
    if (date instanceof Date) {
      date.setHours(0, 0, 0, 0);
    } else {
      date = this.stringToDateWithFormat(date, Constant.DATE_FMT);
      date.setHours(0, 0, 0, 0);
    }
    return date;
  }

  stringToDateWithFormat(inputString: string, format: string): Date {
    return moment(inputString, format).toDate();
  }

}
