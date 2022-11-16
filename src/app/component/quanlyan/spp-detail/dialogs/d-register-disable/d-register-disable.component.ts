import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {SppRegister} from '../../../../../model/spp-register';
import {Constant} from '../../../../../shared/constants/constant.class';
import {NotificationService} from '../../../../../service/notification.service';
import {WebUtilities} from '../../../../../shared/utils/qla-utils.class';
import {DateChangeService} from 'src/app/service/date-change.service';
  
  @Component({
    selector: 'app-d-register-disable',
    templateUrl: './d-register-disable.component.html',
    styleUrls: ['./d-register-disable.component.scss']
  })
  export class DRegisterDisableComponent implements OnInit, OnChanges {
    @Input() userfor: any;
    @Input() isVisible: boolean;
    @Input() data: SppRegister;
    @Output() closeModal: EventEmitter<any> = new EventEmitter();
    @Output() submitForm: EventEmitter<any> = new EventEmitter();
    isSubmited: boolean;
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
      if (this.data && this.isVisible) {
        // @ts-ignore
        this.data.unspecial = this.data.unspecial === true ? 'Y' : 'N';
      }
    }
    handleCancel(): void {
      this.isVisible = false;
      this.closeModal.emit(false);
    }
    handleOk(): void {
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
      if (!this.data.todate)
      {
        this.notificationService.showNotification(Constant.ERROR, 'Bạn phải nhập giá trị cho trường Thời hạn thụ lý đến ngày');
        valid = false;
      }
      const todate = new Date(this.data.todate);
      const indate = new Date(this.data.indate);
      const dayCount = WebUtilities.calculateDiff(todate, indate);
      if (dayCount < 0) {
        this.data.todate = null;
        this.notificationService.showNotification(Constant.ERROR, 'Thời hạn thụ lý đến ngày phải lớn hơn hoặc bằng Ngày thụ lý');
        valid = false;
      }
  
      if (valid) {
        if (!this.data.fromdate)
          this.data.fromdate = this.data.indate;
        this.isVisible = false;
        this.closeModal.emit(false);
        this.data.userfor = this.userfor;
        this.submitForm.emit(this.data);
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
  
    validateOnlyNumbers(event: KeyboardEvent): boolean {
      let charCode = (event.which) ? event.which : event.keyCode;
      return !(charCode > 31 && (charCode < 48 || charCode > 57));
    }
  }
  