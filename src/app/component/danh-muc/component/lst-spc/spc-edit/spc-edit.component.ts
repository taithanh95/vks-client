import {Component, EventEmitter, Input, OnInit, Output, SimpleChanges} from '@angular/core';
import { CategoriesService } from '../../../../../service/categories.service';
import { WebUtilities } from '../../../../../shared/utils/qla-utils.class';
import {GeneralService} from "../../../../../service/general-service";
import {NotificationService} from "../../../../../service/notification.service";
import {Constant} from "../../../../../shared/constants/constant.class";

@Component({
  selector: 'app-spc-edit',
  templateUrl: './spc-edit.component.html',
  styleUrls: ['./spc-edit.component.scss']
})
export class SpcEditComponent implements OnInit {
  @Input() isVisible: boolean;
  @Input() data: any;
  @Output() closeModal: EventEmitter<any> = new EventEmitter();
  @Output() reload: EventEmitter<any> = new EventEmitter();

  lstLocation = [];
  /*LIST DƠN VỊ */
  lstSpp = [];

  loading: boolean;
  isSubmited: boolean;

  constructor(
    private generalService: GeneralService,
    private notificationService: NotificationService,
    private categoriesService: CategoriesService
  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.isVisible) {
      this.lstLocation = [];
      this.getid(this.data?.locaid);
    }
  }

  ngOnInit(): void {
    this.data = {};
  }

  resetData() {
    this.data = {}
  }

  handleCancel(): void {
    this.isVisible = false;
    this.closeModal.emit(false);
  }

  getid(locaid): void {
    this.categoriesService.getLocationById(locaid).subscribe(res => {
      if (res) {
        const data = WebUtilities.toUppercaseFields(res);
        this.lstLocation = [data];
        this.data.addr = data;
      }
    });
  }

  handleOk() {
    this.isSubmited = true;
    this.loading = true;
    let valid = true;
    if (!this.data.name) {
      this.notificationService.showNotification(Constant.ERROR, 'Tên tòa án quan buộc phải nhập');
      valid = false;
    }
    if (!this.data.addr) {
      this.notificationService.showNotification(Constant.ERROR, 'Địa chỉ buộc phải nhập');
      valid = false;
    } else if (!this.data.addr.LOCAID) {
      this.notificationService.showNotification(Constant.ERROR, 'Địa chỉ buộc phải nhập');
      valid = false;
    }
    if (valid) {
      this.isSubmited = false;
      this.handleSubmit(this.data);
    } else {
      this.loading = false;
    }
  }

  handleSubmit(data) {
    let payload = {
      ...data,
      addr: this.data.addr.LOCAID
    };
    this.generalService.updateSPC(payload).subscribe(res => {
      if (res) {
        this.notificationService.showNotification(Constant.SUCCESS, 'Cập nhật Tòa án quan thành công');
        this.handleCancel();
        this.reload.emit();
        this.resetData();
      } else {
        if (res === 'existname')
          this.notificationService.showNotification(Constant.ERROR, 'Tên Tòa án đã tồn tại');
      }
      this.loading = false;
    }, error => {
      const msg = this.generalService.readPropertiesJava(error.error.text);
      this.notificationService.showNotification(Constant.ERROR, msg);
      this.loading = false;
    });
  }

  getListLocation(query): void {
    this.generalService.autocompleteLocation(query).subscribe(res => {
      this.loading = false;
      this.lstLocation = res;
      this.data.addr = this.lstLocation.find(res => res.locaid = query);
      this.data.addr = this.lstLocation[0];
    }, error => {
      alert('Lỗi dữ liệu');
    });
  }

  onInputLocation(e: any): void {
    const value = (e.target as HTMLInputElement).value;
    if (!value || value.indexOf('@') >= 0) {
      this.lstLocation = [];
    } else {
      this.generalService.autocompleteLocation(value).subscribe(res => {
        this.lstLocation = res;
      });
    }
  }
}

