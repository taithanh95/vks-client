import {Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild} from '@angular/core';
import {CategoriesService} from '../../../../../service/categories.service';
import {GeneralService} from '../../../../../service/general-service';
import {NotificationService} from '../../../../../service/notification.service';
import {AppConfigService} from '../../../../../../app-config.service';
import {SppRegister} from '../../../../../model/spp-register';
import {TitleCasePipe} from '@angular/common';
import {Constant} from '../../../../../shared/constants/constant.class';
import {WebUtilities} from '../../../../../shared/utils/qla-utils.class';
import {DateChangeService} from 'src/app/service/date-change.service';
import {StringService} from '../../../../../common/util/string.service';

@Component({
  selector: 'app-d-sppspcpol',
  templateUrl: './d-sppspcpol.component.html',
  styleUrls: ['./d-sppspcpol.component.scss']
})
export class DSppspcpolComponent implements OnInit, OnChanges {
  @Input() userfor: any;
  @Input() isVisible: boolean;
  @Input() data: any;
  @Input() selectedCen: any;
  @Output() closeModal: EventEmitter<any> = new EventEmitter();
  @Output() submitForm: EventEmitter<any> = new EventEmitter();
  @Input() sppCase: any;
  @Input() register: any;
  checkths: boolean;
  lstDeciTypes: any[];
  lstDecis: any[];
  lstReasons: any[];
  lstPols: any[];

  /*OPTIONS*/
  lstPolices: any[];
  lstArmies: any[];
  lstCustoms: any[];
  lstRangers: any[];
  lstBorderGuards: any[];

  lstSpps: any[];
  lstSpcs: any[];
  sppId: any;
  loading: boolean;

  checkOptionsOne = [
    { label: 'A', value: 'B', checked: true },
    { label: 'A', value: 'B', checked: false },
  ];
  isSubmited: boolean;
  selectedSpp: any;

  @ViewChild('autofocus') searchElement: ElementRef;
  constructor(
    private categoriesService: CategoriesService,
    private generalService: GeneralService,
    private notificationService: NotificationService,
    private configService: AppConfigService,
    private titlecasePipe: TitleCasePipe,
    private datechangeSerivce: DateChangeService,
    private stringService: StringService
  ) {
    this.sppId = this.categoriesService.getSppId();
    if (!this.data) {
      // alert('vao day');
      this.data = new SppRegister();
    }
  }

  ngOnInit(): void {
    this.checkths = false;
    this.isSubmited = false;
    this.selectedSpp = WebUtilities.getLoggedSpp();

  }

  ngOnChanges(): void {
    if (this.isVisible){
      this.loading = false;
      if (this.searchElement && this.searchElement.nativeElement){
        setTimeout(()=>{ // this will make the execution after the above boolean has changed
          this.searchElement.nativeElement.focus();
        },100);
      }
      this.checkOptionsOne = [
        { label: this.userfor === 'G1' ? `Giao nhận hồ sơ để truy tố` : `Giao nhận hồ sơ để xét xử`, value: 'Y', checked: true },
        { label: 'Giao nhận cập nhật trả hồ sơ điều tra bổ sung', value: 'T', checked: false },
      ];
      if (this.data && this.data.sppid){
        this.categoriesService.getListVKS(this.data.sppid).subscribe(res => {
          this.lstSpps = res;
          this.data.atxSpp = res[0];
        });
      }
      if (this.data && this.data.spcid){
        this.categoriesService.getListToaAn(this.data.spcid).subscribe(res => {
          this.lstSpcs = res;
          this.data.atxSpc = res[0];
        });
      }
      if (this.data && this.data.polid) {
        this.bindAutoComplete(this.data.policeid);
      }
      this.getListCategories();
    }
  }

  bindAutoComplete(policeid){
    if (this.data && this.data.polid) {
      switch (this.data.polid) {
        case '02':
          this.categoriesService.getListPolice(policeid).subscribe(res => {
            this.lstPolices = res;
            this.data.atxPol = res[0];
          });
          break;
        case '04':
          this.categoriesService.getListArmy(policeid).subscribe(res => {
            this.lstArmies = res;
            this.data.atxArmy = res[0];
          });
          break;
        case '06':
          this.categoriesService.getListCustoms(policeid).subscribe(res => {
            this.lstCustoms = res;
            this.data.atxCustoms = res[0];
          });
          break;
        case '08':
          this.categoriesService.getListRangers(policeid).subscribe(res => {
            this.lstRangers = res;
            this.data.atxRanger = res[0];
          });
          break;
        case '09':
          this.categoriesService.getListBorderGuards(policeid).subscribe(res => {
            this.lstBorderGuards = res;
            this.data.atxBorderGuards = res[0];
          });
          break;
      }
    }
  }
  getListCategories() {
    this.categoriesService.getListDecitypeUseFor({applyfor: 'C', usefor: this.userfor}).subscribe(res => {
      this.lstDeciTypes = res;
    });
    this.getListDecision('');
    this.getListPol();
  }
  getListDecision(deciType: any){
    this.categoriesService.getListDecision_ForHS({applyfor : 'C', decitype : deciType, usefor : this.userfor }).subscribe(res => {
      this.lstDecis = res;
    });
  }
  getListPol() {
    this.categoriesService.getListPol({size: 100}).subscribe(res => {
      this.lstPols = res.datas;
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
    if (!this.data.transdate)
    {
      const fName = 'Ngày giao nhận'
      this.notificationService.showNotification(Constant.ERROR, `Bạn phải nhập giá trị cho trường ${fName}`);
      valid = false;
    }else if (this.data.changeid === '01'  || this.data.changeid === '04'){
      const indate = new Date(this.selectedCen.INDATE);
      const transdate = new Date(this.data.transdate);
      const dayCount = WebUtilities.calculateDiff(transdate, indate);
      if(this.userfor == 'G1' && dayCount > 2)
        this.notificationService.showNotification(Constant.WARNING, 'Trong luật TTHS quy định trong thời gian 02 ngày kể từ ngày ra KLĐT, CQĐT phải gửi bản KLĐT đề nghị truy tố cho VKS');
      else if(this.userfor == 'G2' && dayCount > 3)
        this.notificationService.showNotification(Constant.WARNING, 'Trong trường thời hạn 3 ngày, kể từ ngày ra quyết định truy tố bằng bản cáo trạng, Viện kiểm sát phải gửi hồ sơ và bản cáo trạng đến Toà án');
    }
   /* if (!this.data.transdate)
    {
      const fName = 'Ngày giao nhận'
      this.notificationService.showNotification(Constant.ERROR, `Bạn phải nhập giá trị cho trường ${fName}`);
      valid = false;
    }*/
    if (valid) {
      this.isVisible = false;
      this.closeModal.emit(false);
      this.submitForm.emit({
        ...this.data,
        sender: this.stringService.capitalize(this.data.sender),
        receipter: this.stringService.capitalize(this.data.receipter)
      });
    }else{
      this.loading = false;
    }
  }

  setTimeChange() {

  }

  deciChange($event: any) {
  }

  deciTypeChange($event: any) {
    this.getListDecision(this.data.decitypeid);
  }

  changeidListener() {

  }


  updateSingleChecked(): void {
    const itemChecked = this.checkOptionsOne.find(en => en.checked && en.value === 'T');
    this.checkths = itemChecked !== undefined;
  }
  showAutoPol(item){
    switch (item.polid) {
      case '02':
      case '04':
      case '06':
      case '08':
      case '09':
        return true;
      default:
        return false;
    }
  }
  polChangeEvent() {
    this.data.atxPol = null;
    this.data.atxArmy = null;
    this.data.atxBorderGuards = null;
    this.data.atxCustoms = null;
    this.data.atxRanger = null;
    // alert(this.data.changeid);
    this.bindAutoComplete('0');
  }
  titleCase(val) {
  }
  handleReset(): void {
    this.data = {};
    this.data.action = 'I';
    this.data.status = 'Y';
    this.data.isEdit = false;
    this.data.sppid = this.selectedSpp.sppid;
    this.data.polid = '02';
    this.data.policeid = this.selectedSpp.polid;

    if (this.userfor === 'G2') {
      this.data.changeid = '01';
      this.data.polid = 'SPP';
      this.data.spcid = this.selectedSpp.spcid;
    }
    else if (this.userfor === 'G1') {
      this.data.changeid = '04';
    }
    if (this.data && this.data.sppid){
      this.categoriesService.getListVKS(this.data.sppid).subscribe(res => {
        this.lstSpps = res;
        this.data.atxSpp = res[0];
      });
    }
    if (this.data && this.data.spcid){
      this.categoriesService.getListToaAn(this.data.spcid).subscribe(res => {
        this.lstSpcs = res;
        this.data.atxSpc = res[0];
      });
    }
    if (this.data && this.data.polid) {
      this.bindAutoComplete(this.data.policeid);
    }
    this.getListCategories();
  }

  transdateChange($event: any) {
    const curDate = new Date();
    const transDate = new Date($event);
    const dicisionDate = new Date(this.register.finishdate);
    const dayCount = WebUtilities.calculateDiff(transDate, dicisionDate);
    const nowCount = WebUtilities.calculateDiff(transDate, curDate);
    if (dayCount < 0 && this.userfor == 'G1') {
      this.data.todate = null;
      setTimeout(()=> {
        this.data.transdate = null;
      }, 100);
      this.notificationService.showNotification(Constant.ERROR, 'Ngày giao nhận phải sau Ngày cơ quan kết luận điều tra');
    }
    else if (nowCount > 0){
      this.data.todate = null;
      setTimeout(()=> {
        this.data.transdate = null;
      }, 100);
      this.notificationService.showNotification(Constant.ERROR, 'Ngày giao nhận phải bé hơn hoặc bằng Ngày hiện tại');
    } else if (dayCount < 0 && this.userfor == 'G2') {
      this.data.todate = null;
      setTimeout(()=> {
        this.data.transdate = null;
      }, 100);
      this.notificationService.showNotification(Constant.ERROR, 'Ngày giao nhận phải sau Ngày viện kiểm sát ra cáo trạng');
    }
  }

  onValueTransdate(event: any){
    this.data.transdate = this.datechangeSerivce.onDateValueChange(event);
  }

	validateOnlyNumbers(event: KeyboardEvent): boolean {
    let charCode = (event.which) ? event.which : event.keyCode;
    return !(charCode > 31 && (charCode < 48 || charCode > 57));
  }
}

