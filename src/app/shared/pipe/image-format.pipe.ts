import { Pipe, PipeTransform } from '@angular/core';
import {ShopUtils} from '../utils/shop-utils.class';

@Pipe({
  name: 'imageFormat'
})
export class ImageFormatPipe implements PipeTransform {

  transform(value: string): any {
    if(value) {
      return ShopUtils.toProductImage(value);
    }
    return '';
  }

}
