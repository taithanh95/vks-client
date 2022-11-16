import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {GeneralService} from "../../../../../service/general-service";
import {AppConfigService} from "../../../../../../app-config.service";
import {NotificationService} from "../../../../../service/notification.service";
import {NzTableQueryParams} from "ng-zorro-antd/table";
import {Constant} from "../../../../../shared/constants/constant.class";

@Component({
  selector: 'app-result-law',
  templateUrl: './result-law.component.html',
  styleUrls: ['./result-law.component.scss']
})
export class ResultLawComponent implements OnInit {
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
    this.filterItem.sortOrder = 'ASC';
    var listSppid = JSON.parse(localStorage.getItem("SPP_TRACUU"));
    const payload = {
      ...this.filterItem,
      sppidList: listSppid,
      usefor: this.filterItem?.userforLaw,
      codeid: this.filterItem?.appliedLaws,
      pageSize: this.defaultPage,
      pageIndex: this.defaultPage * (this.pageIndex - 1)
    }
    this.loading = true;
    this.generalService.searchLaws(payload).subscribe(res => {
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

  f(value) {
    switch (value) {
      case 'G1':
        value = 'Kiểm sát điều tra'
        break;
      case 'G2':
        value = 'Kiểm sát giải quyết án - Truy tố'
        break;
      case 'G3':
        value = 'Xét xử sơ thẩm'
        break;
      case 'G4':
        value = 'Xét xử phúc thẩm'
        break;
      case 'G5':
        value = 'Xét xử giám đốc thẩm'
        break;
      case 'G6':
        value = 'Thi hành án'
        break;
      default:
        break;
    }
    return value;
  }
}

