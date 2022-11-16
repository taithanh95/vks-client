import {Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';
import {NzTabPosition} from 'ng-zorro-antd/tabs';
import {NzModalRef} from 'ng-zorro-antd/modal';
import {NotificationService} from '../../../../../../service/notification.service';
import {Router} from '@angular/router';
import {ConstantService} from '../../../../../../service/constant.service';
import {CookieService} from 'ngx-cookie-service';
import {DateChangeService} from '../../../../../../service/date-change.service';
import {GeneralService} from '../../../../../../service/general-service';
import {WebUtilities} from '../../../../../../shared/utils/qla-utils.class';

@Component({
  selector: 'app-detail-register',
  templateUrl: './detail-register.component.html',
  styleUrls: ['./detail-register.component.scss']
})
export class DetailRegisterComponent implements OnInit {
  @Input() tabs: any;
  @Input() isVisible: boolean;
  @Output() closeModal: EventEmitter<any> = new EventEmitter();

  position: NzTabPosition = 'left';

  /* SEARCH FILTER*/

  sppid: any;


  /* DIALOG CONFIRM */
  @ViewChild('confirm') confirmTemplate: TemplateRef<any>;
  @ViewChild('confirmHeader') confirmHeaderTemplate: TemplateRef<any>;
  confirmModalRef: NzModalRef<any>;


  constructor() {
    this.sppid = WebUtilities.getLoggedSppId();
  }

  ngOnInit(): void {
  }

  ngOnChanges(): void {
  }

  handleCancel(): void {
    this.isVisible = false;
    this.closeModal.emit(false);
  }


}
