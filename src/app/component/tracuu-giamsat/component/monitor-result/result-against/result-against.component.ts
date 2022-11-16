import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {GeneralService} from "../../../../../service/general-service";
import {AppConfigService} from "../../../../../../app-config.service";
import {NotificationService} from "../../../../../service/notification.service";
import {NzTableQueryParams} from "ng-zorro-antd/table";
import {Constant} from "../../../../../shared/constants/constant.class";

@Component({
  selector: 'app-result-against',
  templateUrl: './result-against.component.html',
  styleUrls: ['./result-against.component.scss']
})
export class ResultAgainstComponent implements OnInit {
  @Input() filterItem: any;
  @Input() isVisible: boolean;
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter();

  /*page*/
  page: any;
  pageSize: any;
  defaultPage: any;
  pageIndex: any;
  total: any;
  loading: boolean;
  title_spp: any;

  data: any;
  spp: any = JSON.parse(localStorage.getItem("SPP_TRACUU"));

  selectedItem: any;

  constructor(
    private generalService: GeneralService,
    private configService: AppConfigService,
    private notificationService: NotificationService
  ) {
  }

  handleCancel(): void {
    this.isVisible = false;
    this.closeModal.emit(false);
  }

  ngOnInit(): void {
    if (localStorage.getItem("UNDERLEVEL_TRACUU") === 'true') {
      this.title_spp = ' và Các cấp trực thuộc';
      this.filterItem.underlevel = true;
    } else {
      this.title_spp = '';
      this.filterItem.underlevel = false;
    }
    this.resetPage();
    // this.doSearch();
  }

  resetPage() {
    this.pageSize = this.configService.getConfig().pageSize;
    this.page = 10;
    this.defaultPage = this.configService.getConfig().defaultPage;
    this.pageIndex = 1;
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    const {pageSize, pageIndex, sort, filter} = params;
    this.pageIndex = params.pageIndex;
    this.defaultPage = params.pageSize;
    this.doSearch();
  }

  onRowSelect(item) {
    this.selectedItem = item;
  }

  doSearch(): void {
    var listSppid = JSON.parse(localStorage.getItem("SPP_TRACUU"));
    this.filterItem.sortOrder = 'ASC';
    const payload = {
      ...this.filterItem,
      sppidList: listSppid,
      pageSize: this.defaultPage,
      pageIndex: this.defaultPage * (this.pageIndex - 1)
    }
    this.loading = true;
    this.generalService.searchAgainst(payload).subscribe(res => {
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
}
