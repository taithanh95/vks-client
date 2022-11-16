import { Pipe, PipeTransform } from '@angular/core';
import {ShopUtils} from '../utils/shop-utils.class';

@Pipe({
  name: 'orderStatusFormat'
})
export class OrderStatusFormatPipe implements PipeTransform {

  transform(value: number): any {
    if (value) {
      return ShopUtils.toStatus(value);
    }
    return '';
  }

}
