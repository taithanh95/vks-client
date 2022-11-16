import { Component, OnInit } from '@angular/core';
import {Accused, CCase, Spp} from '../../../model/so-thu-ly.model';
import {RegisterDecision} from '../../../model/register-decision';
import {NotificationService} from '../../../../../service/notification.service';
import {FormBuilder} from '@angular/forms';
import {Location} from '@angular/common';
import {ActivatedRoute} from '@angular/router';
import {ParsePipe} from 'ngx-moment';
import {ConstantService} from '../../../../../service/constant.service';
import {ResponseBody} from '../../../model/response-body';
import {Constant} from '../../../../../shared/constants/constant.class';
import {CategoriesService} from "../../../../../service/categories.service";

@Component({
  selector: 'app-register-decision-case-details',
  templateUrl: './register-decision-case-details.component.html',
  styleUrls: ['./register-decision-case-details.component.scss']
})
export class RegisterDecisionCaseDetailsComponent implements OnInit {
  case: CCase;
  listOfItems: RegisterDecision[] = [];
  selectedItem!: RegisterDecision;
  collapse = true;
  isVisible: boolean;
  isConfirmLoading = false;
  account: any;
  spp!: Spp;
  tttrutgon: any;
  sppname: any;

  constructor(
    private notificationService: NotificationService,
    private categoriesService: CategoriesService,
    private fb: FormBuilder,
    private location: Location,
    private route: ActivatedRoute,
    private parsePipe: ParsePipe,
    private constantService: ConstantService
  ) {
  }

  ngOnInit(): void {
    this.getSppByUserId();
    this.getCase();
  }

  toggleCollapse() {
    this.collapse = !this.collapse;
  }

  /*
   * Các sự kiện button
   */
  goBack(): void {
    this.location.back();
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  showPopupView(obj: RegisterDecision): void {
    this.selectedItem = obj;
    this.isVisible = true;
      if(this.selectedItem.rutgon = 'Y'){
        this.tttrutgon = true;
      }
    this.getSppBySppId(this.selectedItem.sppid);
  }

  /*
   * Các phương thức call lên API
   */

  getCase(): void {
    const caseCode = this.route.snapshot.paramMap.get('id');

    this.constantService.postRequest(
      this.constantService.MANAGE_URL + 'case/detail/',
      {caseCode}
    ).toPromise()
      .then(resp => resp.json())
      .then((resp: ResponseBody) => {
        if (resp.responseCode === '0000') {
          this.case = resp.responseData;
          this.getListRegisterDecision();
        } else {
          this.notificationService.showNotification(Constant.ERROR, resp.responseMessage);
        }
      }).catch(err => {
      this.notificationService.showNotification(Constant.ERROR, 'Hệ thống không phản hồi. ' + err.message);
    });
  }

  stringToDate(date: string): Date {
    return this.parsePipe.transform(date, 'DD/MM/YYYY').toDate();
  }

  private getSppByUserId(): void {
    this.account = JSON.parse(localStorage.getItem(Constant.USER_INFO));
    this.spp = JSON.parse(localStorage.getItem(Constant.SPP));

    if (this.account.userid) {
      this.constantService.postRequest(
        this.constantService.MANAGE_URL + 'spp/findFirstByUsername/',
        {username: this.account.userid}
      ).toPromise()
        .then(resp => resp.json())
        .then((resp: ResponseBody) => {
          if (resp.responseCode === '0000') {
            this.spp = resp.responseData;
          }
        })
        .catch(err => {
          this.notificationService.showNotification(Constant.ERROR, 'Hệ thống không có phản hồi. ' + err.message);
        });
    } else {
      this.notificationService.showNotification(Constant.ERROR, 'Vui lòng đăng nhập trước');
    }
  }

  getSppBySppId(sppid: string) {
    this.categoriesService.getSppBySppid(sppid).subscribe(res => {
      if (res.sppid){
        this.sppname = res?.sppid + ' - ' + res?.name;
      }else {
        this.sppname = '';
      }
    });
  }

  getListRegisterDecision(): void {
    if (this.case) {
      this.constantService.postRequest(
        this.constantService.SOTHULY_URL + 'registerDecision/getList/',
        {
          caseCode: this.case.caseCode,
          type: 1,
          sppCode: this.spp.isDePart === 'Y' ? this.spp.sppParent : this.spp.sppId
        }

      ).toPromise()
        .then(resp => resp.json())
        .then((resp: ResponseBody) => {
          if (resp.responseCode === '0007') {
            // Không có dữ liệu thì không làm gì cả (Không bắn thông báo nữa)
          } else if (resp.responseCode === '0000') {
            this.listOfItems = resp.responseData;
          } else {
            this.notificationService.showNotification(Constant.ERROR, resp.responseMessage);
          }
        }).catch(err => this.notificationService.showNotification(Constant.ERROR, 'Hệ thống không phản hồi. ' + err.message));
    }
  }

}
