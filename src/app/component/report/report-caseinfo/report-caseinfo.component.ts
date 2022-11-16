import { Component, HostListener, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { GeneralService } from '../../../service/general-service';
import { WebUtilities } from '../../../shared/utils/qla-utils.class';

@Component({
  selector: 'app-report-caseinfo',
  templateUrl: './report-caseinfo.component.html',
  styleUrls: ['./report-caseinfo.component.scss']
})
export class ReportCaseinfoComponent implements OnInit {
  // EXPORT DETAIL CASE
  innerHtml: SafeHtml | string;
  sppid: string;
  isSpinning: boolean;
  caseCode: string;

  scrHeight: any;
  base64Pdf: any;

  constructor(
    private sanitizer: DomSanitizer,
    private generalService: GeneralService,
    private route: ActivatedRoute
  ) {
    this.sppid = WebUtilities.getLoggedSppId();
    this.route.params.subscribe(routeParams => {
      const casecode = routeParams.casecode;
      this.caseCode = casecode;
    });
    this.getScreenSize();
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
    this.scrHeight = window.innerHeight;
    this.getBas64PDF(this.scrHeight);
  }

  ngOnInit(): void {
    this.isSpinning = true;
    this.showDetailPDF();
  }

  showDetailPDF() {
    const payload = {
      casecode: this.caseCode,
      regicode: `SPP${this.sppid}`
    }
    this.generalService.exportPDF(payload)
      .toPromise()
      .then(resJson => {
        if (resJson.responseCode === '0000') {
          this.isSpinning = false;
          this.base64Pdf = 'data:application/pdf;base64,' + resJson.responseData;
          this.getBas64PDF(this.scrHeight);
        }
      }).catch(err => this.innerHtml = err.error.text);
  }

  getBas64PDF(height?) {
    if (this.base64Pdf) {
      this.innerHtml = this.sanitizer.bypassSecurityTrustHtml(
        `<object data="${this.base64Pdf}" type="application/pdf" class="w-100" height="${height}" allowfullscreen>Không đọc được file pdf</object>`);
    }
  }

}