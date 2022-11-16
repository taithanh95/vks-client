import {Directive, HostListener, ElementRef} from '@angular/core';
import { NumberUtils } from '../utils/number-utils.class';

@Directive({
  selector: 'input[appParseCurrency]'
})
export class ParseCurrencyDirective {

  constructor(private _el: ElementRef) {
  }

  @HostListener('input', ['$event']) onInputChange(event) {
    const initialValue = this._el.nativeElement.value;
    this._el.nativeElement.value = this.formatterCurrency(initialValue);
  }

  formatterCurrency = (value: string) => value ? NumberUtils.currencyFormat(value) : null;
}
