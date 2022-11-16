import { Component, OnInit } from '@angular/core';
import {NotificationService} from "../../../../../../service/notification.service";
import {GeneralService} from "../../../../../../service/general-service";
import {AppConfigService} from "../../../../../../../app-config.service";
import {DateChangeService} from "../../../../../../service/date-change.service";
import {CategoriesService} from "../../../../../../service/categories.service";
import {DateService} from "../../../../../../common/util/date.service";
import {WebUtilities} from "../../../../../../shared/utils/qla-utils.class";

@Component({
  selector: 'app-tab-against',
  templateUrl: './tab-against.component.html',
  styleUrls: ['./tab-against.component.scss']
})
export class TabAgainstComponent implements OnInit {
  filterItem: any;
  /* Show Dialogs*/
  isVisibleResult: boolean;
  sppId: any;

  constructor(
    private notificationService: NotificationService,
    private generalService: GeneralService,
    private configService: AppConfigService,
    private datechangeService: DateChangeService,
    private categoriesService: CategoriesService,
    private dateService: DateService
  ) {
    this.sppId = WebUtilities.getLoggedSppId();
  }

  ngOnInit(): void {
    this.resetFilter();
  }

  resetFilter() {
    this.filterItem = {
      sppid: this.sppId,
      fdateAgainsts: this.dateService.getDayOfPreviousYear(),
      tdateAgainsts: this.dateService.getCurrentDate()
    };
  }

  onValueFDate(event: any) {
    this.filterItem.fdateAgainsts = this.datechangeService.onDateValueChange(event);
  }

  onValueTDate(event: any) {
    this.filterItem.tdateAgainsts = this.datechangeService.onDateValueChange(event);
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
