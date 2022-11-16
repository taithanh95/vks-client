import {Component, EventEmitter, Input, OnInit, Output, SimpleChanges} from '@angular/core';
import {GeneralService} from '../../../../../service/general-service';
import {NotificationService} from '../../../../../service/notification.service';
import {WebUtilities} from '../../../../../shared/utils/qla-utils.class';
import {Constant} from '../../../../../shared/constants/constant.class';

@Component({
  selector: 'app-army-edit',
  templateUrl: './army-edit.component.html',
  styleUrls: ['./army-edit.component.scss']
})
export class ArmyEditComponent implements OnInit {
  @Input() isVisible: boolean;
  @Input() data: any;
  @Output() closeModal: EventEmitter<any> = new EventEmitter();
  @Output() reload: EventEmitter<any> = new EventEmitter();

  // data: any;
  sppid: any;
  lstLocation = [];
  /*LIST DƠN VỊ */
  lstSpp = [];

  loading: boolean;
  isSubmited: boolean;

  constructor(
    private generalService: GeneralService,
    private notificationService: NotificationService
  ) {
    this.sppid = WebUtilities.getLoggedSppId();
  }


  ngOnChanges(changes: SimpleChanges): void {
    if (this.isVisible) {
      this.getListSpp();
      this.getListLocation(this.data.addr);
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

  handleOk() {
    this.isSubmited = true;
    this.loading = true;
    let valid = true;
    if (!this.data.name) {
      this.notificationService.showNotification(Constant.ERROR, 'Tên đơn vị quân đội buộc phải nhập');
      valid = false;
    }
    if (!this.data.addr) {
      this.notificationService.showNotification(Constant.ERROR, 'Địa chỉ buộc phải nhập');
      valid = false;
    }
    if (!this.data.sppid) {
      this.notificationService.showNotification(Constant.ERROR, 'Viện kiểm sát cùng cấp buộc phải nhập');
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
      // name: this.data.name,
      addr: this.data.addr.LOCAID,
      // customid: this.data.customid,
      atxspp: data.sppid,
      sppid: null,
      locaid: null
    };
    this.generalService.updateArmy(payload).subscribe(res => {
      if (res) {
        this.notificationService.showNotification(Constant.SUCCESS, 'Cập nhật Đơn vị quân đội thành công');
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
      this.notificationService.showNotification(Constant.ERROR, 'Đã tồn tại đơn vị quân đội này trong CSDL');
    } else {
      const msgErr = this.generalService.jsonErrorDM[err];
      this.notificationService.showNotification(Constant.ERROR, msgErr ? msgErr : err);
    }
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

  getListSpp(): void {
    console.log('this.data: ',this.data);
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
}
