import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {SppRegister} from '../../../../../model/spp-register';
import {Constant} from '../../../../../shared/constants/constant.class';
import {NotificationService} from '../../../../../service/notification.service';
import {WebUtilities} from '../../../../../shared/utils/qla-utils.class';
import {DateChangeService} from '../../../../../service/date-change.service';

@Component({
  selector: 'app-d-register',
  templateUrl: './d-register.component.html',
  styleUrls: ['./d-register.component.scss']
})
export class DRegisterComponent implements OnInit, OnChanges {
  @Input() userfor: any;
  @Input() isVisible: boolean;
  @Input() data: SppRegister;
  @Output() closeModal: EventEmitter<any> = new EventEmitter();
  @Output() submitForm: EventEmitter<any> = new EventEmitter();
  isSubmited: boolean;
  loading: boolean;
  constructor(
    private notificationService: NotificationService,
    private datechangeService: DateChangeService
  ) {

    if (!this.data) {
      // alert('vao day');
      this.data = new SppRegister();
    }
  }

  ngOnInit(): void {
    this.isSubmited = false;
  }
  ngOnChanges(): void {
    this.isSubmited = false;
    if (this.isVisible){
      this.loading = false;
      if (this.data) {
        // @ts-ignore
        this.data.unspecial = this.data.unspecial === true ? 'Y' : 'N';
        this.data.userforname = this.toUseforName(this.data?.userfor);
      }
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
      this.notificationService.showNotification(Constant.ERROR, 'Bạn phải nhập giá trị cho trường Thụ lý số');
      valid = false;
    }
    if (!this.data.indate)
    {
      this.notificationService.showNotification(Constant.ERROR, 'Bạn phải nhập giá trị cho trường Ngày thụ lý');
      valid = false;
    }
    if (!this.data.fromdate)
    {
      this.notificationService.showNotification(Constant.ERROR, 'Bạn phải nhập giá trị cho trường Thời hạn thụ lý từ ngày');
      valid = false;
    }

    if (!this.data.todate)
    {
      this.notificationService.showNotification(Constant.ERROR, 'Bạn phải nhập giá trị cho trường Thời hạn thụ lý đến ngày');
      valid = false;
    }

    if (valid) {
      this.isVisible = false;
      this.closeModal.emit(false);
      this.data.userfor = this.userfor;
      this.submitForm.emit(this.data);
    }else{
      this.loading = false;
    }
  }

  onValueIndate(event: any){
    this.data.indate = this.datechangeService.onDateValueChange(event);
  }

  onValueSpcindate(event: any){
    this.data.spcindate = this.datechangeService.onDateValueChange(event);
  }

  onValueFromdate(event: any){
    this.data.fromdate = this.datechangeService.onDateValueChange(event);
  }

  onValueTodate(event: any){
    this.data.todate = this.datechangeService.onDateValueChange(event);
  }

  valiDate(){
    if (this.data.indate) {
      const indate = new Date(this.data.indate);
      if (this.data.fromdate) {
        const fromdate = new Date(this.data.fromdate);
        const dayCount = WebUtilities.calculateDiff(fromdate, indate);
        if (dayCount < 0){
          this.data.fromdate = null;
          this.notificationService.showNotification(Constant.ERROR, 'Thời hạn thụ lý từ ngày phải lớn hơn hoặc bằng Ngày thụ lý');
        }
      }
      if (this.data.todate) {
        const todate = new Date(this.data.todate);
        const dayCount = WebUtilities.calculateDiff(todate, indate);
        if (dayCount < 0){
          this.data.todate = null;
          this.notificationService.showNotification(Constant.ERROR, 'Thời hạn thụ lý đến ngày phải lớn hơn hoặc bằng Ngày thụ lý');
        }
      }
   }
  }

	validateOnlyNumbers(event: KeyboardEvent): boolean {
    let charCode = (event.which) ? event.which : event.keyCode;
    return !(charCode > 31 && (charCode < 48 || charCode > 57));
  }

  toUseforName(useFor): any {
    switch (useFor) {
      case 'G1':
        return 'Kiểm sát điều tra';
      case 'G2':
        return 'Kiểm sát GQA - Truy tố';
      case 'G3':
        return 'Kiểm sát XX sơ thẩm';
      case 'G4':
        return 'Kiểm sát XX phúc thẩm';
      case 'G5':
        return 'Kiểm sát XX GĐT, TT';
      case 'G6':
        return 'Kiểm sát XX thi hành án';
      }
    return '';
  }
}
