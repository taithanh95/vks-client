import {Component, EventEmitter, Input, OnChanges, OnInit, Output, Sanitizer, TemplateRef, ViewChild} from '@angular/core';
import {NzModalRef} from 'ng-zorro-antd/modal';
import {NotificationService} from '../../../../service/notification.service';
import {Router} from '@angular/router';
import {ConstantService} from '../../../../service/constant.service';
import {CookieService} from 'ngx-cookie-service';
import {DateChangeService} from '../../../../service/date-change.service';
import {GeneralService} from '../../../../service/general-service';
import {AppConfigService} from '../../../../../app-config.service';
import {WebUtilities} from '../../../../shared/utils/qla-utils.class';
import {NzTabPosition} from 'ng-zorro-antd/tabs';

@Component({
  selector: 'app-lookup-detail',
  templateUrl: './lookup-detail.component.html',
  styleUrls: ['./lookup-detail.component.scss']
})
export class LookupDetailComponent implements OnInit, OnChanges {
  @Input() data: any;
  @Input() isVisible: boolean;
  @Output() closeModal: EventEmitter<any> = new EventEmitter();
  /* PAGE */
  page: any;
  total: any;
  pageSize: any;
  defaultPage: any;
  pageIndex: any;
  position: NzTabPosition = 'left';

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
  value: any;
  lstUserfor: any[] = [];

  /* Button display*/
  isUpdBtn: boolean;
  isDeleteBtn: boolean;
  isDetailBtn: boolean;
  isBtnUpdDisabled: boolean;
  lst: any;

  /* DIALOG CONFIRM */
  @ViewChild('confirm') confirmTemplate: TemplateRef<any>;
  @ViewChild('confirmHeader') confirmHeaderTemplate: TemplateRef<any>;
  confirmModalRef: NzModalRef<any>;

  constructor(
    private notificationService: NotificationService,
    private router: Router,
    private constantService: ConstantService,
    private cookieService: CookieService,
    private datechangeService: DateChangeService,
    private generalService: GeneralService,
    private configService: AppConfigService,
  ) {
    this.sppid = WebUtilities.getLoggedSppId();
  }

  ngOnInit(): void {
    this.value = {
      CASECODE: '',
      CASENAME: ''
    }
    this.resetPage();
    this.getListUserFor();
  }

  ngOnChanges(): void {
  }

  getListUserFor(): void {
    this.generalService.getListRegister(this.data.CASECODE).subscribe(res => {
      this.lstUserfor = res;
      this.value = res[0];
      this.value.userfor = res.find(item => item.userfor === this.userfor);
    })
  }

  resetPage() {
    this.pageSize = this.configService.getConfig().pageSize;
    this.page = 20;
    this.defaultPage = this.configService.getConfig().defaultPage;
    this.pageIndex = 1;
  }

  onRowSelect(item) {
    this.selectedItem = item;
    this.clearSelection(false);
  }

  resetBtn() {
    this.selectedItem = null;
    this.clearSelection(true);
  }

  clearSelection(opt: boolean) {
    this.isDeleteBtn = opt;
    this.isUpdBtn = opt;
    this.isDetailBtn = opt;
    this.isBtnUpdDisabled = opt;
  }

  getRowIndex = (index, pageIndex, pageSize) => index + 1 + pageSize * (pageIndex - 1)

  onValueTodate(event: any) {
    this.data.todate = this.datechangeService.onDateValueChange(event);
  }

  validateOnlyNumbers(event: KeyboardEvent): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    return !(charCode > 31 && (charCode < 48 || charCode > 57));
  }

  onValueDate(event, item) {
    this.data[item] = this.datechangeService.onDateValueChange(event);
  }

  getListSpp(): void {
    this.generalService.getChildSPPSearch(this.sppid).subscribe(res => {
      this.lstSpp = res;
      this.filterItem.sppid = res.find(item => item.SPPID === this.sppid);
    })
  }

  onInputSpp(e: any): void {
    const value = (e.target as HTMLInputElement).value;
    if (!value || value.indexOf('@') >= 0) {
      this.lstSpp = [];
    } else {
      this.generalService.getChildSPPSearch(value).subscribe(res => {
        this.lstSpp = res;
      });
    }
  }

  handleCancel(): void {
    this.isVisible = false;
    this.closeModal.emit(false);
  }


}
