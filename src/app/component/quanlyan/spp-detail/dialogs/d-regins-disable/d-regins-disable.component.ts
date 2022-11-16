import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {CategoriesService} from '../../../../../service/categories.service';
import {Constant} from '../../../../../shared/constants/constant.class';
import {NotificationService} from '../../../../../service/notification.service';
import {WebUtilities} from '../../../../../shared/utils/qla-utils.class';
import {DateChangeService} from 'src/app/service/date-change.service';
  
  @Component({
    selector: 'app-d-regins-disable',
    templateUrl: './d-regins-disable.component.html',
    styleUrls: ['./d-regins-disable.component.scss']
  })
  export class DReginsDisableComponent implements OnInit, OnChanges {
    // tslint:disable-next-line:variable-name
    position_type: any;
    @Input() userfor: any;
    @Input() isVisible: boolean;
    @Input() data: any;
    @Output() closeModal: EventEmitter<any> = new EventEmitter();
    @Output() submitForm: EventEmitter<any> = new EventEmitter();
    sppId: any;
    isSubmited: boolean;
    loading: boolean;
    /*DEMO*/
    inputValue?: any;
    inspectorOpions: any[];
    assignInsOptions: any[];
    assignInsValue?: any;
    onInputInspector(e: any): void {
      let value = (e.target as HTMLInputElement).value;
      if (value === ' ') value = '0';
      if (!value || value.indexOf('@') >= 0) {
        this.inspectorOpions = [];
        this.assignInsOptions = [];
      } else {
        this.categoriesService.getLstInspectorByQuery(value, this.data.position_type, this.sppId).subscribe(res => {
          this.inspectorOpions = res;
        });
      }
    }
  
    blurInspector(){
      if(this.data.atxtIns && !this.data.atxtIns.INSPCODE)
        this.data.atxtIns = null;
    }
  
    onInputAssignInspector(e: any): void {
      const value = (e.target as HTMLInputElement).value;
      if (!value || value.indexOf('@') >= 0) {
        this.assignInsOptions = [];
      } else {
        this.categoriesService.getLstInspectorByQueryNPC(value, this.sppId).subscribe(res => {
          this.assignInsOptions = res;
        });
      }
    }
  
    constructor(
      private categoriesService: CategoriesService,
      private notificationService: NotificationService,
      private datechangeService: DateChangeService
    ) {
      this.sppId = WebUtilities.getLoggedSppId();
      if (!this.data) {
        // alert('vao day');
        this.data = {};
        this.data.position_type = 'KS';
        this.data.position_ksv = 'TG';
      }
    }
  
    ngOnInit(): void {
      // this.position_type = 'DT';
      this.isSubmited = false;
    }
    ngOnChanges(): void {
      if (this.isVisible){
        this.loading = false;
      }
      this.inspectorOpions = [];
      this.assignInsOptions = [];
      /*this.data.atxtIns = {};
      this.data.atxtAssignIns = {};*/
      this.isSubmited = false;
      if (this.isVisible) {
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
      }
    }
    changeInspector() {
      this.data.assigndate = null;
      this.data.setnum = null;
      this.data.atxtIns = null;
      this.data.atxtAssignIns = null;
    }
    handleCancel(): void {
      this.isVisible = false;
      this.closeModal.emit(false);
    }
    handleReset(): void{
      this.doReset();
    }
    doReset(){
      this.data = {};
      this.isSubmited = false;
      this.data.isEdit = false;
      this.data.position_type = 'KS';
      this.data.position_ksv = 'PC';
      this.assignInsOptions = [];
      this.inspectorOpions = [];
      this.data.atxtAssignIns = null;
    }
    handleOk(): void {
      this.loading = true;
      this.isSubmited = true;
      let valid = true;
      if (!this.data.assigndate)
      {
        this.notificationService.showNotification(Constant.ERROR, 'Bạn phải nhập giá trị cho trường Ngày phân công');
        valid = false;
      }
      if (!this.data.atxtIns)
      {
        const npc = this.data.position_type === 'KS' ? 'Kiểm sát viên được phân công' : 'Điều tra viên được phân công';
        this.notificationService.showNotification(Constant.ERROR, `Bạn phải nhập giá trị cho trường ${npc}`);
        valid = false;
      }
      else if (!this.data.atxtIns.INSPCODE){
        const npc = this.data.position_type === 'KS' ? 'Kiểm sát viên được phân công' : 'Điều tra viên được phân công';
        this.notificationService.showNotification(Constant.ERROR, `Bạn chưa chọn ${npc} từ danh sách`);
        valid = false;
      }
      if (this.data.assigndate && this.data.finishdate){
        const assigndate = new Date(this.data.assigndate);
        const finishdate = new Date(this.data.finishdate);
        const dayCount = WebUtilities.calculateDiff(finishdate, assigndate);
        if (dayCount < 0) {
          this.data.todate = null;
          this.notificationService.showNotification(Constant.ERROR, 'Ngày kết thúc >= ngày phân công');
          valid = false;
          this.isSubmited = false;
        }
      }
  
      if (valid) {
        this.isVisible = false;
        this.closeModal.emit(false);
        this.data.userfor = this.userfor;
        if (!this.data.atxtAssignIns || !this.data.atxtAssignIns.INSPCODE){
          this.data.atxtAssignIns = null;
        }
        this.submitForm.emit(this.data);
      }else{
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
    }
    compareFun2 = (o1: any | string, o2: any) => {
      if (o1) {
        return typeof o1 === 'string' ? o1 === o2.FULLNAME : o1.INSPCODE === o2.INSPCODE;
      } else {
        return false;
      }
    }
  
    onValueAssigndate(event: any){
      this.data.assigndate = this.datechangeService.onDateValueChange(event);
    }
  
    onValueFinishdate(event: any){
      this.data.finishdate = this.datechangeService.onDateValueChange(event);
    }
  
    validateOnlyNumbers(event: KeyboardEvent): boolean {
      const charCode = (event.which) ? event.which : event.keyCode;
      return !(charCode > 31 && (charCode < 48 || charCode > 57));
    }
  }
  