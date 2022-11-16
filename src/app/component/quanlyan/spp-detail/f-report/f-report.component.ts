import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AppConfigService} from "../../../../../app-config.service";
import {GeneralService} from "../../../../service/general-service";
import {NzMessageService} from "ng-zorro-antd/message";

@Component({
  selector: 'app-f-report',
  templateUrl: './f-report.component.html',
  styleUrls: ['./f-report.component.scss']
})
export class FReportComponent implements OnInit {
  @Input() sppCase: any;
  @Input() datas: any[];
  @Input() register: any;
  @Output() registerChange: EventEmitter<any> = new EventEmitter();
  @Output() showPopup: EventEmitter<any> = new EventEmitter();
  @Output() showPopupDisable: EventEmitter<any> = new EventEmitter();
  @Output() deleteRow: EventEmitter<any> = new EventEmitter();
  isCollapse = true;
  pageSize: any;
  page: any;
  defaultPage: any;
  loading: boolean;

  toggleCollapse() {
    this.isCollapse = !this.isCollapse;
  }
  constructor(
    private configService: AppConfigService,
    private generalService: GeneralService,
    private nzMessageService: NzMessageService
  ) { }

  ngOnInit(): void {
    this.loading = false;
    this.pageSize = this.configService.getConfig().pageSize;
    this.page = this.configService.getConfig().page;
    this.defaultPage = this.configService.getConfig().defaultPage;
  }
  ngOnchanges = () => console.log(this.datas);
  onRowSelect(selectedItem): void {
    // this.registerChange.emit(selectedItem);
    // for (const item of this.datas) {
    //   item.selected = false;
    // }
    // selectedItem.selected = true;
  }
  showInsert(): void {
    this.showPopup.emit(null);
  }
  showUpdate(): void {
    this.showPopup.emit({name: 'update'});
  }
  toUseforName(useFor): any {
    return this.generalService.toUserForName(useFor);
  }
  f(data, f):any {
    return data[f.toUpperCase()];
  }
  cancel(): void {
    // this.nzMessageService.info('click cancel');
  }

  confirm(item): void {
    // this.nzMessageService.info('click confirm');
    console.log(item)
    this.deleteRow.emit(item);
  }
  showEditForm(data): void {
    this.showPopup.emit(data);
  }
  showDisableForm(data): void {
    this.showPopupDisable.emit(data);
  }
  getRowIndex = (index, pageIndex, pageSize) => index + 1 + pageSize * (pageIndex - 1);
}

