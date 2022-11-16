import {AbstractControl, FormControl, ValidationErrors} from '@angular/forms';
import * as moment from 'moment';

export class CustomValidator {

  static cannotContainSpace(control: AbstractControl): ValidationErrors | null {
    if (control.value) {
      if ((control.value as string).indexOf(' ') >= 0) {
        return {cannotContainSpace: true};
      }
      return null;
    }
    return null;
  }

  static validateNoFullSpace(c: FormControl): { [key: string]: any } | null {
    return (c.value === undefined || c.value === null || c.value.trim() === '') ? {
      customRequired: {
        valid: false
      }
    } : null;
  }

  static compareTwoDates(dateField1, dateField2) {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const firstDate = moment(control.get(dateField1).value).startOf('day');
      const secondDate = moment(control.get(dateField2).value).startOf('day');
      return (firstDate.diff(secondDate)) <= 0 ? null : {
        compareTwoDates: true
      };
    }
  }

  static checkDateAndCurrentDate(control: FormControl): { [key: string]: any } | null {
    if (!control.value) {
      return null;
    }
    const firstDate = moment(control.value).startOf('day');
    const now = moment().startOf('day');
    return (firstDate.diff(now)) <= 0 ? null : {
      lessThanNow: true
    };
  }

}
