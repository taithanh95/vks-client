import { Component, OnInit } from '@angular/core';
import {ConstantService} from "../../../../../../service/constant.service";
import {NotificationService} from "../../../../../../service/notification.service";
import {GeneralService} from "../../../../../../service/general-service";
import {AppConfigService} from "../../../../../../../app-config.service";
import {DateChangeService} from "../../../../../../service/date-change.service";
import {DateService} from "../../../../../../common/util/date.service";
import {Constant} from "../../../../../../shared/constants/constant.class";

@Component({
  selector: 'app-tab-verify',
  templateUrl: './tab-verify.component.html',
  styleUrls: ['./tab-verify.component.scss']
})
export class TabVerifyComponent implements OnInit {
  filterItem: any;
  isVisibleResult: boolean;
  listVerifyIds: any = ConstantService.LIST_TYPE_VERIFY;
  constructor(
      private notificationService: NotificationService,
      private generalService: GeneralService,
      private configService: AppConfigService,
      private datechangeService: DateChangeService,
      private dateService: DateService,
  ) { }

  ngOnInit(): void {

    this.filterItem = {...this.filterItem,
      verifyId: 'case_dupplicate',
      fdateVerify: this.dateService.getDayOfPreviousYear(),
      tdateVerify: this.dateService.getCurrentDate()
    }
  }

  onValueFDate(event: any) {
    this.filterItem.fdateVerify = this.datechangeService.onDateValueChange(event);
  }

  onValueTDate(event: any) {
    this.filterItem.tdateVerify = this.datechangeService.onDateValueChange(event);
  }

  validateOnlyNumbers(event: KeyboardEvent): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    return !(charCode > 31 && (charCode < 48 || charCode > 57));
  }
  showResult(): void {
    this.isVisibleResult = true;
  }

  closeModalResult = ($event: boolean) => this.isVisibleResult = $event;
}
