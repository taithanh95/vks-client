import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ConstantService} from "../../../../../service/constant.service";
import {GeneralService} from "../../../../../service/general-service";
import {AppConfigService} from "../../../../../../app-config.service";
import {NotificationService} from "../../../../../service/notification.service";
import {NzTableQueryParams} from "ng-zorro-antd/table";
import {Constant} from "../../../../../shared/constants/constant.class";

@Component({
  selector: 'app-result-verify',
  templateUrl: './result-verify.component.html',
  styleUrls: ['./result-verify.component.scss']
})
export class ResultVerifyComponent implements OnInit {
  @Input() filterItem: any;
  @Input() isVisible: boolean;
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter();
  data: any;
  loading: boolean;
  defaultPage: any;
  pageIndex: any;
  total: any;
  enabledAutoLoadData = false; // Tự động lấy dữ liệu sau khi tải trang
  selectedItem: any;
  title_spp: any;
  pageSize: any;
  page: any;
  spp: any = JSON.parse(localStorage.getItem("SPP_TRACUU"));
  verifyIds: any = ConstantService.LIST_TYPE_VERIFY;

  constructor( private generalService: GeneralService,
               private configService: AppConfigService,
               private notificationService: NotificationService) { }

  ngOnInit(): void {
    if (localStorage.getItem("UNDERLEVEL_TRACUU") === 'true') {
      this.title_spp = ' và Các cấp trực thuộc';
    } else {
      this.title_spp = '';
    }
    this.resetPage();
    this.enabledAutoLoadData = true;
    // this.loadDataFromServer();
  }
  resetPage() {
    this.pageSize = this.configService.getConfig().pageSize;
    this.page = 10;
    this.defaultPage = this.configService.getConfig().defaultPage;
    this.pageIndex = 1;
  }
  handleCancel(): void {
    this.isVisible = false;
    this.closeModal.emit(false);
  }
  onQueryParamsChange(params: NzTableQueryParams): void {
    const {pageSize, pageIndex, sort, filter} = params;
    this.pageIndex = params.pageIndex;
    this.defaultPage = params.pageSize;
    this.loadDataFromServer();
  }
  loadDataFromServer(): void {
    var listSppid = JSON.parse(localStorage.getItem("SPP_TRACUU"));
    this.filterItem.sortOrder = 'ASC';
    const payload = {
      ...this.filterItem,
      sppidList: listSppid,
      underlevel: localStorage.getItem("UNDERLEVEL_TRACUU"),
      pageSize: this.defaultPage,
      pageIndex: this.defaultPage * (this.pageIndex - 1)
    }
    this.loading = true;
    this.generalService.searchVerify(payload).subscribe(res => {
      this.loading = false;
      this.data = res;
      if (this.data.length != 0)
        this.total = this.data[0].ROWCOUNT;
      else
        this.total = 0;
    }, error => {
      this.notificationService.showNotification(Constant.ERROR, error);
    });
  }
  onRowSelect(item) {
    this.selectedItem = item;
  }

}
