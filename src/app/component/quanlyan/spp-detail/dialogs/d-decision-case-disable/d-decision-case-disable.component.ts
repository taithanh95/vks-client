import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {CategoriesService} from '../../../../../service/categories.service';
import {NotificationService} from '../../../../../service/notification.service';
import {Constant} from '../../../../../shared/constants/constant.class';
import {WebUtilities} from '../../../../../shared/utils/qla-utils.class';
import {DateChangeService} from 'src/app/service/date-change.service';
import {DateService}  from 'src/app/common/util/date.service';

@Component({
  selector: 'app-d-decision-case-disable',
  templateUrl: './d-decision-case-disable.component.html',
  styleUrls: ['./d-decision-case-disable.component.scss']
})
export class DDecisionCaseDisableComponent implements OnInit, OnChanges {
  @Input() userfor: any;
  @Input() isVisible: boolean;
  @Input() register: any;
  @Input() data: any;
  @Input() sppCase: any;
  @Output() closeModal: EventEmitter<any> = new EventEmitter();
  @Output() submitForm: EventEmitter<any> = new EventEmitter();

  lstDeciTypes: any[];
  lstDecis: any[];
  lstReasons: any[];
  /*OPTIONS*/
  lstPolices: any[];
  lstArmies: any[];
  lstCustoms: any[];
  lstRangers: any[];
  lstBorderGuards: any[];
  lstSpps: any[];
  lstSpcs: any[];
  lstSinger: any[];
  lstSignOffice: any[];
  isSubmited: boolean;
  selectedSpp: any;
  sppId: any;
  loading: boolean;
  isOffice: boolean;
  /*DICISION*/
  isVisibleRegisterDecision: any;
  lstRegisterDecision: any[];

  constructor(
    private categoriesService: CategoriesService,
    private notificationService: NotificationService,
    private datechangeService: DateChangeService,
    private dateService: DateService
  ) {
    this.sppId = WebUtilities.getLoggedSppId();
  }

  ngOnInit(): void {
    this.isSubmited = false;
    this.selectedSpp = WebUtilities.getLoggedSpp();
  }
  ngOnChanges(): void {
    if (this.isVisible) {
      this.loading = false;
      this.lstRegisterDecision = [];
      this.isSubmited = false;
      if (this.data && !this.data.isEdit) {
        this.resetForm();
      }
      this.bindAutoComplete(this.data.begin_officeid);
      this.getListCategories();
      this.getLstSignOffice(this.data?.begin_office);
    }
  }
  resetForm() {
    this.data.begin_office = this.userfor === 'G1' || this.userfor === 'G2' ? 'SPP' : 'SPC';
    this.data.begin_officeid = this.sppId;

  }
  bindAutoComplete(begin_officeid: any) {
    switch (this.data.begin_office) {
      case '02':
        this.categoriesService.getListPolice(begin_officeid).subscribe(res => {
          this.lstPolices = res;
          this.data.atxPolice = this.setObj(this.lstPolices, 'POLICEID', begin_officeid);
        });
        break;
      case '04':
        this.categoriesService.getListArmy(begin_officeid).subscribe(res => {
          this.lstArmies = res;
          this.data.atxArmy = this.setObj(this.lstArmies, 'ARMYID', begin_officeid);
        });
        break;
      case '06':
        this.categoriesService.getListCustoms(begin_officeid).subscribe(res => {
          this.lstCustoms = res;
          this.data.atxCustoms = this.setObj(this.lstCustoms, 'CUSTOMID', begin_officeid);
        });
        break;
      case '08':
        this.categoriesService.getListRangers(begin_officeid).subscribe(res => {
          this.lstRangers = res;
          this.data.atxRanger = this.setObj(this.lstRangers, 'RANGID', begin_officeid);
        });
        break;
      case '09':
        this.categoriesService.getListBorderGuards(begin_officeid).subscribe(res => {
          this.lstBorderGuards = res;
          this.data.atxBorderGuards = this.setObj(this.lstBorderGuards, 'BORGUAID', begin_officeid);
        });
        break;
      case 'SPP':
        this.categoriesService.getListVKS(begin_officeid).subscribe(res => {
          this.lstSpps = res;
          this.data.atxSpp = this.setObj(this.lstSpps, 'sppid', begin_officeid);
        });
        break;
      case 'SPC':
        this.categoriesService.getFromSpp2022(begin_officeid).subscribe(res => {
          this.lstSpcs = res;
          this.data.atxSpc = this.lstSpcs[0];
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

  getListCategories() {
    this.categoriesService.getListDecitypeUseFor({ applyfor: 'C', usefor: this.userfor }).subscribe(res => {
      this.lstDeciTypes = res;
    });
    this.getListDecision('');
  }
  getListDecision(deciType: any) {
    this.categoriesService.getListDecision_ForHS({ applyfor: 'C', decitype: deciType, usefor: this.userfor }).subscribe(res => {
      this.lstDecis = res;
    });
  }
  getListReason(deciId: any) {
    let payload = { size: 100, deciId: deciId };
    if (!deciId) delete payload.deciId;
    this.categoriesService.getListReason(payload).subscribe(res => {
      this.lstReasons = res ? res.datas : [];
    });
  }
  onInputPolice(e: any): void {
    const value = (e.target as HTMLInputElement).value;
    if (!value || value.indexOf('@') >= 0) {
      this.lstPolices = [];
    } else {
      this.categoriesService.getListPolice(value).subscribe(res => {
        this.lstPolices = res;
      });
    }
  }
  onInputArmy(e: any): void {
    const value = (e.target as HTMLInputElement).value;
    if (!value || value.indexOf('@') >= 0) {
      this.lstArmies = [];
    } else {
      this.categoriesService.getListArmy(value).subscribe(res => {
        this.lstArmies = res;
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
    if (!this.data.deciid) {
      this.notificationService.showNotification(Constant.ERROR, 'Bạn phải nhập giá trị cho trường Tên quyết định');
      valid = false;
    }
    if (!this.data.begin_office) {
      this.notificationService.showNotification(Constant.ERROR, 'Bạn phải nhập giá trị cho trường Đơn vị ra quyết định');
      valid = false;
    }
    if (!this.data.setnumdeci) {
      this.notificationService.showNotification(Constant.ERROR, 'Bạn phải nhập giá trị cho trường Quyết định số');
      valid = false;
    }
    if (!this.data.indate) {
      this.notificationService.showNotification(Constant.ERROR, 'Bạn phải nhập giá trị cho trường Ngày ra quyết định');
      valid = false;
    }
    if (!this.data.fromdate) {
      this.notificationService.showNotification(Constant.ERROR, 'Bạn phải nhập giá trị cho trường Thời hạn/Hiệu lực từ ngày');
      valid = false;
    }
    if (!this.data.signname) {
      this.notificationService.showNotification(Constant.ERROR, 'Bạn phải nhập giá trị cho trường Người ký');
      valid = false;
    }
    if (!this.data.signoffice) {
      this.notificationService.showNotification(Constant.ERROR, 'Bạn phải nhập giá trị cho trường Chức vụ');
      valid = false;
    }
    if (valid) {
      this.isVisible = false;
      this.closeModal.emit(false);
      this.data.userfor = this.userfor;
      this.submitForm.emit(this.data);
    } else {
      this.loading = false;
    }
  }

  setTimeChange(esettime) {
    const etime = +esettime;
    const stime = this.data.settime ? +this.data.settime : 0;


    if (this.data.fromdate != null && this.data.esetunit != null) {
      const fromDate = new Date(this.data.fromdate);
      if (this.data.esetunit === 'D') {
        this.data.todate = new Date(fromDate.setDate(fromDate.getDate() + etime));
        this.data.finishdate = new Date(fromDate.setMonth(fromDate.getMonth() + stime));
      } else if (this.data.esetunit === 'M') {
        const addMonth = fromDate.getMonth() + etime;
        this.data.todate = new Date(fromDate.setMonth(addMonth));
        this.data.finishdate = new Date(fromDate.setMonth(fromDate.getMonth() + stime));
      } else if (this.data.esetunit === 'Y') {
        this.data.todate = new Date(fromDate.setFullYear(fromDate.getFullYear() + etime));
        this.data.finishdate = new Date(fromDate.setFullYear(fromDate.getFullYear() + stime));
      }
    } else {
      // do not st
    }
  }
  setUnitChange(unit) {
    const etime = +this.data.esettime;
    const stime = this.data.settime ? +this.data.settime : 0;

    if (this.data.fromdate != null && this.data.esetunit != null) {
      const fromDate = new Date(this.data.fromdate);
      if (unit === 'D') {
        this.data.todate = new Date(fromDate.setDate(fromDate.getDate() + etime));
        this.data.finishdate = new Date(fromDate.setMonth(fromDate.getMonth() + stime));
      } else if (unit === 'M') {
        const addMonth = fromDate.getMonth() + etime;
        this.data.todate = new Date(fromDate.setMonth(addMonth));
        this.data.finishdate = new Date(fromDate.setMonth(fromDate.getMonth() + stime));
      } else if (unit === 'Y') {
        this.data.todate = new Date(fromDate.setFullYear(fromDate.getFullYear() + etime));
        this.data.finishdate = new Date(fromDate.setFullYear(fromDate.getFullYear() + stime));
      }
    } else {
      // do not st
    }
  }

  deciChange($event: any) {
    this.getListReason(this.data.deciid);
  }

  deciTypeChange($event: any) {
    this.getListDecision(this.data.decitypeid);
    this.data.deciid = null;
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
  onInputCustoms(e: any): void {
    const value = (e.target as HTMLInputElement).value;
    if (!value || value.indexOf('@') >= 0) {
      this.lstCustoms = [];
    } else {
      this.categoriesService.getListCustoms(value).subscribe(res => {
        this.lstCustoms = res;
      });
    }
  }
  onInputRangers(e: any): void {
    const value = (e.target as HTMLInputElement).value;
    if (!value || value.indexOf('@') >= 0) {
      this.lstRangers = [];
    } else {
      this.categoriesService.getListRangers(value).subscribe(res => {
        this.lstRangers = res;
      });
    }
  }
  onInputBorderGuards(e: any): void {
    const value = (e.target as HTMLInputElement).value;
    if (!value || value.indexOf('@') >= 0) {
      this.lstBorderGuards = [];
    } else {
      this.categoriesService.getListBorderGuards(value).subscribe(res => {
        this.lstBorderGuards = res;
      });
    }
  }

  polChangeEvent() {
    this.data.atxPol = null;
    this.data.atxArmy = null;
    this.data.atxBorderGuards = null;
    this.data.atxCustoms = null;
    this.data.atxRanger = null;
    this.bindAutoComplete(this.sppId);
    this.data.signoffice = null;
    this.getLstSignOffice(this.data.begin_office);
  }
  calculateDiff(fromDate, toDate) {
    return Math.floor((Date.UTC(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate()) - Date.UTC(toDate.getFullYear(), toDate.getMonth(), toDate.getDate())) / (1000 * 60 * 60 * 24));
  }
  todateChange(event) {
    let todate = this.data.todate;
    let dayCount = 0;
    let duThang = 0;
    let duNam = 0;
    let fromDate = new Date(this.data.fromdate);
    let toDate = new Date(event);

    if (todate != null) {
      // tslint:disable-next-line:no-shadowed-variable
      let dayCount = this.calculateDiff(fromDate, toDate);
      if (dayCount > 0) {
        this.data.todate = null;
        event = null;
        this.notificationService.showNotification(Constant.ERROR, 'Hiệu lực từ ngày" phải trước "Đến ngày"');
      }
      else {
        dayCount = -dayCount;
        duThang = dayCount % 30;
        duNam = dayCount % 360;
        if (this.data.esetunit === 'M') {
          if (duThang > 0) {
            this.data.esettime = dayCount;
            this.data.esetunit = 'D';
          } else {
            this.data.esettime = dayCount / 30;
          }
        } else if (this.data.esetunit === 'Y') {
          if (duNam > 0) {
            if (duThang > 0) {
              this.data.esettime = (dayCount);
              this.data.esetunit = 'D'
            } else {
              this.data.esettime = (dayCount / 30);
              this.data.esetunit = 'M'
            }
          } else {
            this.data.esettime = (dayCount / 360);
          }
        } else {
          this.data.esettime = (dayCount);
        }
      }
    }
  }

  indateChange(event) {
    const indate = new Date(event);
    const registerDate = new Date(this.register.indate);
    const currentDate = new Date();

    const dayCount = this.calculateDiff(indate, currentDate);
    if (dayCount > 0) {
      this.notificationService.showNotification(Constant.ERROR, 'Ngày quyết định phải nhỏ hơn hoặc bằng ngày hiện tại');
      setTimeout(() => {
        this.data.indate = null;
        this.data.fromdate = null;
        this.data.finishdate = null;
        this.data.todate = null;
      }, 10);
      return;
    }
    else {
      const regisCount = this.calculateDiff(registerDate, indate);
      if (regisCount > 0) {
        this.notificationService.showNotification(Constant.ERROR, 'Ngày quyết định phải sau ngày thụ lý');
        setTimeout(() => {
          this.data.indate = null;
          this.data.fromdate = null;
          this.data.finishdate = null;
          this.data.todate = null;
        }, 10);
      }
      else {
        this.data.fromdate = event;
      }
    }
  }
  onSingerInput(e: any): void {
    const value = (e.target as HTMLInputElement).value;
    if (!value || value.indexOf('@') >= 0) {
      this.lstSinger = [];
    } else {
      var filter = { sppid: this.selectedSpp.sppid, query: value, polid: this.sppCase.BEGIN_OFFICE, officeid: this.sppCase.BEGIN_OFFICEID, limit: 10 };
      this.categoriesService.getListSignerAutocomplete(filter).subscribe(res => {
        this.lstSinger = res;
      });
    }
  }
  signerAutoChange(option: any) {
    if (option) this.data.signoffice = option.nzValue, this.data.signname = option.nzLabel;
  }

  handleReset(): void {
    this.data = {};
    this.data.isEdit = false;
    this.data.settime = 0;
    this.data.setunit = 'Y';

    this.data.esettime = 0;
    this.data.esetunit = 'M';
    this.data.begin_office = this.userfor === 'G1' || this.userfor === 'G2' ? 'SPP' : 'SPC';
    this.data.begin_officeid = this.sppId;
    this.data.decitypeid = '';
    this.bindAutoComplete(this.data.begin_officeid);
  }

  fromdateChange(event: any) {
    const fromdate = new Date(event);
    const indate = this.data.indate;
    const dayCount = this.calculateDiff(fromdate, indate);
    if (dayCount < 0) {
      this.notificationService.showNotification(Constant.ERROR, 'Ngày hiệu lực phải lớn hơn hoặc bằng ngày ra quyết định');
      setTimeout(() => {
        this.data.fromdate = null;
        this.data.finishdate = null;
        this.data.todate = null;
      }, 10);
      return;
    }
  }

  onValueIndate(event: any) {
    this.data.indate = this.datechangeService.onDateValueChange(event);
  }
  onValueFromdate(event: any) {
    this.data.fromdate = this.datechangeService.onDateValueChange(event);
  }
  onValueTodate(event: any) {
    this.data.todate = this.datechangeService.onDateValueChange(event);
  }

  validateOnlyNumbers(event: KeyboardEvent): boolean {
    let charCode = (event.which) ? event.which : event.keyCode;
    return !(charCode > 31 && (charCode < 48 || charCode > 57));
  }

  openPopupRegisterDecision() {
    this.isVisibleRegisterDecision = true;
  }

  closeRegisterDecision() {
    this.isVisibleRegisterDecision = false;
  }

  submitFormRegisterDecsision(data) {
    this.isVisibleRegisterDecision = false;
    if (data) {
      this.data.registerdeciid = data.id;
      this.data.decitypeid = data?.decisionCode.substring(0, 2);
      this.data.deciid = data?.decisionCode;
      this.data.setnumdeci = data?.decisionNum;
      this.data.indate = this.convertDate(data.issuesDate);
      this.indateChange(this.data.indate);
      if (data.fromDate) {
        this.data.fromdate = this.convertDate(data.fromDate);
      }
      this.fromdateChange(this.data.fromdate);
      if (data.toDate) {
        this.data.todate = this.convertDate(data.toDate);
        this.todateChange(this.data.todate);
      } else {
        this.data.todate = null;
        this.data.esettime = 0;
      }
    }
  }

  convertDate(date): any {
    return this.dateService.stringToDate(date, "DD-MM-YYYY");
  }


  getLstSignOffice(office) {
    if (office === 'SPC') {
      this.lstSignOffice = [{value : 'Thẩm phán'}];
    } else if (office === 'SPP') {
      this.lstSignOffice = [{value : 'Viện trưởng'},{value : 'Phó Viện trưởng'}];
    } else if (office === '02') {
      this.lstSignOffice = [{value : 'Thủ trưởng'},{value : 'Phó Thủ trưởng'}];
    }
    this.isValueOffice();
  }

  isValueOffice() {
    if (this.data.begin_office === '02'
    || this.data.begin_office === 'SPC'
    ||  this.data.begin_office === 'SPP' ) {
      this.isOffice = true;
    } else {
      this.isOffice = false;
    }
  }

}
