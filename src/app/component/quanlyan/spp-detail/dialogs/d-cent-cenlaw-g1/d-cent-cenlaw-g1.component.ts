import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {WebUtilities} from '../../../../../shared/utils/qla-utils.class';
import {CategoriesService} from '../../../../../service/categories.service';
import {GeneralService} from '../../../../../service/general-service';
import {NotificationService} from '../../../../../service/notification.service';
import {Constant} from '../../../../../shared/constants/constant.class';
import {DateChangeService} from '../../../../../service/date-change.service';

@Component({
  selector: 'app-d-cent-cenlaw-g1',
  templateUrl: './d-cent-cenlaw-g1.component.html',
  styleUrls: ['./d-cent-cenlaw-g1.component.scss']
})
export class DCentCenlawG1Component implements OnInit {

  @Input() isVisible: boolean;
  @Input() isVisibleDisable: boolean;
  @Input() lstAccu: any;
  @Input() accuCode: any;
  @Input() userfor: any;
  @Input() centence: any;
  @Input() register: any;
  @Output() closeModal: EventEmitter<any> = new EventEmitter();

  data: any;
  fullname: any;
  codeid: any;
  userInfo: any;
  arrCollapse = [true, true, true, true, true, true];
  isTypeAccu = false;
  isCheckJudment = false;
  isCheckCollectJudment = false;
  isCheckCollectSpppenal = false;
  isCheckSpppenal = false;
  isCheckOpenstatic = false;
  isSelected = false;
  isFieldContainer = false;
  isFieldStaticContainer = false;
  isCheckLstCenPen = false;
  isVisibleCenlawcode = false;
  isCheckUserFor = false;
  titleField: any;
  checkboxPenalty: any;
  infoCollects: any;
  cenPenalty: any;
  penaltyid: any;
  lstCenPenalty: any;
  resultLaw: any;
  page = 0;
  loading: boolean;


  /* selection */
  checked = false;
  indeterminate = false;
  setOfCheckedId = new Set<any>();
  defaultCheckedId = new Set<any>();

  /* Options */
  lstFormatDate: any;
  lstCode: any[];
  lstLoca: any[];
  lstCenlaw: any[];
  LstStatistics: any[];
  LstStatisticsInsert: any[];
  atxResultLaws: any[];
  lstCenPenaltyInsert: any[];
  cenPenalForced = [false, false]
  STR_LIST_OF_PENALTYID = ['00', '01', '02', '03', '04', '05', '06', '11', '12', '13', '14', '15', '16', '17', '18', '21', '22', '23', '30', '31', '32', '33', '41', '42', '43', '51', '52', '53', '61', '62', '63', '64', '65', '66', '67'];
  STR_LIST_RADIO_OF_PENALTYID = ['00', '01', '02', '03', '04', '05', '06', '30', '31', '32', '33', '41', '42', '43'];
  STR_LIST_OF_FOREC_MAIN = ['41', '42', '43'];
  STR_LIST_OF_FOREC = ['61', '62', '63', '64', '65', '66', '67'];
  STR_LIST_OF_CHECKBOX = ['11', '12', '13', '14', '15', '16', '17', '18', '21', '22', '23', '51', '52', '53', '61', '62', '63', '64', '65', '66', '67']


  // EXPORT DETAIL CASE
  isVisibleModal: boolean;

  constructor(
    private categoriesService: CategoriesService,
    private generalService: GeneralService,
    private notificationService: NotificationService,
    private datechangeService: DateChangeService
  ) {
    this.userInfo = JSON.parse(localStorage.getItem(Constant.USER_INFO));
  }

  ngOnInit(): void {
    this.titleField = '';
    this.fullname = '',
    this.codeid = '',
    this.handleFormatDate();
  }

  ngOnChanges() {
    if (this.isVisible) {
      this.doHandleResetCenPenalty();
      this.checkIsVisibleButton();
      this.checkUserfor();
      this.resultLaw = null;
      this.loading = false;
      this.isSelected = false;
      this.LstStatistics = [];
      if (this.lstAccu) {
        const accu = this.lstAccu.find(e => e.ACCUCODE === this.accuCode);
        if (accu) {
          this.fullname = accu.FULLNAME;
          this.getLstCenLaw(accu.FULLNAME)
        }
      }
      this.getLstCode();
    }
  }

  toggleCollapse(index) {
    this.arrCollapse[index] = !this.arrCollapse[index];
  }
  handleCancel() {
    this.checkIsVisibleButton();
    this.closeModal.emit();
  }

  getLstCode() {
    this.categoriesService.getListCode(' ').subscribe(res => {
      this.lstCode = res;
      this.codeid = this.lstCode[0].CODEID;
    });
  }

  onInputAtxLawWithCode(e: any): void {
    let value = (e.target as HTMLInputElement).value;
    if (!value || value.indexOf('@') >= 0) {
      this.atxResultLaws = [];
    } else {
      if (value === ' ') {
        value = '0';
      }
      this.categoriesService.getListLawAutoComplete(value, this.codeid).subscribe(res => {
        this.atxResultLaws = res;
      });
    }
  }

  f(data, f): any {
    return data[f.toUpperCase()];
  }

  toLawOption(l) {
    return `${l.lawid === null ? '' : 'Điều ' + l.lawid}${l.item === null || l.item === 0 ? '' : (' - Khoản ' + l.item)}${l.point === null ? '' : (' - Điểm ' + l.point)}${l.lawid === null ? '' : ' - ' + l.lawname}`;
  }

  openView(view, data) {
    this.data = data;
    this.checkIsVisibleButton();
    this.isFieldContainer = true;
    view === 'vks' ? this.isCheckJudment = true : this.isCheckSpppenal = true;
    this.getTitleField(view);
    this.getLstCenPenalty(this.isCheckJudment);
  }

  openStatic(data) {
    this.data = data;
    this.checkIsVisibleButton();
    this.isFieldStaticContainer = true;
    this.isCheckOpenstatic = true;
    this.titleField = `Chỉ tiêu thống kê ${this.isTypeAccu ? 'pháp nhân' : 'bị can' } : Điều ${this.data.LAWID} ${this.data.LAWNAME}`;
    this.getLstLocation(this.data.CRIMWHERE);
    this.getLstStatic();
  }

  setOfCheck() {
    this.setOfCheckedId = new Set<any>();
    this.defaultCheckedId = new Set<any>();
    this.LstStatistics.forEach(item => this.updateAvaiable(item));
    this.LstStatistics.forEach(item => this.defaultSelected(item));
    this.refreshCheckedStatus();
  }

  getLstLocation(locaid) {
    this.categoriesService.getLocationById(locaid).subscribe(res => {
      if (res) {
        const res$ = WebUtilities.toUppercaseFields(res); 
        this.lstLoca = [res$];
        this.data.axtLoca = res$;
      } else {
        this.lstLoca = [];
      }
    });
  }

  openViewCollect(collect) {
    this.checkIsVisibleButton();
    this.isFieldContainer = true;
    collect === 'collectVks' ? this.isCheckCollectJudment = true : this.isCheckCollectSpppenal = true;
    this.getTitleField(collect);
    this.getLstJudgement(this.isCheckCollectJudment);
  }

  checkIsVisibleButton() {
    this.isCheckJudment = false;
    this.isCheckCollectJudment = false;
    this.isCheckCollectSpppenal = false;
    this.isCheckSpppenal = false;
    this.isCheckOpenstatic = false;
    this.isFieldContainer = false;
    this.isFieldStaticContainer = false;
  }

  getTitleField(field) {
    this.titleField = field === 'vks' ? `Nhập mức án Viện kiểm sát đề nghị áp dụng cho từng ${this.isTypeAccu ? 'pháp nhân' : 'bị can' } (Điều ${this.data.LAWID})` :
      field === 'hinhphat' ? `Nhập hình phạt áp dụng cho ${this.isTypeAccu ? 'pháp nhân' : 'bị can' } (Điều ${this.data.LAWID})` :
        field === 'collectVks' ? 'Tổng hợp mức án Viện kiểm sát đề nghị' : 'Tổng hợp hình phạt'
  }

  onInputLoca(e: any): void {
    const value = (e.target as HTMLInputElement).value;
    if (!value || value.indexOf('@') >= 0) {
      this.lstLoca = [];
    } else {
      this.categoriesService.getListLocation(value).subscribe(res => {
        this.lstLoca = res;
      });
    }
  }

  getLstStatic() {
    this.loading = true;
    const search = {
      centcode: this.centence.centcode,
      regicode: this.register.regicode,
      accucode: this.accuCode,
      lawcode: this.data.LAWCODE,
      userfor: this.userfor
    }
    this.generalService.getListStatica(search).subscribe(res => {
      if (res) {
        this.LstStatistics = res;
        this.page = this.LstStatistics.length;
        this.setOfCheck();
      } else {
        this.LstStatistics = [];
        this.page = 0;
      }
      this.loading = false;
    }, error => {
      this.loading = false;
      this.notificationService.showNotification(Constant.ERROR, 'Lỗi: ' + error.error.text);
    });
  }

  getLstJudgement(check) {
    this.doHandleResetCenPenalty();
    this.isCheckLstCenPen = false;
    const search = {
      centcode: this.centence.centcode,
      regicode: this.register.regicode,
      accucode: this.accuCode,
      isCheckspppenal: check
    }
    this.generalService.getListJudgement(search).subscribe(res => {
      if (res) {
        this.infoCollects = null;
        const lst: any[] = res;
        if (lst.length === 0) {
          this.infoCollects = this.isCheckCollectJudment ? 'Chưa có thông tin tổng hợp mức án Viện kiểm sát đề nghị' : 'Chưa có thông tin tổng hợp hình phạt';
        } else {
          this.isCheckLstCenPen = true;
          lst.forEach(e => this.doHandleSetValueCenpenalty(e));
        }
      }
    }, error => {
      this.notificationService.showNotification(Constant.ERROR, 'Lỗi: ' + error.error.text);
    });
  }

  getLstCenPenalty(check) {
    this.doHandleResetCenPenalty();
    this.isCheckLstCenPen = false;
    const search = {
      centcode: this.centence.centcode,
      lawcode: this.data.LAWCODE,
      accucode: this.accuCode,
      isCheckspppenal: check
    }
    this.generalService.getListCenPenalty(search).subscribe(res => {
      if (res) {
        const lst: any[] = res;
        if (lst.length !== 0) {
          this.isCheckLstCenPen = true;
          lst.forEach(e => this.doHandleSetValueCenpenalty(e));
        }
      }
    }, error => {
      this.notificationService.showNotification(Constant.ERROR, 'Lỗi: ' + error.error.text);
    });
  }

  getLstCenLaw(fullname) {
    this.checkIsVisibleButton();
    this.isSelected = false;
    const accu = this.lstAccu.find(e => e.FULLNAME === fullname);
    this.isTypeAccu = accu.LEGALPER === 'Y' ? true : false;
    this.accuCode = accu.ACCUCODE;
    const search = {
      centcode: this.centence.centcode,
      userfor: this.userfor,
      regicode: this.register.regicode,
      accucode: this.accuCode
    }
    this.generalService.getListCentLaw(search).subscribe(res => {
      if (res) {
        this.lstCenlaw = res;
      } else {
        this.lstCenlaw = [];
      }
    }, error => {
      this.notificationService.showNotification(Constant.ERROR, 'Lỗi: ' + error.error.text);
    });
  }

  insUpdateCenlaw() {
    if (this.resultLaw) {
      const payload = {
        regicode: this.register.regicode,
        centcode: this.centence.centcode,
        lawcode: this.resultLaw.lawcode,
        accucode: this.accuCode,
        userfor: this.userfor,
      }
      this.generalService.saveCentLaw(payload).subscribe(res => {
        if (res) {
          this.notificationService.showNotification(Constant.ERROR, 'Lỗi: ' + res);
        } else {
          this.resultLaw = null;
          this.notificationService.showNotification(Constant.SUCCESS, 'Thêm mới thành công');
        }
        this.getLstCenLaw(this.fullname);
      }, error => {
        this.notificationService.showNotification(Constant.ERROR, 'Lỗi: ' + error.error.text);
      });
    } else {
      this.notificationService.showNotification(Constant.ERROR, 'Bạn phải nhập giá trị cho trường Tội danh');
    }
  }

  confirmDeleteCenLaw() {
    const selected = this.lstCenlaw.find(e => e.selected === true);
    if (selected) {
      const payload = {
        centcode: this.centence.centcode,
        lawcode: selected.LAWCODE,
        accucode: this.accuCode,
      }
      this.generalService.deleteCentLaw(payload).subscribe(res => {
        if (res) {
          this.notificationService.showNotification(Constant.ERROR, 'Lỗi: ' + res);
        } else {
          this.notificationService.showNotification(Constant.SUCCESS, 'Xóa thành công');
        }
        this.getLstCenLaw(this.fullname);
      }, error => {
        this.notificationService.showNotification(Constant.ERROR, 'Lỗi: ' + error.error.text);
      });
    }
  }

  insUpdateCenPenalty() {
    this.STR_LIST_OF_PENALTYID.forEach(e => this.checkValueCenPenalty(e));
    if (this.lstCenPenaltyInsert.length === 0) {
      const mes = this.isCheckJudment ? 'Bạn chưa tích chọn vào mức án viện kiểm sát đề nghị' : 'Bạn chưa tích chọn vào hình phạt';
      this.notificationService.showNotification(Constant.WARNING, mes);
    } else {
      const payload = {
        action: 'I',
        regicode: this.register.regicode,
        centcode: this.centence.centcode,
        lawcode: this.data.LAWCODE,
        accucode: this.accuCode,
        isCheckspppenal: this.isCheckJudment,
        listSppPenalty: this.lstCenPenaltyInsert
      }
      this.generalService.updateCenPenalty(payload).subscribe(res => {
        if (res.result) {
          this.notificationService.showNotification(Constant.ERROR, 'Lỗi: ' + res.result);
        } else {
          if (res.warning) {
            const msg = this.generalService.jsonError[res.warning];
            this.notificationService.showNotification(Constant.WARNING, msg ? msg : res.warning);
          }
          const mes = this.isCheckJudment ? 'Cập nhật mức án Viện kiểm sát thành công' : 'Cập nhật hình phạt thành công'
          this.notificationService.showNotification(Constant.SUCCESS, mes);
          this.getLstCenPenalty(this.isCheckJudment ? true : false);
        }
      }, error => {
        this.notificationService.showNotification(Constant.ERROR, 'Lỗi: ' + error.error.text);
      });
    }
    setTimeout(() => {
      this.lstCenPenaltyInsert = [];
    }, 10);
  }

  confirmDeleteCenPenalty() {
    const payload = {
      action: 'D',
      regicode: this.register.regicode,
      centcode: this.centence.centcode,
      lawcode: this.data.LAWCODE,
      accucode: this.accuCode,
      isCheckspppenal: this.isCheckJudment
    }
    this.generalService.updateCenPenalty(payload).subscribe(res => {
      if (res.result) {
        this.notificationService.showNotification(Constant.ERROR, 'Lỗi: ' + res.result);
      } else {
        if (res.warning) {
          const msg = this.generalService.jsonError[res.warning];
          this.notificationService.showNotification(Constant.WARNING, msg ? msg : res.warning);
        }
        const mes = this.isCheckJudment ? 'Xóa mức án Viện kiểm sát thành công' : 'Xóa hình phạt thành công'
        this.notificationService.showNotification(Constant.SUCCESS, mes);
        this.doHandleResetCenPenalty();
      }
    }, error => {
      this.notificationService.showNotification(Constant.ERROR, 'Lỗi: ' + error.error.text);
    });
  }

  insUpdateJudgement() {
    this.STR_LIST_OF_PENALTYID.forEach(e => this.checkValueCenPenalty(e));
    if (this.lstCenPenaltyInsert.length === 0) {
      this.notificationService.showNotification(Constant.WARNING, 'Bạn chưa tích chọn tổng hợp hình phạt');
    } else {
      const payload = {
        action: 'I',
        regicode: this.register.regicode,
        centcode: this.centence.centcode,
        accucode: this.accuCode,
        isCheckspppenal: this.isCheckCollectJudment,
        listSppPenalty: this.lstCenPenaltyInsert
      }
      this.generalService.updateJudgement(payload).subscribe(res => {
        if (res.result) {
          this.notificationService.showNotification(Constant.ERROR, 'Lỗi: ' + res.result);
        } else {
          if (res.warning) {
            const msg = this.generalService.jsonError[res.warning];
            this.notificationService.showNotification(Constant.WARNING, msg ? msg : res.warning);
          }
          const mes = this.isCheckCollectJudment ? 'Cập nhật tổng hợp mức án Viện kiểm sát thành công' : 'Cập nhật tổng hợp hình phạt thành công'
          this.notificationService.showNotification(Constant.SUCCESS, mes);
          this.getLstJudgement(this.isCheckCollectJudment);
        }
      }, error => {
        this.notificationService.showNotification(Constant.ERROR, 'Lỗi: ' + error.error.text);
      });
    }
    setTimeout(() => {
      this.lstCenPenaltyInsert = [];
    }, 10);
  }

  confirmDeleteJudgement() {
    const payload = {
      action: 'D',
      regicode: this.register.regicode,
      centcode: this.centence.centcode,
      accucode: this.accuCode,
      isCheckspppenal: this.isCheckCollectJudment
    }
    this.generalService.updateJudgement(payload).subscribe(res => {
      if (res.result) {
        this.notificationService.showNotification(Constant.ERROR, 'Lỗi: ' + res.result);
      } else {
        if (res.warning) {
          const msg = this.generalService.jsonError[res.warning];
          this.notificationService.showNotification(Constant.WARNING, msg ? msg : res.warning);
        }
        const mes = this.isCheckCollectJudment ? 'Xóa tổng hợp mức án Viện kiểm sát thành công' : 'Xóa tổng hợp hình phạt thành công'
        this.notificationService.showNotification(Constant.SUCCESS, mes);
        this.doHandleResetCenPenalty();
      }
    }, error => {
      this.notificationService.showNotification(Constant.ERROR, 'Lỗi: ' + error.error.text);
    });
  }

  confirmSearchAgainJudgement() {
    const payload = {
      regicode: this.register.regicode,
      centcode: this.centence.centcode,
      accucode: this.accuCode,
      isCheckspppenal: this.isCheckCollectJudment
    }
    this.generalService.updateTotalCenPenalty(payload).subscribe(res => {
      if (res) {
        this.notificationService.showNotification(Constant.ERROR, 'Lỗi: ' + res);
      } else {
        this.getLstJudgement(this.isCheckCollectJudment)
        const mes = this.isCheckCollectJudment ? 'Tổng hợp mức án viện kiểm sát đề nghị thành công' : 'Tổng hợp hình phạt thành công'
        this.notificationService.showNotification(Constant.SUCCESS, mes);
      }
    }, error => {
      this.notificationService.showNotification(Constant.ERROR, 'Lỗi: ' + error.error.text);
    });
  }

  insUpdateStatics() {
    this.loading = true;
    const payload = {
      regicode: this.register.regicode,
      centcode: this.centence.centcode,
      accucode: this.accuCode,
      lawcode: this.data.LAWCODE,
      Locaid: this.data.axtLoca?.LOCAID,
      crimdate: this.data.CRIMDATE,
      crimtime: this.data.CRIMTIME,
      userfor: this.userfor,
      listStatistics: [...this.setOfCheckedId.values()]
    }
    this.generalService.updateStatics(payload).subscribe(res => {
      this.notificationService.showNotification(Constant.SUCCESS, 'Cập nhật chỉ tiêu thành công');
      this.getLstStatic();
    }, error => {
      this.notificationService.showNotification(Constant.ERROR, 'Lỗi: ' + error.error.text);
    });
  }

  onRowSelect(selectedItem): void {
    for (const item of this.lstCenlaw) {
      item.selected = false;
    }
    selectedItem.selected = true;
    this.isSelected = true;
  }

  handleFormatDate(){
    this.lstFormatDate = {
      pen02 :{penaltyid: '02',from: this.setFormatDate(),to: this.setFormatDate()},
      pen04 :{penaltyid: '04',from: this.setFormatDate(),to: this.setFormatDate()},
      pen04Sup :{penaltyid: '04Sup',from: this.setFormatDate(),to: this.setFormatDate()},
      pen11 :{penaltyid: '11',from: this.setFormatDate(),to: this.setFormatDate()},
      pen12 :{penaltyid: '12',from: this.setFormatDate(),to: this.setFormatDate()},
      pen13 :{penaltyid: '13',from: this.setFormatDate(),to: this.setFormatDate()},
      pen14 :{penaltyid: '14',from: this.setFormatDate(),to: this.setFormatDate()},
      pen41 :{penaltyid: '41',from: this.setFormatDate(),to: this.setFormatDate()},
      pen51 :{penaltyid: '51',from: this.setFormatDate(),to: this.setFormatDate()},
      pen52 :{penaltyid: '52',from: this.setFormatDate(),to: this.setFormatDate()},
      pen53 :{penaltyid: '53',from: this.setFormatDate(),to: this.setFormatDate()}}
  }

  setFormatDate(): any{
    return {
      formatterYear : (value: number) => `${value} Năm`,
      parserYear : (value: string) => value.replace('Năm ', ''),
      formatterMonth : (value: number) => `${value} Tháng`,
      parserMonth : (value: string) => value.replace('Tháng ', ''),
      formatterDay : (value: number) => `${value} Ngày`,
      parserDay : (value: string) => value.replace('Ngày ', '')
    };
  }

  nzFocusYear(id, item) {
    const data = this.lstFormatDate[id];
    data[item].formatterYear = (value: number) => `${value}`;
    data[item].parserYear = (value: string) => value.replace('', '');
    this.lstFormatDate[id] = data;
  }

  nzBlurYear(id, item) {
    const data = this.lstFormatDate[id];
    data[item].formatterYear = (value: number) => `${value} Năm`;
    data[item].parserYear = (value: string) => value.replace('Năm ', '');
    this.lstFormatDate[id] = data;
  }

  nzFocusMonth(id, item) {
    const data = this.lstFormatDate[id];
    data[item].formatterMonth = (value: number) => `${value}`;
    data[item].parserMonth = (value: string) => value.replace('', '');
    this.lstFormatDate[id] = data;
  }

  nzBlurMonth(id, item) {
    const data = this.lstFormatDate[id];
    data[item].formatterMonth = (value: number) => `${value} Tháng`;
    data[item].parserMonth = (value: string) => value.replace('Tháng ', '');
    this.lstFormatDate[id] = data;
  }

  nzFocusDay(id, item) {
    const data = this.lstFormatDate[id];
    data[item].formatterDay = (value: number) => `${value}`;
    data[item].parserDay = (value: string) => value.replace('', '');
    this.lstFormatDate[id] = data;
  }

  nzBlurDay(id, item) {
    const data = this.lstFormatDate[id];
    data[item].formatterDay = (value: number) => `${value} Ngày`;
    data[item].parserDay = (value: string) => value.replace('Ngày ', '');
    this.lstFormatDate[id] = data;
  }

  doHandleResetCenPenalty() {
    this.cenPenalForced = [false, false];
    this.isCheckLstCenPen = false;
    this.lstCenPenaltyInsert = [];
    this.penaltyid = '99';
    this.lstCenPenalty = {
      pen00: { penaltyid: '00' },
      pen01: { penaltyid: '01', nummoney: '', tmoney: '' },
      pen02: { penaltyid: '02', numyear: 0, nummonth: 0, numday: 0, fyear: 0, fmonth: 0, tyear: 0, tmonth: 0 },
      pen03: { penaltyid: '03' },
      pen04: {
        penaltyid: '04', numyear: 0, nummonth: 0, numday: 0, fyear: 0, fmonth: 0, tyear: 0, tmonth: 0, suspended: false,
        numyeartest: 0, nummonthtest: 0, numdaytest: 0, fyeartest: 0, fmonthtest: 0, tyeartest: 0, tmonthtest: 0
      },
      pen05: { penaltyid: '05' },
      pen06: { penaltyid: '06' },
      pen11: { penaltyid: '11', isCheck: false, numyear: 0, nummonth: 0, numday: 0, fyear: 0, fmonth: 0, tyear: 0, tmonth: 0 },
      pen12: { penaltyid: '12', isCheck: false, numyear: 0, nummonth: 0, numday: 0, fyear: 0, fmonth: 0, tyear: 0, tmonth: 0 },
      pen13: { penaltyid: '13', isCheck: false, numyear: 0, nummonth: 0, numday: 0, fyear: 0, fmonth: 0, tyear: 0, tmonth: 0 },
      pen14: { penaltyid: '14', isCheck: false, numyear: 0, nummonth: 0, numday: 0, fyear: 0, fmonth: 0, tyear: 0, tmonth: 0 },
      pen15: { penaltyid: '15', isCheck: false },
      pen16: { penaltyid: '16', isCheck: false, nummoney: '', tmoney: '' },
      pen17: { penaltyid: '17', isCheck: false },
      pen18: { penaltyid: '18', isCheck: false },
      pen21: { penaltyid: '21', isCheck: false },
      pen22: { penaltyid: '22', isCheck: false },
      pen23: { penaltyid: '23', isCheck: false },
      pen30: { penaltyid: '30' },
      pen31: { penaltyid: '31' },
      pen32: { penaltyid: '32' },
      pen33: { penaltyid: '33' },
      pen41: { penaltyid: '41', numyear: 0, nummonth: 0, numday: 0, fyear: 0, fmonth: 0, fday: 0, tyear: 0, tmonth: 0, tday: 0, forced: false },
      pen42: { penaltyid: '42', forced: false },
      pen43: { penaltyid: '43', forced: false , nummoney: '', tmoney: '' },
      pen51: { penaltyid: '51', isCheck: false, nummoney: '', tmoney: ''  },
      pen52: { penaltyid: '52', numyear: 0, nummonth: 0, numday: 0, fyear: 0, fmonth: 0, fday: 0, tyear: 0, tmonth: 0, tday: 0, isCheck: false },
      pen53: { penaltyid: '53', numyear: 0, nummonth: 0, numday: 0, fyear: 0, fmonth: 0, fday: 0, tyear: 0, tmonth: 0, tday: 0, isCheck: false },
      pen61: { penaltyid: '61', forced: false, isCheck: false },
      pen62: { penaltyid: '62', forced: false, isCheck: false },
      pen63: { penaltyid: '63', forced: false, isCheck: false },
      pen64: { penaltyid: '64', forced: false, isCheck: false },
      pen65: { penaltyid: '65', forced: false, isCheck: false },
      pen66: { penaltyid: '66', forced: false, isCheck: false },
      pen67: { penaltyid: '67', forced: false, isCheck: false }
    }
  }

  doHandleSetValueCenpenalty(data) {
    const item = `pen${data.PENALTYID}`;
    this.lstCenPenalty[item] = WebUtilities.toLowercaseFields(data);
    if (this.STR_LIST_RADIO_OF_PENALTYID.some(e => e === data.PENALTYID)) {
      this.penaltyid = data.PENALTYID;
    }

    if (this.STR_LIST_OF_FOREC_MAIN.some(e => e === data.PENALTYID)
      && !this.cenPenalForced[0]) {
      this.cenPenalForced[0] = this.lstCenPenalty[item].forced;
    }

    if (this.STR_LIST_OF_FOREC.some(e => e === data.PENALTYID)
      && !this.cenPenalForced[1]) {
      this.cenPenalForced[1] = this.lstCenPenalty[item].forced;
    }

    if (this.STR_LIST_OF_CHECKBOX.some(e => e === data.PENALTYID)) {
      this.lstCenPenalty[item].isCheck = true;
    }

  }

  checkValueCenPenalty(penid): any {
    const item = `pen${penid}`;
    const pen = this.lstCenPenalty[item];

    if (this.STR_LIST_OF_FOREC_MAIN.some(e => e === pen?.penaltyid)) {
      pen.forced = this.cenPenalForced[0];
    }

    if (this.STR_LIST_OF_FOREC.some(e => e === pen?.penaltyid)) {
      pen.forced = this.cenPenalForced[1];
    }

    if (this.penaltyid === pen?.penaltyid) {
      this.lstCenPenaltyInsert = [...this.lstCenPenaltyInsert, pen];
      return;
    }

    if (pen?.isCheck) {
      this.lstCenPenaltyInsert = [...this.lstCenPenaltyInsert, pen];
      return;
    }

    // if (!this.STR_LIST_RADIO_OF_PENALTYID.some(e => e === pen?.penaltyid)) {
    //   if (pen?.numyear > 0 ||
    //     pen?.nummonth > 0 ||
    //     pen?.numday > 0 ||
    //     pen?.fyear > 0 ||
    //     pen?.fmonth > 0 ||
    //     pen?.tyear > 0 ||
    //     pen?.tmonth > 0) {
    //     this.lstCenPenaltyInsert = [...this.lstCenPenaltyInsert, pen];
    //     return;
    //   }
    //   if (pen?.nummoney || pen?.tmoney) {
    //     this.lstCenPenaltyInsert = [...this.lstCenPenaltyInsert, pen];
    //     return;
    //   }
    // }
  }

  onValueCrimdate(event: any) {
    this.data.CRIMDATE = this.datechangeService.onDateValueChange(event);
  }

  validateOnlyNumbers(event: KeyboardEvent): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    return !(charCode > 31 && (charCode < 48 || charCode > 57));
  }

  updateCheckedSet(id: any, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  }

  updateAvaiable(item: any) {
    if (item.ACCUCODE) {
      this.setOfCheckedId.add(item.STATID);
    }
  }
  defaultSelected(item: any) {
    if (item.ACCUCODE) {
      this.defaultCheckedId.add(item.STATID);
    }
  }
  onItemChecked(id: any, checked: boolean): void {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
  }

  onAllChecked(value: boolean): void {
    this.LstStatistics.forEach(item => this.updateCheckedSet(item.STATID, value));
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    this.checked = this.LstStatistics.every(item => this.setOfCheckedId.has(item.STATID));
    this.indeterminate = this.LstStatistics.some(item => this.setOfCheckedId.has(item.STATID)) && !this.checked;
  }

  openPopupCenlawcode() {
    this.isVisibleCenlawcode = true;
  }

  closePopupCenlawcode() {
    this.isVisibleCenlawcode = false;
    this.getLstCenLaw(this.fullname)
  }

  async checkUserfor() {
    if (this.userfor === 'G1' || this.userfor === 'G2') {
      this.isCheckUserFor = false;
    } else {
      this.isCheckUserFor = true;
    }
  }

  handleOpenPDFModal=()=>this.isVisibleModal = true;
  handleCancelModal=()=>this.isVisibleModal = false;
}
