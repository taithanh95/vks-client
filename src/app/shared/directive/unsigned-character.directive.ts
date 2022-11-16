import {Directive, ElementRef, HostListener, Renderer2} from '@angular/core';

@Directive({
  selector: '[appUnsignedCharacter]'
})
export class UnsignedCharacterDirective {

  constructor(
    private _el: ElementRef
  ) {
  }

  @HostListener('input', ['$event']) onInputChange(event) {
    const initialValue = this._el.nativeElement.value;
    this._el.nativeElement.value = initialValue.replace(/[^a-z A-Z]/g, '').toUpperCase();
    if (initialValue.toUpperCase() !== this._el.nativeElement.value) {
      event.stopPropagation();
    }
  }

}
