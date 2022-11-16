import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NzTableQueryParams} from 'ng-zorro-antd/table';
import {ComponentMode, Constant} from '../../../../shared/constants/constant.class';
import {NotificationService} from '../../../../service/notification.service';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, Validators} from '@angular/forms';
import {AppConfigService} from '../../../../../app-config.service';
import {GeneralService} from '../../../../service/general-service';
import {ApParamService} from '../../../../service/apparam.service';
import {NzModalRef, NzModalService} from 'ng-zorro-antd/modal';
import {ReviewCaseService} from '../../../../service/review-case.service';
import {ConstantService} from '../../../../service/constant.service';
import {ReviewCaseCreateComponent} from '../review-case-create/review-case-create.component';
import {ReviewCaseModel} from '../model/review-case-model';
import {PageResponse} from '../../../../common/model/base.model';
import {CustomDateParserFormatter, DateService} from '../../../../common/util/date.service';
import {CookieService} from 'ngx-cookie-service';
import {DateChangeService} from "../../../../service/date-change.service";
import * as moment from "moment";

@Component({
  selector: 'app-review-case-search',
  templateUrl: './review-case-search.component.html',
  styleUrls: ['./review-case-search.component.scss']
})
export class ReviewCaseSearchComponent implements OnInit {

  modeEnum = ComponentMode;
  @ViewChild('confirm') confirmTemplate: TemplateRef<any>;
  @ViewChild('confirmHeader') confirmHeaderTemplate: TemplateRef<any>;
  @ViewChild('reviewCaseCreate') reviewCaseCreate: ReviewCaseCreateComponent;
  isCollapse = true;
  loading: boolean;
  userInfo: any;
  controlArray: Array<{ index: number; show: boolean }> = [];
  searchModel = {
    caseCode: '',
    caseName: '',
    firstAccusedName: '',
    fromBeginIndate: null,
    toBeginIndate: null
  };
  pageResponse: PageResponse;
  pageSize: any;
  requiredFromDate = false;
  nzParams: NzTableQueryParams;
  dataList: any[];
  isVisibleAdd: boolean;
  isVisibleList: boolean;
  isVisibleUpdate: boolean;
  isVisibleDetail: boolean;
  selectedItem: ReviewCaseModel;
  confirmModalRef: NzModalRef<any>;

  constructor(private notificationService: NotificationService,
              private route: ActivatedRoute,
              private router: Router,
              private fb: FormBuilder,
              private configService: AppConfigService,
              private generalService: GeneralService,
              private reviewCaseService: ReviewCaseService,
              private constantService: ConstantService,
              private apParamService: ApParamService,
              private modalService: NzModalService,
              private customDateParserFormatter: CustomDateParserFormatter,
              private dateService: DateService,
              private datechangeService: DateChangeService,
			  private cookieService: CookieService) {
  }

  ngOnInit(): void {
    if (localStorage.getItem(Constant.USER_INFO) === null
      || localStorage.getItem(Constant.USERID) !== this.cookieService.get(Constant.USERNAME)) {
      localStorage.clear();
      this.router.navigate(['login'], {queryParams: {returnUrl: this.router.routerState.snapshot.url}});
    }
    this.searchModel = {
      caseCode: '',
      caseName: '',
      firstAccusedName: '',
      fromBeginIndate: this.dateService.getFirstDayOfYear(),
      toBeginIndate: this.dateService.getCurrentDate()
    }

    this.pageResponse = {
      pageNumber: 1,
      pageSize: 10
    }

    this.pageSize = this.configService.getConfig().pageSize;
    this.doSearch();
  }

  doSearch() {
    if (!this.validFrom()){
      return;
    }
    this.pageResponse = {
      pageNumber: 1,
      pageSize: 10
    }
    this.getListData(this.pageResponse.pageNumber, this.pageResponse.pageSize, '', '');
  }

  async getListData(page, size, sortField, sortOrder) {
    this.loading = true;
    this.constantService.postRequest(this.constantService.MANAGE_URL + 'case/getList/'
      , {
        sortField : sortField,
        sortOrder : sortOrder,
        caseCode: this.searchModel.caseCode,
        caseName: this.searchModel.caseName,
        firstAccusedName: this.searchModel.firstAccusedName,
        fromBeginIndate: this.dateService.convertDateToStringByPattern(this.searchModel.fromBeginIndate, 'dd/MM/yyyy'),
        toBeginIndate: this.dateService.convertDateToStringByPattern(this.searchModel.toBeginIndate, 'dd/MM/yyyy'),
        page: page - 1,
        size: size
      }).toPromise()
      .then(res => res.json())
      .then(resJson => {
        if (resJson.responseCode === '0000') {
          this.pageResponse = {
            pageNumber: page,
            pageSize: size,
            totalPages: resJson.responseData.totalPages,
            totalElements: resJson.responseData.totalElements,
            data: resJson.responseData.content
          };
          this.dataList = resJson.responseData.content;
        } else {
          this.dataList = new Array();
        }
      })
      .catch(err => {
        this.notificationService.showNotification(Constant.ERROR, 'Hệ thống không có phản hồi.' + err);
      });
    this.loading = false;
  }

  validFrom() {
    let valid = true;
    if (!this.searchModel.fromBeginIndate || !this.searchModel.toBeginIndate) {
      this.notificationService.showNotification(Constant.ERROR, 'Quyết định khởi tố từ ngày - đến ngày buộc phải nhập');
      valid = false;
    }
    return valid;
  }

  toggleCollapse(): void {
    this.isCollapse = !this.isCollapse;
    this.controlArray.forEach((c, index) => {
      c.show = this.isCollapse ? index < 6 : true;
    });
  }

  getRowIndex = (index, pageIndex, pageSize) => index + 1 + pageSize * (pageIndex - 1);

  showModalAdd() {
    this.isVisibleAdd = true;
  }

  closeModalAdd(status) {
    if (status === 'save') {
      this.dataList.forEach(e => {
        e.checked = false
      });
      this.selectedItem = null;
      this.doSearch();
    }
    this.isVisibleAdd = false;
  }

  showModalList() {
    this.isVisibleList = true;
  }

  closeModalList(status) {
    if (status === 'close') {
      this.dataList.forEach(e => {
        e.checked = false
      });
      this.selectedItem = null;
      this.doSearch();
    }
    this.isVisibleList = false;
  }

  showModalUpdate() {
    if (!this.validSelected()) {
      return;
    }
    this.isVisibleUpdate = true;
  }

  closeModalUpdate(status) {
    if (status === 'save') {
      this.dataList.forEach(e => {
        e.checked = false
      });
      this.selectedItem = null;
      this.doSearch();
    }
    this.isVisibleUpdate = false;
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

  validSelected() {
    if (!this.selectedItem) {
      this.notificationService.showNotification(Constant.ERROR, 'Chưa chọn bản ghi nào');
      return false;
    }
    return true;
  }

  onDelete() {
    if (!this.validSelected()) {
      return;
    }
    this.showConfirmDelete();
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

  deleteData(): any {
    // this.selectedItem.updateUser = this.userInfo.userid;
    // this.reviewCaseService.deleteDenouncement(this.selectedItem).subscribe(res => {
    //   this.notificationService.showNotification(Constant.SUCCESS, 'Xóa thành công');
    //   this.datas.forEach(e => {
    //     e.checked = false
    //   });
    //   this.selectedItem = null;
    //   this.doSearch();
    // }, error => {
    //   console.error(error);
    //   this.notificationService.showNotification(Constant.ERROR, error?.error?.message || 'Xóa thất bại');
    // });

  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    this.nzParams = params;
    const {pageSize, pageIndex, sort, filter} = params;
    const currentSort = sort.find(item => item.value !== null);
    const sortField = (currentSort && currentSort.key) || null;
    const sortOrder = (currentSort && currentSort.value) || null;
    this.getListData(params.pageIndex, params.pageSize, sortField, sortOrder);
  }

  onItemChecked(item: any, checked: boolean): void {
    this.dataList.forEach(e => {
      e.checked = false
    });
    item.checked = checked;
    if (checked) {
      this.selectedItem = item;
    } else {
      this.selectedItem = null;
    }
    if (this.selectedItem) {
      this.constantService.postRequest(this.constantService.SOTHULY_URL + 'reviewCase/findReviewCaseByCaseCode/'
        , {
          caseCode: this.selectedItem.caseCode
        }).toPromise()
        .then(res => res.json())
        .then(resJson => {
          if (resJson.responseCode === '0000') {
            if (resJson.responseData) {
              this.selectedItem.isReviewed = true;
              this.selectedItem.reviewCaseAccusedList = resJson.responseData.reviewCaseAccusedList;
              this.selectedItem.reviewCaseRequestList = resJson.responseData.reviewCaseRequestList;
              this.selectedItem.conclusionNumber = resJson.responseData.conclusionNumber;
              this.selectedItem.conclusionDate = resJson.responseData.conclusionDate;
              this.selectedItem.conclusionId = resJson.responseData.conclusionId;
              this.selectedItem.note = resJson.responseData.note;
              this.selectedItem.id = resJson.responseData.id;
              this.convertDate(this.selectedItem);
            }
          }
          this.loading = false;
        })
        .catch(err => {
          this.notificationService.showNotification(Constant.ERROR, 'Hệ thống không có phản hồi.' + err);
        });
    }
  }

  convertDate(data: ReviewCaseModel) {
    if (data.dConclusionDate) {
      data.conclusionDate = this.dateService.dateToString(data.dConclusionDate, this.dateService.VN_DATE_FORMAT);
    }
    if (data.reviewCaseAccusedList && data.reviewCaseAccusedList.length > 0) {
      for (const r of data.reviewCaseAccusedList) {
        if (r.dJudgmentDate) {
          r.judgmentDate = this.dateService.dateToString(r.dJudgmentDate, this.dateService.VN_DATE_FORMAT);
        } else if (r.judgmentDate) {
          r.dJudgmentDate = this.dateService.stringToDate(r.judgmentDate, this.dateService.VN_DATE_FORMAT);
        }
      }
    }
    if (data.reviewCaseRequestList && data.reviewCaseRequestList.length > 0) {
      for (const r of data.reviewCaseRequestList) {
        if (r.dRequestDate) {
          r.requestDate = this.dateService.dateToString(r.dRequestDate, this.dateService.VN_DATE_FORMAT);
        } else if (r.requestDate) {
          r.dRequestDate = this.dateService.stringToDate(r.requestDate, this.dateService.VN_DATE_FORMAT);
        }
      }
    }
  }

  onRowSelect(item) {
    this.selectedItem = item;
    this.onItemChecked(item,true);
  }

  onValueFromBeginIndate(event: any){
    this.searchModel.fromBeginIndate = this.datechangeService.onDateValueChange(event);
  }

  onValueToBeginIndate(event: any){
    this.searchModel.toBeginIndate = this.datechangeService.onDateValueChange(event);
  }

  validateOnlyNumbers(event: KeyboardEvent): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    return !(charCode > 31 && (charCode < 48 || charCode > 57));
  }

  onDateValueChange(event: any): any {
    const value = event.target.value;
    if ((value.includes('/') && value.length >= 10) || (!value.includes('/') && value.length >= 8)) {
      if (!value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/) && (value.includes('/') && value.length >= 10)) {
        this.notificationService.showNotification(Constant.ERROR, `Sai định dạng ngày tháng ${Constant.DATE_FMT}.`);
        return;
      }
      const date: Date = this.stringToDateWithFormat(value, 'DDMMYYYY');
      if (isNaN(date.getTime())) {
        this.notificationService.showNotification(Constant.ERROR, 'Ngày tháng không hợp lệ.');
        return;
      } else {
        return date;
      }
    }
  }

  stringToDateWithFormat(inputString: string, format: string): Date {
    return moment(inputString, format).toDate();
  }
}
