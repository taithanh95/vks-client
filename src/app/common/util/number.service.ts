import {Injectable} from '@angular/core';

@Injectable()
export class NumberService {
  constructor() {
  }

  getRandomNumber(maxValue: number) {
    return Math.floor(Math.random() * maxValue) + 1;
  }

  numberWithCommas(x) {
    // tslint:disable-next-line:radix
    const num = parseInt(x);
    const parts = num.toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join(',');
  }
}
