import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CategoriesService} from "../../../../../../service/categories.service";
import {NotificationService} from "../../../../../../service/notification.service";
import {DateChangeService} from "../../../../../../service/date-change.service";
import {WebUtilities} from "../../../../../../shared/utils/qla-utils.class";
import {Constant} from "../../../../../../shared/constants/constant.class";
import * as moment from "moment";
import {DecisionJudicial} from "../../../../model/decisionJudicial";
import {ResponseBody} from "../../../../../so-thu-ly/model/response-body";
import {ConstantService} from "../../../../../../service/constant.service";

@Component({
  selector: 'app-decision-judicial-create',
  templateUrl: './decision-judicial-create.component.html',
  styleUrls: ['./decision-judicial-create.component.scss']
})
export class DecisionJudicialCreateComponent implements OnInit {
  @Input() userfor: any;
  @Input() isVisible: boolean;
  @Input() isVisibleDisable: boolean;
  @Input() register: any;
  @Input() deciJudicial: any;
  @Input() sppCase: any;
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter();
  @Output() realoadForm: EventEmitter<boolean> = new EventEmitter();

  /* LIST DATA */
  lstDeciTypes: any[];
  lstDecis: any[];
  lstReasons: any[];
  listOfData: any;

  /*OPTIONS*/
  lstSpps: any[];
  lstSpcs: any[];
  lstSignOffice: any[]

  /* ITEM */
  isSubmited: boolean;
  sppId: any;
  loading: boolean;
  isOffice: boolean;
  userInfo: any;
  timelimit = true;
  reasonable = false;


  constructor(
    private categoriesService: CategoriesService,
    private notificationService: NotificationService,
    private constantService: ConstantService,
    private datechangeService: DateChangeService,
  ) {
    this.deciJudicial = {} as DecisionJudicial;
    this.sppId = WebUtilities.getLoggedSppId();
    this.userInfo = JSON.parse(localStorage.getItem(Constant.SPP));
  }

  ngOnInit(): void {
    this.isSubmited = false;
  }

  ngOnChanges(): void {
    if (this.isVisible) {
      this.loading = false;
      this.isSubmited = false;
      if (!this.deciJudicial.deciJudicialId) {
        this.resetForm();
      }
      this.bindAutoComplete(this.deciJudicial.decisionUnitId);
    }
  }

  resetForm() {
    this.deciJudicial.decisionAgency = '';
    this.deciJudicial.decisionUnitId = this.sppId;
  }

  bindAutoComplete(decisionUnitId: any) {
    switch (this.deciJudicial.decisionAgency) {
      case 'SPP':
        this.categoriesService.getListVKS(decisionUnitId).subscribe(res => {
          this.lstSpps = res;
          this.deciJudicial.decisionUnitId = this.setObj(this.lstSpps, 'sppid', decisionUnitId);
        });
        break;
      case 'SPC':
        this.categoriesService.getFromSpp(decisionUnitId).subscribe(res => {
          this.lstSpcs = res;
          this.deciJudicial.decisionUnitId = this.setObj(this.lstSpcs, 'SPCID', decisionUnitId);
        });
        break;
    }
  }

  setObj(lst: any[], item: string, value: any) {
    if (lst && lst.length > 0) {
      return lst.find(e => e[item] === value);
    } else {
      return null;
    }
  }

  onInputSpp(e: any): void {
    const value = (e.target as HTMLInputElement).value;
    if (!value || value.indexOf('@') >= 0) {
      this.lstSpps = [];
    } else {
      this.categoriesService.getListVKS(value).subscribe(res => {
        this.lstSpps = res;
      });
    }
  }

  onInputSpc(e: any): void {
    const value = (e.target as HTMLInputElement).value;
    if (!value || value.indexOf('@') >= 0) {
      this.lstSpcs = [];
    } else {
      this.categoriesService.getListToaAn(value).subscribe(res => {
        this.lstSpcs = res;
      });
    }
  }

  handleCancel(): void {
    this.isVisible = false;
    this.closeModal.emit(false);
  }

  handleOk(): void {
    this.loading = true;
    this.isSubmited = true;
    let valid = true;
    if (!this.deciJudicial.indate) {
      this.notificationService.showNotification(Constant.ERROR, 'Bạn phải nhập giá trị cho trường Ngày quyết định');
      valid = false;
    }
    if (!this.deciJudicial.fromDate) {
      this.notificationService.showNotification(Constant.ERROR, 'Bạn phải nhập giá trị cho trường Thời hạn/Hiệu lực từ ngày');
      valid = false;
    }
    if (!this.deciJudicial.signer) {
      this.notificationService.showNotification(Constant.ERROR, 'Bạn phải nhập giá trị cho trường Người ký');
      valid = false;
    }
    if (!this.deciJudicial.signerPosition) {
      this.notificationService.showNotification(Constant.ERROR, 'Bạn phải nhập giá trị cho trường Chức vụ');
      valid = false;
    }
    if (valid) {
      this.deciJudicial.userfor = this.userfor;
      this.insert();
    } else {
      this.loading = false;
    }
  }

  onChangeEvent() {
    this.bindAutoComplete(this.sppId);
  }

  // /** HANDLES DATE */
  // setTimeToDate(): void {
  //   if (!this.deciJudicial.fromDate) return;
  //   const etime = this.deciJudicial.esettime ? +this.deciJudicial.esettime : 0;
  //   const fromDate = new Date(this.deciJudicial.fromDate);
  //   if (this.deciJudicial.esetunit === 'D') {
  //     this.deciJudicial.toDate = new Date(fromDate.setDate(fromDate.getDate() + etime));
  //   } else if (this.deciJudicial.esetunit === 'M') {
  //     const addMonth = fromDate.getMonth() + etime;
  //     this.deciJudicial.toDate = new Date(fromDate.setMonth(addMonth));
  //   } else if (this.deciJudicial.esetunit === 'Y') {
  //     this.deciJudicial.toDate = new Date(fromDate.setFullYear(fromDate.getFullYear() + etime));
  //   }
  // }
  //
  // setTimeFinishDate(): void {
  //   if (!this.deciJudicial.indate) return;
  //   const stime = this.deciJudicial.settime ? +this.deciJudicial.settime : 0;
  //   const indate = new Date(this.deciJudicial.indate);
  //   if (this.deciJudicial.esetunit === 'D') {
  //     this.deciJudicial.toDate = new Date(indate.setDate(indate.getDate() + stime));
  //   } else if (this.deciJudicial.esetunit === 'M') {
  //     const addMonth = indate.getMonth() + stime;
  //     this.deciJudicial.toDate = new Date(indate.setMonth(addMonth));
  //   } else if (this.deciJudicial.esetunit === 'Y') {
  //     this.deciJudicial.toDate = new Date(indate.setFullYear(indate.getFullYear() + stime));
  //   }
  // }
  //
  // changeEset() {
  //   this.timelimit = true;
  //   this.fromdateChange(this.deciJudicial.fromDate);
  // }

  setValueESet(deciid, isCheck?) {
    this.categoriesService.getDecisionByDeciId(deciid).subscribe(res => {
      this.deciJudicial.settime = parseInt(res.SETTIME);
      const unit = res.SETUNIT.replace(' ', '');
      this.deciJudicial.setunit = unit === '' ? 'D' : unit;
      this.deciJudicial.esettime = +this.deciJudicial.settime;
      this.deciJudicial.esetunit = this.deciJudicial.setunit;
      if (isCheck) this.timelimit = "N" !== res.TIMELIMIT;
    })
  }

  calculateDiff(fromDate, toDate) {
    return Math.floor((Date.UTC(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate()) - Date.UTC(toDate.getFullYear(), toDate.getMonth(), toDate.getDate())) / (1000 * 60 * 60 * 24));
  }

  todateChange(event) {
    const todate = new Date(event);
    const fromdate = new Date(this.deciJudicial.fromDate);
    console.log('todate', todate);
    console.log('fromDate', fromdate);
    if (moment(fromdate).isAfter(todate)) {
      this.fromdateChange(fromdate);
      this.notificationService.showNotification(Constant.ERROR, 'Giá trị phải lớn hoặc bằng Thời hạn/ hiệu lực từ ngày')
    }
    if (!fromdate && !todate) {
      this.deciJudicial.esettime = this.calculateDiff(fromdate, todate);
      this.deciJudicial.esetunit = 'D';
    }
  }

  indateChange(event) {
    const indate = new Date(event);
    const date = new Date();
    if (!moment(indate).isBefore(date)) {
      this.notificationService.showNotification(Constant.ERROR, 'Ngày quyết định phải nhỏ hơn hoặc bằng ngày hiện tại');
      setTimeout(() => {
        this.deciJudicial.indate = null;
        this.deciJudicial.fromDate = null;
        this.deciJudicial.finishdate = null;
        this.deciJudicial.toDate = null;
      }, 10);
      return;
    }
    this.deciJudicial.fromDate = indate;
    // this.setValueESet(this.deciJudicial.deciid, true);
    // this.setTimeFinishDate();
    // if (this.timelimit) this.setTimeToDate();
  }

  fromdateChange(event: any) {
    const fromdate = new Date(event);
    const indate = this.deciJudicial.indate;
    if (moment(indate).isAfter(fromdate)) {
      this.notificationService.showNotification(Constant.ERROR, 'Thời hạn/ hiệu lực từ ngày phải lớn hơn hoặc bằng ngày ra quyết định');
    } else {
      // if (this.timelimit) this.setTimeToDate();
    }
  }

  onValueDate(item: string, event: any) {
    this.deciJudicial[item] = this.datechangeService.onDateValueChange(event);
  }

  validateOnlyNumbers(event: KeyboardEvent): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    return !(charCode > 31 && (charCode < 48 || charCode > 57));
  }

  /** END HANDLES DATE */

  handleReset(): void {
    this.deciJudicial = {};
    this.deciJudicial.isEdit = false;
    this.deciJudicial.settime = 0;
    this.deciJudicial.setunit = 'D';

    this.deciJudicial.esettime = 0;
    this.deciJudicial.esetunit = 'D';
    this.deciJudicial.decisionAgency = 'SPP';
    this.deciJudicial.decisionUnitId = this.sppId;
    this.bindAutoComplete(this.deciJudicial.decisionUnitId);
  }

  getOfficeId(begin_off: string): string {
    switch (begin_off) {
      case 'SPP':
        return this.deciJudicial.atxSpp.sppid
      case 'SPC':
        return this.deciJudicial.atxSpc.SPCID
    }
  }

  insert(): void {
    const request = {
      ...this.deciJudicial,
      accucode: this.sppCase.accucode,
      regicode: this.register.regicode,
      isDead: this.deciJudicial.isDead ? 1 : 0,
      escaped: this.deciJudicial.escaped ? 1 : 0
    }
    if (this.deciJudicial?.decisionUnitId?.sppid) {
      request.decisionUnitName = this.deciJudicial?.decisionUnitId?.name;
      request.decisionUnitId = this.deciJudicial?.decisionUnitId?.sppid;
    } else {
      request.decisionUnitName = this.deciJudicial?.decisionUnitId?.NAME;
      request.decisionUnitId = this.deciJudicial?.decisionUnitId?.SPCID;
    }
    this.constantService.postRequest(`${this.constantService.QLAHS_URL}decisionJudicial/createOrUpdate/`, request)
      .toPromise().then(respJson => respJson.json())
      .then((resp: ResponseBody) => {
        if (resp.responseCode === '0000') {
          this.realoadForm.emit(true);
          this.closeModal.emit(false);
          this.isVisible = false;
          this.notificationService.showNotification(Constant.SUCCESS, resp.responseMessage);
        } else {
          this.notificationService.showNotification(Constant.ERROR, resp.responseMessage);
        }
        this.loading = false;
      }, () => {
        this.loading = false;
        this.notificationService.showNotification(Constant.ERROR, Constant.MESSAGE_SERVICE_ERROR);
      });
  }

  disabledDeathDate = (deathDate: Date): boolean => {
    if (!deathDate) {
      return false;
    }
    return deathDate.getTime() > new Date().getTime();
  };

  disabledEscapingDate = (escapingDate: Date): boolean => {
    if (!escapingDate) {
      return false;
    }
    return escapingDate.getTime() > new Date().getTime();
  };
}

