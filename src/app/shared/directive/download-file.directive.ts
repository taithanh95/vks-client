import {Directive, ElementRef, HostListener, Input} from '@angular/core';
import {AppConfigService} from 'src/app-config.service';
import {environment} from '../../../environments/environment';

@Directive({
  selector: 'button[appDownloadFile]'
})
export class DownloadFileDirective {

  @Input('appDownloadFile') url : string;
  baseImageUrl: string;

  @Input() fileName?: string;

  constructor(
    private configService: AppConfigService,
    private el: ElementRef) {
    this.baseImageUrl = environment.GATEWAY_URI;
  }

  @HostListener('click', ['$event.target']) onClick(el) {
    /*saveAs(this.baseImageUrl + this.url, this.fileName);*/
  }

}
