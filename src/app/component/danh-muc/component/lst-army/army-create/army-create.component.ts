import {Component, EventEmitter, Input, OnInit, Output, SimpleChanges} from '@angular/core';
import {GeneralService} from '../../../../../service/general-service';
import {NotificationService} from '../../../../../service/notification.service';
import {WebUtilities} from '../../../../../shared/utils/qla-utils.class';
import {Constant} from '../../../../../shared/constants/constant.class';

@Component({
  selector: 'app-army-create',
  templateUrl: './army-create.component.html',
  styleUrls: ['./army-create.component.scss']
})
export class ArmyCreateComponent implements OnInit {
  @Input() isVisible: boolean;
  @Input() data: any;
  @Output() closeModal: EventEmitter<any> = new EventEmitter();
  @Output() reload: EventEmitter<any> = new EventEmitter();

  // data: any;
  sppid: any;
  armyChildId: any;
  armynamenew: any;
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
      this.armynamenew = '';
      this.getid();
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
    if (!this.armyChildId) {
      this.notificationService.showNotification(Constant.ERROR, 'Mã đơn vị quân đội buộc phải nhập');
      valid = false;
    }
    if (!this.armynamenew) {
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
      name: this.armynamenew,
      addr: this.data.addr.LOCAID,
      armyid: this.data.armyid,
      atxspp: data.sppid,
      sppid: null,
      newarmyid: this.armyChildId
    };
    this.generalService.insertArmy(payload).subscribe(res => {
      if (!res) {
        this.notificationService.showNotification(Constant.SUCCESS, 'Thêm mới Đơn vị quân đội thành công');
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
    } else if (err === 'existid') {
      this.notificationService.showNotification(Constant.ERROR, 'Mã đơn vị quân đội đã tồn tại');
    } else {
      const msgErr = this.generalService.jsonErrorDM[err];
      this.notificationService.showNotification(Constant.ERROR, msgErr ? msgErr : err);
    }
  }

  getid(): void {
    this.generalService.getidArmy({
      sppid: this.data.armyid,
      spplevel: this.data.armylevel,
    }).subscribe(res => {
      this.loading = false;
      this.armyChildId = res;
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

  handleChange(): void {
    if (this.data.addr && this.data.addr instanceof Object) {
      if ((parseInt(this.data.armylevel) + 1) === 2) {
        this.armynamenew = 'Tỉnh đội ' + this.data.addr.NAME;
      } else if ((parseInt(this.data.armylevel) + 1) === 3) {
        this.armynamenew = 'Huyện đội ' + this.data.addr.NAME;
      }
    }
  }

}
