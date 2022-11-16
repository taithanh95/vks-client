import {Component, OnInit} from '@angular/core';
import {Accused, CCase} from '../../model/so-thu-ly.model';
import {AbstractControl, FormBuilder} from '@angular/forms';
import {Router} from '@angular/router';
import {NotificationService} from '../../../../service/notification.service';
import {ConstantService} from '../../../../service/constant.service';
import {ResponseBody} from '../../model/response-body';
import {Constant} from '../../../../shared/constants/constant.class';
import {DatePipe} from '@angular/common';
import * as moment from 'moment';
import {CookieService} from 'ngx-cookie-service';
import {WebUtilities} from "../../../../shared/utils/qla-utils.class";

@Component({
  selector: 'app-register-decision-case',
  templateUrl: './register-decision-case.component.html',
  styleUrls: ['./register-decision-case.component.scss']
})
export class RegisterDecisionCaseComponent implements OnInit {
  formSearch = this.fb.group({
    caseCode: [''],
    caseName: [''],
    firstAccusedName: [''],
    fromDate: [''],
    toDate: [''],
    beginSetnum: ['']
  });
  scroll = null;
  loading = true;
  selectedItem?: CCase;
  cols = [
    {
      title: 'Chọn',
      sortOrder: null,
      sortFn: null,
      sortDirections: null,
      width: '50px'
    },
    {
      title: 'Mã vụ án',
      sortOrder: null,
      sortFn: (a: CCase, b: CCase) => a.caseCode.localeCompare(b.caseCode),
      sortDirections: ['ascend', 'descend', null],
      width: '100px'
    },
    {
      title: 'Tên vụ án',
      sortOrder: null,
      sortFn: (a: CCase, b: CCase) => a.caseName.localeCompare(b.caseName),
      sortDirections: ['ascend', 'descend', null],
      width: '100px'
    },
    {
      title: 'Bị can đầu vụ',
      sortOrder: null,
      sortFn: null,
      sortDirections: null,
      width: '100px'
    },
    {
      title: 'Điều luật chính',
      sortOrder: null,
      sortFn: (a: CCase, b: CCase) => a.law.lawId.localeCompare(b.law.lawId),
      sortDirections: ['ascend', 'descend', null],
      width: '180px'
    },
    {
      title: 'Quyết định khởi tố số',
      sortOrder: null,
      sortFn: (a: CCase, b: CCase) => a.beginSetnum - b.beginSetnum,
      sortDirections: ['ascend', 'descend', null],
      width: '100px'
    },
    {
      title: 'Ngày quyết định khởi tố',
      sortOrder: null,
      sortFn: (a: CCase, b: CCase) => a.beginIndate.localeCompare(b.beginIndate),
      sortDirections: ['ascend', 'descend', null],
      width: '100px'
    }
  ];
  listOfItem: CCase[] = [];
  totalPages = 1;
  totalElements = 0;
  pageNumber = 1;
  pageSize = 20;
  collapse = true;
  setOfCheckedId = new Set<string>();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private notificationService: NotificationService,
    private constantService: ConstantService,
    private cookieService: CookieService
  ) {
  }

  ngOnInit(): void {
    if (localStorage.getItem(Constant.USER_INFO) === null
      || localStorage.getItem(Constant.USERID) !== this.cookieService.get(Constant.USERNAME)) {
      localStorage.clear();
      this.router.navigate(['login'], {queryParams: {returnUrl: this.router.routerState.snapshot.url}});
    }
    this.loadDataFromServer();
  }

  loadDataFromServer(): void {
    this.listOfItem = [];
    this.totalPages = 0;
    this.totalElements = 0;
    this.scroll = null;
    this.loading = true;
    const toDate = new DatePipe('en-US').transform(this.toDate().value, 'dd/MM/yyyy');
    const fromDate = new DatePipe('en-US').transform(this.fromDate().value, 'dd/MM/yyyy');

    this.constantService.postRequest(this.constantService.MANAGE_URL + 'case/getListVuAnChuaKetThucThuLy/', {
      caseCode: this.formSearch.get('caseCode').value,
      caseName: this.formSearch.get('caseName').value,
      firstAccusedName: this.formSearch.get('firstAccusedName').value,
      fromDate,
      toDate,
      beginSetnum: this.formSearch.get('beginSetnum').value,
      sppId: WebUtilities.getLoggedSppId()
    }).toPromise()
      .then(resp => resp.json())
      .then((resp: ResponseBody) => {
        this.loading = false;
        if (resp.responseCode === '0007') {
          // Không tìm thấy dữ liệu thì không làm gì cả
        } else if (resp.responseCode === '0000') {
          this.scroll = {x: '1200px', y: '240px'};
          this.listOfItem = resp.responseData;
          this.totalPages = this.getTotalPagesOfList();
          this.totalElements = this.getTotalElements();
        } else {
          this.notificationService.showNotification(Constant.ERROR, resp.responseMessage);
        }
      }, error => this.notificationService.showNotification(Constant.ERROR, 'Hệ thống không có phản hồi. ' + error.message))
  }

  getTotalPagesOfList(): number {
    return Math.ceil(this.listOfItem.length / this.pageSize);
  }

  getTotalElements(): number {
    return this.listOfItem.length;
  }

  toggleCollapse(): void {
    this.collapse = !this.collapse;
  }

  goToList() {
    this.setLocalStorageCaseCode(this.selectedItem ? this.selectedItem.caseCode : '')
    this.router.navigate(['admin/so-thu-ly/dang-ky-lenh-vu-an/danh-sach']);
  }

  goToDetails(): void {
    this.router.navigate(['admin/so-thu-ly/dang-ky-lenh-vu-an/xem', this.selectedItem.caseCode])
  }

  goToCreate(): void {
    this.router.navigate(['admin/so-thu-ly/dang-ky-lenh-vu-an/them-moi', this.selectedItem.caseCode])
  }

  goToCreateCase() {
    this.router.navigate(['/admin/quanlyan/cap-nhat-thong-tin/G1']);
  }

  onChangePageIndex(pageNumber: number): void {
    this.pageNumber = pageNumber;
  }

  onChangePageSize(pageSize: number): void {
    this.pageSize = pageSize;
  }

  onSelect(data: Accused): void {
    this.selectedItem = data;
    this.onItemChecked(data.caseCode, true);
  }

  onItemChecked(accuCode: string, checked: boolean): void {
    this.listOfItem.forEach(item => {
      if (item.caseCode !== accuCode) {
        this.updateCheckedSet(item.caseCode, false)
      } else {
        if (checked) {
          this.selectedItem = item;
        } else {
          this.selectedItem = null;
        }
        this.updateCheckedSet(item.caseCode, checked);
      }
    });
  }

  updateCheckedSet(accuCode: string, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(accuCode);
    } else {
      this.setOfCheckedId.delete(accuCode);
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
        this.fromDate().setValue(null);
        return;
      }
      const date: Date = this.stringToDateWithFormat(value, 'DDMMYYYY');
      if (isNaN(date.getTime())) {
        this.notificationService.showNotification(Constant.ERROR, 'Ngày tháng không hợp lệ.');
        this.fromDate().setValue(null);
        return;
      } else {
        this.fromDate().setValue(date);
      }
    }
  }

  onToDateValueChange(event: any): void {
    const value = event.target.value;
    if ((value.includes('/') && value.length >= 10) || (!value.includes('/') && value.length >= 8)) {
      if (!value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/) && (value.includes('/') && value.length >= 10)) {
        this.notificationService.showNotification(Constant.ERROR, 'Sai định dạng ngày tháng dd/MM/yyyy.');
        this.toDate().setValue(null);
        return;
      }
      const date: Date = this.stringToDateWithFormat(value, 'DDMMYYYY');
      if (isNaN(date.getTime())) {
        this.notificationService.showNotification(Constant.ERROR, 'Ngày tháng không hợp lệ.');
        this.toDate().setValue(null);
        return;
      } else {
        this.toDate().setValue(date);
      }
    }
  }

  fromDate(): AbstractControl {
    return this.formSearch.get('fromDate');
  }

  toDate(): AbstractControl {
    return this.formSearch.get('toDate');
  }

  disabledStartDate = (startValue: Date): boolean => {
    if (!startValue || !this.toDate().value) {
      return false;
    }
    return startValue.getTime() > this.toDate().value.getTime();
  };

  disabledEndDate = (endValue: Date): boolean => {
    if (!endValue || !this.fromDate().value) {
      return false;
    }
    return endValue.getTime() <= this.fromDate().value.getTime();
  };

  goToCase(): void {
    const url = 'https://qlahs.vksndtc.gov.vn/'
    this.router.navigateByUrl(url);
  }

  setLocalStorageCaseCode = (value) => localStorage.setItem(Constant.SPP_CASECODE,value);

}
