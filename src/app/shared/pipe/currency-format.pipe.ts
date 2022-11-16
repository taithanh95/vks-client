import { Pipe, PipeTransform } from '@angular/core';
import {NumberUtils} from '../utils/number-utils.class';

@Pipe({
  name: 'currencyFormat'
})
export class CurrencyFormatPipe implements PipeTransform {

  transform(value: number): any {
    if(value) {
      return NumberUtils.currencyFormat(value.toString());
    }
    return value;
  }

}
