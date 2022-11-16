import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {CategoriesService} from '../../../../../service/categories.service';
import {NotificationService} from '../../../../../service/notification.service';
import {GeneralService} from '../../../../../service/general-service';
import {DateChangeService} from '../../../../../service/date-change.service';
import {Constant} from '../../../../../shared/constants/constant.class';
import {WebUtilities} from '../../../../../shared/utils/qla-utils.class';
import {StringService} from '../../../../../common/util/string.service';

@Component({
  selector: 'app-d-appeal',
  templateUrl: './d-appeal.component.html',
  styleUrls: ['./d-appeal.component.scss']
})
export class DAppealComponent implements OnInit, OnChanges {

  @Input() isVisible: boolean;
  @Input() data: any;
  @Input() sppCase: any;
  @Input() userfor: any;
  @Input() loading: boolean;
  @Input() register: any;
  @Input() lstCentence: any[];
  @Input() lstDecisionCase: any[];
  @Input() lstAccu: any[];

  @Output() submitForm: EventEmitter<any> = new EventEmitter();
  @Output() closeModal: EventEmitter<any> = new EventEmitter();
  pageSize: any;

  isCollapse = true;
  selectedSpp: any;
  isSubmited: boolean;
  userInfo: any;
  isVisibleCenLaw: boolean;
  accuCode: any;
  /*OPTIONS*/
  lstSpcs: any[]; // Tòa án
  lstSinger: any[];
  lstAppeals: any[];

  constructor(
    private categoriesService: CategoriesService,
    private notificationService: NotificationService,
    private generalService: GeneralService,
    private datechangeService: DateChangeService,
    private stringService: StringService
  ) {
    this.userInfo = JSON.parse(localStorage.getItem(Constant.USER_INFO));
    this.userInfo.sppid = WebUtilities.getLoggedSppId();
  }

  ngOnInit(): void {
    this.loading = false;
    this.isSubmited = false;
    this.selectedSpp = WebUtilities.getLoggedSpp();
  }

  ngOnChanges(): void {
    if (this.isVisible){
      this.isSubmited = false;
      this.loading = false;
      if (this.data && this.data.isEdit){
        // todo map arrAppealid
        this.getAppealAcc(this.data.appecode);
      }
      this.getAppealName();
    }
  }

  handleOk(): void {
    this.loading = true;
    this.isSubmited = true;
    let valid = true;
    if (!this.data.setnum)
    {
      this.notificationService.showNotification(Constant.ERROR, 'Bạn phải nhập giá trị cho trường Số bản án/ quyết định');
      valid = false;
    }
    if (!this.data.indate)
    {
      this.notificationService.showNotification(Constant.ERROR, 'Bạn phải nhập giá trị cho trường Ngày kháng cáo');
      valid = false;
    }
    if (!this.data.arrAppealid)
    {
      this.notificationService.showNotification(Constant.ERROR, 'Bạn phải nhập giá trị cho trường Tên loại kháng cáo');
      valid = false;
    }

    if (this.data.acctype === 'P' && !this.data.perapp)
    {
      this.notificationService.showNotification(Constant.ERROR, 'Bạn phải nhập giá trị cho trường Họ và tên người tham gia tố tụng');
      valid = false;
    }

    if (this.data.acctype === 'A' && !this.data.accucode)
    {
      this.notificationService.showNotification(Constant.ERROR, 'Bạn phải nhập giá trị cho trường Tên bị cáo');
      valid = false;
    }
    if (valid) {
      // this.submitCentence(this.data);
      this.submitForm.emit({...this.data, perapp: this.stringService.capitalize(this.data.perapp)});
      this.loading = false;
    }else {
      this.loading = false;
    }
  }

  // tslint:disable-next-line:variable-name
  getLstSpcs(begin_officeid: any) {
    this.categoriesService.getListToaAn(begin_officeid).subscribe(res => {
      this.lstSpcs = res;
    });
  }
  getAppealName(){
    this.categoriesService.getListAppealName(null).subscribe(res => {
      this.lstAppeals = res;
    });
  }
  getAppealAcc(code){
    this.categoriesService.getAppealAcc(code).subscribe(res => {
      this.data.arrAppealid = [];
      res.forEach(en => {
        this.data.arrAppealid.push(en.APPEALID);
      });
    });
  }

  handleCancel(){
    this.closeModal.emit(false);
  }

  toggleCollapse(){
    this.isCollapse = !this.isCollapse;
  }

  f(data, f):any {
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
      const filter = { sppid: this.selectedSpp.sppid, query: value, polid: this.sppCase.BEGIN_OFFICE, officeid: this.sppCase.BEGIN_OFFICEID, limit: 10 };
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
    if (this.data.setdate && $event) {
      const setdate = new Date(this.data.setdate)
      const dayCount = WebUtilities.calculateDiff(indate, setdate);
      if (dayCount < 0) {
        const name = this.data.appeafor === 'C' ? 'bản án' : 'quyết định';
        this.notificationService.showNotification(Constant.ERROR, `Ngày kháng cáo phải lớn hơn hoặc bằng ngày ra ${name}`);
        setTimeout(() => {
          this.data.indate = null;
        }, 100);
        return;
      }
      if (dayCount > 15) {
        const name = this.data.appeafor === 'C' ? 'bản án' : 'quyết định';
        this.notificationService.showNotification(Constant.WARNING, `Ngày kháng cáo hiện lớn hơn 15 ngày Ngày ra ${name}`);
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

  onValueDate(event, item){
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

  openPopup(i){
    this.accuCode = this.lstAccu[i].ACCUCODE;
    this.isVisibleCenLaw = true;
  }

  closePopupCenlaw(){
    this.isVisibleCenLaw = false;
  }

  changeAppeafor($event: any) {
    this.data.setnum = null;
    this.data.setdate = null;
  }

  changeSetnum($event: any) {
    if (this.data.appeafor === 'C'){
      const item = this.lstCentence.find(en => en.SETNUM === $event);
      if (item){
        this.data.setdate = item.INDATE;
      }
    }
    else{
      const item = this.lstDecisionCase.find(en => en.SETNUM === $event);
      if (item){
        this.data.setdate = item.INDATE;
      }
    }
  }
}
