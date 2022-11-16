import {Directive, ElementRef, HostListener} from '@angular/core';
// import {BsLocaleService} from 'ngx-bootstrap/datepicker';
// import {defineLocale, viLocale} from 'ngx-bootstrap/chronos';

// defineLocale('vi', viLocale);

@Directive({
  selector: 'input[appMaskDate]'
})
export class MaskDateDirective {
  constructor(
    private _el: ElementRef,
    // private localeService: BsLocaleService
  ) {
    // viLocale.invalidDate = '';
    // defineLocale('vi', viLocale);
    // this.localeService.use('vi');
  }

  @HostListener('keypress', ['$event']) onKeypressInput(event) {
    if (event.keyCode < 47 || event.keyCode > 57) {
      event.preventDefault();
    }
    const len = this._el.nativeElement.value.length;
    if (len !== 1 || len !== 3) {
      if (event.keyCode === 47) {
        event.preventDefault();
      }
    }

    if (len === 2) {
      this._el.nativeElement.value += '/';
    }

    if (len === 5) {
      this._el.nativeElement.value += '/';
    }

    if (len === 10) {
      event.preventDefault();
    }
  }
}
