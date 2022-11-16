import {Component, Input, OnInit} from '@angular/core';
import {NotificationService} from "../../../../../../service/notification.service";
import {GeneralService} from "../../../../../../service/general-service";
import {AppConfigService} from "../../../../../../../app-config.service";
import {DateChangeService} from "../../../../../../service/date-change.service";
import {DateService} from "../../../../../../common/util/date.service";
import {WebUtilities} from "../../../../../../shared/utils/qla-utils.class";
import {ConstantService} from "../../../../../../service/constant.service";

@Component({
  selector: 'app-tab-accused',
  templateUrl: './tab-accused.component.html',
  styleUrls: ['./tab-accused.component.scss']
})
export class TabAccusedComponent implements OnInit {
  filterItem: any;
  isVisibleResult: boolean;
  listTypeAccused: any = ConstantService.LIST_TYPE_ACCUSED;
  listUseFor: any = ConstantService.LIST_USE_FOR;
  lstSpps: any;

  constructor(
    private notificationService: NotificationService,
    private generalService: GeneralService,
    private configService: AppConfigService,
    private datechangeService: DateChangeService,
    private dateService: DateService) {
  }

  ngOnInit(): void {
    this.filterItem = {...this.filterItem,
      typeAccused: '1',
      usefor: 'G1',
      fdateAccused: this.dateService.getDayOfPreviousYear(),
      tdateAccused: this.dateService.getCurrentDate()
    }

  }

  resetFilter() {

  }


  onValueFDate(event: any) {
    this.filterItem.fdateAccused = this.datechangeService.onDateValueChange(event);
  }

  onValueTDate(event: any) {
    this.filterItem.tdateAccused = this.datechangeService.onDateValueChange(event);
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
