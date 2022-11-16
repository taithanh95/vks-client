import {Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {CategoriesService} from '../../../../../service/categories.service';
import {WebUtilities} from '../../../../../shared/utils/qla-utils.class';
import {GeneralService} from '../../../../../service/general-service';
import {NotificationService} from '../../../../../service/notification.service';
import {Constant} from '../../../../../shared/constants/constant.class';
import {AppConfigService} from '../../../../../../app-config.service';
import {DateChangeService} from 'src/app/service/date-change.service';
import {StringService} from '../../../../../common/util/string.service';

@Component({
  selector: 'app-d-victim',
  templateUrl: './d-victim.component.html',
  styleUrls: ['./d-victim.component.scss']
})
export class DVictimComponent implements OnInit, OnChanges {
  // tslint:disable-next-line:variable-name
  position_type: any;
  @Input() sppCase: any;
  @Input() userfor: any;
  @Input() isVisible: boolean;
  @Input() data: any;
  @Input() register: any;
  @Output() closeModal: EventEmitter<any> = new EventEmitter();
  @Output() submitForm: EventEmitter<any> = new EventEmitter();
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

  /*LAW*/
  @Input() lstLaw: any[];
  lstSavedLaw: any[];
  pageSize: any;
  page: any;
  defaultPage: any;
  loading: boolean;
  isVisibleLaw: boolean;

  isVisibleDeci: boolean;
  /*Accu*/
  lstDeciAccu: any[];

  lstAccu: any[];
  selectedDeci: any;

  /*Violation*/
  lstViolation: any[];
  isVisibleViolation: boolean;
  selectedVio: any;
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
  onInputCountry(e: any): void {
    const value = (e.target as HTMLInputElement).value;
    if (!value || value.indexOf('@') >= 0) {
      this.lstCountry = [];
    } else {
      let payload = {counName: value};
      this.categoriesService.getListCountry(payload).subscribe(res => {
        this.lstCountry = res.datas;
      });
    }
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
    private datechangeService: DateChangeService,
    private stringService: StringService
  ) {
    this.sppId = this.categoriesService.getSppId();
    if (!this.data) {
      // alert('vao day');
      this.data = {};
      this.data.position_type = 'KS';
      this.data.position_ksv = 'TG';
      this.arrCollapse = [true, true, true, true, true];
    }

  }

  ngOnInit(): void {
    this.lstDeciAccu = [];
    this.isSubmited = false;
    this.loading = false;
    this.pageSize = this.configService.getConfig().pageSize;
    this.page = this.configService.getConfig().page;
    this.defaultPage = this.configService.getConfig().defaultPage;
    this.selectedSpp = WebUtilities.getLoggedSpp();
    this.resetViolation();
  }
  resetViolation(){
    this.selectedVio = {VIOLATION_TYPE: 1};
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
  getListCategories(){
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
  }
  ngOnChanges(): void {
    if (!this.data || !this.isVisible) return;
    this.isSubmited = false;
    if (this.data.isEdit){
      this.generalService.getLstLawByAccu(this.data.accucode).subscribe(res => {
        this.lstSavedLaw = res;
      });
      this.getListDeciByAccu();
      this.lstAccu = [this.data];
    }
    else{
      this.lstSavedLaw = this.lstLaw.filter(en => 1 === 1);
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
    let payloadCountry = {};
    if (this.data && this.data.counid){
      payloadCountry = {counId: this.data.counid};
    }
    else{
      payloadCountry = {counId: 'VN'};
    }
    if (this.data) {
      this.categoriesService.getListCountry(payloadCountry).subscribe(res => {
        this.lstCountry = res.datas;
        this.data.country = res.datas[0];
      });
    }

    if (this.data && this.data.locaid) {
      this.categoriesService.getListLocation(this.data.locaid).subscribe(res => {
        this.lstLoca = res;
        this.data.locaid = res[0];
      });
    }
    if (this.data && this.data.address) {
      this.categoriesService.getListLocation(this.data.address).subscribe(res => {
        this.lstAddress = res;
        this.data.address = res[0];
      });
    }
    if (this.data && this.data.begin_officeid) {
      this.bindAutoComplete(this.data.begin_officeid);
    }
    this.getListCategories();
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
    const filter = {applyfor: 'A', casecode: this.data.casecode, sortOrder: 'ASC', usefor: this.userfor, regicode: this.data.regicode};
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
  f(data, f):any {
    return data[f.toUpperCase()];
  }
  handleCancel(): void {
    this.isVisible = false;
    this.closeModal.emit(false);
  }
  handleOk(): void {
    this.isSubmited = true;
    let valid = true;
    /*if (!this.data.begin_setnum)
    {
      this.notificationService.showNotification(Constant.ERROR, 'Bạn phải nhập giá trị cho trường Quyết định số');
      valid = false;
    }
    if (!this.data.begin_indate)
    {
      this.notificationService.showNotification(Constant.ERROR, 'Bạn phải nhập giá trị cho trường Ngày ra quyết định');
      valid = false;
    }*/
    if (!this.data.fullname)
    {
      this.notificationService.showNotification(Constant.ERROR, 'Bạn phải nhập giá trị cho trường Họ và tên');
      valid = false;
    }
    if (!this.data.byear)
    {
      this.notificationService.showNotification(Constant.ERROR, 'Bạn phải nhập giá trị cho trường Năm sinh');
      valid = false;
    }
    else {

    }
    if (!this.data.country)
    {
      this.notificationService.showNotification(Constant.ERROR, 'Bạn phải nhập giá trị cho trường Quốc tịch');
      valid = false;
    }
    if (!this.data.natiid)
    {
      this.notificationService.showNotification(Constant.ERROR, 'Bạn phải nhập giá trị cho trường Dân tộc');
      valid = false;
    }
    if (!this.data.sex)
    {
      this.notificationService.showNotification(Constant.ERROR, 'Bạn phải nhập giá trị cho trường Giới tính');
      valid = false;
    }
    if (!this.data.birthday)
    {
      this.notificationService.showNotification(Constant.ERROR, 'Bạn phải nhập giá trị cho trường Ngày sinh');
      valid = false;
    }
    if (!this.data.levelid)
    {
      this.notificationService.showNotification(Constant.ERROR, 'Bạn phải nhập giá trị cho trường Học vấn');
      valid = false;
    }
    if (!this.data.locaid)
    {
      this.notificationService.showNotification(Constant.ERROR, 'Bạn phải nhập giá trị cho trường Nơi ĐKHKTT');
      valid = false;
    }
    if (valid) {
      this.data.phapnhan = '';
      //set saved law list
      this.data.lawcode = this.lstSavedLaw;
      this.isVisible = false;
      this.closeModal.emit(false);
      this.data.userfor = this.userfor;
      this.submitForm.emit({
        ...this.data,
        fullname: this.stringService.capitalize(this.data.fullname),
        othername: this.stringService.capitalize(this.data.othername)
      });
    }
  }

  checkDisabled() {
    if (this.userfor === 'G3' || this.userfor === 'G4' || this.userfor === 'G5' || this.userfor === 'G6' || this.data.isEdit === true)
      return true;
    else
      return false;
  }
  compareFun1 = (o1: any | string, o2: any) => {
    if (o1) {
      const ret = typeof o1 === 'string' ? o1 === o2.FULLNAME : o1.INSPCODE === o2.INSPCODE;
      return ret;
    } else {
      return false;
    }
  }
  compareFun2 = (o1: any | string, o2: any) => {
    if (o1) {
      return typeof o1 === 'string' ? o1 === o2.FULLNAME : o1.INSPCODE === o2.INSPCODE;
    } else {
      return false;
    }
  }

  birthdayChange() {
    if (this.data){
      if (!this.data.byear) return;
      if (!this.data.bmonth){
        this.data.bmonth = 12;
      }
      if (!this.data.bday){
        this.data.bday = this.getDaysInMonth(this.data.bmonth, this.data.byear);
      }
      let crimDate = this.sppCase.CRIMDATE;
      const birthDay = new Date(this.data.byear, this.data.bmonth - 1, this.data.bday);

      crimDate  = new Date(crimDate);
      this.data.birthday = null;

      // @ts-ignore
      const ageDate = new Date(crimDate - birthDay); // miliseconds from epoch
      const totalYear = Math.abs(ageDate.getUTCFullYear() - 1970);
      if (totalYear < 14 && (this.sppCase.CASETYPE === 'L3' || this.sppCase.CASETYPE === 'L4')){
        const msg = this.generalService.readPropertiesJava('SppAccused.warn.accusedTooYoung');
        this.notificationService.showNotification(Constant.ERROR, msg);
        this.data.birthday = null;
        return;
      }
      /*else if (totalYear < 16){
        const msg = this.generalService.readPropertiesJava('SppAccused.warn.accusedTooYoung');
        this.notificationService.showNotification(Constant.ERROR, msg);
        this.data.birthday = null;
        return;
      }*/
      else if (birthDay.getFullYear() < 1700 && birthDay.getFullYear() > 1000){
        const msg = this.generalService.readPropertiesJava('SppAccused.warn.accusedTooOld');
        this.notificationService.showNotification(Constant.ERROR, msg);
        this.data.birthday = null;
        return;
      }
      this.data.birthday = birthDay;
    }
  }
  getDaysInMonth(month,year) {
    return new Date(year, month, 0).getDate();
  };
  showInsertLaw() {
    this.isVisibleLaw = true;
  }

  showInsertDeciAccuForm() {
    this.isVisibleDeci = true;
    this.selectedDeci = { isEdit: false};
  }
  closePopupLaw(): void {
    this.isVisibleLaw = false;
  }
  submitLaw(data): void {
    //this.lstSavedLaw.push(data);
    //use ... to change grid
    const checkExists = this.lstSavedLaw.find(en => en.LAWID === data.LAWID);
    if (!checkExists) {
      this.lstSavedLaw = [
        ...this.lstSavedLaw,
        data
      ];
    }
    else{
      this.notificationService.showNotification(Constant.ERROR, 'Điều luật đã được thêm trước đó');
    }
  }

  deleteLaw(data: any) {
    this.lstSavedLaw = this.lstSavedLaw.filter(en => en.LAWID !== data.LAWID);
  }
  getListPol() {
    this.categoriesService.getListPol({size: 100}).subscribe(res => {
      this.lstPols = res.datas;
    });
  }
  confirm(data): void {
    this.deleteLaw(data);
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
      }
      else {
        this.getListDeciByAccu();
      }
    });
  }
  handleReset() {
    this.doReset();
  }
  doReset(){
    this.isSubmited = false;
    this.data = {};
    this.data.begin_setnum = '';
    this.data.begin_indate = new Date();
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
    this.bindAutoComplete(this.data.begin_officeid);
    if (this.data && this.data.locaid) {
      this.categoriesService.getListLocation(this.data.locaid).subscribe(res => {
        this.lstLoca = res;
        this.data.locaid = res[0];
      });
    }
    if (this.data && this.data.address) {
      this.categoriesService.getListLocation(this.data.address).subscribe(res => {
        this.lstAddress = res;
        this.data.address = res[0];
      });
    }
  }

  cancel() {
  }

  showEditFormDeci(deci: any) {
    deci = WebUtilities.toLowercaseFieldsWithoutConvertBoolean(deci);
    deci.isEdit = true;
    this.selectedDeci = deci;
    this.isVisibleDeci = true;
  }

  closePopupDecisionAcc() {
    this.isVisibleDeci = false;
  }

  handleCancelViolation() {
    this.isVisibleViolation = false;
  }
  showInsertViolation() {
    this.isVisibleViolation = true;
  }

  handleSubmitViolation() {
    alert('To do');
  }

  onValueBirthday(event: any){
    this.data.birthday = this.datechangeService.onDateValueChange(event);
  }

	validateOnlyNumbers(event: KeyboardEvent): boolean {
    let charCode = (event.which) ? event.which : event.keyCode;
    return !(charCode > 31 && (charCode < 48 || charCode > 57));
  }
}
