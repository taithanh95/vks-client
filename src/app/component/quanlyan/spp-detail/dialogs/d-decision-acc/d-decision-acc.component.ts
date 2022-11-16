import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {CategoriesService} from '../../../../../service/categories.service';
import {GeneralService} from '../../../../../service/general-service';
import {NotificationService} from '../../../../../service/notification.service';
import {AppConfigService} from '../../../../../../app-config.service';
import {SppRegister} from '../../../../../model/spp-register';
import {Constant} from '../../../../../shared/constants/constant.class';
import {WebUtilities} from '../../../../../shared/utils/qla-utils.class';
import {DateChangeService} from '../../../../../service/date-change.service';
import {DateService} from '../../../../../common/util/date.service';
import {ConstantService} from '../../../../../service/constant.service';
import {ResponseBody} from '../../../../../component/so-thu-ly/model/response-body';
import {DateUtils} from '../../../../../shared/utils/date-utils.class';
import * as moment from 'moment';

@Component({
  selector: 'app-d-decision-acc',
  templateUrl: './d-decision-acc.component.html',
  styleUrls: ['./d-decision-acc.component.scss']
})
export class DDecisionAccComponent implements OnInit, OnChanges {
  @Input() userfor: any;
  @Input() isVisible: boolean;
  @Input() register: any;
  @Input() accus: any;
  @Input() sppCase: any;
  @Input() onlyAccu: boolean;
  datas: any[];
  @Input() data: any;
  @Output() closeModal: EventEmitter<any> = new EventEmitter();
  @Output() reload: EventEmitter<any> = new EventEmitter();

  allowClone: boolean;
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
  lstInpectors: any[]
  inspectorOpions: any[]
  isSubmited: boolean;
  sppId: any;
  lstPols: any[];
  userInfo: any;
  selectedSpp: any;
  loading: boolean;
  isOffice: boolean;
  /*DICISION*/
  isVisibleRegisterDecision: boolean;
  registerId: any;
  lstRegisterDecision: any[];

  constructor(
    private categoriesService: CategoriesService,
    private generalService: GeneralService,
    private notificationService: NotificationService,
    private configService: AppConfigService,
    private datechangeService: DateChangeService,
    private dateService: DateService,
    private constantService: ConstantService
  ) {
    this.sppId = this.categoriesService.getSppId();
    if (!this.data) {
      this.data = new SppRegister();
    }
  }

  ngOnInit(): void {
    this.data = {};
    this.isSubmited = false;
    this.getListPol();
    this.userInfo = JSON.parse(localStorage.getItem(Constant.USER_INFO));
    this.allowClone = false;
    this.selectedSpp = WebUtilities.getLoggedSpp();
  }

  ngOnChanges(): void {
    if (this.isVisible) {
      this.allowClone = false;
      this.loading = false;
      this.lstRegisterDecision = [];
      this.datas = [];
      this.registerId = null;
      this.isSubmited = false;
      if (this.data && !this.data.isEdit) {
        this.resetForm();
      }
      if (this.data && this.data.begin_officeid) {
        this.bindAutoComplete(this.data.begin_officeid);
        this.getListReason(this.data.deciid)
      }
      if (this.data && this.data.decitypeid) {
        this.data.decitypeid = this.data.deciid.substring(0, 2);
      }
      if (this.register) {
        this.getListData();
        this.getListCategories();
      }
      if (!this.onlyAccu) {
        this.resetForm();
      }
      if (this.data?.accucode) {
        this.getListRegisterDecision();
      }
      this.getLstSignOffice(this.data?.begin_office);
    }
  }

  getListPol() {
    this.categoriesService.getListPol({size: 100}).subscribe(res => {
      this.lstPols = res.datas;
      this.lstPols.push({polid: 'SPP', name: 'Viện kiểm sát'});
      this.lstPols.push({polid: 'SPC', name: 'Tòa án'});
    });
  }

  getListData(): void {
    //this.datas = [];
    // tslint:disable-next-line:max-line-length
    const filter = {
      applyfor: 'A',
      casecode: this.register.casecode,
      sortOrder: 'ASC',
      usefor: this.userfor,
      regicode: this.register.regicode
    };
    this.generalService.getListDecision(filter).subscribe(res => {
      if (res) {
        this.datas = res;
      } else {
        this.datas = [];
      }
      // alert(res.length);
    }, error => {
      this.notificationService.showNotification(Constant.ERROR, 'Lỗi: ' + error.error.text);
    });
  }

  f(data, f): any {
    return data[f.toUpperCase()];
  }

  cancel(): void {
    // this.nzMessageService.info('click cancel');
  }

  confirm(item): void {
    // delete row
    this.deleteDecisionCase(item);
  }

  resetForm() {
    this.loading = false;
    this.registerId = null;
    this.data = {};
    this.isSubmited = false;
    this.data.decitypeid = '';
    this.data.setunit = 'D';
    this.data.settime = 0;
    this.data.begin_office = this.userfor === 'G3' ? 'SPC' : 'SPP';
    this.data.begin_officeid = '01';

    this.data.begin_officeid = this.userInfo ? WebUtilities.getLoggedSppId() : null;
    if (this.accus && this.accus.length > 0) {
      if (this.onlyAccu) {
        this.data.accucode = this.accus[0].accucode;
      } else {
        const first = this.accus.find(en => en.FIRSTACC === 'Y');
        if (first) this.data.accucode = first.ACCUCODE;
        else this.data.accucode = this.accus[0].ACCUCODE;
      }
    }
    this.bindAutoComplete(this.data.begin_officeid);
  }

  deleteDecisionCase(item): void {
    this.generalService.deleteDecisionAcc(item.DECICODE).subscribe(res => {
      this.notificationService.showNotification(Constant.SUCCESS, 'Xóa quyết định bị can thành công');
      this.getListData();
      //làm mới màn hình danh sách cấp số lệnh
      this.getListRegisterDecision();
      // alert(res.length);
    }, error => {
      const msg = this.generalService.readPropertiesJava(error.error.text);
      if (msg) {
        this.notificationService.showNotification(Constant.ERROR, msg);
      } else {
        this.getListData();
        //làm mới màn hình danh sách cấp số lệnh
        this.getListRegisterDecision();
      }
    });
  }

  bindAutoComplete(begin_officeid: any) {
    switch (this.data.begin_office) {
      case '02':
        this.categoriesService.getListPolice(begin_officeid).subscribe(res => {
          this.lstPolices = res;
          this.data.atxPolice = res.find(e => e.POLICEID === begin_officeid);
        });
        break;
      case '04':
        this.categoriesService.getListArmy(begin_officeid).subscribe(res => {
          this.lstArmies = res;
          this.data.atxArmy = res.find(e => e.ARMYID === begin_officeid);
        });
        break;
      case '06':
        this.categoriesService.getListCustoms(begin_officeid).subscribe(res => {
          this.lstCustoms = res;
          this.data.atxCustoms = res.find(e => e.CUSTOMID === begin_officeid);
        });
        break;
      case '08':
        this.categoriesService.getListRangers(begin_officeid).subscribe(res => {
          this.lstRangers = res;
          this.data.atxRanger = res.find(e => e.RANGID === begin_officeid);
        });
        break;
      case '09':
        this.categoriesService.getListBorderGuards(begin_officeid).subscribe(res => {
          this.lstBorderGuards = res;
          this.data.atxBorderGuards = res.find(e => e.BORGUAID === begin_officeid);
        });
        break;
      case 'SPP':
        this.categoriesService.getListVKS(begin_officeid).subscribe(res => {
          this.lstSpps = res;
          this.data.atxSpp = res.find(e => e.sppid === begin_officeid);
        });
        break;
      case 'SPC':
        this.categoriesService.getListToaAn(begin_officeid).subscribe(res => {
          this.lstSpcs = res;
          this.data.atxSpc = res.find(e => e.SPCID === begin_officeid);
        });
        break;
    }
  }

  getListCategories() {
    this.categoriesService.getListDecitypeAccu({usefor: this.userfor}).subscribe(res => {
      this.lstDeciTypes = res;
    });
    this.getListDecision('');
  }

  getListDecision(deciType: any) {
    this.categoriesService.getListDecision_ForHS({
      applyfor: 'A',
      decitype: this.data.decitypeid,
      usefor: this.userfor
    }).subscribe(res => {
      this.lstDecis = res;
    });
  }

  getListReason(deciId: any) {
    this.categoriesService.loadLstReason({usefor: this.userfor, applyfor: 'A', deciid: ''}).subscribe(res => {
      this.lstReasons = res ? res : [];
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

    if (!this.data.setnum) {
      this.notificationService.showNotification(Constant.ERROR, 'Bạn phải nhập giá trị cho trường Quyết định số');
      valid = false;
    }
    if (!this.data.indate) {
      this.notificationService.showNotification(Constant.ERROR, 'Bạn phải nhập giá trị cho trường Ngày ra quyết định');
      valid = false;
    }
    if (!this.data.begin_office) {
      this.notificationService.showNotification(Constant.ERROR, 'Bạn phải nhập giá trị cho trường Đơn vị ra quyết định');
      valid = false;
    }
    if (!this.data.accucode) {
      this.notificationService.showNotification(Constant.ERROR, 'Bạn phải nhập giá trị cho trường Bị can');
      valid = false;
    }
    if (!this.data.deciid) {
      this.notificationService.showNotification(Constant.ERROR, 'Bạn phải nhập giá trị cho trường Quyết định');
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
    if (this.datas.find(e => this.data.setnum == e.SETNUM &&
      this.data.deciid == e.DECIID && this.dateService.dateToString(this.data.indate, "DD/MM/YYYY") == this.dateService.dateToString(e.INDATE, "DD/MM/YYYY"))) {
      this.notificationService.showNotification(Constant.ERROR, 'Số quyết định đã được cấp trong năm');
      valid = false;
    }
    const validBeginOfficeid = this.validBegin_Off(this.data.begin_office);
    const validDecision = this.validRegisterDecision();
    if (valid && validDecision && validBeginOfficeid) {
      //this.isVisible = false;
      //this.closeModal.emit(false);
      this.data.userfor = this.userfor;
      //this.submitForm.emit(this.data);

      this.doInsertUpdate(this.data);
      //Neu chi co 1 acc -> dong popup
      if (this.onlyAccu) {
        this.closeModal.emit(false);
      }
      this.resetForm();
    } else {
      this.loading = false;
    }
  }

  msgErr = (item) => `Bạn phải nhập giá trị cho trường ${item}`;

  validBegin_Off(begin_office) {
    switch (begin_office) {
      case '02':
        if (!this.data.atxPolice) {
          this.notificationService.showNotification(Constant.ERROR, this.msgErr('Đơn vị công an'))
          return false
        }
        break;
      case '04':
        if (!this.data.atxArmy) {
          this.notificationService.showNotification(Constant.ERROR, this.msgErr('Quân đội'))
          return false
        }
        break;
      case '06':
        if (!this.data.atxCustoms) {
          this.notificationService.showNotification(Constant.ERROR, this.msgErr('Hải quan'))
          return false
        }
        break;
      case '08':
        if (!this.data.atxRanger) {
          this.notificationService.showNotification(Constant.ERROR, this.msgErr('Kiểm lâm'))
          return false
        }
        break;
      case '09':
        if (!this.data.atxBorderGuards) {
          this.notificationService.showNotification(Constant.ERROR, this.msgErr('Bộ đội biên phòng'))
          return false
        }
        break;
      case 'SPP':
        if (!this.data.atxSpp) {
          this.notificationService.showNotification(Constant.ERROR, this.msgErr('Viện kiểm sát'))
          return false
        }
        break;
      case 'SPC':
        if (!this.data.atxSpc) {
          this.notificationService.showNotification(Constant.ERROR, this.msgErr('Tòa án'))
          return false
        }
        break;
      default:
        return true
    }
    return true;
  }

  doInsertUpdate(data) {
    data.userforname = this.generalService.toUserForName(this.userfor);
    data.usefor = this.userfor;
    data.regicode = this.register.regicode;
    data.sppid = WebUtilities.getLoggedSppId();
    data.casecode = this.register.casecode;
    const savedItem = {
      decision: data,
      action: 'I',
      sppid: WebUtilities.getLoggedSppId()
    };
    let actionText = 'Thêm mới';
    if (data.isEdit) {
      savedItem.action = 'U';
      actionText = 'Cập nhật';
    } else {
      savedItem.action = 'I';
    }
    this.generalService.saveSppDecisionAccu(savedItem).subscribe(res => {
      this.notificationService.showNotification(Constant.SUCCESS, `${actionText} quyết định bị can thành công`);
      if (this.onlyAccu) {
        // refresh parent
        // this.submitForm.emit();
      } else {
        this.getListData();
      }
      this.reload.emit();
      //làm mới màn hình danh sách cấp số lệnh
      this.getListRegisterDecision();
    }, error => {
      if (error.error && error.error.text)
        this.notificationService.showNotification(Constant.ERROR, error.error.text);
      else
        this.notificationService.showNotification(Constant.ERROR, 'Lỗi dữ liệu');
      if (this.onlyAccu) {
        // refresh parent
        // this.submitForm.emit();
      } else {
        this.getListData();
      }
      //làm mới màn hình danh sách cấp số lệnh
      this.getListRegisterDecision();
    });
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

  polChangeEvent() {
    this.data.atxPolice = null;
    this.data.atxArmy = null;
    this.data.atxBorderGuards = null;
    this.data.atxCustoms = null;
    this.data.atxRanger = null;
    // alert(this.data.changeid);
    this.bindAutoComplete('0');
    this.data.signoffice = null;
    this.getLstSignOffice(this.data.begin_office);
  }

  calculateDiff(fromDate, toDate) {
    return Math.floor((Date.UTC(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate()) - Date.UTC(toDate.getFullYear(), toDate.getMonth(), toDate.getDate())) / (1000 * 60 * 60 * 24));
  }

  todateChange(event) {
    const todate = this.data.todate;
    const dayCount = 0;
    let duThang = 0;
    let duNam = 0;
    const fromDate = new Date(this.data.fromdate);
    const toDate = new Date(event);

    if (todate != null) {
      // tslint:disable-next-line:no-shadowed-variable
      let dayCount = this.calculateDiff(fromDate, toDate);
      if (dayCount > 0) {
        this.data.todate = null;
        event = null;
        this.notificationService.showNotification(Constant.ERROR, 'Hiệu lực từ ngày" phải trước "Đến ngày"');
      } else {
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
    } else {
      this.data.fromdate = event;
    }
  }

  showEditForm(data: any) {
    this.data = WebUtilities.toLowercaseFieldsWithoutConvertBoolean(data);
    this.data.isEdit = true;
    for (let i = 0; i < this.datas.length; i++) {
      const item = this.datas[i];
      item.selected = false;
    }
    data.selected = true;
    this.allowClone = true;
    this.bindAutoComplete(this.data.begin_officeid);
    this.data.decitypeid = this.data.deciid.substring(0, 2);
  }

  cloneItem() {
    this.allowClone = false;
    this.data.isEdit = false;
    this.data.accucode = null;
    this.data.setnum = null;
    this.data.decicode = null;
  }

  signerAutoChange(option: any) {
    if (option) this.data.signoffice = option.nzValue, this.data.signname = option.nzLabel;
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
    const charCode = (event.which) ? event.which : event.keyCode;
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
      this.registerId = data.id;
      this.data.decitypeid = data?.decisionCode.substring(0, 2);
      this.data.deciid = data?.decisionCode;
      this.data.setnum = data?.decisionNum;
      this.data.indate = this.convertDate(data.issuesDate);
      this.indateChange(this.data.indate);
      if (data.fromDate) {
        this.data.fromdate = this.convertDate(data.fromDate);
      }
      if (data.toDate) {
        this.data.todate = this.convertDate(data.toDate);
        this.todateChange(this.data.todate);
      } else {
        this.data.todate = null;
        this.data.esettime = null;
      }
    }
  }

  convertDate(date): any {
    return this.dateService.stringToDate(date, "DD-MM-YYYY");
  }

  getListRegisterDecision(): void {
    this.lstRegisterDecision = [];
    this.constantService.postRequest(
      this.constantService.SOTHULY_URL + 'registerDecision/getList/',
      {
        type: 2,
        accusedCode: this.data?.accucode,
        sppCode: this.sppCase.SPPID,
        stage: this.userfor
      }).toPromise().then(resp => resp.json())
      .then((resp: ResponseBody) => {
        if (resp.responseCode === '0007') {
          // Không có dữ liệu thì không làm gì cả (Không bắn thông báo nữa)
        } else if (resp.responseCode === '0000') {
          resp.responseData.some(n => {
            this.checkDecisionExsit(n.decisionNum, n.decisionCode, n.issuesDate) ?
              this.lstRegisterDecision = [...this.lstRegisterDecision] :
              this.lstRegisterDecision = [...this.lstRegisterDecision, n];
          });
        } else {
          this.notificationService.showNotification(Constant.ERROR, resp.responseMessage);
        }
      }).catch(err => this.notificationService.showNotification(Constant.ERROR, 'Hệ thống không phản hồi. ' + err.message));
  }

  checkDecisionExsit(decisionNum, decisionCode, issuesDate): boolean {
    let rs = false;
    this.getListData();
    if (this.datas.length != 0) {
      rs = this.datas.some(e => e.ACCUCODE == this.data?.accucode && e.SETNUM == decisionNum && e.DECIID === decisionCode
        && this.dateService.dateToString(e.INDATE, "DD/MM/YYYY") == issuesDate);
    }
    return rs;
  }

  validRegisterDecision(): boolean {
    let valid = true;
    if (this.checkDecisionExsit(this.data.setnum, this.data.deciid, this.dateService.dateToString(this.data.indate, "DD/MM/YYYY"))) {
      if (this.data.decicode) {
        return valid;
      }
      this.notificationService.showNotification(Constant.ERROR, 'Cấp số lệnh/QĐ đã được sử dụng');
      return valid = false;
    }

    if (this.datas.length != 0) {
      if (!(this.datas.every(e => e.ACCUCODE == this.data?.accucode && e.DECIID != this.data.deciid))) {
        const indate = this.dateService.dateToString(this.data.indate, "DD/MM/YYYY");
        const maxDate = this.dateService.dateToString(this.maxValueDate(this.data?.deciid, 'datas'), "DD/MM/YYYY");
        const maxNumdeci = this.maxValueNumdeci(this.data?.deciid, 'datas');

        this.datas.filter(e => e.DECIID == this.data.deciid && e.ACCUCODE == this.data?.accucode).some(e => {
          const date = this.dateService.dateToString(e.INDATE, "DD/MM/YYYY");
          // if (e.SETNUM != this.data.setnum && date == indate) {
          //   this.notificationService.showNotification(Constant.ERROR, 'Quyết định đã được cấp trong ngày');
          //   valid = false;
          // }

          if (e.SETNUM == this.data.setnum && date != indate) {
            this.notificationService.showNotification(Constant.ERROR, 'Số quyết định đã được cấp');
            valid = false;
          }
          if (e.SETNUM != this.data.setnum && moment(this.dateService.stringToDate(maxDate, "DD/MM/YYYY")).isAfter(new Date(this.data.indate))) {
            this.notificationService.showNotification(Constant.ERROR, `Yêu cầu ngày ra QĐ lớn hơn ngày ${maxDate}`);
            valid = false;
          }
          // if (parseInt(this.data.setnum) < maxNumdeci
          //   && date != indate) {
          //   this.notificationService.showNotification(Constant.ERROR, `Yêu cầu số quyết định lớn hơn ${maxNumdeci}`);
          //   valid = false;
          // }
          return valid === false;
        });
      }
    }

    if (!valid) {
      return valid
    }

    if (this.lstRegisterDecision.length != 0) {

      if (this.lstRegisterDecision.some(e => e.decisionCode != this.data.deciid)) {
        return valid;
      }

      const indate = this.dateService.dateToString(this.data.indate, "DD/MM/YYYY");
      const maxDate = this.maxValueDate(this.data?.deciid);
      const maxNumdeci = this.maxValueNumdeci(this.data?.deciid);
      this.lstRegisterDecision.filter(e => e.decisionCode == this.data.deciid).some(e => {
        if (e.decisionNum == this.data.setnum
          && e.issuesDate == indate) {
          this.notificationService.showNotification(Constant.ERROR, 'Quyết định đã được cấp trong ngày2');
          valid = false;
        }
        if (e.decisionNum == this.data.setnum
          && e.issuesDate != indate) {
          this.notificationService.showNotification(Constant.ERROR, 'Số quyết định đã được cấp');
          valid = false;
        }
        if (e.decisionNum != this.data.setnum
          && moment(this.dateService.stringToDate(maxDate, "DD/MM/YYYY")).isAfter(new Date(this.data.indate))) {
          this.notificationService.showNotification(Constant.ERROR, `Yêu cầu ngày ra QĐ lớn hơn ngày ${maxDate}`);
          valid = false;
        }
        // if (parseInt(this.data.setnum) < maxNumdeci
        //   && e.issuesDate != indate) {
        //   this.notificationService.showNotification(Constant.ERROR, `Yêu cầu số quyết định lớn hơn ${maxNumdeci}`);
        //   valid = false;
        // }
        return valid === false;
      });
    }
    return valid;
  }

  maxValueDate(deciid, lst?) {
    if (lst === 'datas') {
      const lstDicision = deciid ? this.datas.filter(e => e.DECIID == deciid) : [];
      if (lstDicision.length == 1) {
        return lstDicision[0].INDATE;
      } else if (lstDicision.length > 1) {
        return lstDicision.reduce((prev, current) => {
          return DateUtils.compareDate(new Date(prev.INDATE), new Date(current.INDATE)) > 0 ? prev.INDATE : current.INDATE;
        });
      } else {
        return null;
      }
    } else {
      const lstDicision = deciid ? this.lstRegisterDecision.filter(e => e.decisionCode == deciid) : [];
      if (lstDicision.length == 1) {
        return lstDicision[0].issuesDate;
      } else if (lstDicision.length > 1) {
        return lstDicision.reduce((prev, current) => {
          return prev.issuesDate > current.issuesDate ? prev.issuesDate : current.issuesDate;
        });
      } else {
        return null;
      }
    }
  }

  maxValueNumdeci(deciid, lst?) {
    if (lst === 'datas') {
      const lstDicision = deciid ? this.datas.filter(e => e.DECIID == deciid) : [];
      if (lstDicision.length == 1) {
        return lstDicision[0].SETNUM;
      } else if (lstDicision.length > 1) {
        return lstDicision.reduce((prev, current) => {
          return prev.SETNUM > current.SETNUM ? prev.SETNUM : current.SETNUM;
        });
      } else {
        return null;
      }
    } else {
      const lstDicision = deciid ? this.lstRegisterDecision.filter(e => e.decisionCode == deciid) : [];
      if (lstDicision.length == 1) {
        return lstDicision[0].decisionNum;
      } else if (lstDicision.length > 1) {
        return lstDicision.reduce((prev, current) => {
          return prev.decisionNum > current.decisionNum ? prev.decisionNum : current.decisionNum;
        });
      } else {
        return null;
      }
    }
  }

  getLstSignOffice(office) {
    if (office === 'SPC') {
      this.lstSignOffice = [{value: 'Thẩm phán'}];
    } else if (office === 'SPP') {
      this.lstSignOffice = [{value: 'Viện trưởng'}, {value: 'Phó Viện trưởng'}];
    } else if (office === '02') {
      this.lstSignOffice = [{value: 'Thủ trưởng'}, {value: 'Phó Thủ trưởng'}];
    }
    this.isValueOffice();
  }

  isValueOffice() {
    if (this.data.begin_office === '02'
      || this.data.begin_office === 'SPC'
      || this.data.begin_office === 'SPP') {
      this.isOffice = true;
    } else {
      this.isOffice = false;
    }
  }

  onInputInspector(e: any): void {
    let value = (e.target as HTMLInputElement).value;
    if (value === ' ') value = '0';
    if (!value || value.indexOf('@') >= 0) {
      this.lstInpectors = [];
    } else {
      this.categoriesService.getLstInspectorByQuery(value, 'ALL', this.sppId).subscribe(res => {
        this.lstInpectors = res;
      });
    }
  }

  handleChangeSignname() {
    if (this.lstInpectors) {
      const rs = this.lstInpectors.find(s => s.FULLNAME === this.data.signname);
      if (rs) {
        this.categoriesService.getInspectorByinpcode(rs?.INSPCODE).subscribe(res => {
          this.inspectorOpions = [res];
          this.data.signoffice = res.JOBTITLE;
        }, err => {
          console.log(err.error.text);
        });
      }
    }
  }
}
