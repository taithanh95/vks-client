import { Injectable } from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import { Observable, of } from 'rxjs';
import { NotificationService } from '../../service/notification.service';
import { Constant } from '../constants/constant.class';
import { WebUtilities } from '../utils/qla-utils.class';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GuardActiveStlGuard implements CanActivate {

  constructor(private notificationService: NotificationService,
              private router: Router) {
  }

  canActivate(): Observable<boolean> {
    const env = this.router.getCurrentNavigation()?.extras?.state;
    // lấy đơn vị thao tác.
    const currentSpp = WebUtilities.getLoggedSppId();

    // Lấy đơn vị đăng nhập.
    const beginSpp = WebUtilities.getBeginSppId();

    // Kiểm tra xem hots có cùng hệ thống ?
    if (!env) {
      const user_info = JSON.parse(localStorage.getItem(Constant.USER_LOGIN));
      const spp = JSON.parse(localStorage.getItem(Constant.SPP_LOGIN));
      localStorage.setItem(Constant.USER_INFO, JSON.stringify(user_info))
      localStorage.setItem(Constant.SPP, JSON.stringify(spp));
      localStorage.setItem(Constant.SPPID, beginSpp);
      return of(true).pipe(delay(500));
    }

    if (currentSpp !== beginSpp) {
      this.notificationService.showNotification(Constant.WARNING, 'Đơn vị thao tác hiện tại không phải đơn vị đăng nhập')
      return of(false).pipe(delay(500));
    }
    return of(true).pipe(delay(500));
  }
}
