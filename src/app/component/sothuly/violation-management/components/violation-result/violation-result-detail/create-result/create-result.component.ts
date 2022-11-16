import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Constant} from "../../../../../../../shared/constants/constant.class";
import {GeneralService} from "../../../../../../../service/general-service";
import {NotificationService} from "../../../../../../../service/notification.service";

@Component({
  selector: 'app-create-result',
  templateUrl: './create-result.component.html',
  styleUrls: ['./create-result.component.scss']
})
export class CreateResultComponent implements OnInit {
  @Input() isVisible: boolean;
  @Output() submit: EventEmitter<any> = new EventEmitter();
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter();

  data: any;
  isSubmited = false;
  lstStages = [];
  lstViolates_interim = [];
  lstStandard1_interim = [];
  lstStandard2_interim = [];
  lstViolates = [];
  lstStandard1 = [];
  lstStandard2 = [];
  resultContent: any;
  stageName: any;
  statisticalviolationName: string;
  tieuchimotName: string;
  tieuchihaiName: string;

  constructor(
    private generalService: GeneralService,
    private notification: NotificationService
  ) {
  }

  ngOnInit(): void {
    this.data = {
      stage: null,
      statisticalviolation: null,
      tieuchimot: null,
      tieuchihai: null
    };
    this.getLstReport();
  }

  ngOnChanges() {
    if (this.isVisible) {
      this.getLstReport();
      this.reloadLstGiaidoan();
    }
  }


  reloadLstGiaidoan() {
    this.getLstViolation();
    this.getlstStandard1();
    this.getlstStandard2();
  }

  getLstReport() {
    this.setLstReport(1);
    this.setLstReport(2);
    this.setLstReport(3);
    this.setLstReport(4);
  }

  setLstReport(level) {
    this.generalService.getListReport({status: 1, pageIndex: 0, pageSize: 1000, level: level}).toPromise().then(
      resp => {
        if (resp.responseCode !== '0000') {
          resp.responseData.content = [];
        }
        if (level === 1) {
          this.lstStages = resp.responseData.content;
        } else if (level === 2) {
          this.lstViolates_interim = resp.responseData.content;
        } else if (level === 3) {
          this.lstStandard1_interim = resp.responseData.content;
        } else {
          this.lstStandard2_interim = resp.responseData.content;
        }
      }, err => {
        this.notification.showNotification(Constant.ERROR, err.responseMessage)
      });
  }


  getLstViolation() {
    this.lstViolates = [];
    if (this.data.stage) {
      this.lstViolates = [...this.lstViolates, ...this.lstViolates_interim.filter(n => n.parent == this.data.stage)];
    } else {
      this.data.statisticalviolation = null;
      this.data.tieuchimot = null;
      this.data.tieuchihai = null;
    }
  }

  getlstStandard1() {
    this.lstStandard1 = [];
    this.statisticalviolationName = '';
    if (this.data.statisticalviolation && this.data.statisticalviolation.length > 0) {
      this.data.statisticalviolation.forEach(e => {
        this.lstStandard1 = [...this.lstStandard1, ...this.lstStandard1_interim.filter(n => n.parent == e.id)];
        this.statisticalviolationName = (this.statisticalviolationName != '') ? (this.statisticalviolationName + '; ' + e.name) : (this.statisticalviolationName + e.name);
      }, []);
    } else {
      this.data.tieuchimot = null;
      this.data.tieuchihai = null;
    }
  }

  getlstStandard2() {
    this.lstStandard2 = [];
    this.tieuchimotName = '';
    if (this.data.tieuchimot && this.data.tieuchimot.length > 0) {
      this.data.tieuchimot.forEach(e => {
        this.lstStandard2 = [...this.lstStandard2, ...this.lstStandard2_interim.filter(n => n.parent == e.id)];
        this.tieuchimotName = this.tieuchimotName + '; ' + e.name;
      }, [])
    } else {
      this.data.tieuchihai = null;
    }
  }

  handleOk() {
    if (this.data.stage) {
      this.stageName = this.lstStages.filter(e => e.id == this.data.stage);
      if (this.data.tieuchihai && this.data.tieuchihai.length > 0) {
        this.tieuchihaiName = '';
        this.data.tieuchihai.forEach(e => {
          this.tieuchihaiName = this.tieuchihaiName + '; ' + e.name;
        }, [])
      }
      this.resultContent = this.stageName[0].name + ': ' + (this.statisticalviolationName ? this.statisticalviolationName : '')
        + (this.tieuchimotName ? this.tieuchimotName : '') + (this.tieuchihaiName ? this.tieuchihaiName : '');
    }
    this.submit.emit(this.resultContent);
    this.closeModal.emit(false);
  }

  handleCancel() {
    this.closeModal.emit(false), this.isVisible = false
  }
}
