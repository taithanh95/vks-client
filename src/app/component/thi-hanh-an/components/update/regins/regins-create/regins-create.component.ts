import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NotificationService} from "../../../../../../service/notification.service";
import {DateChangeService} from "../../../../../../service/date-change.service";
import {Constant} from "../../../../../../shared/constants/constant.class";
import {CategoriesService} from '../../../../../../service/categories.service';
import {WebUtilities} from '../../../../../../shared/utils/qla-utils.class';
import {GeneralService} from '../../../../../../service/general-service';

@Component({
  selector: 'app-regins-create',
  templateUrl: './regins-create.component.html',
  styleUrls: ['./regins-create.component.scss']
})
export class ReginsCreateComponent implements OnInit {
  @Input() userfor: any;
  @Input() isVisible: boolean;
  @Input() isVisibleDisable: boolean;
  @Input() data: any;
  @Input() selectedRegister: any;
  @Output() closeModal: EventEmitter<any> = new EventEmitter();
  @Output() reloadRegins: EventEmitter<any> = new EventEmitter();
  sppId: any;
  userInfo: any;
  isSubmited: boolean;
  loading: boolean;
  /*DEMO*/
  inspectorOpions: any[];
  assignInsOptions: any[];

  constructor(
    private categoriesService: CategoriesService,
    private notificationService: NotificationService,
    private datechangeService: DateChangeService,
    private generalService: GeneralService
  ) {
    this.sppId = WebUtilities.getLoggedSppId();
    this.userInfo = JSON.parse(localStorage.getItem(Constant.SPP));
    if (!this.data) {
      this.data = {};
      this.data.position_type = 'KS';
    }
  }

  ngOnInit(): void {
    this.isSubmited = false;
  }
  ngOnChanges(): void {
    if (this.isVisible) {
      this.handleRenderData();
    }
  }

  handleRenderData(): void {
    this.loading = false;
    this.isSubmited = false;
    this.inspectorOpions = [];
    this.assignInsOptions = [];
    if (this.data) {
      if (!this.data.isEdit) {
        this.getLstAssign();
      } else {
        if (this.data.inspcode)
          this.categoriesService.getInspectorByinpcode(this.data.inspcode).subscribe(res => {
            this.inspectorOpions = [res];
            this.data.atxtIns = res;
          }, err => {
            console.log(err.error.text);
          });
        if (this.data.assignins)
          this.categoriesService.getInspectorByinpcode(this.data.assignins).subscribe(res => {
            this.assignInsOptions = [res];
            this.data.atxtAssignIns = res;
          }, err => {
            console.log(err.error.text);
          });
      }
    }
  }

  //lấy mặc định người phân công , Lãnh đạo
  getLstAssign(): void {
    this.categoriesService.getLstInspectorByQueryNPC('', this.sppId).subscribe(res => {
      if (res.length > 0) {
        this.assignInsOptions = res;
        this.data.atxtAssignIns = this.assignInsOptions[0];
      }
    })
  }

  handleCancel(): void {
    this.isVisible = false;
    this.closeModal.emit(false);
  }
  handleReset(): void {
    this.doReset();
  }
  doReset() {
    this.data = {};
    this.isSubmited = false;
    this.data.isEdit = false;
    this.data.position_type = 'KS';
    this.assignInsOptions = [];
    this.inspectorOpions = [];
    this.data.atxtIns = null;
    this.data.atxtAssignIns = null;
    this.getLstAssign();
  }
  handleOk(): void {
    this.loading = true;
    this.isSubmited = true;
    let valid = true;
    if (!this.data.assigndate) {
      this.notificationService.showNotification(Constant.ERROR, 'Bạn phải nhập giá trị cho trường Ngày phân công');
      valid = false;
    }
    if (!this.data.atxtIns) {
      this.notificationService.showNotification(Constant.ERROR, 'Bạn phải nhập giá trị cho trườngKiểm sát viên được phân công');
      valid = false;
    }
    else if (!this.data.atxtIns.INSPCODE) {
      this.notificationService.showNotification(Constant.ERROR, 'Bạn chưa chọn Kiểm sát viên được phân công từ danh sách');
      valid = false;
    }
    if (valid) {
      if (!this.data.atxtAssignIns || !this.data.atxtAssignIns.INSPCODE) {
        this.data.atxtAssignIns = null;
      }
      this.submitRegins(this.data);
    } else {
      this.loading = false;
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

  onValueAssigndate(event: any, item: string) {
    this.data[item] = this.datechangeService.onDateValueChange(event);
  }

  validateOnlyNumbers(event: KeyboardEvent): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    return !(charCode > 31 && (charCode < 48 || charCode > 57));
  }

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

  blurInspector() {
    if (this.data.atxtIns && !this.data.atxtIns.INSPCODE)
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

  submitRegins(data): void {
    if (this.selectedRegister) {
      data.userforname = this.generalService.toUserForName(this.userfor);
      data.usefor = this.userfor;
      data.regicode = this.selectedRegister.regicode;
      data.atxtinscode = data.atxtIns ? data.atxtIns.INSPCODE : null;
      data.atxassigninscode = data.atxtAssignIns ? data.atxtAssignIns.INSPCODE : null;
      const savedItem = {...data, sppname: this.userInfo.NAME, action: data.isEdit ? 'U' : 'I' };
      this.generalService.insertUpdatePropoAssignG6(savedItem).subscribe(res => {
        this.loading = false;
        if (data.isEdit) {
          this.notificationService.showNotification(Constant.SUCCESS, 'Cập nhật kiểm sát viên thành công');
          this.reloadRegins.emit(false);
          this.closeModal.emit(false);
          this.isVisible = false;
        } else {
          if (res === 'error_exist_record') {
            this.notificationService.showNotification(Constant.ERROR, 'Kiểm sát viên này đã được phân công, hãy chọn Kiểm sát viên khác');
          } else {
            this.notificationService.showNotification(Constant.SUCCESS, 'Thêm mới kiểm sát viên thành công');
            this.reloadRegins.emit(false);
            this.data.isEdit = true;
          }
        }
      }, error => {
        this.loading = false;
        if (error.error && error.error.text) {
          this.notificationService.showNotification(Constant.ERROR, error.error.text);
        } else {
          this.notificationService.showNotification(Constant.ERROR, 'Lỗi dữ liệu');
        }
      });
    }
  }

}