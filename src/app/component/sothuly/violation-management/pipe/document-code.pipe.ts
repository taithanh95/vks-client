import { Pipe, PipeTransform } from '@angular/core';
import {Constant} from '../../../../shared/constants/constant.class';

@Pipe({
  name: 'documentCode'
})
export class DocumentCodePipe implements PipeTransform {

  private documentCode = Constant.DOCUMENT_CODE;

  transform(value: any, ...args: any[]): any {
    let result: string;
    for (const val of this.documentCode) {
      if (value === val.value) {
        result = val.description;
      }
    }
    return result;
  }

}
