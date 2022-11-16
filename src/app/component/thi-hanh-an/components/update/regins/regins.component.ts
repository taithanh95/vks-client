import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AppConfigService} from '../../../../../../app-config.service';

@Component({
  selector: 'app-regins',
  templateUrl: './regins.component.html',
  styleUrls: ['./regins.component.scss']
})
export class ReginsComponent implements OnInit {
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

  onRowSelect(selectedItem): void {
    for (const item of this.datas) {
      item.selected = false;
    }
    selectedItem.selected = true;
  }

  showInsert(): void {
    this.showPopup.emit(null);
  }

  cancel = () => null;

  confirm(regiCode): void {
    this.deleteRow.emit(regiCode);
  }

  showEditForm(data): void {
    this.showPopup.emit(data);
  }

  showDisableForm(data): void {
    this.showPopupDisable.emit(data);
  }

  getRowIndex = (index, pageIndex, pageSize) => index + 1 + pageSize * (pageIndex - 1);

  positionName = (type: string) => type === 'KS' ? 'Kiểm sát viên' : 'Điều tra viên';
}
