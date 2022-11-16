import {Component, OnInit} from '@angular/core';
import {Denouncement} from '../../model/so-thu-ly.model';
import {AbstractControl, FormBuilder} from '@angular/forms';
import {Router} from '@angular/router';
import {NotificationService} from '../../../../service/notification.service';
import {Constant} from '../../../../shared/constants/constant.class';
import {SoThuLyService} from '../../service/so-thu-ly.service';
import {CookieService} from 'ngx-cookie-service';
import {WebUtilities} from "../../../../shared/utils/qla-utils.class";

@Component({
  selector: 'app-register-decision-denouncement',
  templateUrl: './register-decision-denouncement.component.html',
  styleUrls: ['./register-decision-denouncement.component.scss']
})
export class RegisterDecisionDenouncementComponent implements OnInit {
  formSearch = this.fb.group({
    crimeReportSource: [''],
    denouncementCode: [''],
    reporter: [''],
    accusedName: ['']
  });
  loading = true;
  selectedItem?: Denouncement;
  scroll = null;
  cols = [
    {
      title: 'Chọn',
      sortOrder: null,
      sortFn: null,
      sortDirections: null,
      width: '60px'
    },
    {
      title: 'Mã tin báo',
      sortOrder: null,
      sortFn: (a: Denouncement, b: Denouncement) => a.denouncementCode.localeCompare(b.denouncementCode),
      sortDirections: ['ascend', 'descend', null],
      width: '60px'
    },
    {
      title: 'Loại tin báo',
      sortOrder: null,
      sortFn: (a: Denouncement, b: Denouncement) => a.crimeReportSource.localeCompare(b.crimeReportSource),
      sortDirections: ['ascend', 'descend', null],
      width: '100px'
    },
    {
      title: 'Người báo tin',
      sortOrder: null,
      sortFn: (a: Denouncement, b: Denouncement) => a.rreporter.localeCompare(b.rreporter),
      sortDirections: ['ascend', 'descend', null],
      width: '100px'
    },
    {
      title: 'Người bị tố giác',
      sortOrder: null,
      sortFn: (a: Denouncement, b: Denouncement) => a.fullName.localeCompare(b.fullName),
      sortDirections: ['ascend', 'descend', null],
      width: '160px'
    },
    {
      title: 'Nội dung',
      sortOrder: null,
      sortFn: (a: Denouncement, b: Denouncement) => a.rdelation.localeCompare(b.rdelation),
      sortDirections: ['ascend', 'descend', null],
      width: '160px'
    },
    {
      title: 'Ngày VKS tiếp nhận',
      sortOrder: null,
      sortFn: (a: Denouncement, b: Denouncement) => a.takenOverDate.localeCompare(b.takenOverDate),
      sortDirections: ['ascend', 'descend', null],
      width: '80px'
    }
  ];
  listOfItem: Denouncement[] = [];
  totalPages = 1;
  totalElements = 0;
  pageNumber = 1;
  pageSize = 20;
  collapse = true;
  setOfCheckedId = new Set<number>();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private notificationService: NotificationService,
    private soThuLyService: SoThuLyService,
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

  async loadDataFromServer(): Promise<void> {
    this.listOfItem = [];
    this.totalPages = 0;
    this.totalElements = 0;
    this.scroll = null;
    this.loading = true;
    const resp = await this.soThuLyService.postRequest(this.soThuLyService.SOTHULY_URL + 'denouncedDenouncement/getList', {
      denouncementCode: this.formSearch.get('denouncementCode').value,
      crimeReportSource: this.formSearch.get('crimeReportSource').value,
      reporter: this.formSearch.get('reporter').value,
      accusedName: this.formSearch.get('accusedName').value,
      sppId: WebUtilities.getLoggedSppId()
    }).toPromise();
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
    this.setLocalStorageId(this.selectedItem ? this.selectedItem.id : null)
    this.router.navigate(['admin/so-thu-ly/dang-ky-lenh-tin-bao/danh-sach'])
  }

  goToDetails(): void {
    this.router.navigate(['admin/so-thu-ly/dang-ky-lenh-tin-bao/xem', this.selectedItem.id])
  }

  goToCreate(): void {
    this.router.navigate(['admin/so-thu-ly/dang-ky-lenh-tin-bao/them-moi', this.selectedItem.id])
  }

  onChangePageIndex(pageNumber: number): void {
    this.pageNumber = pageNumber;
  }

  onChangePageSize(pageSize: number): void {
    this.pageSize = pageSize;
  }

  onSelect(data: Denouncement): void {
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

  fromBeginIndate(): AbstractControl {
    return this.formSearch.get('fromBeginIndate');
  }

  toBeginIndate(): AbstractControl {
    return this.formSearch.get('toBeginIndate');
  }

  disabledStartDate = (startValue: Date): boolean => {
    if (!startValue || !this.fromBeginIndate().value) {
      return false;
    }
    return startValue.getTime() > this.toBeginIndate().value.getTime();
  };

  disabledEndDate = (endValue: Date): boolean => {
    if (!endValue || !this.fromBeginIndate().value) {
      return false;
    }
    return endValue.getTime() <= this.fromBeginIndate().value.getTime();
  };

  setLocalStorageId = (value) => localStorage.setItem(Constant.DENOUNCEMENT_ID,value);

}
