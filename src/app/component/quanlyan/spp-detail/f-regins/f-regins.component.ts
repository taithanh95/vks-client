import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AppConfigService} from '../../../../../app-config.service';
import {GeneralService} from '../../../../service/general-service';
import {CategoriesService} from '../../../../service/categories.service';
import {NzMessageService} from 'ng-zorro-antd/message';

@Component({
  selector: 'app-f-regins',
  templateUrl: './f-regins.component.html',
  styleUrls: ['./f-regins.component.scss']
})
export class FReginsComponent implements OnInit {
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
    private nzMessageService: NzMessageService,
    private categoriesService: CategoriesService
  ) { }

  ngOnInit(): void {
    this.loading = false;
    this.pageSize = this.configService.getConfig().pageSize;
    this.page = this.configService.getConfig().page;
    this.defaultPage = this.configService.getConfig().defaultPage;
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
  showUpdate(): void {
    this.showPopup.emit({name: 'update'});
  }
  toPositionName(pos): any {
    return this.categoriesService.getPositionName(pos);
  }

  cancel(): void {
    // this.nzMessageService.info('click cancel');
  }

  confirm(regiCode): void {
    // this.nzMessageService.info('click confirm');
    this.deleteRow.emit(regiCode);
  }
  showEditForm(data): void {
    this.showPopup.emit(data);
  }
  showDisableForm(data): void {
    this.showPopupDisable.emit(data);
  }
  getRowIndex = (index, pageIndex, pageSize) => index + 1 + pageSize * (pageIndex - 1);
}

