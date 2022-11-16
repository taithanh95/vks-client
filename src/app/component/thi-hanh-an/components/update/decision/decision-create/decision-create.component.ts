import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {CategoriesService} from '../../../../../../service/categories.service';
import {NotificationService} from '../../../../../../service/notification.service';
import {Constant} from '../../../../../../shared/constants/constant.class';
import {WebUtilities} from '../../../../../../shared/utils/qla-utils.class';
import {DateChangeService} from '../../../../../../service/date-change.service';
import {GeneralService} from '../../../../../../service/general-service';
import {DeciDataModel} from '../../../../../thi-hanh-an/model/decidata.model';

@Component({
  selector: 'app-decision-create',
  templateUrl: './decision-create.component.html',
  styleUrls: ['./decision-create.component.scss']
})
export class DecisionCreateComponent implements OnInit,OnChanges {
  @Input() userfor: any;
  @Input() isVisible: boolean;
  @Input() isVisibleDisable: boolean;
  @Input() register: any;
  @Input() data: any;
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter();
  @Output() realoadForm: EventEmitter<boolean> = new EventEmitter();

  /* LIST DATA */
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
  lstSignOffice: any[]
  LstSidOptions: any[];

  /* DECISION DATA DETAIL*/
  decidata!: DeciDataModel;

  /** LIST QUYẾT ĐỊNH BỔ SUNG THI HÀNH ÁN */
  arrDeciData = ['8714','8716','8723','8702','8705','8712','8729','8721']
  arrVaild = ['8714','8702','8729']

  /* ITEM */
  isSubmited: boolean;
  selectedSpp: any;
  sppId: any;
  loading: boolean;
  isOffice: boolean;
  userInfo: any;
  timelimit = true;
  reasonable = false;



  constructor(
    private categoriesService: CategoriesService,
    private notificationService: NotificationService,
    private datechangeService: DateChangeService,
    private generalService: GeneralService
  ) {
    this.decidata = {} as DeciDataModel;
    this.sppId = WebUtilities.getLoggedSppId();
    this.userInfo = JSON.parse(localStorage.getItem(Constant.SPP));
  }

  ngOnInit(): void {
    this.isSubmited = false;
    this.selectedSpp = WebUtilities.getLoggedSpp();
    this.getListCategories();
  }

  ngOnChanges(): void {
    if (this.isVisible) {
      this.loading = false;
      this.isSubmited = false;
      if (this.data) {
        if (this.data.isEdit) {
          this.getDeciData();
          this.getLoadListReason(this.data?.deciid);
        } else {
          this.resetForm()
        }
      }
      this.bindAutoComplete(this.data.begin_officeid);
    }
  }

  getDeciData(): void {
    if (this.arrDeciData.includes(this.data.deciid)) {
      const search = {
        decicode: this.data.decicode,
        deciid:this.data.deciid,
        regicode: this.register.regicode
      }
      this.generalService.searchDeciDataG6(search).subscribe(res => {
        if(res.responseCode === '0000') {
          this.decidata = WebUtilities.toLowercaseFieldsWithoutConvertBoolean(res.responseData);
        } else {
          this.notificationService.showNotification(Constant.ERROR,res.responseMessage);
        }
      });
    }
  }

  resetForm() {
    this.data.begin_office = 'SPP';
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
        this.categoriesService.getFromSpp(begin_officeid).subscribe(res => {
          this.lstSpcs = res;
          this.data.atxSpc = this.setObj(this.lstSpcs, 'SPCID', begin_officeid);
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

  getListCategories(): void {
    this.categoriesService.getAllPol().subscribe(res => {
      this.LstSidOptions = res;
    });
    this.getListDecision('');
  }

  getListDecision(deciType?: any) {
    this.categoriesService.getListDecision_ForHS({ applyfor: 'A', decitype: deciType, usefor: this.userfor }).subscribe(res => {
      this.lstDecis = res;
    });
  }

  getLoadListReason(deciid: any) {
    const payload = { usefor: this.userfor, applyfor: 'A', deciid: deciid };
    this.categoriesService.loadLstReason(payload).subscribe(res => {
      this.lstReasons = res;
      this.reasonable = this.lstReasons.length > 0;
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
    if (!this.data.setnum) {
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
    if (this.arrVaild.includes(this.data.deciid) && !this.decidata.actdate){
      this.notificationService.showNotification(Constant.ERROR, 'Bạn phải nhập giá trị cho trường Ngày thi hành án');
      valid = false;
    }
    if (valid) {
      this.data.userfor = this.userfor;
      this.submitDecisionCase(this.data);
    } else {
      this.loading = false;
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
  }

  /** HANDLES DATE */
  setTimeToDate(): void {
    if (!this.data.fromdate) return;
    const etime = this.data.esettime ? +this.data.esettime : 0;
    const fromDate = new Date(this.data.fromdate);
    if (this.data.esetunit === 'D') {
      this.data.todate = new Date(fromDate.setDate(fromDate.getDate() + etime));
    } else if (this.data.esetunit === 'M') {
      const addMonth = fromDate.getMonth() + etime;
      this.data.todate = new Date(fromDate.setMonth(addMonth));
    } else if (this.data.esetunit === 'Y') {
      this.data.todate = new Date(fromDate.setFullYear(fromDate.getFullYear() + etime));
    }
  }

  setTimeFinishDate(): void {
    if (!this.data.indate) return;
    const stime = this.data.settime ? +this.data.settime : 0;
    const indate = new Date(this.data.indate);
    if (this.data.esetunit === 'D') {
      this.data.todate = new Date(indate.setDate(indate.getDate() + stime));
    } else if (this.data.esetunit === 'M') {
      const addMonth = indate.getMonth() + stime;
      this.data.todate = new Date(indate.setMonth(addMonth));
    } else if (this.data.esetunit === 'Y') {
      this.data.todate = new Date(indate.setFullYear(indate.getFullYear() + stime));
    }
  }

  changeEset() {
    this.timelimit = true;
    this.fromdateChange(this.data.fromdate);
  }

  deciChange($event: any) {
    this.getLoadListReason(this.data.deciid);
    this.setValueESet(this.data.deciid);
    this.decidata = {} as DeciDataModel;
  }

  setValueESet(deciid,isCheck?) {
    this.categoriesService.getDecisionByDeciId(deciid).subscribe(res => {
      if (res) {
        this.data.settime = parseInt(res?.SETTIME);
        const unit = res?.SETUNIT.replace(' ', '');
        this.data.setunit = unit === '' ? 'D' : unit;
        this.data.esettime = +this.data.settime;
        this.data.esetunit = this.data.setunit;
        if (isCheck) this.timelimit = "N" !== res?.TIMELIMIT;
      }
    }, err => console.error(err))
  }

  calculateDiff(fromDate, toDate) {
    return Math.floor((Date.UTC(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate()) - Date.UTC(toDate.getFullYear(), toDate.getMonth(), toDate.getDate())) / (1000 * 60 * 60 * 24));
  }

  todateChange(event) {
    const todate = new Date(event);
    const fromdate = new Date(this.data.fromdate);
    const countDay = this.calculateDiff(todate,fromdate);
    if (countDay < 0){
      this.fromdateChange(fromdate);
      this.notificationService.showNotification(Constant.ERROR,'Thời hạn/Hiệu lực từ ngày không được sau đến ngày')
    }

    if (!fromdate && !todate) {
      this.data.esettime = countDay;
      this.data.esetunit = 'D';
    }
  }

  indateChange(event) {
    const indate = new Date(event);
    const registerDate = new Date(this.register.indate);
    const countDay = this.calculateDiff(indate,registerDate);
    if (countDay < 0) {
      this.notificationService.showNotification(Constant.ERROR, 'Ngày quyết định phải nhỏ hơn hoặc bằng ngày thụ lý');
      setTimeout(() => {
        this.data.indate = null;
        this.data.fromdate = null;
        this.data.finishdate = null;
        this.data.todate = null;
      }, 10);
      return;
    }
    this.data.fromdate = indate;
    this.setValueESet(this.data.deciid, true);
    this.setTimeFinishDate();
    if (this.timelimit) this.setTimeToDate();
    
  }

  fromdateChange(event: any) {
    const fromdate = new Date(event);
    const indate = this.data.indate;
    const countDay = this.calculateDiff(fromdate,indate);
    if (countDay < 0){
      this.notificationService.showNotification(Constant.ERROR, 'Ngày hiệu lực phải lớn hơn hoặc bằng ngày ra quyết định');
    } else {
      if (this.timelimit) this.setTimeToDate();
    }
  }

  onValueDate(item: string, event: any) {
    this.data[item] = this.datechangeService.onDateValueChange(event);
  }

  onValueDateDeciData(item: string, event: any) {
    this.decidata[item] = this.datechangeService.onDateValueChange(event);
  }

  validateOnlyNumbers(event: KeyboardEvent): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    return !(charCode > 31 && (charCode < 48 || charCode > 57));
  }

  /** END HANDLES DATE */

  handleReset(): void {
    this.data = {};
    this.data.isEdit = false;
    this.data.settime = 0;
    this.data.setunit = 'D';

    this.data.esettime = 0;
    this.data.esetunit = 'D';
    this.data.begin_office = 'SPP';
    this.data.begin_officeid = this.sppId;
    this.bindAutoComplete(this.data.begin_officeid);
  }

  submitDecisionCase(data): void {
    if (this.register) {
      data.regicode = this.register.regicode;
      data.accucode = this.register.accucode;

      const savedItem = {
        ...data,
        decidata: this.decidata,
        begin_officeid: this.getOfficeId(this.data.begin_office),
        action: 'I',
        sppid: this.userInfo.sppid
      };
      let actionText = 'Thêm mới';
      if (data.isEdit) {
        savedItem.action = 'U';
        actionText = 'Cập nhật';
      }
      
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      this.generalService.saveDecisionG6(savedItem).subscribe(res => {
        if (res.responseCode === '0000') {
          const err = ['spp_decision_error_THA','spp_decision_error_UT'];
          if (err.includes(res.responseMessage)) {
            const msg = this.generalService.readPropertiesJava(res.responseMessage);
            this.notificationService.showNotification(Constant.ERROR, msg);
          } else {
            this.notificationService.showNotification(Constant.SUCCESS, actionText + ' quyết định thành công');
            this.realoadForm.emit(false);
            this.closeModal.emit(false);
            this.isVisible = false;
          }
        } else {
          this.notificationService.showNotification(Constant.ERROR, res.responseMessage);
        }
        this.loading = false;
      }, error => {
        this.loading = false;
        if (error.error && error.error.text) {
          this.notificationService.showNotification(Constant.ERROR, error.error.text);
        } else {
          this.notificationService.showNotification(Constant.ERROR, 'Lỗi dữ liệu');
        }
      });
    }
  }

  getOfficeId(begin_off: string): string {
    switch (begin_off) {
      case '02':
          return this.data.atxPolice.POLICEID;
      case '04':
          return this.data.atxArmy.ARMYID;
      case '06':
          return this.data.atxCustoms.CUSTOMID;
      case '08':
          return this.data.atxRanger.RANGID;
      case '09':
          return this.data.atxBorderGuards.BORGUAID;
      case 'SPP':
          return this.data.atxSpp.sppid
      case 'SPC':
          return this.data.atxSpc.SPCID
    }
  }

  formatterYear = (value = 0) => `${value} Năm`
  parserYear = (value = '') => value.replace('Năm ', '')
  formatterMonth = (value = 0) => `${value} Tháng`
  parserMonth = (value = '') => value.replace('Tháng ', '')
  formatterDay = (value = 0) => `${value} Ngày`
  parserDay = (value = '') => value.replace('Ngày ', '')
}

