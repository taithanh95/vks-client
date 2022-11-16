import {isDevMode} from '@angular/core';

export class ShopUtils {
  static toProductImage(imgSrc) {
    if (isDevMode())
      return 'http://192.168.18.27:8990/uploads/' + imgSrc;
    else
      return '/uploads/' + imgSrc;
  }
  static  toUnitName(unit, data) {
    console.log(data, unit);
    return data.find(x => x.id === unit).name;
  }
  static toStatus(status) {
    switch (status) {
      case 5:
        return 'Chờ xác nhận';
      case 7:
        return 'Đã hủy';
      case 10:
        return 'Đã xác nhận';
      case 15:
        return 'Đã giao hàng';
      default:
        return '';
    }
  }
}
