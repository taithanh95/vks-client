import { Pipe, PipeTransform } from '@angular/core';
import {ShopUtils} from '../utils/shop-utils.class';

@Pipe({
  name: 'fullNameFormat'
})
export class FullNameFormatPipe implements PipeTransform {

  transform(value: any): any {
    if(value) {
      return value.ho + ' ' + value.ten;
    }

    return '';
  }

}
