import {FormGroup} from "@angular/forms";
import {Subscription} from "rxjs";

export class DateUtils {
  static checkRangeDate(fromDateCheck, toDateCheck, fromDate, toDate): any {
    if (!fromDate || !toDate ) { return false; }
    const fdateCheck = Date.parse(fromDateCheck);
    const tdateCheck = Date.parse(toDateCheck);
    const fdate = Date.parse(fromDate);
    const tdate = Date.parse(toDate);

    if (
      (fdateCheck <= fdate && tdateCheck  >= fdate && tdateCheck <= tdate) ||
      (fdateCheck >= fdate && fdateCheck <= tdate && tdateCheck  >= fdate && tdateCheck <= tdate) ||
      (fdateCheck <= fdate && tdateCheck >= tdate) ||
      (fdateCheck >= fdate && fdateCheck  <= tdate && tdateCheck >= tdate)) {
      return true;
    }
    return false;
  }


  static checkBackDate( date1: Date, date2: Date, backNumber: number  ): number {
    if (date1 && date2 && date1 instanceof Date && date2 instanceof Date) {
      const backDate = new Date(date2.getFullYear() - backNumber, date2.getMonth(), date2.getDate());
      if (date1.getTime() > backDate.getTime()) {
        return 1;
      } else if (date1.getTime() === backDate.getTime()) {
        return 0;
      } else {
        return -1;
      }
    }

    return null;

  }

  static compareDate(date1: Date, date2: Date, back: number = 0): number {
    if (date1 && date2 && date1 instanceof Date && date2 instanceof Date) {

      const d1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
      const d2 = new Date(date2.getFullYear()  - back, date2.getMonth(), date2.getDate());
      if (d1 > d2) { return 1; } else if ( d1 < d2) { return -1; } else { return 0; }
    }
    return null;
  }

  static constraintYearAndDate(formGroup: FormGroup, year: string, date: string): Subscription {
    const subscription: Subscription  = new Subscription();
    subscription.add(formGroup.get(year).valueChanges.subscribe((next) => {
      const currentDateVal = formGroup.get(date).value;
      if (next && !isNaN(next)) {
        const year: number = (Number(next) > 275760 || Number(next) < 1) ? new Date().getFullYear() : Number(next);
        if (currentDateVal) {
          const currentDate: Date = new Date(currentDateVal);
          const needChangeDate = !isNaN(Date.parse(currentDateVal)) && currentDate.getFullYear() !== year;
          if (needChangeDate) {
            currentDate.setFullYear(year);
            formGroup.get(date).setValue(currentDate);
          }
        } else {
          const defaultDate: Date = new Date(year, 0, 1);
          formGroup.get(date).setValue(defaultDate);
        }
      } else {
        if (currentDateVal && !isNaN(Date.parse(currentDateVal))) {
          const currentDate: Date = new Date(currentDateVal);
          formGroup.get(year).setValue(currentDate.getFullYear());
        }
      }
    }));
    subscription.add(formGroup.get(date).valueChanges.subscribe((next) => {
      if (next && !isNaN(Date.parse(next))) {
        const date: Date = new Date(next);
        formGroup.get(year).setValue(date.getFullYear().toString(10));
      } else {
        if (!isNaN(formGroup.get(year).value)) {
          const year: number = (Number(next) > 275760 || Number(next) < 1) ? new Date().getFullYear() : Number(next);
          const defaultDate: Date = new Date(year, 0, 1);
          formGroup.get(date).setValue(defaultDate);
        }
      }
    }))
    return subscription;
  }
}
