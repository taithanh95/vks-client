import {Component, OnDestroy, OnInit} from '@angular/core';

import {Router, NavigationEnd, ActivatedRoute} from '@angular/router';
import {Constant} from '../../shared/constants/constant.class';
import * as fromAuth from '../../component/auth/redux/auth.reducer';
import * as actionAuth from '../../component/auth/redux/auth.action';
import {ActionsSubject, Store} from '@ngrx/store';
import {filter, map} from 'rxjs/operators';
import {Subscription} from 'rxjs';
import {Menu} from '../../model/menu.class';
import {AuthService} from '../../service/auth.service';
import {TranslateService} from '@ngx-translate/core';
import {NzI18nService, vi_VN} from 'ng-zorro-antd/i18n';
import {CookieService} from 'ngx-cookie-service';
import {ResponseBody} from '../so-thu-ly/model/response-body';
import {NotificationService} from '../../service/notification.service';
// import { environment } from '../../../environments/environment';
import { GeneralService } from '../../service/general-service';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss']
})
export class AdminLayoutComponent implements OnInit, OnDestroy {
  static readonly ROUTE_DATA_PAGENAME = 'pagename';

  isCollapsed = false;
  username: string;
  sub: Subscription;
  selectedMenu: Menu;
  pageName: string;
  // stlURL = `${environment.SOTHULY_URI}/#/dashboard`;

  menus = [];

  constructor(
    private router: Router,
    private activeRoute: ActivatedRoute,
    private store: Store<fromAuth.AppState>,
    private actionsSubject$: ActionsSubject,
    private authService: AuthService,
    private cookieService: CookieService,
    private translate: TranslateService,
    private i18n: NzI18nService,
    private notificationService: NotificationService,
    private generalService: GeneralService
  ) {
  }

  getFnLstMenu() {
    setTimeout( async () => {
      this.generalService.getLstMenu().subscribe(res => {
        if (res) {
          const subMenu = [];
          const menuItem = [];
          for(const item of res) {
            if (item.funcname === 'Trang chủ') 
              subMenu.push(item);

            if(item.submenu && !item.parentid)
              subMenu.push(item)
            else 
              menuItem.push(item)
          }
          subMenu.sort((s1, s2) => s1.menuorder);
          for (const item of subMenu) {
            const lstMenu = menuItem.filter(it => it.parentid === item.funcid).sort((s1, s2) => s1.menuorder);
            item.children = lstMenu;
            this.menus.push(item);
          }
        }
      }, err => console.log(err))
    }, 100);
  }

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.username = this.cookieService.get(Constant.USERNAME);
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.getPageInfo())).subscribe((pageName: string) => {
      this.pageName = this.translate.instant(pageName);
    });
    this.pageName = this.translate.instant(this.getPageInfo());
    this.i18n.setLocale(vi_VN);
    this.getFnLstMenu();
  }

  private getPageInfo() {
    let child = this.activeRoute.firstChild;
    while (child.firstChild) {
      child = child.firstChild;
    }
    if (child.snapshot.data[AdminLayoutComponent.ROUTE_DATA_PAGENAME]) {
      return child.snapshot.data[AdminLayoutComponent.ROUTE_DATA_PAGENAME];
    }
    return '';
  }
  

  logout(): void {
    this.authService.logout({accessToken: this.cookieService.get(Constant.ACCESS_TOKEN)})
      .subscribe((resJson: ResponseBody) => {
      if (resJson.responseCode === '0000') {
        if (this.cookieService.check(Constant.LOGIN_USER_ID)) {
          this.cookieService.delete(Constant.LOGIN_USER_ID);
        }
        if (this.cookieService.check(Constant.USER_FULL_NAME)) {
          this.cookieService.delete(Constant.USER_FULL_NAME);
        }
        if (this.cookieService.check(Constant.USERNAME)) {
          this.cookieService.delete(Constant.USERNAME);
        }
        if (this.cookieService.check(Constant.ACCESS_TOKEN)) {
          this.cookieService.delete(Constant.ACCESS_TOKEN);
        }
        if (this.cookieService.check(Constant.USER_ROLE_LIST)) {
          this.cookieService.delete(Constant.USER_ROLE_LIST);
        }
        if (this.cookieService.check(Constant.ID_SPP)) {
          this.cookieService.delete(Constant.ID_SPP);
        }
        if (this.cookieService.check(Constant.USER_TYPE)) {
          this.cookieService.delete(Constant.USER_TYPE);
        }
        localStorage.clear();
        this.notificationService.showNotification(Constant.SUCCESS, 'Đăng xuất thành công');
        this.router.navigate(['login']);
      } else {
        this.notificationService.showNotification(Constant.ERROR, 'Có lỗi khi thực hiện: ' + resJson.responseMessage);
        this.router.navigate(['login']);
      }
    }, err => {
      this.notificationService.showNotification(Constant.ERROR, 'Có lỗi khi thực hiện: ' + err);
        this.router.navigate(['login']);
      });
  }

  goToSoThuLy(url: string) {
   return this.router.navigateByUrl(url, {state : { environment: true }})
  }
}

export function clearState(reducer) {
  return (state, action) => {
    if (action.type === actionAuth.AuthActionTypes.Logout) {
      state = undefined;
    }
    return reducer(state, action);
  };
}
