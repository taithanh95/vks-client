import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'numberFormat'
})
export class NumberFormatPipe implements PipeTransform {
// LẤY SỐ TRƯỚC DẤU '.'
  transform(value: any): any {
    if (value) {
      const val = value.toString();
      if (val.includes('.')) {
        return val.substr(0, val.indexOf('.'))
      }
      return val;
    }
    return '';
  }
}
