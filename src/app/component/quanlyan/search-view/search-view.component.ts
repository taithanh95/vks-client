import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup} from '@angular/forms';
import {AppConfigService} from '../../../../app-config.service';
import {TableSelectionAbstract} from '../../../shared/component/table/table-selection.abstract';
import {Constant} from '../../../shared/constants/constant.class';
import {GeneralService} from '../../../service/general-service';
import {NotificationService} from '../../../service/notification.service';
import {SppService} from '../../../service/spp-service';
import {NzTableQueryParams} from 'ng-zorro-antd/table';
import {Accused, FilterSppCaseClass, Register} from '../../../model/filter-spp-case.class';
import {SppCase} from '../../../model/sppcase.class';
import {WebUtilities} from '../../../shared/utils/qla-utils.class';
import {CategoriesService} from '../../../service/categories.service';
import {CookieService} from 'ngx-cookie-service';
import {DateChangeService} from '../../../service/date-change.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-search-view',
  templateUrl: './search-view.component.html',
  styleUrls: ['./search-view.component.scss']
})
export class SearchViewComponent extends TableSelectionAbstract implements OnInit {
  type: any;
  isVisibleAdd: boolean;
  /*page*/
  pageSize: any;
  page: any;
  defaultPage: any;
  total: any;
  pageIndex = 1;

  /*search filter*/
  loaicoquan: any;
  validateForm!: FormGroup;
  controlArray: Array<{ index: number; show: boolean }> = [];
  isCollapse = true;
  arrCollapse: any[];
  atxLaws: any[];
  loading = false;
  enabledAutoLoadData = false; // Tự động lấy dữ liệu sau khi tải trang
  datas: any[];
  userInfo: any;
  selectedItem: any;
  filterLaw: any;
  public filterItem: FilterSppCaseClass;
  /*filterItem = {
    pageSize: 100,
    rowIndex: 0,
    sortField: '',
    sortOrder: '',
    sppId: '',
    sppcase : {
      casename: '',
      casecode: '',
      begin_setnum: '',
      begin_office: ''
    }
  };
*/
  checked = false;
  setOfCheckedId = new Set<number>();

  // EXPORT DETAIL CASE
  innerHtml: SafeHtml | string;
  isVisible: boolean;
  isSpinning: boolean;
  sppid: string

  constructor(
    private notificationService: NotificationService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private configService: AppConfigService,
    private generalService: GeneralService,
    private sppService: SppService,
    private categoriesService: CategoriesService,
    private cookieService: CookieService,
    private datechangeService: DateChangeService,
    private sanitizer: DomSanitizer
  ) {
    super('id');
    this.type = this.route.snapshot.paramMap.get('type');
    this.resetFilter();
    this.sppid = WebUtilities.getLoggedSppId();
  }

  toLawOption(l) {
    return `${l.lawid == null ? '' : 'Điều ' + l.lawid}${l.item == null || l.item === 0 ? '' : (' - Khoản ' + l.item)}${l.point == null ? '' : (' - Điểm ' + l.point)}${l.lawid == null ? '' : ' - ' + l.lawname}`;
  }

  ngOnInit(): void {
    if (localStorage.getItem(Constant.USER_INFO) === null
      || localStorage.getItem(Constant.USERID) !== this.cookieService.get(Constant.USERNAME)) {
      localStorage.clear();
      this.router.navigate(['login'], {queryParams: {returnUrl: this.router.routerState.snapshot.url}});
    }
    this.userInfo = JSON.parse(localStorage.getItem(Constant.USER_INFO));
    // this.loaicoquan = 0;
    this.pageSize = this.configService.getConfig().pageSize;
    this.page = 50;
    this.defaultPage = this.configService.getConfig().defaultPage;

    this.arrCollapse = [true, false];
    // this.doSearch();
  }

  resetFilter() {
    this.filterItem = new FilterSppCaseClass();
    this.filterItem.pageSize = 100;
    this.filterItem.rowIndex = 0;
    this.filterItem.sortField = '';
    this.filterItem.sortOrder = '';
    this.filterItem.sppId = WebUtilities.getLoggedSppId();
    this.filterItem.sppcase = new SppCase();
    this.filterItem.sppcase.userfor = this.type;
    this.filterItem.sppcase.sppid = this.filterItem.sppId;
    this.filterItem.sppcase.atxLaw = null;
    this.filterItem.accused = new Accused();
    this.filterLaw = null;
    this.filterItem.register = new Register();
    this.filterItem.centence = {};
  }

  onInputAtxLaw(e: any): void {
    let value = (e.target as HTMLInputElement).value;
    if (!value || value.indexOf('@') >= 0) {
      this.atxLaws = [];
    } else {
      if (value === ' ') value = '0';
      this.categoriesService.getListLawAutoCompleteWithoutType(value).subscribe(res => {
        this.atxLaws = res;
      });
    }
  }

  toggleCollapse(index: number) {
    this.arrCollapse[index] = !this.arrCollapse[index];
  }

  loadDataFromServer(): void {
    if (this.enabledAutoLoadData) {
      // console.log(this.total, this.pageIndex);
      this.filterItem.pageSize = this.defaultPage;
      this.filterItem.rowIndex = this.defaultPage * (this.pageIndex - 1);
      this.loading = true;
      this.filterItem.sppId = WebUtilities.getLoggedSppId();
      this.filterItem.sppcase.sppid = this.filterItem.sppId;
      const payloadSearch = this.filterItem;
      if (this.filterLaw) {
        // convert
        this.filterItem.sppcase.atxLaw = {lawcode: this.filterLaw.lawcode};
      } else {
        delete this.filterItem.sppcase.atxLaw;
      }
      this.generalService.getListUpdateInfo(this.filterItem).subscribe(res => {
        if (res.responseCode === '0008') {
          this.logout();
        }
        this.loading = false;
        this.datas = res;
        if (res.length > 0)
          this.total = res[0].ROWCOUNT;
        else
          this.total = 0;
      }, error => {
        alert('Lỗi dữ liệu');
      });
    }
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    const {pageSize, pageIndex, sort, filter} = params;
    this.pageIndex = params.pageIndex;
    this.defaultPage = params.pageSize;

    const currentSort = sort.find(item => item.value !== null);
    this.filterItem.sortField = (currentSort && currentSort.key) || 'CASECODE';
    if ((currentSort && currentSort.value) === 'ascend') {
      this.filterItem.sortOrder = 'ASC';
    } else {
      this.filterItem.sortOrder = 'DESC';
    }
    this.loadDataFromServer();
  }

  getListData() {
    this.loading = true;
    this.filterItem.sppId = this.userInfo.sppid;
    this.generalService.getListUpdateInfo(this.filterItem).subscribe(res => {
      this.loading = false;
      // console.log(res);
      this.datas = res;
    }, error => {
      alert('Lỗi dữ liệu');
    });
  }

  // toggleCollapse(): void {
  //   this.isCollapse = !this.isCollapse;
  //   this.controlArray.forEach((c, index) => {
  //     c.show = this.isCollapse ? index < 6 : true;
  //   });
  // }

  doSearch() {
    this.enabledAutoLoadData = true;
    this.loadDataFromServer();
  }

  clearSearch() {
    this.resetFilter();
    this.doSearch();
  }

  showEditForm() {
    this.selectedItem.isEdit = true;
    this.sppService.setCurrentSppCase(this.selectedItem);
    this.router.navigate(['/admin/quanlyan/cap-nhat-thong-tin/' + this.type]);
  }

  showModalAdd() {
    // this.isVisibleAdd = true;
    this.sppService.setCurrentSppCase(null);
    setTimeout(() => {
      this.router.navigate(['/admin/quanlyan/cap-nhat-thong-tin/G1']);
    }, 50);
    // location.href = '/admin/quanlyan/cap-nhat-thong-tin/' + 1;
  }

  resetForm(): void {
    this.validateForm.reset();
    /*this.filterItem = {
      pageSize: 10,
      rowIndex: 0,
      sortField: '',
      sortOrder: '',
      sppId: '',
      sppcase : {
        casename: '',
        casecode: '',
        begin_setnum: ''
      }
    };*/
  }

  submitFormUpdate(data) {
    if (data.crimdate) {
      data.cday = '' + data.crimdate.getDate();
    }

    data.kham_nghiem_hien_truong = '' + data.kham_nghiem_hien_truong;
    data.nhan_dang = '' + data.nhan_dang;
    data.kham_nghiem_tu_thi = '' + data.kham_nghiem_tu_thi;
    data.kham_xet = '' + data.kham_xet;
    data.nhan_biet_giong_noi = '' + data.nhan_biet_giong_noi;
    data.thuc_nghiem_dieu_tra = '' + data.thuc_nghiem_dieu_tra;
    data.doi_chat = '' + data.doi_chat;
    data.kham_nghiem_hien_truong_ko = '' + data.kham_nghiem_hien_truong_ko;
    data.nhan_dang_ko = '' + data.nhan_dang_ko;
    data.kham_nghiem_tu_thi_ko = '' + data.kham_nghiem_tu_thi_ko;
    data.kham_xet_ko = '' + data.kham_xet_ko;
    data.nhan_biet_giong_noi_ko = '' + data.nhan_biet_giong_noi_ko;
    data.thuc_nghiem_dieu_tra_ko = '' + data.thuc_nghiem_dieu_tra_ko;
    data.doi_chat_ko = '' + data.doi_chat_ko;
    data.tt_hoi_cung = '' + data.tt_hoi_cung;
    data.tt_lk_nbd_ds = '' + data.tt_lk_nbd_ds;
    data.tg_hoi_cung = '' + data.tg_hoi_cung;
    data.tt_lk_bb_tg = '' + data.tt_lk_bb_tg;
    data.tt_lk_nlc = '' + data.tt_lk_nlc;
    data.tt_lk_nbh = '' + data.tt_lk_nbh;
    data.tg_lk = '' + data.tg_lk;
    if (!data.crimtime || data.crimtime === '') {
      data.crimtime = '00:00';
    }
    data.sppid = WebUtilities.getLoggedSppId();
    data.atxLaw = {lawcode: data.atxLaw.lawcode};
    const inputItem = {
      isTachvu: true,
      sppId: WebUtilities.getLoggedSppId(),
      sppcase: data,
      userId: this.userInfo.userid,
      withWarn: true
    };
    this.generalService.addBanAn(inputItem).subscribe(res => {
      this.loadDataFromServer();
      this.notificationService.showNotification(Constant.SUCCESS, 'Thêm mới vụ án thành công');
    }, error => {
      this.notificationService.showNotification(Constant.ERROR, error.error.text);
    });
  }

  closeModalUpdate(data) {
    this.isVisibleAdd = false;
  }

  onRowSelect(item) {
    this.selectedItem = item;
    for (const child of this.datas) {
      child.selected = false;
    }
    item.selected = true;
  }

  getRowIndex = (index, pageIndex, pageSize) => index + 1 + pageSize * (pageIndex - 1);

  updateCheckedSet(id: number, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  }

  onItemChecked(id: number, checked: boolean): void {
    this.updateCheckedSet(id, checked);
  }

  onAllChecked(checked: boolean): void {
    this.datas.forEach(({CASECODE}) => this.updateCheckedSet(CASECODE, checked));
  }

  testChange() {
    console.log(this.filterItem);
  }

  logout() {
    this.cookieService.deleteAll();
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  doDelete() {
    console.log(this.selectedItem);
    this.generalService.deleteSppCase(this.selectedItem.CASECODE).subscribe(res => {
      this.notificationService.showNotification(Constant.SUCCESS, 'Xóa vụ án thành công');
      this.loadDataFromServer();
    }, error => {
      this.notificationService.showNotification(Constant.ERROR, error.error.text);
    });
  }

  onValueDate($obj,$item,$event){
    this.filterItem[$obj][$item] = this.datechangeService.onDateValueChange($event);
  } 
  
  validateOnlyNumbers(event: KeyboardEvent): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    return !(charCode > 31 && (charCode < 48 || charCode > 57));
  }

  async showDetailPDF() {
    this.isSpinning = true;
    this.isVisible = true;
    const payload = {
      casecode : this.selectedItem.CASECODE,
      regicode : `SPP${this.sppid}`
    }
    this.generalService.exportPDF(payload)
    .toPromise()
    .then(resJson => {
      if (resJson.responseCode === '0000') {
        this.isSpinning = false;
        const base64Pdf = 'data:application/pdf;base64,' + resJson.responseData;
        this.innerHtml = this.sanitizer.bypassSecurityTrustHtml(
          `<object data="${base64Pdf}" type="application/pdf" class="w-100" height="500">Không đọc được file pdf</object>`);
      }
    }).catch(err => this.innerHtml = err.error.text);
  }
   
  handleCancel=()=>this.isVisible = false;
}
