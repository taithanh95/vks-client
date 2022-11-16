import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {Constant} from "../../../../shared/constants/constant.class";
import {NzModalRef, NzModalService} from "ng-zorro-antd/modal";
import {NotificationService} from "../../../../service/notification.service";
import {DateChangeService} from "../../../../service/date-change.service";
import {GeneralService} from "../../../../service/general-service";
import {AppConfigService} from "../../../../../app-config.service";
import {NzTableQueryParams} from "ng-zorro-antd/table";
import {Router} from '@angular/router';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {
  /* PAGE */
  page: any;
  total: any;
  pageSize: any;
  defaultPage: any;
  pageIndex: any;

  /* DATA PAGE */
  datas = [];

  /* SEARCH FILTER*/
  isCollapse = true;
  loading = false;
  enabledAutoLoadData = false; // Tự động lấy dữ liệu sau khi tải trang
  selectedItem: any;
  filterItem: any;
  lstSpp: any[];
  userfor: any;
  sppid: any;

  /* VALUE BUTTON */
  isBtn: boolean;

  /* DIALOG CONFIRM */
  @ViewChild('confirm') confirmTemplate: TemplateRef<any>;
  @ViewChild('confirmHeader') confirmHeaderTemplate: TemplateRef<any>;
  confirmModalRef: NzModalRef<any>;
  
  /* VISIBILITY SCREEN DIALOGS */
  isVisible: boolean;
  isVisibleDis: boolean;


  /* DATA SCREEN DETAILS */
  dataDetail: any;

  constructor(
    private notificationService: NotificationService,
    private datechangeService: DateChangeService,
    private generalService: GeneralService,
    private configService: AppConfigService,
    private modalService: NzModalService,
    private router: Router
  ) {
  }

  showConfirmDelete(): void {
    this.confirmModalRef = this.modalService.create({
      nzTitle: this.confirmHeaderTemplate,
      nzContent: this.confirmTemplate,
      nzClosable: false,
      nzAutofocus: null,
      nzFooter: [
        {
          label: 'Có', onClick: () => {
            this.deleteRow();
            this.confirmModalRef.close();
          }
        },
        {
          label: 'Không', onClick: () => {
            this.confirmModalRef.close();
          }
        }
      ]
    });
  }

  ngOnInit(): void {
    this.pageSize = this.configService.getConfig().pageSize;
    this.page = 20;
    this.defaultPage = this.configService.getConfig().defaultPage;
    this.pageIndex = 1;
    this.isBtn = true;
    this.enabledAutoLoadData = false;
    this.resetFilter();
  }

  resetFilter(): void {
    this.filterItem = {
      reportCode: '',
      name: ''
    };
  }

  toggleCollapse(): void {
    this.isCollapse = !this.isCollapse;
  }

  loadDataFromServer(): void {
    if (this.enabledAutoLoadData) {
      this.loading = true;
      const payload = {
        ...this.filterItem,
        status: 1,
        pageSize: this.defaultPage,
        pageIndex: this.pageIndex - 1
      };
      this.generalService.getListReport(payload).subscribe(res => {
        this.loading = false;
        this.datas = res.responseData.content;
        this.total = res.responseData?.totalElements;
      }, () => {
        this.loading = false;
        this.notificationService.showNotification(Constant.ERROR, 'Lỗi dữ liệu');
      });
    }
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    const {pageSize, pageIndex, sort, filter} = params;
    this.pageIndex = params.pageIndex;
    this.defaultPage = params.pageSize;
    this.loadDataFromServer();
  }

  doSearch(): void {
    this.enabledAutoLoadData = true;
    this.pageIndex = 1
    this.loadDataFromServer();
  }

  showEditForm(isView?): void {
    this.isVisible = true;
    this.dataDetail = this.selectedItem;
    this.dataDetail.parentname = this.selectedItem.name;
    this.dataDetail.name = null;
    if (isView) {
      this.dataDetail.isEdit = true;
    } else {
      this.dataDetail.isEdit = false;
      this.dataDetail.parent = this.selectedItem.id;
      this.dataDetail.level = ++this.selectedItem.level;
      this.dataDetail.id = null;
    }
  }

  onRowSelect(item: any): void {
    this.selectedItem = item;
    this.isBtn = false;
  }

  getRowIndex(index, pageIndex, pageSize): number {
    return index + 1 + pageSize * (pageIndex - 1);
  }

  currentPageDataChange = ($event: any[]) => null;

  onValueDate($item, $event): void {
    this.filterItem[$item] = this.datechangeService.onDateValueChange($event);
  }

  validateOnlyNumbers(event: KeyboardEvent): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    return !(charCode > 31 && (charCode < 48 || charCode > 57));
  }

  resetDatas(): any {
    this.datas = [];
  }
  closeModalDetail($event): void {
    this.isVisible = false;
    this.isVisibleDis = false;
    this.isBtn = true;
    this.doSearch();
  }
  reloadPage = ($event) => this.doSearch();

  deleteRow(): void {
    this.generalService.deleteReport(this.selectedItem).subscribe(res => {
      this.loading = false;
      this.doSearch();
    }, () => {
      this.loading = false;
      this.notificationService.showNotification(Constant.ERROR, 'Lỗi dữ liệu');
    });
  }

  rollback() {
    return this.router.navigate(['admin/quanlyso/danh-sach-so-thu-ly'])
  }
  
}
