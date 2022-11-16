import { AfterViewInit, Component, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GeneralService } from '../../../../../service/general-service';
import { NotificationService } from '../../../../../service/notification.service';
import { SppService } from '../../../../../service/spp-service';
import { Constant } from '../../../../../shared/constants/constant.class';
import { WebUtilities } from '../../../../../shared/utils/qla-utils.class';

@Component({
  selector: 'app-edit-view-join',
  templateUrl: './edit-view-join.component.html',
  styleUrls: ['./edit-view-join.component.scss']
})
export class EditViewJoinComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {
  sppCase: any;
  userfor: any;
  reload: any;
  isCollapse: boolean;
  isShowPopup: boolean;
  isVisibleAdd: boolean;
  userInfo: any;
  insertLoading: boolean;

  sppid: string;

  /** LIST DATA CHOICE */
  lstSelected: any[] = [];

  /** GRID VIEW */
  loading: boolean;
  lstDatas: any[] = [];

  toggleCollapse() {
    this.isCollapse = !this.isCollapse;
  }
  constructor(
    private sppService: SppService,
    private notificationService: NotificationService,
    private generalService: GeneralService,
    private router: Router
  ) {
    this.sppCase = this.sppService.getCurrentSppCaseJoin();
    this.userInfo = JSON.parse(localStorage.getItem(Constant.USER_INFO));
    this.sppid = WebUtilities.getLoggedSppId();
  }
  ngAfterViewInit() {
    this.loadDataFromServer();
  }
  ngOnDestroy(): void {
    this.sppCase = this.sppService.setCurrentSppCaseJoin(null);
  }

  ngOnInit(): void {
    if (!this.sppCase) {
      this.goToBack();
    }else {
      this.isCollapse = true;
    }
  }

  ngOnChanges(): void {
    //nothing
  }
  goToBack() {
    this.router.navigate(['/admin/vu-an/search/nhap-vu-an']);
  }
  showModalAdd(): void {
    this.isVisibleAdd = true;
    this.sppCase.isedit = false;
    this.sppCase = {};
  }

  loadDataFromServer() {
    this.loading = true;
    const payload = {
      ...this.sppCase,
      pageSize: 50,
      rowIndex: 0,
      sppid: this.sppid,
      choice: '4'
    }
    this.generalService.searchListSppJoin(payload).subscribe(res => {
      this.loading = false;
      this.lstDatas = res;
    }, error => {
      alert('Lỗi dữ liệu');
    });
  }

  getRowIndex = (index, pageIndex, pageSize) => index + 1 + pageSize * (pageIndex - 1)

  handleOk() {
    const lstCase = []; 
    this.lstSelected.forEach(imp => lstCase.push(imp.CASECODE))
    const payload = {
      casecode: this.sppCase.casecode,
      lstCase: lstCase,
      action: 'I',
      sppid: this.sppid
    }
    this.generalService.saveListSppJoin(payload).subscribe(res => {
      if (!res) {
        this.notificationService.showNotification(Constant.SUCCESS, 'Nhập vụ án thành công');
        this.goToBack();
      } else {
        this.notificationService.showNotification(Constant.ERROR, res)
      }
    }, error => this.notificationService.showNotification(Constant.ERROR, error.error.text))
  }

  onShowPopupSearch() {
    this.isVisibleAdd = true;
  }

  onClosePopupSearch(): void {
    this.isVisibleAdd = false;
  }

  async onSubmitPopupSearch(data) {
    this.isVisibleAdd = false;
    if (!data) {
      return;
    }
    if (this.lstDatas.some(emp => emp.CASECODE === data.CASECODE)) {
      this.notificationService.showNotification(Constant.ERROR,'Vụ án đã được chọn');
      return;
    }
    this.lstSelected.push(data);
    this.lstDatas = [...this.lstDatas,data]
  }

  toCaseType(caseType) {
    switch (caseType) {
      case 'L0':
        return 'Chưa xác định';
      case 'L1':
        return 'Ít nghiêm trọng';
      case 'L2':
        return 'Nghiêm trọng';
      case 'L3':
        return 'Rất nghiêm trọng';
      case 'L4':
        return 'Đặc biệt nghiêm trọng';
      default: return '';
    }
  }

  checkBtn=(value)=> (value && value.length > 0) ? false : true;
}