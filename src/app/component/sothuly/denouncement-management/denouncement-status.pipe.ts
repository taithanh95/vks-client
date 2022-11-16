import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  pure: false,
  name: 'denouncementStatusColor'
})
export class DenouncementStatusColorPipe implements PipeTransform{

  private mapColor = [
    '', 'blue', 'brown', '#4db8ff', 'green', 'red'
  ]

  private mapStatusName = [
    '', 'Chưa thực hiện', 'Đang giải quyết', 'Tạm đình chỉ', 'Đã giải quyết', 'Đã quá hạn'
  ]

  transform(value: any, ...args: any[]): any {
    if (args[0] === 'statusName') {
      return this.mapStatusName[value] ? this.mapStatusName[value] : '';
    } else if (args[0] === 'color') {
      return this.mapColor[value] ? this.mapColor[value] : '';
    } else {
      return '';
    }
  }

}
