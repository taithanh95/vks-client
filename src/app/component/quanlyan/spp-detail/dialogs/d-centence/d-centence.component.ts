import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CategoriesService} from '../../../../../service/categories.service';
import {DateChangeService} from '../../../../../service/date-change.service';
import {GeneralService} from '../../../../../service/general-service';
import {NotificationService} from '../../../../../service/notification.service';
import {Constant} from '../../../../../shared/constants/constant.class';
import {WebUtilities} from '../../../../../shared/utils/qla-utils.class';

@Component({
  selector: 'app-d-centence',
  templateUrl: './d-centence.component.html',
  styleUrls: ['./d-centence.component.scss']
})
export class DCentenceComponent implements OnInit {

  @Input() isVisible: boolean;
  @Input() isVisibleDisable: boolean;
  @Input() data: any;
  @Input() sppCase: any;
  @Input() userfor: any;
  @Input() loading: boolean;
  @Input() register: any;
  @Input() lstAccu: any;
  @Output() submitForm: EventEmitter<any> = new EventEmitter();
  @Output() closeModal: EventEmitter<any> = new EventEmitter();
  pageSize: any;

  isCollapse = true;
  selectedSpp: any;
  isSubmited: boolean;
  userInfo: any;
  isVisibleConclu: boolean; // Quan Điểm/Kết luận
  isVisibleCenLaw: boolean;
  isVisibleCentenLaw: boolean;
  isVisibleDisableCenLaw: boolean;
  accuCode: any;
  titleName: any;
  signname: any;
  /*OPTIONS*/
  lstSpcs: any[]; // Tòa án
  lstSinger: any[];
  lstCentence: any[]
  lstConclu: any[] // Kết Luận / Quan điểm

  lstInpectors: any[]
  inspectorOpions: any[]


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
  }

  ngOnChanges(): void {
    this.titleScreen();
    this.handleReset();
  }

  handleReset(){
    this.isSubmited = false;
    if (this.isVisible){
      this.loading = false;
      // this.signname = this.data.signname;
      if (this.data && this.data.isEdit){
        // this.getListAccuByCent();
        this.getLstSpcs(this.data.spcid);
      }
      if(this.data && !this.data.isEdit){
        this.data.signoffice = 'Thẩm phán';
        this.getLstSpcs(this.userInfo.sppid);
      }
      if(this.data && (this.userfor === 'G4' || this.userfor === 'G5')){
        this.getLstConclu(this.userfor);
      }
    }
  }

  handleOk(): void {
    this.loading = true;
    this.isSubmited = true;
    this.data.spcid = this.data.atxSpc?.SPCID;
    let valid = true;
    if (!this.data.indate)
    {
      this.notificationService.showNotification(Constant.ERROR, 'Bạn phải nhập giá trị cho trường Ngày ra bản án');
      valid = false;
    }
    if (!this.data.spcid)
    {
      this.notificationService.showNotification(Constant.ERROR, 'Bạn phải nhập giá trị cho trường Tòa án ra bản án');
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
    if (this.userfor !== 'G3' && !this.data.concid)
    {
      this.notificationService.showNotification(Constant.ERROR, 'Bạn phải nhập giá trị cho trường Bản án phúc phẩm');
      valid = false;
    }
    if (!this.data.trialdate)
    {
      this.notificationService.showNotification(Constant.ERROR, 'Bạn phải nhập giá trị cho trường Ngày xét xử');
      valid = false;
    }

    if (valid) {
      this.submitCentence(this.data)
    }else {
      this.loading = false;
    }
  }

  getLstSpcs(begin_officeid: any) {
    this.categoriesService.getFromSpp(begin_officeid).subscribe(res => {
      this.lstSpcs = res;
      this.data.atxSpc = this.lstSpcs[0];
    });
  }

  getLstConclu(userfor) {
    if (userfor === 'G4') {
      this.data.concid = '03';
    } else {
      this.data.concid = '51';
    }

    this.categoriesService.getListConclution(userfor).subscribe(res => {
      this.lstConclu = res;
    })
  }

  handleCancel(){
    this.closeModal.emit(this.data?.isEdit);
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

  // onSingerInput(e: any): void {
  //   const value = (e.target as HTMLInputElement).value;
  //   this.data.signname  = value;
  //   if (!value || value.indexOf('@') >= 0) {
  //     this.lstSinger = [];
  //   } else {
  //     var filter = { sppid: this.selectedSpp.sppid, query: value, polid: this.sppCase.BEGIN_OFFICE, officeid: this.sppCase.BEGIN_OFFICEID, limit: 10 };
  //     this.categoriesService.getListSignerAutocomplete(filter).subscribe(res => {
  //       this.lstSinger = res;
  //     });
  //   }
  // }

  // signerAutoChange(option: any) {
  //   if (option) this.data.signoffice = option.nzValue , this.data.signname = option.nzLabel;
  // }

  indateChange($event: any) {
    const indate = new Date($event);
    const actdate = new Date();
    if (actdate && $event) {
      const dayCount = WebUtilities.calculateDiff(indate, actdate);
      if (dayCount > 0) {
        this.notificationService.showNotification(Constant.ERROR, 'Ngày quyết định phải nhỏ hơn hoặc bằng ngày hiện tại');
        setTimeout(() => {
          this.data.indate = null;
        }, 100);
        return;
      } else {
        this.data.actdate = new Date (indate.setMonth(indate.getMonth() + 1));
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

  // getListAccuByCent(): void {
  //   this.generalService.getListAccuByCentCode(this.data.centcode).subscribe(res => {
  //     if (res) {
  //       this.lstAccu = res;
  //     } else {
  //       this.lstAccu = [];
  //     }
  //   }, error => {
  //     this.notificationService.showNotification(Constant.ERROR, 'Lỗi: ' + error.error.text);
  //   });
  // }

  onValueDate(event,item){
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
          this.getListCentence();
          this.submitForm.emit(this.data);
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

  getListCentence(): void {
    this.lstCentence = [];
    const filter = {
      casecode: this.sppCase.CASECODE,
      sortOrder: 'ASC',
      sppid: this.userInfo.sppid,
      userfor: this.userfor,
      regicode: this.register.regicode
    };
    this.generalService.getListCentence(filter).subscribe(res => {
      if (res) {
        this.lstCentence = res;
        const cent = this.data?.isEdit ? this.lstCentence.find(e => e.CENTCODE == this.data.centcode)
                                      : this.lstCentence.find(e => e.STATUS == 'Y');
        this.data = WebUtilities.toLowercaseFields(cent);
        this.data.movement = this.data.movement === true ? "Y" : "N";
        this.data.status = this.data.status === true ? "Y" : "N";
        this.data.isEdit = true;
      } else {
        this.data = {};
      }
      this.handleReset();
    }, error => {
      this.notificationService.showNotification(Constant.ERROR, error.error.text);
    });
  }

  openPopup(i){
    this.accuCode = this.lstAccu[i].ACCUCODE;
    this.isVisibleCenLaw = true;
    this.isVisibleDisableCenLaw = this.isVisibleDisable ? true : false;
  }

  openConclusions(i){
    this.accuCode = this.lstAccu[i].ACCUCODE;
    this.isVisibleConclu = true;
  }

  openCentenlaw=()=>this.isVisibleCentenLaw = true;
  closeCentenlaw=($event)=>this.isVisibleCentenLaw = false;

  closePopupCenlaw(){
    this.isVisibleCenLaw = false;
    this.isVisibleDisableCenLaw = false;
  }

  closePopupConclu() {
    this.isVisibleConclu = false;
  }

  titleScreen(){
    if (this.userfor === 'G5')
      this.titleName = this.isVisibleDisable ? 'Xem chi tiết quyết định Giám đốc thẩm/Tái thẩm' : 'Cập nhật quyết định Giám đốc thẩm/Tái thẩm';
    else
      this.titleName =this.isVisibleDisable ? 'Xem chi tiết bản án' : 'Cập nhật bản án';
  }

  onInputInspector(e: any): void {
    let value = (e.target as HTMLInputElement).value;
    if (value === ' ') value = '0';
    if (!value || value.indexOf('@') >= 0) {
      this.lstInpectors = [];
    } else {
      this.categoriesService.getLstInspectorByQuery(value, 'ALL', this.userInfo.sppid).subscribe(res => {
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
