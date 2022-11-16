import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {NzTableQueryParams} from 'ng-zorro-antd/table';
import {NotificationService} from '../../../../service/notification.service';
import {Constant} from '../../../../shared/constants/constant.class';
import {ResponseBody} from '../../../so-thu-ly/model/response-body';
import {ConstantService} from '../../../../service/constant.service';
import {CookieService} from 'ngx-cookie-service';
import {DateChangeService} from '../../../../service/date-change.service';
import {GeneralService} from '../../../../service/general-service';
import {AppConfigService} from '../../../../../app-config.service';
import {WebUtilities} from '../../../../shared/utils/qla-utils.class';
import {SppService} from '../../../../service/spp-service';
import {NzModalRef, NzModalService} from 'ng-zorro-antd/modal';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

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

  /* INFO ENFORCEMENT */
  actionTHA: any;

  /* VALUE BUTTON */
  valueBtnEdit: string;

  /* DIALOG CONFIRM */
  @ViewChild('confirm') confirmTemplate: TemplateRef<any>;
  @ViewChild('confirmHeader') confirmHeaderTemplate: TemplateRef<any>;
  confirmModalRef: NzModalRef<any>;

  /* DISPLAY BUTTON */
  isBtnEdit: boolean;
  isBtnDetail: boolean;
  isBtnDisEdit: boolean;
  isBtnDisEditN: boolean;
  isBtnDelete: boolean;
  isBtnDisabled: boolean;
  isBtnDisabledUp: boolean;
  isBtnDetailCase: boolean;

  /* DATA SCREEN DETAILS */
  dataDetail: any;

  /* VISIBILITY SCREEN DIALOGS */
  isVisibleDetail: boolean;
  isVisibleDisDetail: boolean;
  isVisibleEditDetail: boolean;

  // EXPORT DETAIL CASE
  innerHtml: SafeHtml | string;
  isVisible: boolean;
  isSpinning: boolean;

  constructor(
    private notificationService: NotificationService,
    private router: Router,
    private constantService: ConstantService,
    private cookieService: CookieService,
    private datechangeService: DateChangeService,
    private generalService: GeneralService,
    private configService: AppConfigService,
    private sppService: SppService,
    private modalService: NzModalService,
    private sanitizer: DomSanitizer
  ) {
    this.sppid = WebUtilities.getLoggedSppId();
    this.resetFilter();
    this.userfor = 'G6';
  }

  toLawOption(l): string {
    return `${l.lawid == null ? '' : 'Điều ' + l.lawid}${l.item == null || l.item === 0 ? '' : (' - Khoản ' + l.item)}${l.point == null ? '' : (' - Điểm ' + l.point)}${l.lawid == null ? '' : ' - ' + l.lawname}`;
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
            this.deleteTHA();
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
    this.valueBtnEdit = 'Nhận ủy thác';
    this.pageSize = this.configService.getConfig().pageSize;
    this.page = 20;
    this.defaultPage = this.configService.getConfig().defaultPage;
    this.pageIndex = 1;
    this.actionTHA = null;
    this.getVienKiemSatByUsername();
    this.loadDataFromServer();
    this.resetButton();
    this.resetVisiable();
    this.resetFilter();
  }

  resetVisiable() {
    this.isVisibleDetail = false;
    this.isVisibleDisDetail = false;
    this.isVisibleEditDetail = false;
  }

  resetFilter(): void {
    this.filterItem = {
      caseCode: '',
      caseName: '',
      regiCode: '',
      sppCentence: null,
      fromDate: '',
      toDate: '',
      accuName: '',
      acceptType: 1,
      executeJudgmentStatus: '1'
    };
  }

  getVienKiemSatByUsername(): void {
    this.constantService.postRequest(this.constantService.MANAGE_URL + 'spp/findByUsername/'
      , {
        username: this.cookieService.get(Constant.USERNAME)
      }).toPromise().then(resJson => resJson.json()).then((resp: ResponseBody) => {
        if (resp.responseCode === '0000') {
          this.lstSpp = resp.responseData;
        } else {
          this.notificationService.showNotification(Constant.ERROR, resp.responseMessage);
        }
      }, err => {
        this.notificationService.showNotification(Constant.ERROR, 'Hệ thống không có phản hồi.' + err);
      });
  }

  toggleCollapse(): void {
    this.isCollapse = !this.isCollapse;
  }

  checkDate(): void{
    if (this.filterItem.fromDate && this.filterItem.toDate) {
      const fromdate = new Date(this.filterItem.fromDate);
      const todate = new Date(this.filterItem.toDate);
      const count = WebUtilities.calculateDiff(fromdate,todate);
      if (count > 0) {
        this.notificationService.showNotification(Constant.ERROR,'Bản án ra đến ngày phải lớn hơn hoặc bằng Bản án ra từ ngày');
        this.filterItem.toDate = null;
      }
    }
  }

  loadDataFromServer(): void {
    if (this.enabledAutoLoadData) {
      this.loading = true;
      this.convertActionTHA();

      const payload = {...this.filterItem,
        pageSize : this.defaultPage,
        rowIndex : this.defaultPage * (this.pageIndex - 1),
        sppid : this.sppid,
        status : this.actionTHA,
        userfor: this.userfor
      };
      this.generalService.getListUpdateInfoG6(payload).subscribe(res => {
        this.loading = false;
        if (res) {
          this.datas = res;
          if (res.length > 0)
            this.total = res[0].ROWCOUNT;
          else
            this.total = 0;
        }

      }, () => {
        this.loading = false;
      });
    }
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    const { pageSize, pageIndex, sort, filter } = params;
    this.pageIndex = params.pageIndex;
    this.defaultPage = params.pageSize;
    this.loadDataFromServer();
  }

  doSearch(): void {
    if(!this.filterItem.caseCode && !this.filterItem.caseName && !this.filterItem.accuName) {
      this.notificationService.showNotification(Constant.ERROR, 'Bạn phải nhập dữ liệu tìm kiếm vào 1 trong các trường Mã vụ án hoặc Tên vụ án hoặc Người chấp hành án')
      this.enabledAutoLoadData = false;
    }else{
    this.enabledAutoLoadData = true
    this.pageIndex = 1;

    this.loadDataFromServer();}
  }

  showEditForm(): void {
    this.sppService.setCurrentSppRegister(WebUtilities.toLowercaseFieldsWithoutConvertBoolean(this.selectedItem));
    this.router.navigate(['/admin/thi-hanh-an/update/', this.selectedItem.CASECODE]);
  }

  onRowSelect(item: any): void {
    this.selectedItem = item;
    this.valueBtnEdit = this.selectedItem.RESULTTHA === 'N' ? 'Sửa từ chối' : 'Nhận ủy thác';
    this.convertActionTHA();
    this.resetButton();
    this.resetVisiable();
    this.toggleButtons();
  }

  getRowIndex(index, pageIndex, pageSize): number {
    return index + 1 + pageSize * (pageIndex - 1);
  }

  showViewOnly(){
    this.isVisibleDisDetail = true;
    this.showDetails();
  }

  showDetails($event?) : void{
    this.isVisibleDetail = true;
    // this.isVisibleEditDetail = $event ? true : false;
    this.dataDetail = this.convertDataTHA(this.selectedItem);
    this.dataDetail.accuname = this.selectedItem.FULLNAME;
    if ($event) {
      this.isVisibleEditDetail = true;
      this.fDateUT();
    } else {
      this.isVisibleEditDetail = false;
      this.fDataTL();
    }
  }

  fDataTL(): void {
    this.dataDetail.sppidf = this.sppid;
    this.dataDetail.result = 'C';
    if (this.selectedItem.RESULTTHA && this.selectedItem.RESULTTHA === 'N') {
      this.dataDetail.action = 'I';
      this.dataDetail.acceptreject = this.selectedItem.ACCEPTDATETHA;
      this.dataDetail.acceptdate = null;
    } else {
      this.dataDetail.action = this.selectedItem.TRANSCODETHA ? 'U' : 'I';
    }
  }

  fDateUT(): void {
    if (this.selectedItem.TRANSCODETHA && this.selectedItem.ACCEPTDATETHA) {
      if (this.selectedItem.RESULTTHA && this.selectedItem.RESULTTHA === 'Y') {
        this.dataDetail.action = 'UN';
        this.dataDetail.ckresult = this.selectedItem.REGICODEDTL ? true : false;
      } else {
        this.dataDetail.action = 'NA';
        this.dataDetail.ckresult = false;
      }
    } else {
      this.dataDetail.result = 'Y';
      this.dataDetail.action = 'NA';
      if (this.selectedItem.ACCEPTDATETHA && this.selectedItem.RECEIPTERTHA) {
        this.dataDetail.ckresult = true;
      } else {
        this.dataDetail.ckresult = false;
      }
    }
  }

  convertDataTHA(data): any {
    return Object.keys(data).reduce((c, k) => (c[this.convertCutTHA(k)] = data[k], c), {});
  }

  convertCutTHA(item: string): string {
    if (item) {
      const len = item.length;
      return item.substr(len -3 ,len) === 'THA' ? item.substr(0,len - 3).toLowerCase() : item.toLowerCase();
    }
  }

  currentPageDataChange = ($event: any[]) => null;

  onValueDate($item, $event): void{
    this.filterItem[$item] = this.datechangeService.onDateValueChange($event);
  }

  validateOnlyNumbers(event: KeyboardEvent): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    return !(charCode > 31 && (charCode < 48 || charCode > 57));
  }

  resetDatas(): any {
    this.datas = [];
    this.resetButton();
    this.convertActionTHA();
  }

  toggleButtons(): void {
    if (this.actionTHA === 'DTL' && this.selectedItem.RESULTTHA && this.selectedItem.RESULTTHA === 'Y') {
      this.isBtnEdit = true;
    } else {
      this.isBtnEdit = false;
    }

    // Chi tiết ủy thác
    if (this.actionTHA === 'DTL' && this.selectedItem.RESULTTHA  && this.selectedItem.RESULTTHA === 'Y') {
      this.isBtnDetail = false;
    } else if (this.actionTHA === 'DNUT' && this.selectedItem.RESULTTHA ) {
      this.isBtnDetail = false;
    }

    // Nhận ủy thác
    if (this.actionTHA === 'CNUT' && this.selectedItem.RESULTTHA ) {
      this.isBtnDisEditN = false;
    }

    // Sửa Nhận ủy thác
    if (!(this.actionTHA === 'CNUT' && this.selectedItem.RESULTTHA  && this.selectedItem.RESULTTHA === 'N')) {
      this.isBtnDisEdit = false;
    }
    if (this.actionTHA !== 'DNUT' && !this.selectedItem.REGICODEDTL
      && !this.selectedItem.RESULTDC) {
      this.isBtnDisEdit = false;
    }

    // Xóa ủy thác - Xóa Từ chối - Xóa nhận ủy thác
    if (this.actionTHA === 'DTL' && this.selectedItem.TRANSCODETHA  && this.selectedItem.RESULTTHA  &&
      this.selectedItem.RESULTTHA === 'C') {
      this.isBtnDelete = false;
    } else if (this.actionTHA === 'CNUT' && this.selectedItem.RESULTTHA  && this.selectedItem.RESULTTHA === 'N') {
      this.isBtnDelete = false;
    } else if (this.actionTHA === 'DNUT' && !this.selectedItem.REGICODEDTL) {
      this.isBtnDelete = false;
    }

    // Chi tiết vụ án
    if (this.actionTHA === 'DTL' && this.selectedItem.REGICODE  && this.selectedItem.DECIIDTHA  &&
      this.selectedItem.DECIIDTHA === '8719' && !(this.selectedItem.RESULTTHA  && this.selectedItem.RESULTTHA === 'Y')) {
      this.isBtnDisabled = false;
    }

    // Ủy thác - Cập nhật thông tin
    if (this.actionTHA === 'CTL' || this.actionTHA === 'DTL') {
      this.isBtnDisabledUp = false;
    } else {
      this.isBtnDisabledUp = true;
    }

    // Chi tiết vụ án -- được có khi chọn row bất kỳ
    this.isBtnDetailCase = false;
  }

  resetButton(): void{
    this.isBtnEdit = true;
    this.isBtnDetail = true;
    this.isBtnDisEdit = true;
    this.isBtnDisEditN = true;
    this.isBtnDelete = true;
    this.isBtnDisabled = true;
    this.isBtnDisabledUp = true;
    this.isBtnDetailCase = true;
  }

  convertActionTHA(): string {
  if (this.filterItem.acceptType === 1) {
      return this.actionTHA = this.filterItem.executeJudgmentStatus === '1' ? 'CTL' : 'DTL';
    } else {
      return this.actionTHA = this.filterItem.executeJudgmentStatus === '1' ? 'CNUT' : 'DNUT';
    }
  }

  isValidGridView(): boolean {
    if (this.actionTHA === 'CNUT') {
      return true;
    } else if (this.actionTHA === 'DTL') {
      return true;
    }
    return false;
  }

  closeModalDetail($event): void {
    this.resetVisiable();
    this.resetButton();
    this.dataDetail = {};
    this.selectedItem = {};
    this.doSearch();
  }

  fStatus(status: string): string {
    if (this.actionTHA !== 'CNUT') {
      return status === 'C' ? 'Đã chuyển ủy thác'
      : status === 'Y' ? 'Đã nhận ủy thác'
      : status === 'N' ? 'Bị từ chối' : '';
    } else {
      return status === 'C' ? 'Chưa nhận ủy thác'
      : status === 'N' ? 'Đã từ chối ủy thác'
      : status === 'Y' ? 'Đã nhận ủy thác' : '';
    }
  }

  deleteTHA(): void {
    let action = null;
    if (this.actionTHA === 'CNUT' && this.selectedItem.RESULTTHA === 'N') {
      action = 'U';
    } else if (this.actionTHA === 'DNUT' && this.selectedItem.RESULTTHA === 'Y') {
      action = 'U';
    } else {
      action = 'D';
    }
    const payload = {
      action,
      transcode: this.selectedItem.TRANSCODETHA,
      casecode: this.selectedItem.CASECODE,
      accucode: this.selectedItem.ACCUCODE,
      regicode: this.selectedItem.REGICODE
    }
    this.generalService.deleteEnforcement(payload).subscribe(res => {
      if (res) {
        this.notificationService.showNotification(Constant.ERROR,res);
      } else {
        this.notificationService.showNotification(Constant.SUCCESS, 'Xóa dữ liệu thành công');
        this.doSearch();
        this.resetButton();
      }
    }, err => this.notificationService.showNotification(Constant.ERROR,err.error.text))
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
