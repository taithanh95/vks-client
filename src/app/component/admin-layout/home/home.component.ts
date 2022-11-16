import { Component, OnInit } from '@angular/core';
import {CategoriesService} from '../../../service/categories.service';
import {Router} from '@angular/router';
import {GeneralService} from '../../../service/general-service';
import {CookieService} from 'ngx-cookie-service';
import {NotificationService} from '../../../service/notification.service';
import {Constant} from '../../../shared/constants/constant.class';
import {WebUtilities} from '../../../shared/utils/qla-utils.class';
import {Spp} from '../../../model/spp.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  isLoading: boolean;
  lstSpp: any;
  selectedSppId: any;

  constructor(
    private categoriesService: CategoriesService,
    private router: Router,
    private generalService: GeneralService,
    private cookieService: CookieService,
    private notificationService: NotificationService
  ) {
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.generalService.getUserLogin(this.cookieService.get(Constant.USERNAME), 'Ab123456').subscribe(res => {
      if (res.length === 0) {
        this.isLoading = false;
      } else {
        const result = res[0];
        localStorage.setItem(Constant.ACCESS_TOKEN, this.cookieService.get(Constant.ACCESS_TOKEN));
        // localStorage.setItem(Constant.USERID, result.userid);
        // localStorage.setItem(Constant.USER_INFO, JSON.stringify(result));
        // localStorage.setItem(Constant.SPPID, result.sppid);
        this.categoriesService.getChildSpp(result.sppid).subscribe(resSpp => {
          // const selectedSpp = resSpp ? resSpp[0] : null;
          // if (selectedSpp) {
          //   localStorage.setItem(Constant.SPP, JSON.stringify(selectedSpp));
          // }
          this.lstSpp = resSpp ? resSpp : [];
          this.selectedSppId = WebUtilities.getLoggedSppId();
        });
        this.isLoading = false;
      }
    }, () => {
      this.isLoading = false;
      this.notificationService.showNotification(Constant.ERROR, 'Vui lòng đăng nhập để tiếp tục phiên làm việc');
      this.cookieService.deleteAll();
      this.router.navigate(['login']);
    });
  }

  sppChange(sppId) {
    const userInfo = JSON.parse(localStorage.getItem(Constant.USER_INFO));
    userInfo.sppid = sppId;
    localStorage.setItem(Constant.USER_INFO, JSON.stringify(userInfo));
    localStorage.setItem(Constant.SPPID, sppId);
    const curSpp = this.lstSpp.find(en => en.SPPID === sppId);
    localStorage.setItem(Constant.SPP, JSON.stringify(curSpp));
  }

}
