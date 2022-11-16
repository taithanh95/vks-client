import {Component, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {Router} from '@angular/router';
import {NotificationService} from '../../../../service/notification.service';
import {Constant} from '../../../../shared/constants/constant.class';
import {ResponseBody} from '../../model/response-body';
import {Accused} from '../../model/so-thu-ly.model';
import {ConstantService} from '../../../../service/constant.service';
import {CookieService} from 'ngx-cookie-service';
import {WebUtilities} from "../../../../shared/utils/qla-utils.class";

@Component({
  selector: 'app-register-decision-accu',
  templateUrl: './register-decision-accu.component.html',
  styleUrls: ['./register-decision-accu.component.scss']
})
export class RegisterDecisionAccuComponent implements OnInit {
  formSearch = this.fb.group({
    caseCode: [''],
    caseName: [''],
    accuCode: [''],
    fullName: [''],
    beginSetnum: ['']
  });
  loading = true;
  selectedItem?: Accused;
  scroll = null;
  cols = [
    {
      title: 'Chọn',
      sortOrder: null,
      sortFn: null,
      sortDirections: null,
      width: '50px'
    },
    {
      title: 'Mã bị can',
      sortOrder: null,
      sortFn: (a: Accused, b: Accused) => a.accuCode.localeCompare(b.accuCode),
      sortDirections: ['ascend', 'descend', null],
      width: '100px'
    },
    {
      title: 'Tên bị can',
      sortOrder: null,
      sortFn: (a: Accused, b: Accused) => a.fullName.localeCompare(b.fullName),
      sortDirections: ['ascend', 'descend', null],
      width: '100px'
    },
    {
      title: 'Mã vụ án',
      sortOrder: null,
      sortFn: (a: Accused, b: Accused) => a.caseCode.localeCompare(b.caseCode),
      sortDirections: ['ascend', 'descend', null],
      width: '100px'
    },
    {
      title: 'Tên vụ án',
      sortOrder: null,
      sortFn: (a: Accused, b: Accused) => a.caseName.localeCompare(b.caseName),
      sortDirections: ['ascend', 'descend', null],
      width: '100px'
    },
    {
      title: 'Ngày sinh',
      sortOrder: null,
      sortFn: (a: Accused, b: Accused) => a.birthDay.localeCompare(b.birthDay),
      sortDirections: ['ascend', 'descend', null],
      width: '100px'
    },
    {
      title: 'Giới tính',
      sortOrder: null,
      sortFn: (a: Accused, b: Accused) => a.sex.localeCompare(b.sex),
      sortDirections: ['ascend', 'descend', null],
      width: '100px'
    },
    {
      title: 'Tội danh',
      sortOrder: null,
      sortFn: (a: Accused, b: Accused) => a.lawId.localeCompare(b.lawId),
      sortDirections: ['ascend', 'descend', null],
      width: '180px'
    },
    {
      title: 'Quyết định khởi tố số',
      sortOrder: null,
      sortFn: (a: Accused, b: Accused) => a.beginSetnum - b.beginSetnum,
      sortDirections: ['ascend', 'descend', null],
      width: '100px'
    },
    {
      title: 'Ngày quyết định khởi tố',
      sortOrder: null,
      sortFn: (a: Accused, b: Accused) => a.beginIndate.localeCompare(b.beginIndate),
      sortDirections: ['ascend', 'descend', null],
      width: '100px'
    }
  ];
  listOfItem: Accused[] = [];
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
    this.constantService.postRequest(this.constantService.MANAGE_URL + 'accused/getListComboBox/', {
      caseCode: this.formSearch.get('caseCode').value,
      caseName: this.formSearch.get('caseName').value,
      accuCode: this.formSearch.get('accuCode').value,
      fullName: this.formSearch.get('fullName').value,
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
    this.setLocalStorageAccuCode(this.selectedItem ? this.selectedItem.accuCode : '');
    this.router.navigate(['admin/so-thu-ly/dang-ky-lenh-bi-can/danh-sach'])
  }

  goToDetails(): void {
    this.router.navigate(['admin/so-thu-ly/dang-ky-lenh-bi-can/xem', this.selectedItem.accuCode])
  }

  goToCreate(): void {
    this.router.navigate(['admin/so-thu-ly/dang-ky-lenh-bi-can/them-moi', this.selectedItem.accuCode])
  }

  onChangePageIndex(pageNumber: number): void {
    this.pageNumber = pageNumber;
  }

  onChangePageSize(pageSize: number): void {
    this.pageSize = pageSize;
  }

  onSelect(data: Accused): void {
    this.selectedItem = data;
    this.onItemChecked(data.accuCode, true);
  }

  onItemChecked(accuCode: string, checked: boolean): void {
    this.listOfItem.forEach(item => {
      if (item.accuCode !== accuCode) {
        this.updateCheckedSet(item.accuCode, false)
      } else {
        if (checked) {
          this.selectedItem = item;
        } else {
          this.selectedItem = null;
        }
        this.updateCheckedSet(item.accuCode, checked);
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

  onClick() {
    this.router.navigate(['admin/quanlyan/search/truy-to/1']);
  }

  setLocalStorageAccuCode = (value) => localStorage.setItem(Constant.SPP_ACUUCODE,value);

}
