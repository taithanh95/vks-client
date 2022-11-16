import {Directive, HostListener, ElementRef} from '@angular/core';

@Directive({
  selector: 'input[appWithoutSpecialCharacters]'
})
export class RemoveSpecialCharactersDirective {
  constructor(private _el: ElementRef) {
  }

  @HostListener('input', ['$event']) onInputChange(event) {
    const initialValue = this._el.nativeElement.value;
    this._el.nativeElement.value = initialValue.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
    if ( initialValue !== this._el.nativeElement.value) {
      event.stopPropagation();
    }
  }

}
