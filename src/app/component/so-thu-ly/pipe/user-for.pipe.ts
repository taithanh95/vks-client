import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'userFor'
})
export class UserForPipe implements PipeTransform {

  transform(userFor: string): string {
    return (userFor === 'G1') ? 'Điều tra' : 'Truy tố';
  }

}
