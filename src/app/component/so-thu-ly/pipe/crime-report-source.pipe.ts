import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'crimeReportSource'
})
export class CrimeReportSourcePipe implements PipeTransform {

  transform(crimeReportSource: string): string {
    let result: string;
    switch (crimeReportSource) {
      case '1':
        result = 'Tin báo';
        break;
      case '2':
        result = 'Tin tố giác';
        break;
      default:
        result = 'Kiến nghị khởi tố';
    }
    return result;
  }

}
