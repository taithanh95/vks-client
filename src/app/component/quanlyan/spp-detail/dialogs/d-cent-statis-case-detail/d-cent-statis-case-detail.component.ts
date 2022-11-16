import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {GeneralService} from "../../../../../service/general-service";
import {NotificationService} from "../../../../../service/notification.service";
import {Constant} from "../../../../../shared/constants/constant.class";

@Component({
  selector: 'app-d-cent-statis-case-detail',
  templateUrl: './d-cent-statis-case-detail.component.html',
  styleUrls: ['./d-cent-statis-case-detail.component.scss']
})
export class DCentStatisCaseDetailComponent implements OnInit {
  @Input() isVisible: boolean;
  @Input() law: any;
  @Input() casecode: any;
  @Input() sppCase: any;
  @Input() register: any;
  @Input() centence: any;
  @Input() userfor: any;
  @Output() closeModal: EventEmitter<any> = new EventEmitter();

  datas: any[];
  isCollapse: any;
  loading: boolean;

  constructor(
    private generalService: GeneralService,
    private notificationService: NotificationService
  ) {
  }

  ngOnInit(): void {
  }

  ngOnChanges() {
    if (this.isVisible) this.getListStatics();
  }

  toggleCollapse() {
    this.isCollapse = !this.isCollapse;
  }

  handleCancel(): void {
    this.closeModal.emit(false);
  }

  getListStatics() {
    this.loading = true;
    const search = {
      regicode: this.register.regicode,
      centcode: this.centence.centcode,
      lawcode: this.law.LAWCODE,
      userfor: this.userfor
    };
    this.generalService.searchCaseStatis(search).subscribe(res => {
      if (res) {
        this.loading = false;
        this.datas = res;
        console.log('data:  ', res);
      }
      // alert(res.length);
    }, error => {
      alert('Lỗi dữ liệu');
    });
  }

  handleOk() {
    this.datas.forEach(en => {
      en.LAWCODE = this.law.LAWCODE;
      en.CASECODE = this.casecode;
      en.AMOUNT = en.AMOUNT ? en.AMOUNT : 0
    });
    let payload = {
      regicode: this.register.regicode,
      centcode: this.centence.centcode,
      lawcode: this.law.LAWCODE,
      lstStaticcBegin: this.datas,
      userfor: this.userfor
    };
    this.generalService.insertCaseStatis(payload).subscribe(res => {
      if (!res) {
        this.closeModal.emit(false);
        this.notificationService.showNotification(Constant.SUCCESS, 'Cập nhật chỉ tiêu thành công');
      } else {
        const lstErrors = res.split('|');
        lstErrors.forEach(en => {
          if (en) {
            const errorText = this.generalService.jsonError[en];
            this.notificationService.showNotification(Constant.WARNING, errorText);
          }
        });
      }
    }, error => {
      console.log(error);
      alert('Lỗi dữ liệu: ' + error);
    });
  }
}
