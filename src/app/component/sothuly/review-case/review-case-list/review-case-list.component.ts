import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {ComponentMode, Constant} from '../../../../shared/constants/constant.class';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ApParamService} from '../../../../service/apparam.service';
import {NzModalRef, NzModalService} from 'ng-zorro-antd/modal';
import {ConstantService} from '../../../../service/constant.service';
import {ReviewCaseAccusedModel, ReviewCaseModel} from '../model/review-case-model';
import {CategoriesService} from '../../../../service/categories.service';
import {DatePipe} from '@angular/common';
import {DenouncementService} from '../../../../service/denouncement.service';
import {LoaderService} from '../../../../service/loader.service';
import {PageResponse} from '../../../../common/model/base.model';
import {DateService} from '../../../../common/util/date.service';
import {NotificationService} from '../../../../service/notification.service';
import {NzTableQueryParams} from 'ng-zorro-antd/table';
import {AppConfigService} from '../../../../../app-config.service';

@Component({
  selector: 'app-review-case-list',
  templateUrl: './review-case-list.component.html',
  styleUrls: ['./review-case-list.component.scss']
})
export class ReviewCaseListComponent implements OnInit, OnChanges {
  modeEnum = ComponentMode;
  @Input() isVisibleList: boolean;
  @Output() closeModal: EventEmitter<string> = new EventEmitter();
  confirmModalRef: NzModalRef<any>;
  formReviewCase: FormGroup;
  isCollapse = true;
  controlArray: Array<{ index: number; show: boolean }> = [];
  searchModel = {
    caseCode: '',
    caseName: '',
    accusedCode: '',
    accusedName: '',
    judgmentNum: '',
    fromDate: '',
    toDate: ''
  };
  pageResponse: PageResponse;
  pageSize: any;
  dataList: any[];
  isVisibleDetail: boolean;
  police: any;
  requiredFromDate = false;
  selectedItem: ReviewCaseModel;
  nzParams: NzTableQueryParams;
  procurators = [];
  arrCollapse = [];
  accesses = Constant.ACCESSES;
  isSpinning: boolean;
  fullAccusedList: ReviewCaseAccusedModel[];
  loading: boolean;
  disabledEndDate = (dateValue: Date): boolean => {
    if (!dateValue) {
      return false;
    }
    const maxDate = new Date(2100, 1, 1).getTime();
    const minDate = new Date(1900, 1, 1).getTime();
    return (maxDate < dateValue.getTime() || minDate >= dateValue.getTime());

  };

  constructor(private notificationService: NotificationService,
              private fb: FormBuilder,
              private categoriesService: CategoriesService,
              private apParamService: ApParamService,
              private datePipe: DatePipe,
              private modalService: NzModalService,
              private configService: AppConfigService,
              private denouncementService: DenouncementService,
              private loaderService: LoaderService,
              private constantService: ConstantService,
              private dateService: DateService
  ) {
  }

  ngOnInit(): void {
    this.searchModel = {
      caseCode: '',
      caseName: '',
      accusedCode: '',
      accusedName: '',
      judgmentNum: '',
      fromDate: '',
      toDate: ''
    }

    this.pageResponse = {
      pageNumber: 1,
      pageSize: 10
    }

    this.pageSize = this.configService.getConfig().pageSize;
    this.createFormControl();
    this.getListData(this.pageResponse.pageNumber, this.pageResponse.pageSize, '', '');
  }

  handleCancel(): void {
    this.closeModal.emit('close');
    this.resetPage();
  }

  createFormControl() {
    this.formReviewCase = this.fb.group({
      id: [null],
      caseCode: [{value: null, disabled: true}],
      caseName: [{value: null, disabled: true}]
    });
  }

  resetPage() {
    this.searchModel = {
      caseCode: '',
      caseName: '',
      accusedCode: '',
      accusedName: '',
      judgmentNum: '',
      fromDate: '',
      toDate: ''
    }
    this.pageResponse = {
      pageNumber: 1,
      pageSize: 10
    }
    this.dataList = new Array();
  }

  toggleCollapse(): void {
    this.isCollapse = !this.isCollapse;
    this.controlArray.forEach((c, index) => {
      c.show = this.isCollapse ? index < 6 : true;
    });
  }

  doSearch() {
    this.validFrom();
    this.pageResponse = {
      pageNumber: 1,
      pageSize: 10
    }
    this.getListData(this.pageResponse.pageNumber, this.pageResponse.pageSize, '', '');
  }

  getListData(page, size, sortField, sortOrder) {
    this.loading = true;
    let fromDate = '';
    if (this.searchModel.fromDate) {
      fromDate = this.dateService.convertDateToStringByPattern(this.searchModel.fromDate, 'dd/MM/yyyy');
    }
    let toDate = '';
    if (this.searchModel.toDate) {
      toDate = this.dateService.convertDateToStringByPattern(this.searchModel.toDate, 'dd/MM/yyyy');
    }
    this.constantService.postRequest(this.constantService.SOTHULY_URL + 'reviewCase/getPageReviewCaseAccused/'
      , {
        pageNumber: page,
        pageSize: size,
        sortField: sortField,
        sortOrder: sortOrder,
        dataRequest: {
          caseCode: this.searchModel.caseCode,
          caseName: this.searchModel.caseName,
          accusedCode: this.searchModel.accusedCode,
          accusedName: this.searchModel.accusedName,
          judgmentNum: this.searchModel.judgmentNum,
          fromDate,
          toDate
        }
      }).toPromise()
      .then(res => res.json())
      .then(resJson => {
        if (resJson.responseCode === '0000') {
          if (resJson.responseData) {
            this.pageResponse = resJson.responseData;
            this.dataList = resJson.responseData.data;
          } else {
            this.dataList = new Array();
          }
        } else {
          this.dataList = new Array();
          // tslint:disable-next-line:max-line-length
        }
        this.loading = false;
      })
      .catch(err => {
        this.notificationService.showNotification(Constant.ERROR, 'Hệ thống không có phản hồi.' + err);
      });
  }

  validFrom() {

  }

  validSelected() {
    if (!this.selectedItem) {
      this.notificationService.showNotification(Constant.ERROR, 'Chưa chọn bản ghi nào');
      return false;
    }
    return true;
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

  ngOnChanges(changes: SimpleChanges): void {
    this.doSearch();
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
      this.loading = true;
      this.constantService.postRequest(this.constantService.SOTHULY_URL + 'reviewCase/detailReviewCaseByAccused/'
        , {
          reviewCaseId: this.selectedItem.reviewCaseId,
          accusedCode: this.selectedItem.accusedCode
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
          } else {
            // tslint:disable-next-line:max-line-length
            this.notificationService.showNotification(Constant.ERROR, resJson.responseCode + ' - ' + resJson.responseMessage);
          }
        })
        .catch(err => {
          this.notificationService.showNotification(Constant.ERROR, 'Hệ thống không có phản hồi.' + err);
        });
      this.loading = false;
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

  cancelDelete() {
  }

  confirmDelete() {
    if (!this.validSelected()) {
      return;
    }
    this.loading = true;
    this.constantService.postRequest(this.constantService.SOTHULY_URL + 'reviewCase/updateReviewCaseAccused/'
      , {
        id: this.selectedItem.reviewCaseAccusedId,
        status: 0
      }).toPromise()
      .then(res => res.json())
      .then(resJson => {
        if (resJson.responseCode === '0000') {
          this.getListData(this.pageResponse.pageNumber, this.pageResponse.pageSize, '', '');
          this.notificationService.showNotification(Constant.ERROR, 'Xóa thành công');
        } else {
          // tslint:disable-next-line:max-line-length
          this.notificationService.showNotification(Constant.ERROR, 'Xóa không thành công');
        }
      })
      .catch(err => {
        this.notificationService.showNotification(Constant.ERROR, 'Hệ thống không có phản hồi.' + err);
      });
    this.loading = false;
  }

}
