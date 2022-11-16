import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {AppConfigService} from '../../../../../app-config.service';

@Component({
  selector: 'app-f-caselaw',
  templateUrl: './f-caselaw.component.html',
  styleUrls: ['./f-caselaw.component.scss']
})
export class FCaselawComponent implements OnInit, OnChanges {
  @Input() sppCase: any;
  @Input() datas: any[];
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
  ngOnChanges(): void {
  }

  ngOnInit(): void {
    this.loading = false;
    this.pageSize = this.configService.getConfig().pageSize;
    this.page = this.configService.getConfig().page;
    this.defaultPage = this.configService.getConfig().defaultPage;
  }
  getRowIndex = (index, pageIndex, pageSize) => index + 1 + pageSize * (pageIndex - 1);

  cancel() {}

  confirm(lawcode) {
    this.deleteRow.emit(lawcode);
  }
}
