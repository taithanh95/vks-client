import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {GeneralService} from "../../../../../service/general-service";
import {NotificationService} from "../../../../../service/notification.service";
import {WebUtilities} from "../../../../../shared/utils/qla-utils.class";
import {Constant} from "../../../../../shared/constants/constant.class";

@Component({
  selector: 'app-borderguards-edit',
  templateUrl: './borderguards-edit.component.html',
  styleUrls: ['./borderguards-edit.component.scss']
})
export class BorderguardsEditComponent implements OnInit, OnChanges {
  @Input() data: any;
  @Input() isVisible: boolean;
  @Output() closeModal: EventEmitter<any> = new EventEmitter();
  @Output() reload: EventEmitter<any> = new EventEmitter();

  /*LIST DƠN VỊ */
  lstSpp = [];
  lstLocation = [];

  loading: boolean;
  isSubmited: boolean;
  sppid: string;

  constructor(private generalService: GeneralService,
              private notificationService: NotificationService) {
    this.sppid = WebUtilities.getLoggedSppId();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (this.isVisible) {
      this.getListSpp();
      this.getListLocation(this.data?.locaid);
    }
  }
  ngOnInit(): void {

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
      this.notificationService.showNotification(Constant.ERROR, 'Tên đơn vị biên phòng buộc phải nhập');
      valid = false;
    }
    if (!this.data.locaid) {
      this.notificationService.showNotification(Constant.ERROR, 'Địa chỉ buộc phải nhập');
      valid = false;
    }

    if (!this.data.sppid) {
      this.notificationService.showNotification(Constant.ERROR, 'Tên VKS buộc phải nhập');
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
      sppid:data.sppid ? data?.sppid?.SPPID :null,
      addr: data.locaid ? data?.locaid?.LOCAID : null,
      locaid: data.locaid ? data?.locaid?.NAME : null,
      atxspp: this.data.sppid
    };
    payload.action = 'U';

    this.generalService.updateBorguards(payload).subscribe(res => {
      if (!res) {
        this.notificationService.showNotification(Constant.SUCCESS, 'Cập nhật đơn vị biên phòng thành công');
        this.handleCancel();
        this.reload.emit();
        this.resetData();
      } else {
        this.handleErr(res);
        this.loading = false;
      }
    }, error => {
      this.handleErr(error.error.text);
      this.loading = false;
    });
  }

  handleErr(err: string){
    if (err === 'existname') {
      this.notificationService.showNotification(Constant.ERROR, 'Đã tồn tại tên đơn vị biên phòng này trong CSDL');
    } else {
      const msgErr = this.generalService.jsonErrorDM[err];
      this.notificationService.showNotification(Constant.ERROR, msgErr ? msgErr : err);
    }
  }

  getListSpp(): void {
    this.generalService.getListSppByQuery({
      query: this.data?.sppid,
      sppid: this.sppid
    }).subscribe(res => {
      this.loading = false;
      this.lstSpp = res;
      this.data.sppid = this.lstSpp.find(spp => spp.SPPID === this.data?.sppid);
    }, error => {
      alert('Lỗi dữ liệu');
    });
  }

  onInputSpp(e: any): void {
    const value = (e.target as HTMLInputElement).value;
    if (!value || value.indexOf('@') >= 0) {
      this.lstSpp = [];
    } else {
      this.generalService.getListSppByQuery({
        query: value,
        sppid: this.sppid
      }).subscribe(res => {
        this.lstSpp = res;
      });
    }
  }

  getListLocation(query): void {
    this.generalService.autocompleteLocation(query).subscribe(res => {
      this.loading = false;
      this.lstLocation = res;
      this.data.locaid = this.lstLocation.find(res => res.locaid = query);
      this.data.locaid = this.lstLocation[0];
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
