import {Component, EventEmitter, Input, OnInit, Output, SimpleChanges} from '@angular/core';
import {GeneralService} from "../../../../../service/general-service";
import {NotificationService} from "../../../../../service/notification.service";
import {WebUtilities} from "../../../../../shared/utils/qla-utils.class";
import {Constant} from "../../../../../shared/constants/constant.class";
import { CategoriesService } from '../../../../../service/categories.service';

@Component({
  selector: 'app-spp-edit',
  templateUrl: './spp-edit.component.html',
  styleUrls: ['./spp-edit.component.scss']
})
export class SppEditComponent implements OnInit {
  @Input() isVisible: boolean;
  @Input() data: any;
  @Output() closeModal: EventEmitter<any> = new EventEmitter();
  @Output() reload: EventEmitter<any> = new EventEmitter();

  // data: any;
  sppid: any;
  lstLocation = [];
  /*LIST DƠN VỊ */
  lstSpc = [];

  loading: boolean;
  isSubmited: boolean;

  constructor(
    private generalService: GeneralService,
    private notificationService: NotificationService,
    private categoriesService : CategoriesService
  ) {
    this.sppid = WebUtilities.getLoggedSppId();
  }


  ngOnChanges(changes: SimpleChanges): void {
    if (this.isVisible) {
      this.getListSpc();
      this.getid(this.data.locaid);
    }
  }

  ngOnInit(): void {
    this.data = {};
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

  resetData() {
    this.data = {}
  }

  handleCancel(): void {
    this.isVisible = false;
    this.closeModal.emit(false);
  }

  handleOk() {
    this.isSubmited = true;
    this.loading = true;
    let valid = true;
    if (!this.data.name) {
      this.notificationService.showNotification(Constant.ERROR, 'Tên viện kiểm sát buộc phải nhập');
      valid = false;
    }

    if (!this.data.addr) {
      this.notificationService.showNotification(Constant.ERROR, 'Địa chỉ buộc phải nhập');
      valid = false;
    } else if (!this.data.addr.LOCAID) {
      this.notificationService.showNotification(Constant.ERROR, 'Địa chỉ buộc phải nhập');
      valid = false;
    }

    if (!this.data.spcid) {
      this.notificationService.showNotification(Constant.ERROR, 'Tòa án cùng cấp buộc phải nhập');
      valid = false;
    } else if (!this.data.spcid.SPCID) {
      this.notificationService.showNotification(Constant.ERROR, 'Tòa án cùng cấp buộc phải nhập');
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
      addr: this.data.addr.LOCAID,
      atxtspc: data.spcid,
      spcid: null,
      locaid: null
    };
    this.generalService.updateSPP(payload).subscribe(res => {
      if (res) {
        this.notificationService.showNotification(Constant.SUCCESS, 'Cập nhật Viện kiểm sát thành công');
        this.handleCancel();
        this.reload.emit();
        this.resetData();
      } else {
        const msg = this.generalService.jsonErrorDM[res];
        this.notificationService.showNotification(Constant.ERROR, msg);
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

  getListSpc(): void {
    this.generalService.getListSpcByQuery({
      query: this.data?.spcid,
    }).subscribe(res => {
      this.loading = false;
      this.lstSpc = res;
      this.data.spcid = this.lstSpc.find(spc => spc.SPCID === this.data?.spcid);
    }, error => {
      alert('Lỗi dữ liệu');
    });
  }


  onInputSpc(e: any): void {
    const value = (e.target as HTMLInputElement).value;
    if (!value || value.indexOf('@') >= 0) {
      this.lstSpc = [];
    } else {
      this.generalService.getListSpcByQuery({
        query: value,
      }).subscribe(res => {
        this.lstSpc = res;
      });
    }
  }
}
