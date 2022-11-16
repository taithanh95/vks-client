import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {AbstractControl, FormBuilder} from '@angular/forms';
import {Router} from '@angular/router';
import {NotificationService} from '../../../service/notification.service';
import {ConstantService} from '../../../service/constant.service';
import {ComponentMode, Constant} from '../../../shared/constants/constant.class';
import * as moment from 'moment';
import {NzModalRef, NzModalService} from 'ng-zorro-antd/modal';
import {Compensation} from './model/compensation';
import {DatePipe} from '@angular/common';
import {ResponseBody} from '../../so-thu-ly/model/response-body';
import {PageResponse} from '../../../common/model/base.model';
import {CookieService} from 'ngx-cookie-service';
import {NzTableQueryParams} from "ng-zorro-antd/table";
import {WebUtilities} from "../../../shared/utils/qla-utils.class";

@Component({
  selector: 'app-compensations-management',
  templateUrl: './compensations-management.component.html',
  styleUrls: ['./compensations-management.component.scss']
})
export class CompensationsManagementComponent implements OnInit {
  popupMode: ComponentMode = ComponentMode.CREATE;
  popupModeEnum = ComponentMode;
  isVisible: boolean;
  selectedSpp: any;
  formSearch = this.fb.group({
    id: [''],
    claimantName: [''],
    damagesName: [''],
    resultCode: [''],
    fromDate: [''],
    toDate: ['']
  });
  scroll = null;
  loading = true;
  selectedItem?: Compensation;
  cols = [
    {
      title: 'Chọn',
      sortOrder: null,
      sortFn: null,
      sortDirections: null,
      width: '50px'
    },
    {
      title: 'Mã tiếp nhận',
      sortOrder: null,
      sortFn: null,
      sortDirections: null,
      width: '100px'
    },
    {
      title: 'Ngày tiếp nhận',
      sortOrder: null,
      sortFn: null,
      sortDirections: null,
      width: '100px'
    },
    {
      title: 'Người  yêu cầu',
      sortOrder: null,
      sortFn: null,
      sortDirections: null,
      width: '100px'
    },
    {
      title: 'Người thiệt hại',
      sortOrder: null,
      sortFn: null,
      sortDirections: null,
      width: '180px'
    },
    {
      title: 'Kết quả xử lý',
      sortOrder: null,
      sortFn: null,
      sortDirections: null,
      width: '100px'
    }
  ];
  listOfItem: Compensation[] = [];
  pageResponse: PageResponse = {
    totalElements: 0,
    totalPages: 0,
    pageNumber: 1,
    pageSize: 20
  };
  collapse = true;
  setOfCheckedId = new Set<number>();

  @ViewChild('confirm') confirmTemplate: TemplateRef<any>;
  @ViewChild('confirmHeader') confirmHeaderTemplate: TemplateRef<any>;
  confirmModalRef: NzModalRef<any>;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private notificationService: NotificationService,
    private constantService: ConstantService,
    private modalService: NzModalService,
    private cookieService: CookieService
  ) {
  }

  ngOnInit(): void {
    if (localStorage.getItem(Constant.USER_INFO) === null
      || localStorage.getItem(Constant.USERID) !== this.cookieService.get(Constant.USERNAME)) {
      localStorage.clear();
      this.router.navigate(['login'], {queryParams: {returnUrl: this.router.routerState.snapshot.url}});
    }
    this.selectedSpp = JSON.parse(localStorage.getItem(Constant.SPP));
    this.loadDataFromServer(this.formSearch.value);
  }

  loadDataFromServer(request: Compensation): void {
    this.listOfItem = [];
    this.pageResponse.totalElements = 0;
    this.pageResponse.totalPages = 1;
    this.scroll = null;
    this.loading = true;
    const toDate = new DatePipe('en-US').transform(request.toDate, 'dd/MM/yyyy');
    const fromDate = new DatePipe('en-US').transform(request.fromDate, 'dd/MM/yyyy');

    if (fromDate > toDate) {
      this.notificationService.showNotification(Constant.ERROR, 'Từ ngày phải nhỏ hơn hoặc bằng đến ngày');
      return;
    }

    this.constantService.postRequest(this.constantService.SOTHULY_URL + 'compensation/getPage/', {
      pageNumber: this.pageResponse.pageNumber,
      pageSize: this.pageResponse.pageSize,
      dataRequest: {
        ...request,
        fromDate,
        toDate,
        sppid: WebUtilities.getLoggedSppId(),
      }
    }).toPromise()
      .then(resp => resp.json())
      .then((resp: ResponseBody) => {
        this.loading = false;
        if (resp.responseCode === '0007') {
          // Không tìm thấy dữ liệu thì không làm gì cả
        } else if (resp.responseCode === '0000') {
          this.scroll = {x: '1200px', y: '240px'};
          this.pageResponse = resp.responseData;
          this.listOfItem = resp.responseData.data;
        } else {
          this.notificationService.showNotification(Constant.ERROR, resp.responseMessage);
        }
      }, error => this.notificationService.showNotification(Constant.ERROR, 'Hệ thống không có phản hồi. ' + error.message))
  }

  toggleCollapse(): void {
    this.collapse = !this.collapse;
  }

  onOpenModal(mode: ComponentMode): void {
    this.popupMode = mode;
    this.isVisible = true;
  }

  // onChangePageIndex(pageNumber: number): void {
  //   this.pageResponse.pageNumber = pageNumber;
  // }
  //
  // onChangePageSize(pageSize: number): void {
  //   this.pageResponse.pageSize = pageSize;
  // }

  onSelect(data: Compensation): void {
    this.selectedItem = data;
    this.onItemChecked(data.id, true);
  }

  onItemChecked(id: number, checked: boolean): void {
    this.listOfItem.forEach(item => {
      if (item.id !== id) {
        this.updateCheckedSet(item.id, false)
      } else {
        if (checked) {
          this.selectedItem = item;
        } else {
          this.selectedItem = null;
        }
        this.updateCheckedSet(item.id, checked);
      }
    });
  }

  updateCheckedSet(id: number, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  }

  numberOnly(event: KeyboardEvent): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    return !(charCode > 31 && (charCode < 48 || charCode > 57));
  }

  stringToDateWithFormat(inputString: string, format: string): Date {
    return moment(inputString, format).toDate();
  }

  onFromDateValueChange(event: any): void {
    const value = event.target.value;
    if ((value.includes('/') && value.length >= 10) || (!value.includes('/') && value.length >= 8)) {
      if (!value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/) && (value.includes('/') && value.length >= 10)) {
        this.notificationService.showNotification(Constant.ERROR, 'Sai định dạng ngày tháng dd/MM/yyyy.');
        this.fromDate.setValue(null);
        return;
      }
      const date: Date = this.stringToDateWithFormat(value, 'DDMMYYYY');
      if (isNaN(date.getTime())) {
        this.notificationService.showNotification(Constant.ERROR, 'Ngày tháng không hợp lệ.');
        this.fromDate.setValue(null);
        return;
      } else {
        this.fromDate.setValue(date);
      }
    }
  }

  onToDateValueChange(event: any): void {
    const value = event.target.value;
    if ((value.includes('/') && value.length >= 10) || (!value.includes('/') && value.length >= 8)) {
      if (!value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/) && (value.includes('/') && value.length >= 10)) {
        this.notificationService.showNotification(Constant.ERROR, 'Sai định dạng ngày tháng dd/MM/yyyy.');
        this.toDate.setValue(null);
        return;
      }
      const date: Date = this.stringToDateWithFormat(value, 'DDMMYYYY');
      if (isNaN(date.getTime())) {
        this.notificationService.showNotification(Constant.ERROR, 'Ngày tháng không hợp lệ.');
        this.toDate.setValue(null);
        return;
      } else {
        this.toDate.setValue(date);
      }
    }
  }

  get fromDate(): AbstractControl {
    return this.formSearch.get('fromDate');
  }

  get toDate(): AbstractControl {
    return this.formSearch.get('toDate');
  }

  onConfirmDelete() {
    this.confirmModalRef = this.modalService.create({
      nzTitle: this.confirmHeaderTemplate,
      nzContent: this.confirmTemplate,
      nzClosable: false,
      nzAutofocus: null,
      nzFooter: [
        {
          label: 'Có', onClick: () => {
            this.deleteData();
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

  deleteData(): void {
    this.loading = true;
    this.constantService.postRequest(this.constantService.SOTHULY_URL + 'compensation/delete/',
      {
        id: this.selectedItem.id
      }).toPromise().then(() => {
      this.notificationService.showNotification(Constant.SUCCESS, 'Xóa thành công');
      this.selectedItem = null;
      this.loading = false;
      this.loadDataFromServer(this.formSearch.value);
      this.confirmModalRef.close();
    }).catch(err => {
      this.loading = false;
      this.confirmModalRef.close();
      this.notificationService.showNotification(Constant.ERROR, 'Xóa thất bại: ' + err);
    });
  }

  onCloseModal(event: boolean): void {
    this.isVisible = event;
    this.loadDataFromServer(this.formSearch.value);
  }

  saveOrUpdate(item: any) {
    console.log(item);
    if (this.popupMode === ComponentMode.CREATE) {
      this.notificationService.showNotification(Constant.SUCCESS, 'Chức năng chưa thực hiện');
    } else if (this.popupMode === ComponentMode.UPDATE) {
      this.notificationService.showNotification(Constant.SUCCESS, 'Chức năng chưa thực hiện');
    }
    this.isVisible = false;
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    const {pageSize, pageIndex, sort, filter} = params;
    this.pageResponse.pageNumber = params.pageIndex;
    this.pageResponse.pageSize = params.pageSize;
    this.loadDataFromServer(this.formSearch.value);
  }
}
