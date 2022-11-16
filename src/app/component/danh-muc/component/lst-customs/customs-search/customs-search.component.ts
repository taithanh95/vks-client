import {Component, OnInit} from '@angular/core';
import {NotificationService} from "../../../../../service/notification.service";
import {Router} from "@angular/router";
import {CategoriesService} from "../../../../../service/categories.service";
import {GeneralService} from "../../../../../service/general-service";
import {AppConfigService} from "../../../../../../app-config.service";
import {CookieService} from "ngx-cookie-service";
import {Constant} from "../../../../../shared/constants/constant.class";
import {NzTableQueryParams} from "ng-zorro-antd/table";
import {WebUtilities} from "../../../../../shared/utils/qla-utils.class";

export interface TreeNodeInterface {
  customid?: string;
  name?: string;
  customlevel?: string;
  expand?: boolean;
  children?: TreeNodeInterface[];
  parent?: TreeNodeInterface;
  pluschildren?: string;
}

@Component({
  selector: 'app-customs-search',
  templateUrl: './customs-search.component.html',
  styleUrls: ['./customs-search.component.scss']
})
export class CustomsSearchComponent implements OnInit {
  /* Show Dialogs*/
  isVisibleDetail: boolean;
  isVisibleEdit: boolean;
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
  spp: any;

  customid: any;
  customname: any;
  customlevel: any;

  /* Button display*/
  isUpdBtn: boolean;
  isInsBtn: boolean;
  isDeleteBtn: boolean;
  isDetailBtn: boolean;

  /**TREE TABLE */
  isViewTable = true;

  loadTree = false;

  forwardValue = true;

  titleTable = 'Hiển thị dạng cây';
  listOfMapData: TreeNodeInterface[];
  mapOfExpandedData: { [customid: string]: TreeNodeInterface[] } = {};

  constructor(
    private notificationService: NotificationService,
    private router: Router,
    private categoriesService: CategoriesService,
    private generalService: GeneralService,
    private configService: AppConfigService,
    private cookieService: CookieService
  ) {
    this.resetFilter();
    this.sppId = WebUtilities.getLoggedSppId();
  }

  ngOnInit(): void {
    if (localStorage.getItem(Constant.USER_INFO) === null
      || localStorage.getItem(Constant.USERID) !== this.cookieService.get(Constant.USERNAME)) {
      localStorage.clear();
      this.router.navigate(['login'], {queryParams: {returnUrl: this.router.routerState.snapshot.url}});
    }
    this.pageSize = this.configService.getConfig().pageSize;
    this.page = 20;
    this.defaultPage = this.configService.getConfig().defaultPage;
    this.pageIndex = 1;
  }

  resetFilter() {
    this.resetBtn();
    this.filterItem = {
      sppid: '',
      name: '',
      addr: '',
      tel: '',
      fax: '',
    };
  }

  loadDataFromServer(): void {
    if (this.enabledAutoLoadData) {
      const payload = {
        ...this.filterItem,
        size: this.defaultPage,
        page: this.defaultPage * (this.pageIndex - 1)
      }
      this.loading = true;
      this.generalService.searchCustoms(payload).subscribe(res => {
        this.loading = false;
        if (res) {
          this.datas = res.datas;
          if (this.datas.length != 0)
            this.total = this.datas[0].rowcount;
          else
            this.total = 0;
          this.resetBtn();
        } else {
          // this.notificationService.showNotification(Constant.ERROR, 'Không tìm thấy dữ liệu cần tra cứu');
          this.loading = false;
          this.datas = [];
        }
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

  showDetail(): void {
    this.isVisibleDetail = true;
  }

  closeDetail(isClose: boolean): void {
    this.isVisibleDetail = isClose;
  }

  showEditForm(): void {
    this.isVisibleEdit = true;
    this.data = WebUtilities.toLowercaseFieldsWithoutConvertBoolean(this.selectedItem);
    delete this.data.children;
    delete this.data.parent;
  }

  closeEditForm(isClose: boolean): void {
    this.isVisibleEdit = isClose;
  }

  showCreateForm(): void {
    this.data =
      {
        ...this.selectedItem,
        addr: '',
        sppid: '',
        tel: '',
        fax: '',
        director: '',
        position: ''
      }
    delete this.data.children;
    delete this.data.parent;
    this.isVisibleCreate = true;
  }

  closeCreateForm(isClose: boolean): void {
    this.isVisibleCreate = isClose;
  }

  onRowSelect(item) {
    this.selectedItem = item;
    this.toggleButtons();
  }

  resetBtn() {
    this.selectedItem = null;
    this.isDeleteBtn = true;
    this.isUpdBtn = true;
    this.isDetailBtn = true;
    this.isInsBtn = true;
  }

  getRowIndex = (index, pageIndex, pageSize) => index + 1 + pageSize * (pageIndex - 1)

  toggleButtons() {
    if (this.selectedItem) {
      const temp = this.filterItem.sendtype === 'U';
      this.isDeleteBtn = temp;
      this.isUpdBtn = temp;
      // this.isInsBtn = temp;
      this.isDetailBtn = false;
    } else {
      this.isDeleteBtn = false;
      this.isUpdBtn = false;
      // this.isInsBtn = false;
      this.isDetailBtn = true;
    }
    this.isInsBtn = (this.selectedItem.customlevel === '1' || this.selectedItem.customlevel === '2') ? false : true;
  }

  doDelete() {
    this.generalService.deleteCustoms({
      customid: this.selectedItem.customid,
      customparent: this.selectedItem.customparent
    }).subscribe(res => {
      if (res && res  !== 'success') {
        this.notificationService.showNotification(Constant.ERROR, 'Không thể xóa khi có ràng buộc dữ liệu.');
      } else {
        this.notificationService.showNotification(Constant.SUCCESS, 'Xóa Đơn vị Hải quan thành công');
        this.loadDataFromServer();
      }
    }, () => {
      this.notificationService.showNotification(Constant.ERROR, 'Không thể xóa khi có ràng buộc dữ liệu.');
    });
  }

  private resetPage() {
    this.pageSize = this.configService.getConfig().pageSize;
    this.page = 20;
    this.defaultPage = this.configService.getConfig().defaultPage;
    this.pageIndex = 1;
  }

  reloadPage(stt: boolean){
    if (this.forwardValue) {
      //stt : true (thêm mới dữ liệu thành công, false (cập nhật dữ liệu thàng công))
      if (stt) {
        this.doSearch();
      }else {
        this.loadDataFromServer();
      }
    }else {
      this.resetBtn();
      this.getLstTreeData();
    }
  }

  /**
   * BEGIN FOR TREE TABLE
   */

   async getLstTreeData() {
    this.loadTree = true;
    const payload = { id: '', level: '0' }
    this.getTreeData(payload).subscribe(res => {
      if (res) {
        this.listOfMapData = res;
        for (const dt of res) {
          this.mapOfExpandedData[dt.customid] = this.convertTreeToList(dt);
        }
        this.loadTree = false;
      }
    }, err => { console.log(err), this.loadTree = false });
  }

  getTreeData(payload) {
    return this.categoriesService.getTreeDataCustoms({ ...payload, sppid: this.sppId });
  }

  async collapse(array: TreeNodeInterface[], data: TreeNodeInterface, $event: boolean) {
    if ($event) {
      if (!data.children) {
        this.loadTree = true;
        let level = +data.customlevel;
        const childload = { id: data.customid, level: ++level };
        this.getTreeData(childload).subscribe(res => {
          if (res) {
            data.children = res;
            const node = this.getParentTreeData(data);
            this.mapOfExpandedData[node.customid] = this.convertTreeToList(node, true);
            this.loadTree = false;
          }
        }, err => { console.log(err), this.loadTree = false });
      }
    }

    if (!$event) {
      if (data.pluschildren === 'Y') {
        if (data.children) {
          data.children.forEach(d => {
            const target = array?.find(a => a.customid === d.customid);
            target.expand = false;
            this.collapse(array, target, false);
          });
        }
      } else {
        return;
      }
    }
  }


  getParentTreeData(root: TreeNodeInterface) {
    if (root.parent) {
      const parent = root.parent;
      const children = parent.children.map(child => {
        if (child.customid === root.customid) {
          return root;
        }
        return { ...child, expand: false };
      })

      parent.children = children;
      if (parent.parent) {
        return this.getParentTreeData(parent);
      } else {
        return parent;
      }
    }
    return root;
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
          stack.push({ ...node.children[i], expand: node.children[i].expand ? node.children[i].expand : false, parent: node });
        }
      }
    }

    return array;
  }

  visitNode(node: TreeNodeInterface, hashMap: { [customid: string]: boolean }, array: TreeNodeInterface[]): void {
    if (!hashMap[node.customid]) {
      hashMap[node.customid] = true;
      array.push(node);
    }
  }

  forwardTable() {
    this.forwardValue = !this.forwardValue;
    this.resetBtn();
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

