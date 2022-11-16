import {Component, OnInit} from '@angular/core';
import {NotificationService} from "../../../../service/notification.service";
import {GeneralService} from "../../../../service/general-service";

@Component({
  selector: 'app-monitor-search',
  templateUrl: './monitor-search.component.html',
  styleUrls: ['./monitor-search.component.scss']
})
export class MonitorSearchComponent implements OnInit {
  /* Show Dialogs*/
  isVisibleResult: boolean;
  /*page*/
  page: any;
  pageSize: any;
  defaultPage: any;
  pageIndex: any;
  total: any;
  loading: boolean;

  /*search filter*/
  datas: any[];
  filterItem: any;
  selectedItem: any;
  sppId: any;
  data: any;

  /* Button display*/
  isUpdBtn: boolean;
  isDeleteBtn: boolean;
  isDetailBtn: boolean;
  isBtnUpdDisabled: boolean;
  lstSpps: any;

  constructor(
    private notificationService: NotificationService,
    private generalService: GeneralService,
  ) {
  }

  ngOnInit(): void {
    localStorage.setItem("SPP_TRACUU", JSON.stringify([localStorage.getItem("sppid")]));
    localStorage.setItem("UNDERLEVEL_TRACUU", "false");

    this.resetFilter();
    this.getListSpp();
  }

  resetFilter() {
    this.filterItem = {
      sppid: [localStorage.getItem("sppid")]
    };
  }

  changeUnderLevel(e: any) {
    localStorage.setItem("UNDERLEVEL_TRACUU", this.filterItem.underlevel);
  }

  onInputSpp(e: any): void {
    const value = (e.target as HTMLInputElement).value;
    if (!value || value.indexOf('@') >= 0) {
      this.lstSpps = [];
    } else {
      this.generalService.getChildSPPSearch(value).subscribe(res => {
        this.lstSpps = res;
      });
    }
  }

  getListSpp() {
    this.generalService.getChildSPPSearch('').subscribe(res => {
      this.lstSpps = res;
    });
  }

  sppChange(e: any) {
    localStorage.setItem("SPP_TRACUU", JSON.stringify(this.filterItem.sppid));
  }
}
