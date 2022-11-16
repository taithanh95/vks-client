import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'sex'
})
export class SexPipe implements PipeTransform {

  transform(sex: string): string {
    switch (sex) {
      case 'B':
        return 'Nam';
      case 'G':
        return 'Nữ';
      default:
        return 'Không xác định';
    }
  }

}
