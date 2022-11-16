import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output} from '@angular/core';
import {CategoriesService} from "../../../../../service/categories.service";
import {NotificationService} from "../../../../../service/notification.service";
import {GeneralService} from "../../../../../service/general-service";
import {DateChangeService} from "../../../../../service/date-change.service";
import {Constant} from "../../../../../shared/constants/constant.class";
import {WebUtilities} from "../../../../../shared/utils/qla-utils.class";

@Component({
  selector: 'app-d-against-result',
  templateUrl: './d-against-result.component.html',
  styleUrls: ['./d-against-result.component.scss']
})
export class DAgainstResultComponent implements OnInit, OnChanges {
  @Input() isVisible: boolean;
  @Input() sppCase: any;
  @Input() userfor: any;
  @Input() loading: boolean;
  @Input() register: any;
  @Input() lstCentence: any[];
  @Input() lstDecisionCase: any[];
  @Input() lstAccu: any[];

  @Output() submitForm: EventEmitter<any> = new EventEmitter();
  @Output() registerChange: EventEmitter<any> = new EventEmitter();
  @Output() closeModal: EventEmitter<any> = new EventEmitter();
  @Output() deleteRow: EventEmitter<any> = new EventEmitter();

  isVisibleTable: boolean;

  page: any;
  defaultPage: any;
  pageSize: any;
  data: any;
  isCollapse = true;
  selectedSpp: any;
  isSubmited: boolean;
  userInfo: any;
  isVisibleCenLaw: boolean;
  accuCode: any;
  /*OPTIONS*/
  lstAgainst: any[];
  lstSpcs: any[]; // Tòa án
  lstSinger: any[];
  lstAgainstName: any[];
  lstResult: any[];
  labelScreen = 'kháng nghị';

  constructor(
    private categoriesService: CategoriesService,
    private notificationService: NotificationService,
    private generalService: GeneralService,
    private datechangeService: DateChangeService
  ) {
    this.userInfo = JSON.parse(localStorage.getItem(Constant.USER_INFO));
    this.userInfo.sppid = WebUtilities.getLoggedSppId();
  }

  ngOnInit(): void {
    this.loading = false;
    this.isSubmited = false;
    this.selectedSpp = WebUtilities.getLoggedSpp();
    this.labelScreen = this.userfor === 'G4' ? 'đề nghị' : 'kháng nghị';
    this.getAgainstName();
    this.getResult();
    this.getListAgainsResult();
  }

  onRowSelect(selectedItem): void {
    this.registerChange.emit(selectedItem);
    for (const item of this.lstAgainst) {
      item.selected = false;
    }
    selectedItem.selected = true;
  }

  ngOnChanges(): void {
    if (this.isVisible) {
      this.isSubmited = false;
      this.loading = false;
      if (this.data) {
        // todo map arrAgainstid
        this.getAgainstAcc(this.data.againstcode);
      }
      if (this.lstCentence) {
        this.lstCentence = this.lstCentence.filter(e => e.SETNUM != null);
      }
    }
  }

  getListAgainsResult(): void {
    this.generalService.getListAgainsResult({casecode: this.sppCase.CASECODE,sppid: this.userInfo.sppid}).subscribe(res => {
      if (res) {
        this.lstAgainst = res;
        this.lstAgainst.forEach(dt => dt.ARRAGAINSTID = dt.ARRAGAINSTID ? dt.ARRAGAINSTID.split(',') : null);
      } else {
        this.lstAgainst = [];
      }
    }, error => {
      this.notificationService.showNotification(Constant.ERROR, error.error.text);
    });
  }

  handleOk(): void {
    this.loading = true;
    this.isSubmited = true;
    let valid = true;
    if (!this.data.resultid) {
      this.notificationService.showNotification(Constant.ERROR, 'Bạn phải nhập giá trị cho trường Kết quả');
      valid = false;
    }
    if (valid) {
      this.submitForm.emit(this.data);
      this.loading = false;
    } else {
      this.loading = false;
    }
  }

  // tslint:disable-next-line:variable-name
  getLstSpcs(begin_officeid: any) {
    this.categoriesService.getListToaAn(begin_officeid).subscribe(res => {
      this.lstSpcs = res;
    });
  }

  getAgainstName() {
    this.categoriesService.getLstAgainstName(
      {applyfor: this.userfor === 'G4' ? 'C' : 'A',
      sortOrder: 'ASC'}
      ).subscribe(res => {
      this.lstAgainstName = res;
    });
  }

  getAgainstAcc(code) {
    this.categoriesService.getAgainstCase(code).subscribe(res => {
      this.data.arrAgainstid = [];
      res.forEach(en => {
        this.data.arrAgainstid.push(en.AGAINSTID);
      });
    });
  }

  getResult() {
    this.categoriesService.loadLstAgainstResult('1').subscribe(res => {
      this.lstResult = res;
    });
  }

  handleCancel() {
    // this.isVisibleTable = false;
    this.closeModal.emit(false);
  }

  toggleCollapse() {
    this.isCollapse = !this.isCollapse;
  }

  f(data, f): any {
    return data[f.toUpperCase()];
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

  onSingerInput(e: any): void {
    const value = (e.target as HTMLInputElement).value;
    if (!value || value.indexOf('@') >= 0) {
      this.lstSinger = [];
    } else {
      const filter = {
        sppid: this.selectedSpp.sppid,
        query: value,
        polid: this.sppCase.BEGIN_OFFICE,
        officeid: this.sppCase.BEGIN_OFFICEID,
        limit: 10
      };
      this.categoriesService.getListSignerAutocomplete(filter).subscribe(res => {
        this.lstSinger = res;
      });
    }
  }

  signerAutoChange(option: any) {
    if (option) this.data.signoffice = option.POSITION
  }

  indateChange($event: any) {
    const indate = new Date($event);
    const actdate = new Date();
    if (this.data.forindate && $event) {
      const forindate = new Date(this.data.forindate)
      const dayCount = WebUtilities.calculateDiff(indate, forindate);
      const name = this.data.agafor === 'C' ? 'bản án' : 'quyết định';
      if (dayCount < 0) {
        this.notificationService.showNotification(Constant.ERROR, `Ngày kháng nghị phải lớn hơn hoặc bằng ngày ra ${name}`);
        setTimeout(() => {
          this.data.indate = null;
        }, 100);
        return;
      }
      if (dayCount > 15 && this.data.agalevel === 'CC') {
        this.notificationService.showNotification(Constant.WARNING, `Ngày kháng nghị hiện lớn hơn 15 ngày Ngày ra ${name}`);
        return;
      }
      if (dayCount > 30 && this.data.agalevel === 'CT') {
        this.notificationService.showNotification(Constant.WARNING, `Ngày kháng nghị hiện lớn hơn 30 ngày Ngày ra ${name}`);
        return;
      }
    }
    if (actdate && $event) {
      const dayCount = WebUtilities.calculateDiff(indate, actdate);
      if (dayCount > 0) {
        this.notificationService.showNotification(Constant.ERROR, 'Ngày quyết định phải nhỏ hơn hoặc bằng ngày hiện tại');
        setTimeout(() => {
          this.data.indate = null;
        }, 100);
        return;
      }
    }
  }

  actdateChange($event: any) {
    const actdate = new Date($event);
    const indate = new Date(this.data.indate);
    if (indate && $event) {
      const dayCount = WebUtilities.calculateDiff(indate, actdate);
      if (dayCount > 0) {
        this.notificationService.showNotification(Constant.ERROR, 'Ngày quyết định phải sau ngày thụ lý');
        setTimeout(() => {
          this.data.actdate = null;
        }, 100);
        return;
      }
    }
  }

  /*getListAccuByCent(): void {
    this.generalService.getListAccuByCentCode(this.data.centcode).subscribe(res => {
      if (res) {
        this.lstAccu = res;
      } else {
        this.lstAccu = [];
      }
    }, error => {
      this.notificationService.showNotification(Constant.ERROR, 'Lỗi: ' + error.error.text);
    });
  }*/

  onValueDate(event, item) {
    this.data[item] = this.datechangeService.onDateValueChange(event);
  }

  validateOnlyNumbers(event: KeyboardEvent): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    return !(charCode > 31 && (charCode < 48 || charCode > 57));
  }

  submitCentence(data): void {
    if (this.register) {
      if (!data.isEdit) {
        data.userforname = this.generalService.toUserForName(this.userfor);
        data.userfor = this.userfor;
        data.regicode = this.register.regicode;
      }
      data.sppid = this.userInfo.sppid;
      data.casecode = this.sppCase.CASECODE;
      const savedItem = {
        centence: data,
        action: 'I',
        sppId: this.userInfo.sppid,
        regicode: data.regicode,
        userId: this.userInfo.userid,
        userfor: data.userfor,
        beginOffice: this.sppCase.BEGIN_OFFICE,
        beginOfficeId: this.sppCase.BEGIN_OFFICEID
      };
      let actionText = 'Thêm mới';
      if (data.isEdit) {
        savedItem.action = 'U';
        actionText = 'Cập nhật';
      } else {
        savedItem.action = 'I';
      }
      this.generalService.saveSppCentenceG1(savedItem).subscribe(res => {
        this.loading = false;
        if (res.result) {
          this.notificationService.showNotification(Constant.ERROR, res.result);
        } else {
          this.notificationService.showNotification(Constant.SUCCESS, actionText + ' thành công');
          this.isVisible = false;
          this.closeModal.emit(true);
        }
      }, error => {
        if (error.error && error.error.text) {
          this.notificationService.showNotification(Constant.ERROR, error.error.text);
        } else {
          this.notificationService.showNotification(Constant.ERROR, 'Lỗi dữ liệu');
        }
      });
    }
  }

  openPopup(i) {
    this.accuCode = this.lstAccu[i].ACCUCODE;
    this.isVisibleCenLaw = true;
  }

  closePopupCenlaw() {
    this.isVisibleCenLaw = false;
  }

  changeSetnum($event: any) {
    if (this.data.agafor === 'C') {
      const item = this.lstCentence.find(en => en.SETNUM === $event);
      if (item) {
        this.data.forindate = item.INDATE;
      }
    } else {
      const item = this.lstDecisionCase.find(en => en.SETNUM === $event);
      if (item) {
        this.data.forindate = item.INDATE;
      }
    }
  }

  changeAgofor() {
    this.data.forsetnum = null;
    this.data.forindate = null;
  }

  cancel(): void {
  }

  confirm(regiCode): void {
  }

  getRowIndex = (index, pageIndex, pageSize) => index + 1 + pageSize * (pageIndex - 1);

  showEditForm(data) {
    this.data = WebUtilities.toLowercaseFields(data);
    this.isVisibleTable = true;
    this.userfor = this.data.regisuserfor;
    this.labelScreen = this.userfor === 'G4' ? 'đề nghị' : 'kháng nghị';
  }

}
