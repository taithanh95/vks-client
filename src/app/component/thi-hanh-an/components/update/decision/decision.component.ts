import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AppConfigService} from '../../../../../../app-config.service';
@Component({
  selector: 'app-decision',
  templateUrl: './decision.component.html',
  styleUrls: ['./decision.component.scss']
})
export class DecisionComponent implements OnInit {
  @Input() isCheck: boolean;
  @Input() datas: any[];
  @Input() register: any;
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
    private configService: AppConfigService
  ) { }

  ngOnInit(): void {
    this.loading = false;
    this.pageSize = this.configService.getConfig().pageSize;
    this.page = this.configService.getConfig().page;
    this.defaultPage = this.configService.getConfig().defaultPage;
  }

  f(data, f):any {
    return data[f.toUpperCase()];
  }
  cancel = () => null;

  confirm(item): void {
    this.deleteRow.emit(item);
  }
  showInsert(): void {
    this.showPopup.emit();
  }
  showEditForm(data): void {
    this.showPopup.emit(data);
  }
  showDisableForm(data): void {
    this.showPopupDisable.emit(data);
  }
  getRowIndex = (index, pageIndex, pageSize) => index + 1 + pageSize * (pageIndex - 1);
}
