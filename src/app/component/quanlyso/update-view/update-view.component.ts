import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {delay} from 'rxjs/operators';
import {CategoriesService} from '../../../service/categories.service';
import {DateChangeService} from '../../../service/date-change.service';
import {GeneralService} from '../../../service/general-service';
import {NotificationService} from '../../../service/notification.service';
import {Constant} from '../../../shared/constants/constant.class';

@Component({
  selector: 'app-update-view',
  templateUrl: './update-view.component.html',
  styleUrls: ['./update-view.component.scss']
})
export class UpdateViewComponent implements OnInit, OnChanges {

  @Input() data: any;
  @Input() isVisible: boolean;
  @Input() isVisibleDis: boolean;
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter();
  @Output() realoadForm: EventEmitter<boolean> = new EventEmitter();

  loading = false;
  isSubmited = false;
  lstSpp = [];
  lstStages = [];
  lstViolates_interim = [];
  lstStandard1_interim = [];
  lstStandard2_interim = [];
  lstViolates = [];
  lstStandard1 = [];
  lstStandard2 = [];
  sppId: any;
  titleName = 'Thêm mới';

  constructor(
    private datechangeService: DateChangeService,
    private generalService: GeneralService,
    private notification: NotificationService,
    private categoriesService: CategoriesService
  ) {
    this.sppId = this.categoriesService.getSppId();
   }

  ngOnInit(): void {
    this.data = {};
    this.loading = false;
    this.isSubmited = false;
    this.getLstReport();
  }

  ngOnChanges() {
    if(this.isVisible) {
      this.data.stage = !this.data.stage ? null : this.data.stage.split(',').map(n => +n);
      this.data.statisticalviolation = !this.data.statisticalviolation ? null : this.data.statisticalviolation.split(',').map(n => +n);
      this.data.tieuchimot = !this.data.tieuchimot ? null : this.data.tieuchimot.split(',').map(n => +n);
      this.data.tieuchihai = !this.data.tieuchihai ? null : this.data.tieuchihai.split(',').map(n => +n);
      this.getLstSpp(this.data.isEdit ? this.data.sppid : this.sppId);
      this.getLstReport();
      this.reloadLstGiaidoan();
      this.titleName = this.data.isEdit ? 'Cập nhật' : 'Thêm mới';
    }
  }

  reloadLstGiaidoan() {
    this.getLstViolation();
    this.getlstStandard1();
    this.getlstStandard2();
  }

  onValueDate($item, $event): void{
    this.data[$item] = this.datechangeService.onDateValueChange($event);
  }

  async getLstSpp(office) {
    this.categoriesService.getListVKS(office).subscribe(res => {
      this.lstSpp = res;
      this.data.sppid = this.lstSpp.find(e => e.sppid === office);
    },() => console.log('lỗi lấy đơn vị'));
  }

  onInputSpp(e: any): void {
    const value = (e.target as HTMLInputElement).value;
    if (!value || value.indexOf('@') >= 0) {
      this.lstSpp = [];
    } else {
      this.categoriesService.getListVKS(value).subscribe(res => {
        this.lstSpp = res;
      });
    }
  }

  async getLstReport() {
    this.setLstReport(1);
    this.setLstReport(2);
    this.setLstReport(3);
    this.setLstReport(4);
  }

  async setLstReport(level) {
    this.generalService.getListReport({status: 1, pageIndex: 0, pageSize: 1000, level: level}).toPromise().then(
      resp => {
        if (resp.responseCode !== '0000') {
          resp.responseData.content = [];
        }
        if (level === 1) {
          this.lstStages = resp.responseData.content;
        } else if(level === 2) {
          this.lstViolates_interim = resp.responseData.content;
        } else if(level === 3) {
          this.lstStandard1_interim = resp.responseData.content;
        } else {
          this.lstStandard2_interim = resp.responseData.content;
        }
      }, err => {this.notification.showNotification(Constant.ERROR, err.responseMessage)});
  }



  validateOnlyNumbers(event: KeyboardEvent): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    return !(charCode > 31 && (charCode < 48 || charCode > 57));
  }

  handleCancel(): void{
    this.isVisible = false;
    this.isVisibleDis = false;
    this.closeModal.emit(false);
  }

  handleOk(): void {
    let valid = true;
    this.loading = true;
    this.isSubmited = true;
    if (!this.data.createdat) {
      this.notification.showNotification(Constant.ERROR, 'Bạn phải nhập giá trị cho trường Ngày cập nhật')
      valid = false;
    }
    if (!this.data.period) {
      this.notification.showNotification(Constant.ERROR, 'Bạn phải nhập giá trị cho trường Kỳ báo báo')
      valid = false;
    }
    if (!this.data.sppid) {
      this.notification.showNotification(Constant.ERROR, 'Bạn phải chọn giá trị cho trường Đơn vị')
      valid = false;
    }
    if (!this.data.stage || this.data.stage.length === 0) {
      this.notification.showNotification(Constant.ERROR, 'Bạn phải chọn giá trị cho trường Giai đoạn')
      valid = false;
    }
    if (!this.data.statisticalviolation || this.data.statisticalviolation.length === 0) {
      this.notification.showNotification(Constant.ERROR, 'Bạn phải chọn giá trị cho trường Ngày cập nhật')
      valid = false;
    }
    if (valid) {
      this.onSubmitForm(this.data);
    }else{
      this.loading = false;
    }
  }

  onSubmitForm(data): void {
    const payload = {
      ...data,
      sppid: data.sppid?.sppid,
      stage: data.stage?.toString(),
      statisticalviolation: data.statisticalviolation?.toString(),
      tieuchimot: data.tieuchimot?.toString(),
      tieuchihai: data.tieuchihai?.toString(),
    }
    payload.option = 'I';
    let msg = 'Thêm mới';

    if (data.isEdit) {
      payload.option = 'U';
      msg = 'Cập nhật';
    }

    this.generalService.insertUpdInfoReport(payload).pipe(delay(500))
    .toPromise().then(() => {
      this.notification.showNotification(Constant.SUCCESS, `${msg} dữ liệu thành công`)
      this.isSubmited = false;
      this.loading = false;
      this.realoadForm.emit(false);
      this.closeModal.emit(false);
    }, () => {
      this.notification.showNotification(Constant.ERROR, 'lỗi dữ liệu')
    })
  }

  handleReset(){
    this.isSubmited = false;
    this.data.period = null;
    this.data.sppid = null;
    this.data.stage = null;
    this.data.statisticalviolation = null;
    this.data.tieuchimot = null;
    this.data.tieuchihai = null;
  }

  async getLstViolation() {
    this.lstViolates = [];
    if(this.data.stage && this.data.stage.length > 0){
      this.data.stage.forEach(e => {
        this.lstViolates = [...this.lstViolates,...this.lstViolates_interim.filter(n => n.parent == e)];
      },[])
    } else {
      this.data.statisticalviolation = null;
      this.data.tieuchimot = null;
      this.data.tieuchihai = null;
    }
  }

  async getlstStandard1() {
    this.lstStandard1 = [];
    if(this.data.statisticalviolation && this.data.statisticalviolation.length > 0){
      this.data.statisticalviolation.forEach(e => {
        this.lstStandard1 = [...this.lstStandard1,...this.lstStandard1_interim.filter(n => n.parent == e)];
      },[])
    } else {
      this.data.tieuchimot = null;
      this.data.tieuchihai = null;
    }
  }

  async getlstStandard2() {
    this.lstStandard2 = [];
    if(this.data.tieuchimot && this.data.tieuchimot.length > 0){
      this.data.tieuchimot.forEach(e => {
        this.lstStandard2 = [...this.lstStandard2,...this.lstStandard2_interim.filter(n => n.parent == e)];
      },[])
    } else {
      this.data.tieuchihai = null;
    }
  }
}
