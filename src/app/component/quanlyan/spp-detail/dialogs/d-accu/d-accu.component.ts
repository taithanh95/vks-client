import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {CategoriesService} from '../../../../../service/categories.service';
import {WebUtilities} from '../../../../../shared/utils/qla-utils.class';
import {GeneralService} from '../../../../../service/general-service';
import {NotificationService} from '../../../../../service/notification.service';
import {Constant} from '../../../../../shared/constants/constant.class';
import {AppConfigService} from '../../../../../../app-config.service';
import {ConstantService} from '../../../../../service/constant.service';
import {ViolantionModel} from '../../../../../model/violantion.model';
import * as moment from 'moment';
import {DateChangeService} from '../../../../../service/date-change.service';
import {of} from 'rxjs/internal/observable/of';
import {StringService} from '../../../../../common/util/string.service';

@Component({
  selector: 'app-d-accu',
  templateUrl: './d-accu.component.html',
  styleUrls: ['./d-accu.component.scss']
})
export class DAccuComponent implements OnInit, OnChanges {
  // tslint:disable-next-line:variable-name
  position_type: any;
  @Input() sppCase: any;
  @Input() userfor: any;
  @Input() isVisible: boolean;
  @Input() data: any;
  @Input() register: any;
  @Output() closeModal: EventEmitter<any> = new EventEmitter();
  @Output() submitForm: EventEmitter<any> = new EventEmitter();
  @Output() loadPage: EventEmitter<any> = new EventEmitter();
  sppId: any;
  selectedSpp: any;
  isSubmited: boolean;

  /*DEMO*/
  inputValue?: any;
  inspectorOpions: any[];
  assignInsOptions: any[];
  assignInsValue?: any;
  arrCollapse: any[];

  /*OPTIONS*/
  lstPolices: any[];
  lstArmies: any[];

  lstCustoms: any[];
  lstRangers: any[];
  lstBorderGuards: any[];
  lstSpps: any[]; // Viện kiểm sát
  lstSpcs: any[]; // Tòa án

  lstCountry: any[];
  lstLoca: any[];
  lstAddress: any[];
  lstReligions: any[];
  lstNations: any[];
  lstKnowledges: any[];

  lstOccupations: any[];
  lstParties: any[];
  lstOffices: any[];
  lstPols: any[];
  @Input() sppAccadditioninfo: any;
  /*LAW*/
  @Input() lstLaw: any[];
  lstSavedLaw: any[];

  pageSize: any;
  page: any;
  defaultPage: any;
  loading: boolean;
  isVisibleLaw: boolean;
  isVisibleViolantion: boolean;
  isVisibleArrestDetentionArrestee: boolean;
  isVisibleYearErr: boolean;
  isYearBef: any;
  isVisiblePreventMeasures: boolean;

  isVisibleDeci: boolean;
  /*Accu*/
  lstDeciAccu: any[];
  lstDecisionAcc: any[];

  lstAccu: any[];
  selectedDeci: any;

  /** LIST PREVENTIVE MEASURES*/
  lstPreventiveMeasuresId: string[];
  lstData: any[] = [];
  reventiveMeasures: any;

  /*Violation*/
  lstViolantion: ViolantionModel[] = [];
  isVisibleViolation: boolean;
  selectedVio: ViolantionModel;
  violantionModelForEdit: ViolantionModel;
  index: number;

  /** Data Occupations */
  arrOccupations: string[]

  /** Data decision acc */
  deci = [{
    setnum: '',
    indate: '',
    atxSpp: null,
    atxPolice: null,
    atxSpc: null,
    atxArmy: null,
    atxCustoms: null,
    atxRanger: null,
    atxBorderGuards: null,
    decicode: '',
    deciid: '',
    fromdate: '',
    todate: '',
    signname: '',
    signoffice: '',
    casecode: '',
    regicode: '',
    begin_office: '',
    begin_officeid: '',
    accucode: '',
  }];

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

  onInputCustoms(e: any): void {
    const value = (e.target as HTMLInputElement).value;
    if (!value || value.indexOf('@') >= 0) {
      this.lstArmies = [];
    } else {
      this.categoriesService.getListCustoms(value).subscribe(res => {
        this.lstCustoms = res;
      });
    }
  }

  onInputRangers(e: any): void {
    const value = (e.target as HTMLInputElement).value;
    if (!value || value.indexOf('@') >= 0) {
      this.lstArmies = [];
    } else {
      this.categoriesService.getListRangers(value).subscribe(res => {
        this.lstRangers = res;
      });
    }
  }

  onInputBorderGuards(e: any): void {
    const value = (e.target as HTMLInputElement).value;
    if (!value || value.indexOf('@') >= 0) {
      this.lstArmies = [];
    } else {
      this.categoriesService.getListBorderGuards(value).subscribe(res => {
        this.lstBorderGuards = res;
      });
    }
  }

  polChangeEvent() {
    this.data.police = null;
    this.data.army = null;
    this.data.border = null;
    this.data.customs = null;
    this.data.ranger = null;
    this.data.spp = null;
    this.data.spc = null;
    this.bindAutoComplete('0');
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

  selectCountry() {
    this.categoriesService.getListCountry({counId: this.data.counid}).subscribe(res => {
      this.data.country = res.datas[0];
    });
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

  onInputAddress(e: any): void {
    const value = (e.target as HTMLInputElement).value;
    if (!value || value.indexOf('@') >= 0) {
      this.lstAddress = [];
    } else {
      this.categoriesService.getListLocation(value).subscribe(res => {
        this.lstAddress = res;
      });
    }
  }

  constructor(
    private categoriesService: CategoriesService,
    private generalService: GeneralService,
    private notificationService: NotificationService,
    private configService: AppConfigService,
    private constantService: ConstantService,
    private datechangeService: DateChangeService,
    private stringService: StringService
  ) {
    this.sppId = this.categoriesService.getSppId();
    if (!this.data) {
      this.data = {};
      this.data.position_type = 'KS';
      this.data.position_ksv = 'TG';
      this.arrCollapse = [true, true, true, true, true];
    }

  }

  ngOnInit(): void {
    this.sppAccadditioninfo = {};
    this.lstPreventiveMeasuresId = [];
    this.arrOccupations = [];
    this.lstViolantion = [];
    this.lstDeciAccu = [];
    this.lstDecisionAcc = [];
    this.isSubmited = false;
    this.loading = false;
    this.pageSize = this.configService.getConfig().pageSize;
    this.page = this.configService.getConfig().page;
    this.defaultPage = this.configService.getConfig().defaultPage;
    this.selectedSpp = WebUtilities.getLoggedSpp();
  }


  toggleCollapse(index: number) {
    this.arrCollapse[index] = !this.arrCollapse[index];
  }

  bindAutoComplete(begin_officeid: any) {
    switch (this.data.begin_office) {
      case '02':
        this.categoriesService.getListPolice(begin_officeid).subscribe(res => {
          this.lstPolices = res;
          this.data.police = res[0];
        });
        break;
      case '04':
        this.categoriesService.getListArmy(begin_officeid).subscribe(res => {
          this.lstArmies = res;
          this.data.army = res[0];
        });
        break;
      case '06':
        this.categoriesService.getListCustoms(begin_officeid).subscribe(res => {
          this.lstCustoms = res;
          this.data.customs = res[0];
        });
        break;
      case '08':
        this.categoriesService.getListRangers(begin_officeid).subscribe(res => {
          this.lstRangers = res;
          this.data.ranger = res[0];
        });
        break;
      case '09':
        this.categoriesService.getListBorderGuards(begin_officeid).subscribe(res => {
          this.lstBorderGuards = res;
          this.data.border = res[0];
        });
        break;
      case 'SPP':
        this.categoriesService.getListVKS(begin_officeid).subscribe(res => {
          this.lstSpps = res;
          this.data.spp = res[0];
        });
        break;
      case 'SPC':
        this.categoriesService.getListToaAn(begin_officeid).subscribe(res => {
          this.lstSpcs = res;
          this.data.spc = res[0];
        });
        break;
    }
  }

  getListCategories() {
    this.categoriesService.getListReligion({size: 100}).subscribe(res => {
      this.lstReligions = res.datas;
    });
    this.categoriesService.getListNation({size: 100}).subscribe(res => {
      this.lstNations = res.datas;
    });
    this.categoriesService.getListKnowledge({size: 100}).subscribe(res => {
      this.lstKnowledges = res.datas;
    });
    this.categoriesService.getListOccupation({size: 100}).subscribe(res => {
      this.lstOccupations = res.datas;
    });
    this.categoriesService.getListParty({size: 100}).subscribe(res => {
      this.lstParties = res.datas;
    });
    this.categoriesService.getListOffice({size: 100}).subscribe(res => {
      this.lstOffices = res.datas;
    });
    this.categoriesService.getListPol({size: 100}).subscribe(res => {
      this.lstPols = res.datas;
    });
    this.categoriesService.getListCountry({size: 300}).subscribe(res => {
      this.lstCountry = res.datas;
    });
  }

  ngOnChanges(): void {
    if (!this.data || !this.isVisible) {
      return;
    }
    if (this.isVisible) {
      this.lstData = []
      this.reventiveMeasures = {};
      this.isSubmited = false;
      this.loading = false;
      if (this.data.isEdit) {
        this.generalService.getLstLawByAccu(this.data.accucode).subscribe(res => {
          this.lstSavedLaw = res;
        });
        this.generalService.getSppAccadditioninfoByAcuucode(this.data.accucode).subscribe(res => {
          this.sppAccadditioninfo = res !== null ? res : {};
          if (this.sppAccadditioninfo.preventiveMeasuresId) {
            this.lstPreventiveMeasuresId = this.sppAccadditioninfo.preventiveMeasuresId.split(',');
          }
        });
        this.generalService.getSppViolantionByAcuucode(this.data.accucode).subscribe(res => {
          this.lstViolantion = res;
        });
        this.generalService.getListPreventiveMeasures(this.data.accucode).subscribe(res => {
          this.lstData = res;
        });
        this.getListDeciByAccu();
        this.lstAccu = [this.data];
        if (this.data.occuid) {
          this.arrOccupations = this.data.occuid.split(',');
        }
      } else {
        this.arrOccupations = [];
        this.lstPreventiveMeasuresId = [];
        this.sppAccadditioninfo = {};
        this.lstViolantion = [];
        this.lstSavedLaw = this.lstLaw.filter(en => 1 === 1);
        this.data.begin_indate = this.sppCase.BEGIN_INDATE;
      }
      this.inspectorOpions = [];
      this.assignInsOptions = [];

      if (this.data && this.data.inspcode) {
        this.categoriesService.getLstInspectorByQuery(this.data.inspcode, this.data.position_type, this.sppId).subscribe(res => {
          this.inspectorOpions = res;
          this.data.atxtIns = res[0];
        });
      }
      if (this.data && this.data.assignins) {
        this.categoriesService.getLstInspectorByQueryNPC(this.data.assignins, this.sppId).subscribe(res => {
          this.assignInsOptions = res;
          this.data.atxtAssignIns = res[0];
        });
      }
      if (!this.data.counid) {
        this.data.counid = 'VN'
      }
      const payloadCountry = {counId: this.data.counid};
      if (this.data) {
        this.categoriesService.getListCountry(payloadCountry).subscribe(res => {
          this.data.country = res.datas[0];
        });
      }

      if (this.data && this.data.locaid) {
        this.categoriesService.getLocationById(this.data.locaid).subscribe(res => {
          res = WebUtilities.toUppercaseFields(res);
          this.lstLoca = [res];
          this.data.locaid = res;
        });
      }
      if (this.data && this.data.address) {
        this.categoriesService.getLocationById(this.data.address).subscribe(res => {
          res = WebUtilities.toUppercaseFields(res);
          this.lstAddress = [res];
          this.data.address = res;
        });
      }
      if (this.data && this.data.begin_officeid) {
        this.bindAutoComplete(this.data.begin_officeid);
      }
      this.getListCategories();
    }
  }

  changeInspector() {
    this.data.assigndate = null;
    this.data.setnum = null;
    this.data.atxtIns = null;
    this.data.atxtAssignIns = null;
  }

  getListDeciByAccu(): void {
    /*this.lstDeciAccu = [];*/
    // tslint:disable-next-line:max-line-length
    const filter = {
      applyfor: 'A',
      casecode: this.data.casecode,
      sortOrder: 'ASC',
      usefor: this.userfor,
      regicode: this.data.regicode
    };
    this.generalService.getListDecision(filter).subscribe(res => {
      if (res) {
        this.lstDeciAccu = res.filter(en => en.ACCUCODE === this.data.accucode);
      } else {
        this.lstDeciAccu = [];
      }
      // alert(res.length);
    }, error => {
      this.notificationService.showNotification(Constant.ERROR, 'Lỗi: ' + error.error.text);
    });
  }

  f(data, f): any {
    return data[f.toUpperCase()];
  }

  handleCancel(): void {
    this.isVisible = false;
    this.closeModal.emit(false);
  }

  handleOk(): void {
    this.isSubmited = true;
    this.loading = true;
    let valid = true;
    if (!this.data.begin_setnum) {
      this.notificationService.showNotification(Constant.ERROR, 'Bạn phải nhập giá trị cho trường Quyết định số');
      valid = false;
    }
    if (!this.data.begin_indate) {
      this.notificationService.showNotification(Constant.ERROR, 'Bạn phải nhập giá trị cho trường Ngày ra quyết định');
      valid = false;
    }
    if (!this.data.firstacc) {
      this.notificationService.showNotification(Constant.ERROR, 'Bạn phải nhập giá trị cho trường Bị can đầu vụ');
      valid = false;
    }
    if (!this.data.fullname) {
      this.notificationService.showNotification(Constant.ERROR, 'Bạn phải nhập giá trị cho trường Họ và tên');
      valid = false;
    }
    if (!this.data.byear) {
      this.notificationService.showNotification(Constant.ERROR, 'Bạn phải nhập giá trị cho trường Năm sinh');
      valid = false;
    }

    // if (!this.data.identify) {
    //   this.notificationService.showNotification(Constant.ERROR, 'Bạn phải nhập giá trị cho trường Số CMND');
    //   valid = false;
    // }

    if (!this.data.country) {
      this.notificationService.showNotification(Constant.ERROR, 'Bạn phải nhập giá trị cho trường Quốc tịch');
      valid = false;
    }
    if (!this.data.natiid) {
      this.notificationService.showNotification(Constant.ERROR, 'Bạn phải nhập giá trị cho trường Dân tộc');
      valid = false;
    }
    if (!this.data.sex) {
      this.notificationService.showNotification(Constant.ERROR, 'Bạn phải nhập giá trị cho trường Giới tính');
      valid = false;
    }
    if (!this.data.birthday) {
      this.notificationService.showNotification(Constant.ERROR, 'Bạn phải nhập giá trị cho trường Ngày sinh');
      valid = false;
    }
    if (!this.data.levelid) {
      this.notificationService.showNotification(Constant.ERROR, 'Bạn phải nhập giá trị cho trường Học vấn');
      valid = false;
    }
    if (!this.data.locaid) {
      this.notificationService.showNotification(Constant.ERROR, 'Bạn phải nhập giá trị cho trường Nơi ĐKHKTT');
      valid = false;
    }
    if (valid) {
      this.data.phapnhan = '';
      this.data.lstViolantion = this.lstViolantion;
      this.data.occuid = this.arrOccupations.toString();
      this.data.lstPreventMeasures = this.lstData;
      // this.sppAccadditioninfo.preventiveMeasuresId = this.lstPreventiveMeasuresId.toString();
      this.data.sppAccadditioninfo = this.sppAccadditioninfo;
      // set saved law list
      this.data.lawcode = this.lstSavedLaw;
      this.data.userfor = this.userfor;
      if (this.data.isEdit) {
        this.isVisible = false;
        this.loading = false;
        this.closeModal.emit(false);
        this.submitForm.emit({...this.data, fullname: this.stringService.capitalize(this.data.fullname),
          othername: this.stringService.capitalize(this.data.othername)});
      } else {
        this.submitAccu({
          ...this.data,
          fullname: this.stringService.capitalize(this.data.fullname),
          othername: this.stringService.capitalize(this.data.othername)
        });
      }
    } else {
      this.loading = false;
    }
  }

  checkDisabled() {
    if (this.userfor === 'G3' || this.userfor === 'G4' || this.userfor === 'G5' || this.userfor === 'G6' || this.data.isEdit === true) {
      return true;
    } else {
      return false;
    }
  }

  compareFun1 = (o1: any | string, o2: any) => {
    if (o1) {
      const ret = typeof o1 === 'string' ? o1 === o2.FULLNAME : o1.INSPCODE === o2.INSPCODE;
      return ret;
    } else {
      return false;
    }
  };
  compareFun2 = (o1: any | string, o2: any) => {
    if (o1) {
      return typeof o1 === 'string' ? o1 === o2.FULLNAME : o1.INSPCODE === o2.INSPCODE;
    } else {
      return false;
    }
  };

  birthdayChange() {
    if (this.data) {
      this.isVisibleYearErr = false;
      this.data.byear = !this.data.byear ? this.isYearBef : this.data.byear;
      if (!this.data.byear) {
        this.notificationService.showNotification(Constant.ERROR, 'Bạn phải nhập giá trị cho trường Năm sinh bị can / bị cáo')
        this.isVisibleYearErr = true;
        return;
      } else if (this.data.byear.length < 4) {
        setTimeout(() => {
          this.isVisibleYearErr = true;
          this.data.byear = null;
          this.data.bmonth = null;
          this.data.bday = null;
          this.data.birthday = null;
        }, 10);
        this.notificationService.showNotification(Constant.ERROR, 'Bạn phải nhập giá trị cho trường Năm / tháng / ngày sinh')
        return;
      }
      this.isYearBef = this.data.byear ? this.data.byear : this.isYearBef;

      if (!this.data.bmonth || this.data.bmonth > 12) {
        this.data.bmonth = 12;
      }
      const day = this.getDaysInMonth(this.data.bmonth, this.data.byear);
      if (!this.data.bday || this.data.bday > day) {
        this.data.bday = day;
      }
      this.checkBirthDay();
    }
  }

  checkBirthDay() {
    let crimDate = this.sppCase.CRIMDATE;
    const birthDay = new Date(this.data.byear, this.data.bmonth - 1, this.data.bday);

    crimDate = new Date(crimDate);
    this.data.birthday = null;

    if (moment(new Date()).isBefore(birthDay)) {
      this.notificationService.showNotification(Constant.WARNING, 'Ngày sinh phải nhỏ hơn hoặc bằng ngày hiện tại')
      this.data.byear = null;
      this.data.bmonth = null;
      this.data.bday = null;
      this.data.birthday = null;
      return;
    }
    // @ts-ignore
    const ageDate = new Date(crimDate - birthDay); // miliseconds from epoch
    const totalYear = Math.abs(ageDate.getUTCFullYear() - 1970);
    // if (totalYear < 14 && (this.sppCase.CASETYPE === 'L3' || this.sppCase.CASETYPE === 'L4')) {
    if (totalYear < 14) {
      const msg = this.generalService.readPropertiesJava('SppAccused.warn.accusedTooYoung');
      this.notificationService.showNotification(Constant.WARNING, msg);
      this.data.byear = null;
      this.data.bmonth = null;
      this.data.bday = null;
      this.data.birthday = null;
      return;
    }
    /*else if (totalYear < 16){
      const msg = this.generalService.readPropertiesJava('SppAccused.warn.accusedTooYoung');
      this.notificationService.showNotification(Constant.ERROR, msg);
      this.data.birthday = null;
      return;
    }*/
    else if (birthDay.getFullYear() < 1700) {
      const msg = this.generalService.readPropertiesJava('SppAccused.warn.accusedTooOld');
      this.notificationService.showNotification(Constant.WARNING, msg);
      this.data.byear = null;
      this.data.bmonth = null;
      this.data.bday = null;
      this.data.birthday = null;
      return;
    }
    this.data.birthday = birthDay;
  }

  getDaysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
  }

  showInsertLaw() {
    this.isVisibleLaw = true;
  }

  showArrestDetentionArrestee() {
    this.isVisibleArrestDetentionArrestee = true;
  }

  showInsertDeciAccuForm() {
    this.isVisibleDeci = true;
    this.selectedDeci = {isEdit: false};
  }

  closePopupLaw(): void {
    this.isVisibleLaw = false;
  }

  closePopupArrestDetentionArrestee(): void {
    this.isVisibleArrestDetentionArrestee = false;
  }

  closePopupViolantion(): void {
    this.isVisibleViolantion = false;
  }

  submitLaw(data): void {
    // this.lstSavedLaw.push(data);
    // use ... to change grid
    const checkExists = this.lstSavedLaw.some(e => e.LAWCODE === data.LAWCODE);
    if (!checkExists) {
      this.lstSavedLaw = [
        ...this.lstSavedLaw,
        data
      ];
    } else {
      this.notificationService.showNotification(Constant.ERROR, 'Điều luật đã được thêm trước đó');
    }
  }
  submitArrestDetentionArrestee(data) {
    this.deci = [];
    data.settlementDecisions.forEach(async rs => {
      if (rs.decisionId === '5101') {
        this.data.begin_setnum = rs.decisionNumber;
        this.data.begin_indate = rs.decisionDate;
        switch (rs.decisionMakingAgency) {
          case '1':
            this.data.begin_office = '02';
            break;
          case '2':
            this.data.begin_office = '04';
            break;
          case '3':
            this.data.begin_office = '06';
            break;
          case '4':
            this.data.begin_office = '08';
            break;
          case '5':
            this.data.begin_office = '09';
            break;
          case '6':
            this.data.begin_office = 'SPC';
            break;
          case '7':
            this.data.begin_office = 'SPP';
            break;
          case '8':
            this.data.begin_office = '10';
            break;
          case '9':
            this.data.begin_office = '12';
            break;
        }
        this.bindAutoComplete(rs.decisionMakingUnitId);
      } else {
        let decision = {
          setnum: '',
          indate: '',
          atxSpp: null,
          atxPolice: null,
          atxSpc: null,
          atxArmy: null,
          atxCustoms: null,
          atxRanger: null,
          atxBorderGuards: null,
          decicode: '',
          deciid: '',
          fromdate: '',
          todate: '',
          signname: '',
          signoffice: '',
          casecode: '',
          regicode: '',
          begin_office: '',
          begin_officeid: '',
          accucode: '',
        };
        // let decision;
        decision.setnum = rs.decisionNumber;
        decision.indate = rs.decisionDate;
        switch (rs.decisionMakingAgency) {
          case '1':
            decision.begin_office = '02';
            const atxPolice = await this.getObject('getPoliceFromBySppId', rs.decisionMakingUnitId);
            decision.atxPolice = atxPolice;
            break;
          case '2':
            decision.begin_office = '04';
            const atxArmy = await this.getObject('getArmyBySppId', rs.decisionMakingUnitId);
            decision.atxArmy = atxArmy[0];
            break;
          case '3':
            decision.begin_office = '06';
            const atxCustoms = await this.getObject('getCustomsBySppId', rs.decisionMakingUnitId);
            decision.atxCustoms = atxCustoms[0];
            break;
          case '4':
            decision.begin_office = '08';
            const atxRanger = await this.getObject('getRangerBySppId', rs.decisionMakingUnitId);
            decision.atxRanger = atxRanger[0];
            break;
          case '5':
            decision.begin_office = '09';
            const atxBorderGuards = await this.getObject('getBorderGuardsBySppId', rs.decisionMakingUnitId);
            decision.atxBorderGuards = atxBorderGuards[0];
            break;
          case '6':
            decision.begin_office = 'SPC';
            const atxSpc = await this.getObject('getFromSpp', rs.decisionMakingUnitId);
            decision.atxSpc = atxSpc[0];
            break;
          case '7':
            decision.begin_office = 'SPP';
            const atxSpp = await this.getObject('getSppBySppid', rs.decisionMakingUnitId);
            decision.atxSpp = atxSpp;
            break;
          case '8':
            decision.begin_office = '10';
            break;
          case '9':
            decision.begin_office = '12';
            break;
        }
        decision.decicode = rs.decisionNumber; // Cần lấy mã quyết định
        decision.deciid = rs.decisionId;
        decision.fromdate = rs.effectStartDate;
        decision.todate = rs.effectEndDate;
        decision.signname = rs.signer;
        decision.signoffice = rs.singerPosition;
        decision.casecode = this.sppCase.CASECODE;
        decision.regicode = this.register.regicode;
        decision.accucode = this.register.accucode;
        this.deci.push(decision);
      }
    });
    this.data.fullname = data.fullName;
    const newDate = new Date(data.dateOfBirth);
    this.data.byear = data.yearOfBirth;
    this.data.bmonth = newDate.getMonth() + 1;
    this.data.bday = newDate.getDate();
    this.data.birthday = newDate;
    this.data.addrname = data.address;
    this.data.arresteeId = data.id;
    if (data.isDead) {
      this.sppAccadditioninfo.dead = data.isDead;
    }
    if (data.deathDate) {
      const deathDate = new Date(data.deathDate);
      this.sppAccadditioninfo.deadDay = deathDate;
    }
    if (data.causeOfDeathId) {
      this.sppAccadditioninfo.causeOfDeath = Number(data.causeOfDeathId);
    }
    if (data.escaped) {
      this.sppAccadditioninfo.fled = data.escaped;
    }
    if (data.escapingDate) {
      const escapingDate = new Date(data.escapingDate);
      this.sppAccadditioninfo.dayOfHiding = escapingDate;
    }
    if (data.reasonForEscaping) {
      this.sppAccadditioninfo.reasonForHiding = data.reasonForEscaping;
    }
    if (data.moveToAnotherPlace) {
      this.sppAccadditioninfo.moveToOtherPlace = data.moveToAnotherPlace;
    }
    if (data.moveToAnotherPlaceDate) {
      this.sppAccadditioninfo.moveOutdate = data.moveToAnotherPlaceDate;
    }
    if (data.arriveFromAnotherPlace) {
      this.sppAccadditioninfo.movedToAnotherPlace = data.arriveFromAnotherPlace;
    }
    if (data.arriveFromAnotherPlaceDate) {
      this.sppAccadditioninfo.moveInDate = data.arriveFromAnotherPlaceDate;
    }
    if (data.reason) {
      this.sppAccadditioninfo.reason = data.reason;
    }
    for (const item of data.disciplineViolations) {
      const violantionModelItem: ViolantionModel = {};
      violantionModelItem.typeOfViolations = 2;
      violantionModelItem.contentViolations = item.violationContent;
      violantionModelItem.processing = item.punishmentType;
      violantionModelItem.dateOfViolation = item.violationDate;
      this.lstViolantion.push(violantionModelItem);
    }
    for (const item of data.lawOffenses) {
      let CodeId;
      switch (item.lawName) {
        case 'BLHS 2015':
          CodeId = '06'
          break;
        case 'BLHS 1999':
          CodeId = '02'
          break;
        case 'BLHS 1985':
          CodeId = '05'
          break;
        default:
          break;
      }
      const payload = {
        LawName: item.enactmentName,
        CodeId: CodeId,
        sortField: 'lawId',
        sortOrder: 'DESC',
      }
      this.setLawOffenses(payload);
    }
  }

  async getObject(funcName: string, param: string) {
    return new Promise<any>(async (resolve) => {
      this.categoriesService[funcName](param).subscribe(res => {
        resolve(res ?? '');
      });
    })
  }

  async setLawOffenses(payload) {
    const lawOff = await this.categoriesService.getListLaw(payload).toPromise().then();
    of(lawOff).subscribe(res => {
      if (res.datas) {
        const item = res.datas[0];
        const lawOffensesItem: any = {};
        lawOffensesItem.LAWID = item.lawId;
        lawOffensesItem.ITEM = item.item;
        lawOffensesItem.POINT = item.point;
        lawOffensesItem.LAWNAME = item.lawName;
        lawOffensesItem.CODENAME = item.codeName;
        lawOffensesItem.LAWCODE = item.lawCode;
        this.lstSavedLaw = [
          ...this.lstSavedLaw,
          lawOffensesItem
        ];
      }
    })
  }

  submitViolantion(data): void {
    if (data.index === undefined) {
      this.lstViolantion.push(data);
    } else {
      this.lstViolantion[data.index].id = data.id;
      this.lstViolantion[data.index].typeOfViolations = data.typeOfViolations;
      this.lstViolantion[data.index].typeName = data.typeName;
      this.lstViolantion[data.index].dateOfViolation = data.dateOfViolation;
      this.lstViolantion[data.index].timeOfViolation = data.timeOfViolation;
      this.lstViolantion[data.index].contentViolations = data.contentViolations;
      this.lstViolantion[data.index].processing = data.processing;
      this.lstViolantion[data.index].accuCode = data.accuCode;
      this.lstViolantion[data.index].caseCode = data.caseCode;
      this.lstViolantion[data.index].violcode = data.violcode;
    }
  }

  deleteLaw(index: any) {
    this.lstSavedLaw.splice(index, 1)[0];
    this.lstSavedLaw = [...this.lstSavedLaw]
  }

  getListPol() {
    this.categoriesService.getListPol({size: 100}).subscribe(res => {
      this.lstPols = res.datas;
    });
  }

  confirm(index): void {
    this.deleteLaw(index);
  }

  deleteClientViolantion(data: any) {
    const index = this.lstViolantion.indexOf(data);
    if (index > -1) {
      this.lstViolantion.splice(index, 1);
      this.lstViolantion = [...this.lstViolantion]
    }
  }

  deleteBackEndViolantion(data: any) {
    this.generalService.deleteViolantionById(data.id).subscribe();
  }

  confirmViolantion(data, i): void {
    this.deleteClientViolantion(data);
    this.deleteBackEndViolantion(data);
  }

  confirmDeleteDeci(deci): void {
    this.generalService.deleteDecisionAcc(deci.DECICODE).subscribe(res => {
      this.notificationService.showNotification(Constant.SUCCESS, 'Xóa quyết định bị can thành công');
      this.getListDeciByAccu();
      // alert(res.length);
    }, error => {
      const msg = this.generalService.readPropertiesJava(error.error.text);
      if (msg) {
        this.notificationService.showNotification(Constant.ERROR, msg);
      } else {
        this.getListDeciByAccu();
      }
    });
  }

  handleReset() {
    this.doReset();
  }

  doReset() {
    this.sppAccadditioninfo.dead = null;
    this.sppAccadditioninfo.fled = null;
    this.sppAccadditioninfo.moveToOtherPlace = null;
    this.sppAccadditioninfo.movedToAnotherPlace = null;
    this.lstData = [];
    this.lstViolantion = [];
    this.reventiveMeasures = {};
    this.lstSavedLaw = this.lstLaw;
    this.isSubmited = false;
    this.data = {};
    this.data.begin_setnum = '';
    this.data.begin_indate = this.sppCase.BEGIN_INDATE;
    /*this.selectedAccu.begin_office = '02';
    this.selectedAccu.begin_officeid = this.selectedSpp.polid;*/
    this.data.begin_office = this.sppCase.BEGIN_OFFICE;
    this.data.begin_officeid = this.sppCase.BEGIN_OFFICEID;

    this.data.firstacc = 'N';
    this.data.religion = 'K';
    this.data.sex = 'B';
    this.data.counid = 'VN';
    this.data.natiid = '01';
    this.data.levelid = '01';
    this.data.locaid = this.selectedSpp.locaid;
    this.data.address = this.selectedSpp.locaid;
    this.data.partyid = '';
    this.data.isEdit = false;
    this.data.country = this.lstCountry.find(e => e.counid === this.data.counid, []);
    this.bindAutoComplete(this.data.begin_officeid);
    if (this.data && this.data.locaid) {
      this.categoriesService.getLocationById(this.data.locaid).subscribe(res => {
        res = WebUtilities.toUppercaseFields(res);
        this.lstLoca = [res];
        this.data.locaid = res;
      });
    }
    if (this.data && this.data.address) {
      this.categoriesService.getLocationById(this.data.address).subscribe(res => {
        res = WebUtilities.toUppercaseFields(res);
        this.lstAddress = [res];
        this.data.address = res;
      });
    }
  }

  cancel = () => null;

  showEditFormDeci(deci: any) {
    deci = WebUtilities.toLowercaseFieldsWithoutConvertBoolean(deci);
    deci.isEdit = true;
    this.selectedDeci = deci;
    this.isVisibleDeci = true;
  }

  closePopupDecisionAcc() {
    this.isVisibleDeci = false;
  }

  showInsertViolation() {
    this.violantionModelForEdit = null;
    this.isVisibleViolantion = true;
  }

  showInsertPreventMeasures() {
    this.reventiveMeasures = null;
    this.isVisiblePreventMeasures = true;
  }

  closePopupPreventMeasures(): void {
    this.isVisiblePreventMeasures = false;
  }

  submitPreventMeasures(data): void {
    if (data.index === undefined) {
      this.lstData.push(data);
    } else {
      this.lstData[data.index].measuresId = data.measuresId;
      this.lstData[data.index].measuresDate = data.measuresDate;
      this.lstData[data.index].reason = data.reason;
    }
  }

  openDetailPreventMeasures(data: any, i: number) {
    this.index = i;
    this.reventiveMeasures = data;
    this.isVisiblePreventMeasures = true;
  }

  confirmPreventMeasures(data, i): void {
    const index = this.lstData.indexOf(data);
    if (index > -1) {
      this.lstData.splice(index, 1);
      this.lstData = [...this.lstData]
    }
    // this.deleteBackEndViolantion(data);
  }

  openDetailDialog(data: ViolantionModel, i: number) {
    this.index = i;
    this.violantionModelForEdit = data;
    this.isVisibleViolantion = true;
  }

  onValueBeginIndate(event: any) {
    this.data.begin_indate = this.datechangeService.onDateValueChange(event);
  }

  onValueBirthday(event: any) {
    this.data.birthday = this.datechangeService.onDateValueChange(event);
  }

  onValueDeadDay(event: any) {
    this.sppAccadditioninfo.deadDay = this.datechangeService.onDateValueChange(event);
  }

  onValueDayOfHiding(event: any) {
    this.sppAccadditioninfo.dayOfHiding = this.datechangeService.onDateValueChange(event);
  }

  onValueRecaptureDate(event: any) {
    this.sppAccadditioninfo.recaptureDate = this.datechangeService.onDateValueChange(event);
  }

  onValueMoveOutdate(event: any) {
    this.sppAccadditioninfo.moveOutdate = this.datechangeService.onDateValueChange(event);
  }

  onValueMoveInDate(event: any) {
    this.sppAccadditioninfo.moveInDate = this.datechangeService.onDateValueChange(event);
  }

  validateOnlyNumbers(event: KeyboardEvent): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    return !(charCode > 31 && (charCode < 48 || charCode > 57));
  }

  submitAccu(data): void {
    if (this.register) {
      data.userforname = this.generalService.toUserForName(this.userfor);
      data.usefor = this.userfor;
      data.regicode = this.register.regicode;
      data.sppid = this.sppId;
      data.casecode = this.sppCase.CASECODE;

      const savedItem = {
        accused: {
          ...data,
          fullname: this.stringService.capitalize(data.fullname),
          othername: this.stringService.capitalize(data.othername)
        },
        action: 'I',
        address: data.address,
        army: data.army,
        border: data.border,
        casecode: this.sppCase.CASECODE,
        country: data.country,
        customs: data.customs,
        lawcode: data.lawcode,
        locaid: data.locaid,
        phapnhan: data.phapnhan,
        police: data.police,
        ranger: data.ranger,
        regicode: data.regicode,
        spc: data.spc,
        spp: data.spp,
        sppid: this.sppId,
        fullname: this.stringService.capitalize(data.fullname),
        othername: this.stringService.capitalize(data.othername)
      };
      const _localid = savedItem.locaid.LOCAID ? ('' + savedItem.locaid.LOCAID) : null;
      const _addressid = savedItem.address.LOCAID ? ('' + savedItem.address.LOCAID) : null;
      const name = this.stringService.capitalize(data.fullname);
      const name2 = this.stringService.capitalize(data.othername);
      delete (savedItem.accused.lawcode);
      savedItem.accused.locaid = _localid;
      savedItem.accused.address = _addressid;
      savedItem.accused.fullname = name;
      savedItem.accused.othername = name2;
      let actionText = 'Thêm mới';
      if (data.isEdit) {
        savedItem.action = 'U';
        actionText = 'Cập nhật';
      } else {
        savedItem.action = 'I';
      }
      this.generalService.saveSppAccused(savedItem).subscribe(res => {
        if (res) {
          //Lưu thêm quyết định bị can lấy ở tạm giam tạm giữ
          this.deci.forEach(async obj => {
            const savedItem = {
              decision: {...obj, accucode: res},
              action: 'I',
              sppid: WebUtilities.getLoggedSppId()
            };
            await this.saveDeciAcc(savedItem);
          })
          const msg = this.generalService.readPropertiesJava(res);
          if (msg) {
            this.notificationService.showNotification(Constant.ERROR, msg);
            this.loadPage.emit(true);
          } else {
            this.notificationService.showNotification(Constant.SUCCESS, actionText + ' ' + (data.phapnhan === 'P' ? 'pháp nhân' : 'bị can / bị cáo') + ' thành công');
            this.getAccu();
            this.loadPage.emit(true);
          }
        } else {
          this.notificationService.showNotification(Constant.SUCCESS, actionText + ' ' + (data.phapnhan === 'P' ? 'pháp nhân' : 'bị can / bị cáo') + ' thành công');
          this.getAccu();
          this.loadPage.emit(true);
        }
      }, error => {
        this.loading = false;
        if (error.error && error.error.text) {
          this.notificationService.showNotification(Constant.ERROR, error.error.text);
        } else {
          this.notificationService.showNotification(Constant.ERROR, 'Lỗi dữ liệu');
        }
      }, () => this.loading = false);
    }
  }

  /*ACCU*/
  getAccu(): void {
    const filter = {
      casecode: this.sppCase.CASECODE,
      sortOrder: 'ASC',
      csppid: this.sppId,
      usefor: this.userfor,
      regicode: this.register ? this.register.regicode : null,
      fullname: this.data.fullname,
      othername: this.data.othername
    };
    this.generalService.getListAccu({
      ...filter,
      fullname: this.stringService.capitalize(filter.fullname),
      othername: this.stringService.capitalize(filter.othername)
    }).subscribe(res => {
      const lstAccu: any[] = res;
      const length = lstAccu.length;
      if (length != 0) {
        this.data = WebUtilities.toLowercaseFields(lstAccu[length - 1]);
        this.data.isEdit = true;
        this.data.firstacc = this.data.firstacc === true ? 'Y' : 'N';
      }
    }, error => {
      this.notificationService.showNotification(Constant.ERROR, error.error.text);
    });
  }

  addOccupation(input: HTMLInputElement): void {
    const value = input.value;
    if (!value) {
      this.notificationService.showNotification(Constant.ERROR, 'Nhập giá trị trước khi nhấn thêm mới');
      return;
    }
    if (this.lstOccupations.some(o => o.name.toLowerCase() === value.toLowerCase())) {
      this.notificationService.showNotification(Constant.WARNING, `Nghề nghiệp ${value} đã tồn tại trong danh sách`);
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      this.categoriesService.insertOccupation({name: value}).subscribe((res) => {
        this.getListOccupation(this.lstOccupations.length);
        this.notificationService.showNotification(Constant.SUCCESS, `Thêm nghề nghiệp ${value} thành công`);
      }, err => {
      })
    }
  }

  getListOccupation(length: number) {
    this.categoriesService.getListOccupation({size: length + 1}).subscribe(res => {
      this.lstOccupations = res.datas;
    });
  }

  onBirthChange($event) {
    if ($event) {
      const birth = new Date($event);
      this.data.byear = birth.getFullYear();
      this.data.bmonth = birth.getMonth() + 1;
      this.data.bday = birth.getDate();
      this.checkBirthDay();
    }
  }

  blurSppName() {
    if (this.data.locaid && !this.data.locaid.LOCAID)
      this.data.locaid = null;
  }

  private async saveDeciAcc(savedItem) {
    return await new Promise<any>(resolve => {
      this.generalService.saveSppDecisionAccus(savedItem).subscribe(() => {
      }, (err) => console.log(err), () => resolve())
    })
  }
}
