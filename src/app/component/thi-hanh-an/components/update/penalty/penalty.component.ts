import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AppConfigService} from 'src/app-config.service';
import {SppRegister} from '../../../model/spp-register';

@Component({
  selector: 'app-penalty',
  templateUrl: './penalty.component.html',
  styleUrls: ['./penalty.component.scss']
})
export class PenaltyComponent implements OnInit {
  @Input() datas: any[];
  @Input() register: SppRegister;
  @Output() showPopup: EventEmitter<any> = new EventEmitter();
  @Output() showPopupDisable: EventEmitter<any> = new EventEmitter();
  @Output() deleteRow: EventEmitter<any> = new EventEmitter();
  collapse = true;
  pageSize: any;
  page: any;
  defaultPage: any;
  loading: boolean;

  constructor(private configService: AppConfigService) {}

  ngOnInit(): void {
    this.loading = false;
    this.pageSize = this.configService.getConfig().pageSize;
    this.page = this.configService.getConfig().page;
    this.defaultPage = this.configService.getConfig().defaultPage;
  }

  showInsert(): void {
    this.showPopup.emit(null);
  }

  showEditForm(data): void {
    this.showPopup.emit(data);
  }

  cancel = () => null;

  confirm(data): void {
    this.deleteRow.emit(data);
  }

  showDisableForm(data): void {
    this.showPopupDisable.emit(data);
  }

  toggleCollapse(): void {
    this.collapse = !this.collapse;
  }

  numberOnly(event: KeyboardEvent): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    return !(charCode > 31 && (charCode < 48 || charCode > 57));
  }

  disableBtnCreate(): boolean {
    return this.datas.length === 1 || !this.register || !this.register.regicode || !this.register.accucode;
  }
}
