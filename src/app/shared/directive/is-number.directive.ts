import {Directive, HostListener, ElementRef} from '@angular/core';

@Directive({
  selector: 'input[appIsNumber]'
})
export class IsNumberDirective {
  constructor(private _el: ElementRef) {
  }

  @HostListener('keypress', ['$event']) onKeyDown(event) {
    let e = <KeyboardEvent>event;
    if (e.charCode < 48 || e.charCode >= 58) {
      e.preventDefault();
    }
  }

  // @HostListener('input', ['$event']) onInputChange(event) {
  //   const initialValue = this._el.nativeElement.value;
  //   this._el.nativeElement.value = initialValue.replace(/[^0-9]*/g, '');
  //   if ( initialValue !== this._el.nativeElement.value) {
  //     event.stopPropagation();
  //   }
  // }

}
