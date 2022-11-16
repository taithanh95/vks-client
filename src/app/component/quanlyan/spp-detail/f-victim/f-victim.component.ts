import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {AppConfigService} from '../../../../../app-config.service';
import {GeneralService} from '../../../../service/general-service';
import {NzMessageService} from 'ng-zorro-antd/message';
import {CategoriesService} from '../../../../service/categories.service';

@Component({
  selector: 'app-f-victim',
  templateUrl: './f-victim.component.html',
  styleUrls: ['./f-victim.component.scss']
})
export class FVictimComponent implements OnInit, OnChanges {
  @Input() sppCase: any;
  @Input() datas: any[];
  @Output() registerChange: EventEmitter<any> = new EventEmitter();
  @Output() showPopup: EventEmitter<any> = new EventEmitter();
  @Output() showPopupLegal: EventEmitter<any> = new EventEmitter();
  @Output() showPopupDecisionAcc: EventEmitter<any> = new EventEmitter();
  @Input() victims: any[];
  @Input() register: any;
  @Output() deleteRow: EventEmitter<any> = new EventEmitter();
  @Output() updateBC: EventEmitter<any> = new EventEmitter();
  isCollapse = true;
  pageSize: any;
  page: any;
  defaultPage: any;
  loading: boolean;

  /* selection */
  checked = false;
  indeterminate = false;
  setOfCheckedId = new Set<any>();
  defaultCheckedId = new Set<any>();

  toggleCollapse() {
    this.isCollapse = !this.isCollapse;
  }

  constructor(
    private configService: AppConfigService,
    private generalService: GeneralService,
    private nzMessageService: NzMessageService,
    private categoriesService: CategoriesService
  ) {
  }
  ngOnInit(): void {
    this.loading = false;
    this.pageSize = this.configService.getConfig().pageSize;
    this.page = this.configService.getConfig().page;
    this.defaultPage = this.configService.getConfig().defaultPage;
  }
  ngOnChanges(changes: SimpleChanges): void {

    if (this.victims) {
      this.setOfCheckedId = new Set<any>();
      this.defaultCheckedId = new Set<any>();
      this.victims.forEach(item => this.updateAvaiable(item));
      this.victims.forEach(item => this.defaultSelected(item));
      this.refreshCheckedStatus();
    }
  }
  onRowSelect(selectedItem): void {
    this.registerChange.emit(selectedItem);
    for (let item of this.datas) {
      item.selected = false;
    }
  }
  showInsert(): void {
    this.showPopup.emit(null);
  }
  showInsertLegal(): void {
    this.showPopupLegal.emit(null);
  }
  toPositionName(pos): any {
    return this.categoriesService.getPositionName(pos);
  }
  u(f:string):any {
    return f.toUpperCase();
  }
  f(data, f):any {
    return data[f.toUpperCase()];
  }
  cancel(): void {
  }

  confirm(code): void {
    this.deleteRow.emit(code);
  }
  insertUpdateAccused(){
    const payload = { selectedIds: this.setOfCheckedId, defaultIds: this.defaultCheckedId  };
    this.updateBC.emit(payload);
  }
  showEditForm(data): void {
    this.showPopup.emit(data);
  }
  getRowIndex = (index, pageIndex, pageSize) => index + 1 + pageSize * (pageIndex - 1);

  updateCheckedSet(id: any, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  }
  updateAvaiable(item: any){
    if (item.AVAILABLE === 1){
      this.setOfCheckedId.add(item.ACCUCODE);
    }
  }
  defaultSelected(item: any){
    if (item.AVAILABLE === 1){
      this.defaultCheckedId.add(item.ACCUCODE);
    }
  }
  onItemChecked(id: any, checked: boolean): void {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
  }

  onAllChecked(value: boolean): void {
    this.victims.forEach(item => this.updateCheckedSet(item.ACCUCODE, value));
    this.refreshCheckedStatus();
  }
  refreshCheckedStatus(): void {
    this.checked = this.victims.every(item => this.setOfCheckedId.has(item.ACCUCODE));
    this.indeterminate = this.victims.some(item => this.setOfCheckedId.has(item.ACCUCODE)) && !this.checked;
  }
}
