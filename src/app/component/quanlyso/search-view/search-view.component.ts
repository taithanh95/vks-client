import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {NzModalRef} from 'ng-zorro-antd/modal';
import {NzTableQueryParams} from 'ng-zorro-antd/table';
import {DateChangeService} from '../../../service/date-change.service';
import {GeneralService} from '../../../service/general-service';
import {NotificationService} from '../../../service/notification.service';
import {Constant} from '../../../shared/constants/constant.class';
import {WebUtilities} from '../../../shared/utils/qla-utils.class';
import {AppConfigService} from '../../../../app-config.service';
import { CategoriesService } from '../../../service/categories.service';
@Component({
  selector: 'app-search-view',
  templateUrl: './search-view.component.html',
  styleUrls: ['./search-view.component.scss']
})
export class SearchViewComponent implements OnInit {

  /*ITEM SEARCH */
  filterItem: any;

  /*LIST DƠN VỊ */
  lstSpp = [];

  /* DATA PAGE */
  datas = [];

  /*DISABLED AREA SEARCH */
  isCollapse = true;

  /* PAGE */
  page: any;
  total: any;
  pageSize: any;
  defaultPage: any;
  pageIndex: any;

  /*DISPALY SCREEN DIALOG UPDATE/SEE */
  isVisible: boolean;
  isVisibleDis: boolean;
  refData: any;

  /* SEARCH FILTER*/
  loading = false;
  enabledAutoLoadData = false; // Tự động lấy dữ liệu sau khi tải trang

  /* DIALOG CONFIRM */
  @ViewChild('confirm') confirmTemplate: TemplateRef<any>;
  @ViewChild('confirmHeader') confirmHeaderTemplate: TemplateRef<any>;
  confirmModalRef: NzModalRef<any>;
  
  constructor(
    private configService: AppConfigService,
    private datechangeService: DateChangeService,
    private generalService: GeneralService,
    private notificationService: NotificationService,
    private router: Router,
    private categoriesService: CategoriesService
  ) { }

  ngOnInit(): void {
    this.pageSize = this.configService.getConfig().pageSize;
    this.page = 20;
    this.defaultPage = this.configService.getConfig().defaultPage;
    this.pageIndex = 1;
    this.datas = [];
    this.filterItem = {}
    this.filterItem.createdat = null;
    this.filterItem.period = null;
    this.filterItem.sppid = WebUtilities.getLoggedSppId();
    this.filterItem.note = null;
    this.filterItem.code = null;
    this.getLstSpp(this.filterItem.sppid);
  }
  
  loadDataFromServer(): void {
    if (this.enabledAutoLoadData){
      this.datas = [];
      this.loading = true;
      const payload = {
        ...this.filterItem,
        sppid : this.filterItem?.sppid?.sppid,
        pageSize : this.defaultPage,
        pageIndex : this.defaultPage * (this.pageIndex - 1),
      }
      this.generalService.getListInfoReport(payload).subscribe(res => {
        this.loading = false;
        this.datas = res;
        if (res.length > 0)
          this.total = this.datas[0].ROWCOUNT;
      }, () => {
        this.loading = false;
        this.notificationService.showNotification(Constant.ERROR, 'Lỗi dữ liệu');
      });
    }
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    const { pageSize, pageIndex, sort, filter } = params;
    this.pageIndex = params.pageIndex;
    this.defaultPage = params.pageSize;
    this.loadDataFromServer();
  }

  doSearch() {
    this.enabledAutoLoadData = true;
    this.pageIndex = 1;
    this.loadDataFromServer();
  }

  onValueDate($item, $event): void{
    this.filterItem[$item] = this.datechangeService.onDateValueChange($event);
  }

  getLstSpp(office) {
    this.categoriesService.getListVKS(office).subscribe(res => {
      this.lstSpp = res;
      this.filterItem.sppid = res[0];
    });
  }
  onInputSpp(e: any): void {
    const value = (e.target as HTMLInputElement).value;
    if (!value || value.indexOf('@') >= 0) {
      this.lstSpp = [];
    } else {
      this.categoriesService.getListVKS(value).subscribe(res => {
        this.lstSpp = res;
        this.filterItem.sppid = res[0];
      });
    }
  }

  validateOnlyNumbers(event: KeyboardEvent): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    return !(charCode > 31 && (charCode < 48 || charCode > 57));
  }

  toggleCollapse = () => this.isCollapse = !this.isCollapse;

  deleteRow(id){
    this.generalService.deleteInfoReport(id).subscribe(res => {
      this.loading = false;
      this.doSearch();
      this.notificationService.showNotification(Constant.SUCCESS, 'Xóa dữ liệu thành công');
    }, err => {
      this.loading = false;
      this.notificationService.showNotification(Constant.ERROR, 'Xóa dữ liệu thất bại');
    });
  }
  getRowIndex(index, pageIndex, pageSize): number {
    return index + 1 + pageSize * (pageIndex - 1);
  }

  showForm(data?) {
    this.isVisible = true;
    if(data) {
      this.refData = WebUtilities.toLowercaseFieldsWithoutConvertBoolean(data);
      this.refData.isEdit = true;
    } else {
      this.refData = {};
      this.refData.createdat = new Date();
      this.refData.isEdit = false;
      this.refData.reportcode = this.filterItem.reportcode;
    }
  }
  showDisableForm(data?){
    this.isVisible = true;
    this.isVisibleDis = true;
    this.refData = WebUtilities.toLowercaseFieldsWithoutConvertBoolean(data);
    this.refData.isEdit = true;
  }

  reloadPage = () => this.doSearch();

  cancel = () => null;

  closeModalUpdate() {
    this.isVisible = false;
    this.isVisibleDis = false;
  }

  goListReport() {
    return this.router.navigate(['admin/quanlyso/danh-muc-bao-cao'])
  }
}
