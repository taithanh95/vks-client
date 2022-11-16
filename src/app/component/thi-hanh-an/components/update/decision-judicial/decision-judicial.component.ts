import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {NotificationService} from "../../../../../service/notification.service";
import {ConstantService} from "../../../../../service/constant.service";
import {SppService} from "../../../../../service/spp-service";
import {NzModalRef} from "ng-zorro-antd/modal";
import {AppConfigService} from "../../../../../../app-config.service";

@Component({
  selector: 'app-decision-judicial',
  templateUrl: './decision-judicial.component.html',
  styleUrls: ['./decision-judicial.component.scss']
})
export class DecisionJudicialComponent implements OnInit {
  @Input() register: any;
  @Input() listOfData: any;
  @Input() checkDeciJudicial: boolean;
  @Output() showPopup: EventEmitter<any> = new EventEmitter();
  @Output() showPopupDisable: EventEmitter<any> = new EventEmitter();
  @Output() deleteRow: EventEmitter<any> = new EventEmitter();
  isCollapse = true;
  formSearch!: FormGroup;
  pageSize: any;
  page: any;
  defaultPage: any;
  confirmModalRef: NzModalRef<any>;
  scroll = null;
  loading = false;

  constructor(
    private configService: AppConfigService,
    private fb: FormBuilder,
    private notificationService: NotificationService,
    private constantService: ConstantService,
    private sppService: SppService,
  ) {
  }

  ngOnInit(): void {
    this.loading = false;
    this.pageSize = this.configService.getConfig().pageSize;
    this.page = this.configService.getConfig().page;
    this.defaultPage = this.configService.getConfig().defaultPage;
  }


  toggleCollapse() {
    this.isCollapse = !this.isCollapse;
  }

  numberOnly(event: KeyboardEvent): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    return !(charCode > 31 && (charCode < 48 || charCode > 57));
  }

  cancel = () => null;

  confirm(item): void {
    this.deleteRow.emit(item);
  }

  showInsert(): void {
    this.showPopup.emit();
  }

  showEditForm(data): void {
    this.showPopup.emit(data);
  }

  showDisableForm(data): void {
    this.showPopupDisable.emit(data);
  }

  f(name) {
    switch (name) {
      case '1' :
        return 'Tịch thu tiền vật, trực tiếp liên quan đến tội phạm'
      case '2' :
        return 'Trả lại tài sản, sửa chữa hoặc bồi thường thiệt hại'
      case '3' :
        return 'Buộc công khai xin lỗi'
      case '4' :
        return 'Bắt buộc chữa bệnh'
      case '5' :
        return 'Giáo dục tại trường giáo dưỡng'
      default:
        break;
    }
  }
}
