import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
  name: 'valueToDisplayText',
  pure: true
})
export class ValueToDisplayTextPipe implements PipeTransform{

  /*
  arg 0: list of objects
  arg 1: value field of object
  arg 2: name field of object
   */
  transform(value: any, ...args: any[]): any {
    const map: any[] = args[0];
    const valueField: string = args[1];
    const displayNameField: string = args[2];
    if (map && valueField && displayNameField) {
      const obj = map.filter(e => e[valueField] == value)[0];
      return obj ? obj[displayNameField] : value;
    }
    return value;
  }

}
