import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {GeneralService} from '../../../../../service/general-service';
import {Constant} from '../../../../../shared/constants/constant.class';
import {NotificationService} from '../../../../../service/notification.service';

@Component({
  selector: 'app-static-dialog',
  templateUrl: './static-dialog.component.html',
  styleUrls: ['./static-dialog.component.scss']
})
export class StaticDialogComponent implements OnInit, OnChanges {
  @Input() isVisible: boolean;
  @Input() law: any;
  @Input() casecode: any;
  @Output() closeModal: EventEmitter<any> = new EventEmitter();
  isCollapse: boolean;
  datas: any[];
  loading: boolean;
  constructor(
    private generalService: GeneralService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.isCollapse = true;
    this.generalService.readErrorFile();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (this.isVisible) {
      this.getListStatics();
    }
  }
  getListStatics(){
    this.loading = true;
    const search  = { lawcode: this.law.LAWCODE, casecode: this.casecode };
    this.generalService.searchCaseStatic(search).subscribe(res => {
      if (res) {
        this.loading = false;
        this.datas = res;
      }
      // alert(res.length);
    }, error => {
      alert('Lỗi dữ liệu');
    });
  }
  handleCancel() {
    this.isVisible = false;
    this.closeModal.emit(false);
  }

  toggleCollapse() {
    this.isCollapse = !this.isCollapse;
  }
  getRowIndex = (index, pageIndex, pageSize) => index + 1 + pageSize * (pageIndex - 1);

  handleOk() {
    this.datas.forEach(en => {
      en.LAWCODE = this.law.LAWCODE;
      en.CASECODE = this.casecode;
      en.AMOUNT = en.AMOUNT ? en.AMOUNT : 0
    });
    let payload = {
      lawcode: this.law.LAWCODE,
      casecode: this.casecode,
      lstStaticcBegin: this.datas
    };
    this.generalService.insertStaticcBegin(payload).subscribe(res => {
      if (!res) {
        this.closeModal.emit(false);
        this.notificationService.showNotification(Constant.SUCCESS, 'Cập nhật chỉ tiêu thành công');
      }
      else {
        const lstErrors = res.split('|');
        lstErrors.forEach(en => {
          if (en) {
            const errorText = this.generalService.jsonError[en];
            this.notificationService.showNotification(Constant.ERROR, errorText);
          }
        });
      }
      // alert(res.length);
    }, error => {
      alert('Lỗi dữ liệu: ' + error);
    });
  }
}
