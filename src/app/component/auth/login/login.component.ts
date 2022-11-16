import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {Store} from '@ngrx/store';
import * as fromAuth from '../redux/auth.reducer';
import {AuthModel} from '../../../model/auth.model';
import {Subscription} from 'rxjs';
import {Constant} from '../../../shared/constants/constant.class';
import {AuthService} from '../../../service/auth.service';
import {User} from '../../../model/user.class';
import {UserService} from '../../../service/user-service';
import {GeneralService} from '../../../service/general-service';
import {CategoriesService} from '../../../service/categories.service';
import {environment} from '../../../../environments/environment';
import {CookieService} from 'ngx-cookie-service';
import {ConstantService} from '../../../service/constant.service';
import {NotificationService} from '../../../service/notification.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ResponseBody} from '../../so-thu-ly/model/response-body';
import {WebUtilities} from '../../../shared/utils/qla-utils.class';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  validateForm: FormGroup;
  returnUrl: string;
  messageError: string;
  sub: Subscription;
  user: User;
  auth: AuthModel;
  tabs: any[];

  constructor(
    private httpClient: HttpClient,
    private fb: FormBuilder,
    private router: Router,
    private store: Store<fromAuth.AppState>,
    private route: ActivatedRoute,
    private authService: AuthService,
    private userService: UserService,
    private generalService: GeneralService,
    private categoriesService: CategoriesService,
    private cookieService: CookieService,
    private constantService: ConstantService,
    private notificationService: NotificationService
  ) {
  }

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams.returnUrl || Constant.WELCOME;
    const token = this.cookieService.get(Constant.ACCESS_TOKEN);
    if (token) {
      const username = this.cookieService.get(Constant.USERNAME);
      const fullname = this.cookieService.get(Constant.USER_FULL_NAME);
      const sppId = this.cookieService.get(Constant.ID_SPP);
      this.constantService.postRequest(Constant.AUTH_URI + 'token/check/'
        , {
          accessToken: token
        }).toPromise()
        .then(res => res.json())
        .then(resJson => {
            if (resJson.responseCode === '0000') {
              this.saveLoggedUserToLocalStorage({token, username, fullname, sppId});
              this.router.navigateByUrl(this.returnUrl);
            } else if (resJson.responseCode === '0028') {
              this.notificationService.showNotification(Constant.ERROR, 'Vui lòng đăng nhập để tiếp tục phiên làm việc');
              this.cookieService.deleteAll();
            } else {
              this.notificationService.showNotification(Constant.ERROR, 'Có vấn đề khi thực hiện kiểm tra phiên làm việc. Vui lòng đăng nhập để làm mới phiên làm việc');
              this.cookieService.deleteAll();
            }
          }
        )
        .catch(err => {
          this.notificationService.showNotification(Constant.ERROR, 'Hệ thống không có phản hồi: ' + err.message);
        });
    }
    // this.generalService.readErrorFile();
    this.validateForm = this.fb.group({
      username: [null, [Validators.required]],
      password: [null, [Validators.required]],
    });
  }

  submitForm() {
    const runSSO = environment.runSSO;
    if (runSSO) {
      this.submitFormSSO();
    } else {
      this.submitFormDev();
    }
  }

  submitFormDev(): void {
    this.sub = this.authService.loginDev(this.validateForm.value).subscribe(r => {
      localStorage.setItem(Constant.ACCESS_TOKEN, r.token);
      if (r.token) {
        this.generalService.getUserLogin(this.validateForm.value.username, this.validateForm.value.password).subscribe(res => {
          if (res.length === 0) {
            this.messageError = Constant.LOGIN_FAIL;
          } else {
            const result = res[0];
            result.token = r.token;
            localStorage.setItem(Constant.ACCESS_TOKEN, result.token);
            localStorage.setItem(Constant.USERID, result.userid);
            localStorage.setItem(Constant.USER_INFO, JSON.stringify(result));
            localStorage.setItem(Constant.SPPID_LOGIN, result.sppid);
            localStorage.setItem(Constant.USER_LOGIN, JSON.stringify(result));
            localStorage.setItem(Constant.SPPID, result.sppid);

            const expiredDate = new Date();
            expiredDate.setDate(expiredDate.getDate() + 7);
            this.cookieService.set(Constant.ACCESS_TOKEN, result.token, expiredDate, '/', environment.DOMAIN);

            this.router.navigateByUrl(this.returnUrl);

            this.categoriesService.getChildSpp(result.sppid).subscribe(resSpp => {
              const selectedSpp = resSpp ? resSpp[0] : null;
              if (selectedSpp) {
                const lowerCase = WebUtilities.toUppercaseFields(selectedSpp);
                localStorage.setItem(Constant.SPP, JSON.stringify(lowerCase));
                localStorage.setItem(Constant.SPP_LOGIN, JSON.stringify(lowerCase));
              }
            });
          }
        }, () => {
          this.messageError = Constant.LOGIN_FAIL;
        });
      } else {
        this.messageError = Constant.LOGIN_FAIL;
      }
    }, () => {
      this.messageError = Constant.LOGIN_FAIL;
    });

    return;
  }

  submitFormSSO(): void {
    if (this.validateForm.invalid) {
      this.notificationService.showNotification(Constant.ERROR, 'Vui lòng nhập username và password');
      return;
    }
    this.sub = this.authService.loginWithSSO(this.validateForm.value).subscribe(r => {
      if (r !== null && r.responseCode === '0000') {
        const expiredDate = new Date();
        expiredDate.setDate(expiredDate.getDate() + 7);
        this.cookieService.set(Constant.ACCESS_TOKEN, r.responseData.accessToken,
          expiredDate, '/', environment.DOMAIN);
        this.cookieService.set(Constant.USERNAME, r.responseData.username,
          expiredDate, '/', environment.DOMAIN);
        this.cookieService.set(Constant.USER_FULL_NAME, r.responseData.user.name,
          expiredDate, '/', environment.DOMAIN);
        this.cookieService.set(Constant.LOGIN_USER_ID, r.responseData.user.id,
          expiredDate, '/', environment.DOMAIN);
        this.cookieService.set(Constant.USER_TYPE, r.responseData.user.type,
          expiredDate, '/', environment.DOMAIN);
        this.cookieService.set(Constant.ID_SPP, r.responseData.user.spp.sppId,
          expiredDate, '/', environment.DOMAIN);
        this.saveLoggedUserToLocalStorage({
          token: r.responseData.accessToken,
          username: r.responseData.username,
          fullname: r.responseData.user.name,
          sppId: r.responseData.user.spp.sppId
        });
        this.router.navigateByUrl(this.returnUrl);
      } else {
        this.messageError = Constant.LOGIN_FAIL;
      }
    }, () => {
      this.messageError = Constant.LOGIN_FAIL;
    });
    return;
  }

  async saveLoggedUserToLocalStorage(data: { token: string, username: string, fullname: string, sppId: string }): Promise<void> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + data.token
      })
    };
    this.httpClient.post<ResponseBody>(this.constantService.MANAGE_URL + `spp/findFirstByUsername/`,
      {username: data.username}, httpOptions).subscribe((resp: ResponseBody) => {
      if (resp.responseCode === '0000') {
        const user_inf = JSON.stringify({
          userid: data.username,
          sppid: resp.responseData.sppId,
          fullname: data.fullname})
        localStorage.setItem(Constant.USER_INFO, user_inf);
        localStorage.setItem(Constant.ACCESS_TOKEN, data.token);
        localStorage.setItem(Constant.USERID, data.username);
        localStorage.setItem(Constant.SPPID_LOGIN, data.sppId);
        localStorage.setItem(Constant.USER_LOGIN, user_inf);
        localStorage.setItem(Constant.SPPID, data.sppId);
        const lowerCase = WebUtilities.toUppercaseFields(resp.responseData);
        localStorage.setItem(Constant.SPP, JSON.stringify(lowerCase));
        localStorage.setItem(Constant.SPP_LOGIN, JSON.stringify(lowerCase));
      }
    });
  }
}
