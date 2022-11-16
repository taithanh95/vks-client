import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { GeneralService } from 'src/app/service/general-service';
import { WebUtilities } from 'src/app/shared/utils/qla-utils.class';

@Component({
  selector: 'app-d-report-caseinfo',
  templateUrl: './d-report-caseinfo.component.html',
  styleUrls: ['./d-report-caseinfo.component.scss']
})
export class DReportCaseinfoComponent implements OnChanges {
  @Input() isVisible: boolean;
  @Input() caseCode: string;
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter();

  // EXPORT DETAIL CASE
  innerHtml: SafeHtml | string;
  sppid: string;
  isSpinning: boolean;

  constructor(
    private sanitizer: DomSanitizer,
    private generalService: GeneralService,
  ) {
    this.sppid = WebUtilities.getLoggedSppId();
  }

  ngOnChanges(): void {
    if (this.isVisible) {
      this.isSpinning = true;
      this.showDetailPDF(this.caseCode);
    }
  }

  showDetailPDF(CASECODE) {
    const payload = {
      casecode : CASECODE,
      regicode : `SPP${this.sppid}`
    }
    this.generalService.exportPDF(payload)
    .toPromise()
    .then(resJson => {
      if (resJson.responseCode === '0000') {
        this.isSpinning = false;
        const base64Pdf = 'data:application/pdf;base64,' + resJson.responseData;
        this.innerHtml = this.sanitizer.bypassSecurityTrustHtml(
          `<object data="${base64Pdf}" type="application/pdf" class="w-100" height="500">Không đọc được file pdf</object>`);
      }
    }).catch(err => this.innerHtml = err.error.text);
  }
   
  handleCancelModal=()=> {
    this.isVisible = false;
    this.closeModal.emit();
  };
}
