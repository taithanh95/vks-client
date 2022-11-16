import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {AppConfigService} from '../../../../../app-config.service';
import {GeneralService} from '../../../../service/general-service';
import {NzMessageService} from 'ng-zorro-antd/message';
import {CategoriesService} from '../../../../service/categories.service';

@Component({
  selector: 'app-f-spp-damaged',
  templateUrl: './f-spp-damaged.component.html',
  styleUrls: ['./f-spp-damaged.component.scss']
})
export class FSppDamagedComponent implements OnInit, OnChanges {
  @Input() sppCase: any;
  @Input() datas: any[];
  @Output() registerChange: EventEmitter<any> = new EventEmitter();
  @Output() showPopup: EventEmitter<any> = new EventEmitter();
  @Output() showPopupDisable: EventEmitter<any> = new EventEmitter();
  @Output() showPopupLegal: EventEmitter<any> = new EventEmitter();
  @Output() showPopupDecisionAcc: EventEmitter<any> = new EventEmitter();
  @Input() lstSppDamaged: any[];
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

  ngOnChanges(changes: SimpleChanges): void {}
  
  showInsert(): void {
    this.showPopup.emit(null);
  }

  u(f: string): any {
    return f.toUpperCase();
  }

  f(data, f): any {
    return data[f.toUpperCase()];
  }

  cancel(): void {
  }

  confirm(code): void {
    this.deleteRow.emit(code);
  }

  showEditForm(data): void {
    this.showPopup.emit(data);
  }

  showDisable(data): void {
    this.showPopupDisable.emit(data);
  }
  
}
