import { PipeTransform, Pipe } from '@angular/core';

@Pipe({
  name: 'filter',
})
export class FilterPipe implements PipeTransform {
  transform(items: any[], searchText: string, columName: string): any[] {
    if (!items) { return []; }
    if (!searchText) { return items; }
    searchText = searchText.toLowerCase();
    return items.filter((it) => {
      if (it[columName]) {
      return it[columName].toLowerCase().includes(searchText);
      } else { return null; }
    });
  }
}
