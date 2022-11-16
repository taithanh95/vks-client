import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NotificationService} from '../../../../service/notification.service';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {AppConfigService} from '../../../../../app-config.service';
import {GeneralService} from '../../../../service/general-service';
import {TableSelectionAbstract} from '../../../../shared/component/table/table-selection.abstract';
import {ComponentMode, Constant} from '../../../../shared/constants/constant.class';
import {ApParamService} from '../../../../service/apparam.service';
import {DenouncementService} from '../../../../service/denouncement.service';
import {DenouncementModel} from '../../../../model/denouncement.model';
import {CategoriesService} from '../../../../service/categories.service';
import {DenouncementCreateComponent} from '../denouncement-create/denouncement-create.component';
import {ConstantService} from '../../../../service/constant.service';
import {DateService} from '../../../../common/util/date.service';
import * as moment from 'moment';
import {NzModalRef, NzModalService} from 'ng-zorro-antd/modal';
import {NzTableQueryParams} from 'ng-zorro-antd/table';
import {CookieService} from 'ngx-cookie-service';
import {WebUtilities} from "../../../../shared/utils/qla-utils.class";
import {ResponseBody} from "../../../so-thu-ly/model/response-body";
import {Law} from "../../../so-thu-ly/model/so-thu-ly.model";
import {Code} from "../../../../model/code";

@Component({
  selector: 'app-denouncement-search',
  templateUrl: './denouncement-search.component.html',
  styleUrls: ['./denouncement-search.component.scss']
})
export class DenouncementSearchComponent extends TableSelectionAbstract implements OnInit {

  @ViewChild('confirm') confirmTemplate: TemplateRef<any>;
  @ViewChild('confirmHeader') confirmHeaderTemplate: TemplateRef<any>;
  @ViewChild('denouncementCreate') denouncementCreate: DenouncementCreateComponent;
  confirmModalRef: NzModalRef<any>;
  type: any;
  modeEnum = ComponentMode;
  isVisibleAdd: boolean;
  isVisibleUpdate: boolean;
  isVisibleDetail: boolean;
  /*page*/
  pageSize: any;
  page: any;

  pageRequest: {
    sort?: any;
    offset?: number;
    pageSize?: number;
    pageNumber?: number;
    unpaged?: number;
  } = {
    pageSize: 20,
    pageNumber: 0
  }
  defaultPage: {
    content?: any[];
    empty?: boolean;
    first?: boolean;
    last?: boolean;
    number?: number;
    numberOfElements?: number;
    pageable?: {
      sort?: any;
      offset?: number;
      pageSize?: number;
      pageNumber?: number;
      unpaged?: number
    }
    size?: any;
    sort?: { sorted?: boolean; unsorted?: boolean; empty?: boolean; };
    totalElements?: number;
    totalPages?: number;
    defaultBasePage?: any;
  } = {number: 0, size: this.configService.getConfig().defaultPage};

  /*search filter*/
  loaicoquan: any;

  typeOfVerification = [
    '',
    'Yêu cầu khởi tố vụ án',
    'Yêu cầu tiếp nhận, kiểm tra, xác minh, ra QĐ giải quyết nguồn tin về tội phạm',
    'Yêu cầu cung cấp tài liệu để kiểm sát việc giải quyết nguồn tin về tội phạm',
    'Yêu cầu chuyển nguồn tin về tội phạm',
    'Quyết định hủy bỏ khởi tố',
    'Yêu cầu khác'
  ];

  validateForm!: FormGroup;
  controlArray: Array<{ index: number; show: boolean }> = [];
  isCollapse = true;
  arrCollapse: any[];
  loading: boolean;
  datas: any[];
  userInfo: any;
  selectedItem: DenouncementModel;
  denouncementSources = [];
  denouncementStatus = [];
  takenOverAgencies = [];
  lstDenouncementStatusSelected = [];
  listOfSelectedValue = [];
  listTakenOverAgency = [];
  lstSettlementResults = [];
  ipnEnactmentIdList = [];
  phandlingProsecutorIdList = [];
  procurators = [];
  ipnSettlementAgencyList = [];
  ipnClassifiedNews = [];
  investigationActivityType = [];
  lstSettlementResultsSelected = [];
  lstSelectedItem: any[] = [];
  requiredFromDate = false;
  requiredPhandlingFromDate = false;
  requiredVerificationFromDate = false;
  filterItem = {
    pageSize: 100,
    rowIndex: 0,
    sortField: '',
    sortOrder: '',
    sppId: '',
    fromDate: null,
    toDate: null,
    phandlingFromDate: null,
    phandlingToDate: null,
    phandlingNumber: '',
    phandlingProsecutorId: '',
    denouncementCode: null,
    listOfSelectedValue: [],
    listTakenOverAgency: [],
    ipnSettlementAgency: '',
    ipnClassifiedNews: '',
    ipnEnactmentId: '',
    codeId: '',
    lstDenouncementStatusSelected: [],
    lstSettlementResultsSelected: [],
    delatorOrAccused: '',
    takenOverOfficer: '',
    createUser: '',
    iaAssignmentDecisionNumber: '',
    iaHandlingOfficer: '',
    passignmentDecisionNumber: '',
    corruptionCrime: false,
    economicCrime: false,
    otherCrime: false,
    verificationInvestigationCode: '',
    verificationFromDate: null,
    verificationToDate: null,
    type: '',
    investigationActivityType: ''
  };
  sppId: string;
  username: string;
  nzParams: NzTableQueryParams;

  isBtnUpd: boolean;
  isBtnDetail: boolean;
  isBtnDelete: boolean;

  groupLawCode: string = null;
  lstLaws: Law[] = [];
  listGroupLawCode: Code[] = [];

  constructor(private notificationService: NotificationService,
              private route: ActivatedRoute,
              private router: Router,
              private fb: FormBuilder,
              private configService: AppConfigService,
              private generalService: GeneralService,
              private denounceService: DenouncementService,
              private apParamService: ApParamService,
              private modalService: NzModalService,
              private categoriesService: CategoriesService,
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
    this.loaicoquan = 0;
    this.pageSize = this.configService.getConfig().pageSize;
    this.page = this.configService.getConfig().page;
    this.loading = false;
    this.route.params.subscribe(routeParams => {
      this.type = +routeParams.type;
    });
    this.validateForm = this.fb.group({});
    for (let i = 0; i < 10; i++) {
      this.controlArray.push({index: i, show: i < 6});
      this.validateForm.addControl(`field${i}`, new FormControl());
    }
    this.validateForm.addControl('mavuan', new FormControl());
    this.validateForm.addControl('an_ten', new FormControl());
    this.validateForm.addControl('an_quyetdinhkhoitoso', new FormControl());
    this.validateForm.addControl('an_donviraquyetdinhkhoito', new FormControl());
    this.getListParam(Constant.DENOUNCEMENT_TYPE, 'denouncementSources');
    this.getListParam(Constant.DENOUNCEMENT_STATUS_TYPE, 'denouncementStatus');
    this.getListParam(Constant.TAKEN_OVER_AGENCY, 'takenOverAgencies');
    this.getListParam(Constant.IPN_SETTLEMENT_AGENCY, 'ipnSettlementAgencyList');
    this.getListParam(Constant.IPN_CLASSIFIED_NEWS, 'ipnClassifiedNews');
    this.getListParam(Constant.INVESTIGATION_ACTIVITY_TYPE, 'investigationActivityType');
    this.getListInspector();
    this.loadDataSelect('lstSettlementResults');
    this.filterItem.createUser = this.userInfo.userid;
    this.arrCollapse = [true, false];
    this.getBoLuatByStatus();
  }

  doSearch() {
    this.validFrom();
    // if (isNaN(this.filterItem.denouncementCode)) {
    //   this.notificationService.showNotification(Constant.ERROR, 'Mã tin báo không phải là số');
    //   return;
    // }
    this.getListData(0, 20);
  }

  getListData(page, size) {
    this.setIsBtn(true);
    this.loading = true
    let fromDate = '', toDate = '', phandlingFromDate = '', phandlingToDate = '', verificationFromDate = '', verificationToDate = '';
    if (this.filterItem.fromDate) {
      fromDate = this.dateService.convertDateToStringByPattern(this.filterItem.fromDate, 'dd/MM/yyyy');
    }
    if (this.filterItem.toDate) {
      toDate = this.dateService.convertDateToStringByPattern(this.filterItem.toDate, 'dd/MM/yyyy');
    }
    if (this.filterItem.phandlingFromDate) {
      phandlingFromDate = this.dateService.convertDateToStringByPattern(this.filterItem.phandlingFromDate, 'dd/MM/yyyy');
    }
    if (this.filterItem.phandlingToDate) {
      phandlingToDate = this.dateService.convertDateToStringByPattern(this.filterItem.phandlingToDate, 'dd/MM/yyyy');
    }
    if (this.filterItem.verificationFromDate) {
      verificationFromDate = this.dateService.convertDateToStringByPattern(this.filterItem.verificationFromDate, 'dd/MM/yyyy');
    }
    if (this.filterItem.verificationToDate) {
      verificationToDate = this.dateService.convertDateToStringByPattern(this.filterItem.verificationToDate, 'dd/MM/yyyy');
    }
    this.constantService.postRequest(this.constantService.SOTHULY_URL + 'denouncedDenouncement/getPage/'
      , {
        pageNumber: page + 1,
        pageSize: size,
        dataRequest: {
          fromDate,
          toDate,
          phandlingFromDate,
          phandlingToDate,
          verificationFromDate,
          verificationToDate,
          denouncementCode: this.filterItem.denouncementCode,
          reporter: this.filterItem.delatorOrAccused,
          takenOverOfficer: this.filterItem.takenOverOfficer,
          crimeReportSourceList: this.filterItem.listOfSelectedValue = this.listOfSelectedValue,
          listTakenOverAgency: this.filterItem.listTakenOverAgency = this.listTakenOverAgency,
          decisionIdList: this.filterItem.lstSettlementResultsSelected = this.lstSettlementResultsSelected,
          sppId: this.filterItem.sppId = WebUtilities.getLoggedSppId(),
          statusList: this.filterItem.lstDenouncementStatusSelected = this.lstDenouncementStatusSelected,
          username: this.filterItem.createUser = this.userInfo.userid,
          iaAssignmentDecisionNumber: this.filterItem.iaAssignmentDecisionNumber,
          iaHandlingOfficer: this.filterItem.iaHandlingOfficer,
          phandlingNumber: this.filterItem.phandlingNumber,
          phandlingProsecutorId: this.filterItem.phandlingProsecutorId,
          passignmentDecisionNumber: this.filterItem.passignmentDecisionNumber,
          ipnSettlementAgency: this.filterItem.ipnSettlementAgency,
          ipnClassifiedNews: this.filterItem.ipnClassifiedNews,
          ipnEnactmentId: this.filterItem.ipnEnactmentId,
          corruptionCrime: this.filterItem.corruptionCrime,
          economicCrime: this.filterItem.economicCrime,
          otherCrime: this.filterItem.otherCrime,
          verificationInvestigationCode: this.filterItem.verificationInvestigationCode,
          type: this.filterItem.type,
          investigationActivityType: this.filterItem.investigationActivityType
        }
      }).toPromise()
      .then(res => res.json())
      .then(resJson => {
        if (resJson.responseCode === '0000') {
          this.datas = resJson.responseData.data.map(res => {
            if (res.law && res.law instanceof Array) {
              let lawnames = '';
              for (const law of res.law) {
                lawnames += law.lawName + '</br>';
              }
              res.lawnames = lawnames
              // console.log(lawnames);
            }
            return res;
          });
          this.defaultPage = {
            number: resJson.responseData.pageNumber - 1,
            size: resJson.responseData.pageSize,
            totalElements: resJson.responseData.totalElements,
            totalPages: resJson.responseData.totalPages
          };
        } else if (resJson.responseCode === '0007') {
          this.datas = [];
          this.notificationService.showNotification(Constant.ERROR, 'Không có dữ liệu cần tra cứu.');
        } else {
          this.datas = [];
          this.notificationService.showNotification(Constant.ERROR, resJson.responseMessage);
        }
      })
      .catch(err => {
        this.notificationService.showNotification(Constant.ERROR, 'Hệ thống không có phản hồi.' + err);
      });
    this.loading = false;
  }


  toggleCollapse(index: number) {
    this.arrCollapse[index] = !this.arrCollapse[index];
  }

  getRowIndex = (index, pageIndex, pageSize) => index + 1 + pageSize * (pageIndex - 1);


  showModalAdd() {
    this.isVisibleAdd = true;
  }

  closeModalAdd(status) {
    if (status === 'save') {
      this.datas.forEach(e => {
        e.checked = false
      });
      this.selectedItem = null;
      this.doSearch();
    }
    this.isVisibleAdd = false;
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

  showModalDetail() {
    if (!this.validSelected()) {
      return;
    }
    this.isVisibleDetail = true;
  }

  closeModalDetail() {
    this.isVisibleDetail = false;
  }

  // getDomainValueList(code, list) {
  //   this.apParamService.getParams(code).subscribe(
  //     (data) => {
  //       this[list] = data as ApParamModel[];
  //     });
  // }

  getListParam(code, list): void {
    this.constantService.postRequest(this.constantService.SOTHULY_URL + 'dm/ApParam/getParams'
      , {
        code
      }).toPromise()
      .then(res => res.json())
      .then(resJson => {
        this[list] = resJson.responseData;
      })
      .catch(err => {
        this.notificationService.showNotification(Constant.ERROR, 'Hệ thống không có phản hồi.' + err);
      });
  }

  loadDataSelect(list) {
    this.denounceService.getListDecision('').subscribe(res => {
      this[list] = res.datas;
    });
  }

  // onAllChecked(checked:boolean,childrenName?: string){
  //   this.listOfDisplayData.forEach(item =>
  //     {
  //       this.mapOfCheckedId[item[this.prop]] = checked;
  //       if (childrenName !== undefined) {
  //         this.setChildrenStatus(checked, item, childrenName);
  //       }
  //     }
  //   );
  //   if(checked){
  //     // todo
  //   }else {
  //     this.lstSelectedItem =[];
  //     this.selectedItem= '';
  //   }
  //   for (const child of this.datas) {
  //     if(checked){
  //       this.lstSelectedItem.push(child);
  //     }
  //     child.selected = checked;
  //   }
  //   this.refreshStatus();
  // }

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

  // onItemChecked(item:any,checked:boolean):void{
  //   if(checked){
  //     this.lstSelectedItem.push(item);
  //   }else {
  //     for (let i = this.lstSelectedItem.length - 1; i >= 0; i--) {
  //       if (this.lstSelectedItem[i].id === item.id) {
  //         this.lstSelectedItem.splice(i, 1);
  //       }
  //     }
  //   }
  //   this.selectedItem = this.lstSelectedItem[0];
  //   // set color selected
  //   for (const child of this.datas) {
  //     if(child.id ===item.id)
  //       child.selected = checked;
  //   }
  //   this.refreshStatus()
  // }

  onDelete() {
    if (!this.validSelected()) {
      return;
    }
    this.showConfirmDelete();
  }

  deleteData(): any {
    this.selectedItem.updateUser = this.userInfo.userid;
    this.constantService.postRequest(this.constantService.SOTHULY_URL + 'denouncedDenouncement/delete/',
      {
        id: this.selectedItem.id
      }).toPromise().then(resp => resp.json()).then((resp: ResponseBody) => {
      if (resp.responseCode === '0000') {
        this.notificationService.showNotification(Constant.SUCCESS, 'Xóa thành công');
        this.datas.forEach(e => {
          e.checked = false
        });
        this.selectedItem = null;
        this.doSearch();
      } else {
        this.notificationService.showNotification(Constant.ERROR, resp.responseMessage);
      }
    }).catch(err => {
      this.notificationService.showNotification(Constant.ERROR, 'Xóa thất bại' + err);
    });
    this.loading = false;
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

  validSelected() {
    if (!this.selectedItem) {
      this.notificationService.showNotification(Constant.ERROR, 'Chưa chọn bản ghi nào');
      return false;
    }
    return true;
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    this.nzParams = params;
    const {pageSize, pageIndex, sort, filter} = params;
    const currentSort = sort.find(item => item.value !== null);
    const sortField = (currentSort && currentSort.key) || null;
    const sortOrder = (currentSort && currentSort.value) || null;
    this.filterItem.sortField = sortField;
    this.getListData(params.pageIndex - 1, params.pageSize);
  }

  validFrom() {
    this.refreshValid();
    if (this.filterItem.fromDate != null && this.filterItem.toDate != null && this.filterItem.fromDate !== '' && this.filterItem.toDate !== '') {
      const fromDate = new Date(this.filterItem.fromDate);
      const toDate = new Date(this.filterItem.toDate);
      if (this.converttoLocalDate(fromDate).getTime() > this.converttoLocalDate(toDate).getTime()) {
        this.requiredFromDate = true;
      }
    }
    if (this.filterItem.phandlingFromDate != null && this.filterItem.phandlingToDate != null && this.filterItem.phandlingFromDate !== '' && this.filterItem.phandlingToDate !== '') {
      const fromDate = new Date(this.filterItem.phandlingFromDate);
      const toDate = new Date(this.filterItem.phandlingToDate);
      if (this.converttoLocalDate(fromDate).getTime() > this.converttoLocalDate(toDate).getTime()) {
        this.requiredPhandlingFromDate = true;
      }
    }
    if (this.filterItem.verificationFromDate != null && this.filterItem.verificationToDate != null && this.filterItem.verificationFromDate !== '' && this.filterItem.verificationToDate !== '') {
      const fromDate = new Date(this.filterItem.verificationFromDate);
      const toDate = new Date(this.filterItem.verificationToDate);
      if (this.converttoLocalDate(fromDate).getTime() > this.converttoLocalDate(toDate).getTime()) {
        this.requiredVerificationFromDate = true;
      }
    }
  }

  converttoLocalDate(inputDate: any) {
    const dateOut = new Date(inputDate);
    dateOut.setSeconds(0);
    dateOut.setMinutes(0);
    dateOut.setHours(0);
    return dateOut;
  }

  refreshValid() {
    this.requiredFromDate = false;
    this.requiredPhandlingFromDate = false;
    this.requiredVerificationFromDate = false;
  }

  searchAuto(name: any) {
    this.categoriesService.getListDecision_ForTBTG({search: name}).subscribe(next => {
      this.lstSettlementResults = next ? next.datas : [];
    }, error => {
    })
  }

  stringToDateWithFormat(inputString: string, format: string): Date {
    return moment(inputString, format).toDate();
  }

  onDateValueChange(val: any, event: any){
    const value = event.target.value;
    if ((value.includes('/') && value.length >= 10) || (!value.includes('/') && value.length >= 8)) {
      if (!value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/) && (value.includes('/') && value.length >= 10)) {
        this.notificationService.showNotification(Constant.ERROR, 'Sai định dạng ngày tháng dd/MM/yyyy.');
        this.filterItem[val] = null;
        return;
      }
      const date: Date = this.stringToDateWithFormat(value, 'DDMMYYYY');
      if (isNaN(date.getTime())) {
        this.notificationService.showNotification(Constant.ERROR, 'Ngày tháng không hợp lệ.');
        this.filterItem[val] = null;
        return;
      } else {
        this.filterItem[val] = date;
      }
    }
  }

  numberOnly(event: KeyboardEvent): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    return !(charCode > 31 && (charCode < 48 || charCode > 57));
  }

  onRowSelect(item) {
    this.selectedItem = item;
    this.onItemChecked(item, true);
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

      this.isBtnUpd = true;
      this.isBtnDelete = true;
      this.isBtnDetail = false;
      return;
    }
    this.setIsBtn(true);
  }

  setIsBtn(value: boolean) {
    this.isBtnUpd = value;
    this.isBtnDelete = value;
    this.isBtnDetail = value;
  }

  getListInspector() {
    this.categoriesService.getListInspectorByPosition("KS").subscribe(next => {
      this.procurators = next;
    });
  }

  onCodeIdChange(value: any, flag = false): void {
    if (value) {
      this.lstLaws = [];
      this.groupLawCode = value;
      this.getLaws('');
    }else {
      this.groupLawCode = null;
      this.ipnEnactmentIdList = [];
      this.lstLaws = [];
    }
  }

  getLaws(name: string) {
    if (this.groupLawCode != null) {
      const search = {
        LawName: name,
        sortField: 'lawId',
        sortOrder: 'ESC',
        codeId: this.groupLawCode,
        size: 20
      };
      this.categoriesService.getListLaw(search).subscribe(res => {
        this.lstLaws = res?.datas || [];
      });
    }
  }

  getBoLuatByStatus() {
    this.constantService.postRequest(this.constantService.MANAGE_URL + 'code/getList/'
      , {
        status: 'Y'
      }).toPromise()
      .then(res => res.json())
      .then(resJson => {
        if (resJson.responseCode === '0000') {
          this.listGroupLawCode = resJson.responseData;
        } else {
          // tslint:disable-next-line:max-line-length
          this.notificationService.showNotification(Constant.ERROR, resJson.responseCode + ' - ' + resJson.responseMessage);
        }
      })
      .catch(err => {
        this.notificationService.showNotification(Constant.ERROR, 'Hệ thống không có phản hồi.' + err);
      });
  }

  handleLawIdOpenChange(open: boolean): void {
    if (open && this.groupLawCode == null) {
      this.notificationService.showNotification(Constant.ERROR, 'Yêu cầu chọn Bộ luật trước');
    }
  }

  onSearchLaw(e) {
    this.getLaws(e);
  }
}
