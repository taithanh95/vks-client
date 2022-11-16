import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {AppConfigService} from '../../../../../app-config.service';
import {GeneralService} from '../../../../service/general-service';
import {NzMessageService} from 'ng-zorro-antd/message';
import {CategoriesService} from '../../../../service/categories.service';
import { WebUtilities } from 'src/app/shared/utils/qla-utils.class';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-f-accu',
  templateUrl: './f-accu.component.html',
  styleUrls: ['./f-accu.component.scss']
})
export class FAccuComponent implements OnInit, OnChanges {
  @Input() sppCase: any;
  @Input() datas: any[];
  @Output() registerChange: EventEmitter<any> = new EventEmitter();
  @Output() showPopup: EventEmitter<any> = new EventEmitter();
  @Output() showPopupDisabled: EventEmitter<any> = new EventEmitter();
  @Output() showPopupLegal: EventEmitter<any> = new EventEmitter();
  @Output() showPopupLegalDisabled: EventEmitter<any> = new EventEmitter();
  @Output() showPopupDecisionAcc: EventEmitter<any> = new EventEmitter();
  @Input() accus: any[];
  @Input() register: any;
  @Output() deleteRow: EventEmitter<any> = new EventEmitter();
  @Output() updateBC: EventEmitter<any> = new EventEmitter();
  isCollapse = true;
  pageSize: any;
  page: any;
  defaultPage: any;
  loading: boolean;
  sppid: any;

  /* selection */
  checked = false;
  indeterminate = false;
  setOfCheckedId = new Set<any>();
  defaultCheckedId = new Set<any>();

  toggleCollapse() {
    this.isCollapse = !this.isCollapse;
  }

  // EXPORT DETAIL CASE
  innerHtml: SafeHtml | string;
  isVisible: boolean;
  isSpinning: boolean;

  constructor(
    private configService: AppConfigService,
    private generalService: GeneralService,
    private nzMessageService: NzMessageService,
    private categoriesService: CategoriesService,
    private sanitizer: DomSanitizer
  ) {
    this.sppid = WebUtilities.getLoggedSppId();
  }
  ngOnInit(): void {
    this.loading = false;
    this.pageSize = this.configService.getConfig().pageSize;
    this.page = this.configService.getConfig().page;
    this.defaultPage = this.configService.getConfig().defaultPage;
  }
  ngOnChanges(changes: SimpleChanges): void {

    if (this.accus && this.accus.length > 0) {
      this.setOfCheckedId = new Set<any>();
      this.defaultCheckedId = new Set<any>();
      this.accus.forEach(item => this.updateAvaiable(item));
      this.accus.forEach(item => this.defaultSelected(item));
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
    if (data.LEGALPER !== 'Y')
      this.showPopup.emit(data);
    else
      this.showPopupLegal.emit(data);
  }
  showDisableForm(data): void {
    if (data.LEGALPER !== 'Y')
      this.showPopupDisabled.emit(data);
    else
      this.showPopupLegalDisabled.emit(data);
  }

  getRowIndex = (index, pageIndex, pageSize) => index + 1 + pageSize * (pageIndex - 1);

  showDecisionAcc() {
    this.showPopupDecisionAcc.emit(null);
  }

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
    this.accus.forEach(item => this.updateCheckedSet(item.ACCUCODE, value));
    this.refreshCheckedStatus();
  }
  refreshCheckedStatus(): void {
    this.checked = this.accus.every(item => this.setOfCheckedId.has(item.ACCUCODE));
    this.indeterminate = this.accus.some(item => this.setOfCheckedId.has(item.ACCUCODE)) && !this.checked;
  }

  saveListAccused() {

  }

  onTitleFullName(status): string {
    switch(status) {
      case 'O' :
        return '(Tách đi toàn bộ)';
      case 'A' :
        return '(Tách đi một phần)';
      case 'I' :
        return '(Tách đến)';
      case 'J' :
        return '(Nhập vụ)';
      default :
        return;
    }
  }

  showDetailPDF(CASECODE) {
    this.isSpinning = true;
    this.isVisible = true;
    const payload = {
      casecode : CASECODE,
      regicode : `SPP${this.sppid}`
    }
    this.generalService.exportPDF(payload)
    .toPromise()
    .then(resJson => {
      if (resJson.responseCode === '0000') {
        this.isSpinning = false;
        const base64Pdf = 'data:application/pdf;base64,' + resJson.responseData;
        this.innerHtml = this.sanitizer.bypassSecurityTrustHtml(
          `<object data="${base64Pdf}" type="application/pdf" class="w-100" height="500">Không đọc được file pdf</object>`);
      }
    }).catch(err => this.innerHtml = err.error.text);
  }
   
  handleCancel=()=>this.isVisible = false;
}
