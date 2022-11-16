import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {CategoriesService} from '../../../../../service/categories.service';
import {GeneralService} from '../../../../../service/general-service';
import {NotificationService} from '../../../../../service/notification.service';
import {AppConfigService} from '../../../../../../app-config.service';
import {SppRegister} from '../../../../../model/spp-register';
import {Constant} from '../../../../../shared/constants/constant.class';
import {WebUtilities} from '../../../../../shared/utils/qla-utils.class';
import {DateChangeService} from '../../../../../service/date-change.service';

@Component({
  selector: 'app-d-centence-g1',
  templateUrl: './d-centence-g1.component.html',
  styleUrls: ['./d-centence-g1.component.scss']
})
export class DCentenceG1Component implements OnInit, OnChanges {
  @Input() loading: boolean;
  @Input() userfor: any;
  @Input() isVisible: boolean;
  @Input() data: any;
  @Input() register: any;
  @Output() closeModal: EventEmitter<any> = new EventEmitter();
  @Output() submitForm: EventEmitter<any> = new EventEmitter();
  @Input() sppCase: any;

  /* CASE STATISTICS*/
  isVisibleCaseStatis: boolean;

  /* DATA DISPLAY CENLAW*/
  isVisibleDisableCenLaw: boolean;
  isVisibleCenLaw: boolean;
  accuCode: any;

  lstDeciTypes: any[];
  lstDecis: any[];
  lstReasons: any[];

  /*OPTIONS*/
  lstPolices: any[];
  lstArmies: any[];
  lstSignOffice: any[];
  sppId: any;
  isSubmited: boolean;
  lstSinger: any[];
  selectedSpp: any;
  lstAccu: any[];

  lstInpectors: any[]
  inspectorOpions: any[]
  constructor(
    private categoriesService: CategoriesService,
    private generalService: GeneralService,
    private notificationService: NotificationService,
    private configService: AppConfigService,
    private datechangeService: DateChangeService
  ) {
    this.sppId = this.categoriesService.getSppId();
    if (!this.data) {
      // alert('vao day');
      this.data = new SppRegister();
    }
  }

  ngOnInit(): void {
    this.loading = false;
    this.isSubmited = false;
    this.selectedSpp = WebUtilities.getLoggedSpp();
  }
  ngOnChanges(): void {
    this.isSubmited = false;
    if (this.isVisible){
      this.loading = false;
      this.getListCategories();
      if (this.data && this.data.isEdit){
        this.getListAccuByCent();
      }
      this.getLstSignOffice();
    }

  }
  getListCategories() {
    /*this.categoriesService.getListDecitypeUseFor({applyfor: 'C', usefor: this.userfor}).subscribe(res => {
      this.lstDeciTypes = res;
    });
    this.getListDecision('');*/
  }
  getListDecision(deciType: any){
    this.categoriesService.getListDecision_ForHS({applyfor : 'C', decitype : deciType, usefor : this.userfor }).subscribe(res => {
      this.lstDecis = res;
    });
  }
  f(data, f):any {
    return data[f.toUpperCase()];
  }
  getListReason(deciId: any){
    this.categoriesService.getListReason({size: 100, deciId: deciId}).subscribe(res => {
      this.lstReasons = res.datas;
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
    if (!this.data.setnum)
    {
      const fName = this.isG1_G2() ? 'Kết luận điều tra số' : 'Bản cáo trạng số';
      this.notificationService.showNotification(Constant.ERROR, `Bạn phải nhập giá trị cho trường ${fName}`);
      valid = false;
    }
    if (!this.data.indate)
    {
      const fName = this.isG1_G2() ? 'Ngày CQ ra KLĐT' : 'Ngày VKS ra cáo trạng';
      this.notificationService.showNotification(Constant.ERROR, `Bạn phải nhập giá trị cho trường ${fName}`);
      valid = false;
    }
    if (!this.data.signname)
    {
      this.notificationService.showNotification(Constant.ERROR, 'Bạn phải nhập giá trị cho trường Người ký');
      valid = false;
    }
    if (!this.data.signoffice)
    {
      this.notificationService.showNotification(Constant.ERROR, 'Bạn phải nhập giá trị cho trường Chức vụ');
      valid = false;
    }
    if (valid) {
      this.isVisible = false;
      this.closeModal.emit(false);
      this.submitForm.emit(this.data);
    }
    else{
      this.loading = false;
    }
  }
  setTimeChange() {

  }

  deciChange($event: any) {
    this.getListReason(this.data.deciid);
  }

  deciTypeChange($event: any) {
    this.getListDecision(this.data.decitypeid);
  }
  isG1_G2(){
    return this.userfor === 'G1' ? true : false;
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
  }

  indateChange($event: any) {
    const indate = new Date($event);
    const actdate = this.data.actdate;
    if (actdate && $event) {
      const dayCount = WebUtilities.calculateDiff(indate, actdate);
      if (dayCount > 0) {
        const fName = this.isG1_G2() ? 'Ngày CQ ra KLĐT' : 'Ngày VKS ra cáo trạng';
        this.notificationService.showNotification(Constant.WARNING, `"Ngày hiệu lực" không được trước "${fName}"`);
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
        const fName = this.isG1_G2() ? 'Ngày CQ ra KLĐT' : 'Ngày VKS ra cáo trạng';
        this.notificationService.showNotification(Constant.WARNING, `"Ngày hiệu lực" không được trước "${fName}"`);
        setTimeout(() => {
          this.data.actdate = null;
        }, 100);
        return;
      }
    }
  }
  getListAccuByCent(): void {
    //this.datas = [];
    // tslint:disable-next-line:max-line-length
    this.generalService.getListAccuByCentCode(this.data.centcode).subscribe(res => {
      if (res) {
        this.lstAccu = res;
      } else {
        this.lstAccu = [];
      }
      // alert(res.length);
    }, error => {
      this.notificationService.showNotification(Constant.ERROR, 'Lỗi: ' + error.error.text);
    });
  }

  onValueIndate(event: any){
    this.data.indate = this.datechangeService.onDateValueChange(event);
  }

  onValueActdate(event: any){
    this.data.actdate = this.datechangeService.onDateValueChange(event);
  }

	validateOnlyNumbers(event: KeyboardEvent): boolean {
    let charCode = (event.which) ? event.which : event.keyCode;
    return !(charCode > 31 && (charCode < 48 || charCode > 57));
  }

  openPopup(i){
    this.accuCode = this.lstAccu[i].ACCUCODE;
    this.isVisibleCenLaw = true;
    this.isVisibleDisableCenLaw = false;
  }

  closePopupCenlaw(){
    this.isVisibleCenLaw = false;
    this.isVisibleDisableCenLaw = false;
  }

  getLstSignOffice() {
    if (this.userfor === 'G1') {
      this.lstSignOffice = [{value : 'Thủ trưởng'},{value : 'Phó Thủ trưởng'}];
    } else {
      this.lstSignOffice = [{value : 'Viện trưởng'},{value : 'Phó Viện trưởng'}];
    }
  }

  showChiTieu() {
    this.isVisibleCaseStatis = true;
  }

  closePopupCaseStatis(){
    this.isVisibleCaseStatis = false;
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
