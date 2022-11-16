import { Component, OnInit } from '@angular/core';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { CategoriesService } from '../../../../../service/categories.service';
import { AppConfigService } from '../../../../../../app-config.service';
import { GeneralService } from '../../../../../service/general-service';
import { NotificationService } from '../../../../../service/notification.service';
import { Constant } from '../../../../../shared/constants/constant.class';
import { WebUtilities } from '../../../../../shared/utils/qla-utils.class';

export interface TreeNodeInterface {
  deciid?: string;
  deciname?: string;
  decilevel?: string;
  applyfor_dis?: string;
  status_?: string;
  decitypename?: string;
  expand?: boolean;
  children?: TreeNodeInterface[];
  parent?: TreeNodeInterface;
  plusChildren?: string;
}

@Component({
  selector: 'app-decision-search',
  templateUrl: './decision-search.component.html',
  styleUrls: ['./decision-search.component.scss']
})
export class DecisionSearchComponent implements OnInit {

  /* Show Dialogs*/
  isVisibleDetail: boolean;
  isVisibleCreate: boolean; 
  /*page*/
  page: any;
  pageSize: any;
  defaultPage: any;
  pageIndex: any;
  total: any;
  loading: boolean;

  /*search filter*/
  enabledAutoLoadData = false; // Tự động lấy dữ liệu sau khi tải trang
  datas: any[];
  filterItem: any;
  selectedItem: any;
  sppId: any;
  data: any;

  lstDecitype = [];

  /* Button display*/
  isUpdBtn: boolean;
  isDeleteBtn: boolean;
  isDetailBtn: boolean;
  isBtnUpdDisabled: boolean;
  isBtnAddDisabled: boolean;

  /**TREE TABLE */
  isViewTable = true;

  loadTree = false;

  forwardValue = true;

  titleTable = 'Hiển thị dạng cây';
  listOfMapData: TreeNodeInterface[];
  mapOfExpandedData: { [deciid: string]: TreeNodeInterface[] } = {};

  constructor(
    private notificationService: NotificationService,
    private generalService: GeneralService,
    private configService: AppConfigService,
    private categoriesService: CategoriesService
  ) {
    this.sppId = WebUtilities.getLoggedSppId();
    this.resetFilter();
  }

  ngOnInit(): void {
    this.resetPage();
    this.doSearch();
    this.getLstDecitype();
  }

  resetPage() {
    this.pageSize = this.configService.getConfig().pageSize;
    this.page = 20;
    this.defaultPage = this.configService.getConfig().defaultPage;
    this.pageIndex = 1;
  }

  resetFilter() {
    this.resetBtn();
    this.filterItem = {
      id: '',
      name: '',
      applyFor: '',
      applyFinish: '',
      status: '',
      deciType: '',
      userFor: ''
    };
  }

  getLstDecitype() {
    this.categoriesService.getAllDecitype().subscribe(res => {
      if (res) {
        this.lstDecitype = res;
      } else {
        this.lstDecitype = [];
      }
    }, error => {
      this.notificationService.showNotification(Constant.ERROR, error);
    });
  }

  loadDataFromServer(): void {
    if (this.enabledAutoLoadData) {
      this.filterItem.sortOrder = 'ASC';
      const payload = {
        ...this.filterItem,
        size: this.defaultPage,
        page: (this.pageIndex - 1)
      }
      this.loading = true;
      this.categoriesService.getListDecision(payload).subscribe(res => {
        if (res) {
          this.datas = res.datas;
          this.total = res.totalRecords;
        } else {
          this.datas = [];
          this.total = 0;
        }
        this.resetBtn();
        this.loading = false;
       
      }, error => {
        this.notificationService.showNotification(Constant.ERROR, error);
      });
    }
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    const {pageSize, pageIndex, sort, filter} = params;
    this.pageIndex = params.pageIndex;
    this.defaultPage = params.pageSize;
    this.loadDataFromServer();
  }

  doSearch() {
    this.enabledAutoLoadData = true;
    this.resetBtn();
    this.resetPage();
    this.loadDataFromServer();
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
    // this.isUpdBtn = opt;
    this.isDetailBtn = opt;
    this.isBtnUpdDisabled = opt;
    this.isUpdBtn = opt;
    if (!opt && this.selectedItem?.decilevel === "1") {
      this.isBtnAddDisabled = false;
    } else {
      this.isBtnAddDisabled = true;
    }
  }

  getRowIndex = (index, pageIndex, pageSize) => index + 1 + pageSize * (pageIndex - 1)

  doDelete() {
    this.generalService.deleteLstDecision(this.selectedItem?.deciid).subscribe(res => {
      if (res) {
        this.handleErr(res)
      } else {
        this.notificationService.showNotification(Constant.SUCCESS, 'Xóa thành công');
        if (this.isViewTable) 
          this.loadDataFromServer();
        else 
          this.getLstTreeData();
      }
    }, error => {
      this.handleErr(error.error.text);
    });
  }
  
  handleErr(err: string){
    if (err === "daco_qd_con") {
      this.notificationService.showNotification(Constant.ERROR, 'Đã có quyết định cấp con, bạn phải xóa quyết định cấp con trước');
      return;
    }
    const msgErr = this.generalService.jsonErrorDM[err];
    this.notificationService.showNotification(Constant.ERROR, msgErr ? msgErr : err);
  }

  showEditForm(): void {
    this.data = {
      ...this.selectedItem,
      decitemp: this.selectedItem?.deciid,
      type_ins: this.selectedItem?.deciid.length === 2 ? "CHA" : "CON",
      limittime: (this.selectedItem?.timelimit && this.selectedItem?.timelimit === "Y") ? true : false
    };
    this.data.isEdit = true;
    this.isVisibleCreate = true;
    delete this.data.children;
    delete this.data.parent;
  }
  
  showCreateForm(): void {
    this.data = {
      type_ins: "CHA",
      deciid: '',
      deciname: '',
      limittime: false,
      settime: '',
      setunit: 'D',
      applyfor: 'A',
      applyfinish: 'N',
      status: 'N',
      decitypeid: 'KXD',
      decitemp: this.selectedItem?.deciid,
      decilevel: this.selectedItem?.decilevel,
      isEdit : false
    };
    this.isVisibleCreate = true;
  }

  closeModalCreate($event: boolean){
    this.isVisibleCreate = $event;
  }

  reloadModalCreate($event: boolean){
    this.isVisibleCreate = $event;
    if (this.isViewTable) 
      this.loadDataFromServer();
    else 
      this.getLstTreeData();
  }
  
  showDetail(): void {
    this.isVisibleDetail = true;
    this.data = this.selectedItem;
  }

  closeModalDetail = ($event: boolean) => this.isVisibleDetail = $event;

  /**
   * BEGIN FOR TREE TABLE
   */

   async getLstTreeData() {
    try {
      this.resetBtn();
      this.loadTree = true;
      const payload = { deciid: '', decilevel: '0' }
      const datas = await this.getTreeData(payload);
      datas.subscribe(res => {
          if (res) {
            this.listOfMapData = res;
            for (const dt of res) {
              this.mapOfExpandedData[dt.deciid] = this.convertTreeToList(dt);
            }
           this.loadTree = false;
          }
        }
      )
    } catch(err){console.log(err), this.loadTree = false}
  }

  async getTreeData(payload) {
    return this.categoriesService.getFnFindDecision(payload);
  }

  async collapse(array: TreeNodeInterface[], data: TreeNodeInterface, $event: boolean) {
    if ($event) {
      if (!data.children) {
        this.loadTree = true;
        let level = +data.decilevel;
        const childload = { deciid: data.deciid, decilevel: ++level }
        const children = await this.getTreeData(childload);
        children.subscribe(res => {
          if (res) {
            data.children = res;
            this.mapOfExpandedData[data.deciid] = this.convertTreeToList(data, true);
            this.loadTree = false;
          }
          }, err => {console.log(err), this.loadTree = false});
      }
    }

    if (!$event) {
      if (data.plusChildren === 'Y') {
        if (data.children) {
          setTimeout(() => {
            if (data.children) {
              data.children.forEach(d => {
                const target = array?.find(a => a.deciid === d.deciid);
                target.expand = false;
                this.collapse(array, target, false);
              });
            }
          }, 10)
        }
      } else {
        return;
      }
    }
  }
 
  convertTreeToList(root: TreeNodeInterface, optExpand = false): TreeNodeInterface[] {
    const stack: TreeNodeInterface[] = [];
    const array: TreeNodeInterface[] = [];
    const hashMap = {};
    stack.push({ ...root, expand: optExpand });

    while (stack.length !== 0) {
      const node = stack?.pop();
      this.visitNode(node, hashMap, array);
      if (node.children) {
        for (let i = node.children.length - 1; i >= 0; i--) {
          stack.push({ ...node.children[i], expand: false, parent: node });
        }
      }
    }

    return array;
  }

   visitNode(node: TreeNodeInterface, hashMap: { [key: string]: boolean }, array: TreeNodeInterface[]): void {
     if (!hashMap[node.deciid]) {
       hashMap[node.deciid] = true;
       array.push(node);
     }
   }

   forwardTable() {
     this.forwardValue = !this.forwardValue;
     if (this.forwardValue) {
        this.isViewTable = true;
        this.titleTable = 'Hiển thị dạng cây';
     } else {
        this.isViewTable = false;
        this.titleTable = 'Hiển thị dạng bảng';
        this.getLstTreeData();
     }
   }
}
