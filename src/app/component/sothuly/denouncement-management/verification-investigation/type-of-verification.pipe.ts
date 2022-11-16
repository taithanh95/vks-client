import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'typeOfVerification'
})
export class TypeOfVerificationPipe implements PipeTransform {

  typeOfVerification = [
    '',
    'Yêu cầu khởi tố vụ án',
    'Yêu cầu tiếp nhận, kiểm tra, xác minh, ra QĐ giải quyết nguồn tin về tội phạm',
    'Yêu cầu cung cấp tài liệu để kiểm sát việc giải quyết nguồn tin về tội phạm',
    'Yêu câu chuyển nguồn tin về tội phạm',
    'Quyết định hủy bỏ khởi tố',
    'Yêu cầu khác'
  ];

  transform(value: any, ...args: any[]): any {
      return this.typeOfVerification[value];
  }

}
