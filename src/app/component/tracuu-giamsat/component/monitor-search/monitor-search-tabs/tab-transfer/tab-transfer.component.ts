import { Component, OnInit } from '@angular/core';
import {DateChangeService} from "../../../../../../service/date-change.service";
import {ConstantService} from "../../../../../../service/constant.service";
import {NotificationService} from "../../../../../../service/notification.service";
import {GeneralService} from "../../../../../../service/general-service";
import {AppConfigService} from "../../../../../../../app-config.service";
import {DateService} from "../../../../../../common/util/date.service";

@Component({
  selector: 'app-tab-transfer',
  templateUrl: './tab-transfer.component.html',
  styleUrls: ['./tab-transfer.component.scss']
})
export class TabTransferComponent implements OnInit {
  filterItem: any;
  isVisibleResult: boolean;
  listTypeTransfer: any = ConstantService.LIST_TYPE_TRANSFER;
  lstSpps: any;

  constructor(private notificationService: NotificationService,
              private generalService: GeneralService,
              private configService: AppConfigService,
              private datechangeService: DateChangeService,
              private dateService: DateService
  ) { }

  ngOnInit(): void {
    this.filterItem = {...this.filterItem,
      typeTransfer: 'cqdt_vks',
      fdateTransfer: this.dateService.getDayOfPreviousYear(),
      tdateTransfer: this.dateService.getCurrentDate(),
      type: 'I'
    }
  }

  onValueFDate(event: any) {
    this.filterItem.fdateTransfer = this.datechangeService.onDateValueChange(event);
  }

  onValueTDate(event: any) {
    this.filterItem.tdateTransfer = this.datechangeService.onDateValueChange(event);
  }

  validateOnlyNumbers(event: KeyboardEvent): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    return !(charCode > 31 && (charCode < 48 || charCode > 57));
  }
  showResult(): void {
    this.isVisibleResult = true;
  }

  closeModalResult = ($event: boolean) => this.isVisibleResult = $event;

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
}
