import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NzTableQueryParams} from 'ng-zorro-antd/table';
import {AppConfigService} from '../../../../../app-config.service';
import {TableSelectionAbstract} from '../../../../shared/component/table/table-selection.abstract';
import {ArrestDetentionInfoModel} from '../../../../model/arrest-detention-info.model';
import {ComponentMode, Constant} from '../../../../shared/constants/constant.class';
import {NotificationService} from '../../../../service/notification.service';
import {NzModalRef, NzModalService} from 'ng-zorro-antd/modal';
import {ConstantService} from '../../../../service/constant.service';
import {DateService} from '../../../../common/util/date.service';
import {PageResponse} from '../../../../common/model/base.model';
import {WebUtilities} from '../../../../shared/utils/qla-utils.class';
import * as moment from 'moment';
import {Router} from '@angular/router';
import {CookieService} from 'ngx-cookie-service';

@Component({
  selector: 'app-arrest-detention-search',
  templateUrl: './arrest-detention-search.component.html',
  styleUrls: ['./arrest-detention-search.component.scss']
})
export class ArrestDetentionSearchComponent extends TableSelectionAbstract implements OnInit {
  @ViewChild('confirm') confirmTemplate: TemplateRef<any>;
  @ViewChild('confirmHeader') confirmHeaderTemplate: TemplateRef<any>;
  confirmModalRef: NzModalRef<any>;
  controlArray: Array<{ index: number; show: boolean }> = [];
  isCollapse = true;
  loading: boolean;
  datas: any[] = [];
  pageSize: any;
  selectedItem: ArrestDetentionInfoModel;
  isVisibleAdd: boolean;
  isVisibleUpdate: boolean;
  isVisibleDetail: boolean;
  requiredFromDate = false;
  userInfo: any;
  username: string;
  sppId: string;
  modeEnum = ComponentMode;
  pageResponse: PageResponse;
  nzParams: NzTableQueryParams;
  filterItem = {
    dataRequest: {
      fromDate: null,
      toDate: null,
      sppId: '',
      arresteeName: '',
      codeDetention: null,
      decisionNumber: ''
    }
  };

  isBtnUpd : boolean;
  isBtnDetail : boolean;
  isBtnDelete : boolean;

  constructor(
    private router: Router,
    private configService: AppConfigService,
    private notificationService: NotificationService,
    private modalService: NzModalService,
    private constantService: ConstantService,
    private dateService: DateService,
    private cookieService: CookieService
  ) {
    super('id');
  }

  ngOnInit(): void {
    if (localStorage.getItem(Constant.USER_INFO) === null
      || localStorage.getItem(Constant.USERID) !== this.cookieService.get(Constant.USERNAME)) {
      localStorage.clear();
      this.router.navigate(['login'], {queryParams: {returnUrl: this.router.routerState.snapshot.url}});
    }
    this.userInfo = JSON.parse(localStorage.getItem(Constant.USER_INFO));
    this.username = this.userInfo.userid;
    this.sppId = this.userInfo.sppid;
    this.pageSize = this.configService.getConfig().pageSize;
    this.loading = false;
    this.pageResponse = {
      pageNumber: 1,
      pageSize: 20
    }
    this.doSearch()
  }

  toggleCollapse(): void {
    this.isCollapse = !this.isCollapse;
    this.controlArray.forEach((c, index) => {
      c.show = this.isCollapse ? index < 6 : true;
    });
  }

  onItemChecked(item: any, checked: boolean): void {
    this.datas.forEach(e => {
      e.checked = false
    });
    item.checked = checked;
    if (checked) {
      this.selectedItem = item;
      this.checkSecurity();
    } else {
      this.selectedItem = null;
      this.setIsBtn(true);
    }
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    this.nzParams = params;
    const {pageSize, pageIndex, sort, filter} = params;
    const currentSort = sort.find(item => item.value !== null);
    const sortField = (currentSort && currentSort.key) || null;
    const sortOrder = (currentSort && currentSort.value) || null;
    this.getListData(params.pageIndex, params.pageSize, sortOrder);
  }

  doSearch() {
    this.selectedItem = null;
    if (this.validFrom()) {
      return;
    }
    if (isNaN(this.filterItem.dataRequest.codeDetention)) {
      this.notificationService.showNotification(Constant.ERROR, 'Mã không phải là số');
      return;
    }
    this.getListData(1, 20, '');
  }

  getListData(page, size, sort) {
    this.setIsBtn(true);
    this.loading = true;
    this.filterItem.dataRequest.sppId = this.userInfo.sppid
    let ifromDate = '';
    if (this.filterItem.dataRequest.fromDate) {
      ifromDate = this.dateService.convertDateToStringByPattern(this.filterItem.dataRequest.fromDate, 'dd/MM/yyyy');
    }
    let itoDate = '';
    if (this.filterItem.dataRequest.toDate) {
      itoDate = this.dateService.convertDateToStringByPattern(this.filterItem.dataRequest.toDate, 'dd/MM/yyyy');
    }
    this.constantService.postRequest(this.constantService.SOTHULY_URL + 'arrest-detention/search'
      , {
        pageNumber: page,
        pageSize: size,
        dataRequest: {
          sppId: WebUtilities.getLoggedSppId(),
          fromDate: ifromDate,
          toDate: itoDate,
          arresteeName: this.filterItem.dataRequest.arresteeName,
          codeDetention: this.filterItem.dataRequest.codeDetention,
          decisionNumber: this.filterItem.dataRequest.decisionNumber,
        }
      }).toPromise()
      .then(res => res.json())
      .then(resJson => {
        if (resJson.responseCode === '0000') {
          if (resJson.responseData) {
            this.pageResponse = resJson.responseData;
            this.datas = resJson.responseData.data;
          } else this.datas = [];
        } else {
          // tslint:disable-next-line:max-line-length
          this.datas = [];
          // this.notificationService.showNotification(Constant.ERROR, resJson.responseCode + ' - ' + resJson.responseMessage);
        }
        this.loading = false;
      })
      .catch(err => {
        this.notificationService.showNotification(Constant.ERROR, 'Hệ thống không có phản hồi.' + err);
      });
  }

  showModalAdd() {
    this.isVisibleAdd = true;
  }

  showModalUpdate() {
    if (!this.validSelected()) {
      return;
    }
    this.isVisibleUpdate = true;
  }

  closeModalUpdate(status) {
    if (status === 'save') {
      this.datas.forEach(e => {
        e.checked = false
      });
      this.selectedItem = null;
      this.doSearch();
    }
    this.isVisibleUpdate = false;
  }

  onDelete() {
    if (!this.validSelected()) {
      return;
    }
    this.showConfirmDelete();
  }

  showModalDetail() {
    if (!this.validSelected()) {
      return;
    }
    this.isVisibleDetail = true;
  }

  closeModalDetail() {
    this.isVisibleDetail = false;
  }

  closeModalAdd(status) {
    if (status === 'save') {
      if (this.datas)
        this.datas.forEach(e => {
          e.checked = false
        });
      this.selectedItem = null;
      this.doSearch();
    }
    this.isVisibleAdd = false;
  }

  validFrom() {
    this.requiredFromDate = false;
    this.requiredFromDate = false;
    if (this.filterItem.dataRequest.fromDate != null &&
      this.filterItem.dataRequest.toDate != null &&
      this.filterItem.dataRequest.fromDate !== '' && this.filterItem.dataRequest.toDate !== '') {
      if (WebUtilities.calculateDiff(this.filterItem.dataRequest.fromDate, this.filterItem.dataRequest.toDate) > 0) {
        this.requiredFromDate = true;
      }
    }
    return this.requiredFromDate;
  }

  validSelected() {
    if (!this.selectedItem) {
      this.notificationService.showNotification(Constant.ERROR, 'Chưa chọn bản ghi nào');
      return false;
    }
    return true;
  }

  deleteData() {
    this.selectedItem.updatedBy = this.userInfo.userid;
    const sppId = this.userInfo.userid
    this.constantService.postRequest(this.constantService.SOTHULY_URL + `arrest-detention/deleteArrestDetentionInfo?sppId=${sppId}`
      , this.selectedItem)
      .toPromise()
      .then(res => res.json())
      .then(resJson => {
        if (resJson.responseCode === '0000') {
          this.notificationService.showNotification(Constant.SUCCESS, 'Xóa thành công');
          this.datas.forEach(e => {
            e.checked = false
          });
          this.selectedItem = null;
          this.doSearch();
        } else {
          this.notificationService.showNotification(Constant.ERROR, 'Xóa thất bại');
        }
      })
      .catch(err => {
        this.notificationService.showNotification(Constant.ERROR, 'Hệ thống không có phản hồi. ffff' + err);
      });

  };

  showConfirmDelete(): void {
    this.confirmModalRef = this.modalService.create({
      nzTitle: this.confirmHeaderTemplate,
      nzContent: this.confirmTemplate,
      nzClosable: false,
      nzAutofocus: null,
      nzFooter: [
        {
          label: 'Có', onClick: () => {
            this.deleteData();
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

  stringToDateWithFormat(inputString: string, format: string): Date {
    return moment(inputString, format).toDate();
  }

  onFromDateValueChange(event: any): void {
    const value = event.target.value;
    if ((value.includes('/') && value.length >= 10) || (!value.includes('/') && value.length >= 8)) {
      if (!value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/) && (value.includes('/') && value.length >= 10)) {
        this.notificationService.showNotification(Constant.ERROR, 'Sai định dạng ngày tháng dd/MM/yyyy.');
        this.filterItem.dataRequest.fromDate = null;
        return;
      }
      const date: Date = this.stringToDateWithFormat(value, 'DDMMYYYY');
      if (isNaN(date.getTime())) {
        this.notificationService.showNotification(Constant.ERROR, 'Ngày tháng không hợp lệ.');
        this.filterItem.dataRequest.fromDate = null;
        return;
      } else {
        this.filterItem.dataRequest.fromDate = date;
      }
    }
  }

  onToDateValueChange(event: any): void {
    const value = event.target.value;
    if ((value.includes('/') && value.length >= 10) || (!value.includes('/') && value.length >= 8)) {
      if (!value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/) && (value.includes('/') && value.length >= 10)) {
        this.notificationService.showNotification(Constant.ERROR, 'Sai định dạng ngày tháng dd/MM/yyyy.');
        this.filterItem.dataRequest.toDate = null;
        return;
      }
      const date: Date = this.stringToDateWithFormat(value, 'DDMMYYYY');
      if (isNaN(date.getTime())) {
        this.notificationService.showNotification(Constant.ERROR, 'Ngày tháng không hợp lệ.');
        this.filterItem.dataRequest.toDate = null;
        return;
      } else {
        this.filterItem.dataRequest.toDate = date;
      }
    }
  }

  numberOnly(event: KeyboardEvent): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    return !(charCode > 31 && (charCode < 48 || charCode > 57));
  }

  onRowSelect(item) {
    this.selectedItem = item;
    this.onItemChecked(item,true);
  }

  checkSecurity() {
    if (this.selectedItem) {
      if (this.selectedItem.createUser === localStorage.getItem(Constant.USERID)) {
        this.setIsBtn(false);
        return;
      }

      if (this.selectedItem.shareInfoLevel === 0) {
        this.isBtnUpd = false;
        this.isBtnDetail = false;
        this.isBtnDelete = true;
        return;
      } 

      if (this.selectedItem.shareInfoLevel === 1) {
        this.isBtnUpd = true;
        this.isBtnDelete = true;
        this.isBtnDetail = false;
        return;
      }

      this.setIsBtn(true);
    }
  }

  setIsBtn(value: boolean) {
    this.isBtnUpd = value;
    this.isBtnDelete = value;
    this.isBtnDetail = value;
  }

}
