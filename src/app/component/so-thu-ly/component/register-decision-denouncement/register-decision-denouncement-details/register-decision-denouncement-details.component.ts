import {Component, OnInit} from '@angular/core';
import {DenouncedPerson, Denouncement, Spp} from "../../../model/so-thu-ly.model";
import {RegisterDecision} from "../../../model/register-decision";
import {ConstantService} from "../../../../../service/constant.service";
import {NotificationService} from "../../../../../service/notification.service";
import {Location} from "@angular/common";
import {ActivatedRoute} from "@angular/router";
import {ResponseBody} from "../../../model/response-body";
import {Constant} from "../../../../../shared/constants/constant.class";
import {CategoriesService} from "../../../../../service/categories.service";

@Component({
  selector: 'app-register-decision-denouncement-details',
  templateUrl: './register-decision-denouncement-details.component.html',
  styleUrls: ['./register-decision-denouncement-details.component.scss']
})
export class RegisterDecisionDenouncementDetailsComponent implements OnInit {
  denouncement: Denouncement;
  denouncedPerson: DenouncedPerson[];
  selectedItem: RegisterDecision;
  listOfItems: RegisterDecision[] = [];
  listOfOption: Array<{ value: string; text: string }> = [];
  collapse = true;
  isVisible: boolean;
  spp!: Spp;
  account: any;
  loading = true;
  sppname: any;

  constructor(
    private constantService: ConstantService,
    private notificationService: NotificationService,
    private categoriesService: CategoriesService,
    private location: Location,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    const denouncementId = this.route.snapshot.paramMap.get('id');
    this.getSppByUserId();
    this.getDenouncement(denouncementId);
    this.getDecision();
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

  showPopupView(data: RegisterDecision): void {
    this.selectedItem = data;
    this.isVisible = true;
    this.getSppBySppId(this.selectedItem.sppid);
  }

  /*
   * Các phương thức call lên API
   */

  getDenouncement(denouncementId: string): void {
    this.constantService.postRequest(this.constantService.SOTHULY_URL + 'denouncedDenouncement/detail/', {id: denouncementId})
      .toPromise().then(resp => resp.json())
      .then((resp: ResponseBody) => {
        if (resp.responseCode === '0000') {
          this.denouncement = resp.responseData;
          this.denouncedPerson = this.denouncement.denounceDenouncedPersonList;

          this.getListRegisterDecision();
        } else {
          this.notificationService.showNotification(Constant.ERROR, resp.responseMessage);
        }
      }).catch(err => {
      this.notificationService.showNotification(Constant.ERROR, 'Hệ thống không phản hồi. ' + err.message);
    });
  }

  getDecision(): void {
    this.constantService.postRequest(
      this.constantService.MANAGE_URL + 'decision/getListForDropbox/', {status: ''}
    ).toPromise()
      .then(resp => resp.json())
      .then((resp: ResponseBody) => {
        if (resp.responseCode === '0000') {
          const listOfOption: Array<{ value: string; text: string }> = [];
          resp.responseData.forEach(item => {
            listOfOption.push({
              value: item.deciId,
              text: item.name
            });
          });
          this.listOfOption = listOfOption;
        } else {
          this.notificationService.showNotification(Constant.ERROR, resp.responseMessage);
        }
      });
  }

  getListRegisterDecision(): void {
    this.loading = true;
    this.constantService.postRequest(
      this.constantService.SOTHULY_URL + 'registerDecision/getList/',
      {
        denouncementId: this.denouncement.id,
        type: 3,
        sppCode: this.spp.isDePart === 'Y' ? this.spp.sppParent : this.spp.sppCode
      }).toPromise().then(resp => resp.json())
      .then(async (resp: ResponseBody) => {
        this.loading = false;
        if (resp.responseCode === '0007') {
          // Không làm gì cả
        } else if (resp.responseCode === '0000') {
          this.listOfItems = resp.responseData;
        } else {
          this.notificationService.showNotification(Constant.ERROR, resp.responseMessage);
        }
      }).catch(err => this.notificationService.showNotification(Constant.ERROR, 'Hệ thống không phản hồi. ' + err.message));
  }

  private getSppByUserId(): void {
    this.account = JSON.parse(localStorage.getItem(Constant.USER_INFO));
    this.spp = JSON.parse(localStorage.getItem(Constant.SPP));

    if (this.account.userid) {
      this.constantService.postRequest(
        this.constantService.MANAGE_URL + 'spp/findFirstByUsername/', {
          username: this.account.userid
        }).toPromise()
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

}
