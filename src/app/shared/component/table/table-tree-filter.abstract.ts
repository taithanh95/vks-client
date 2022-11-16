import { TableTreeSelectionAbstract } from './table-tree-selection.abstract';

export abstract class TableTreeFilterAbstract extends TableTreeSelectionAbstract {

    copyArray(items: any[]): any[] {
        const res = items.map(item => {
          if (item[this.childrenProp] && item[this.childrenProp].length >= 0) {
            this.copyArray(item[this.childrenProp]);
          }
          return JSON.parse(JSON.stringify(item));
        });
        return res;
    }

    setExpandSearchItem(items: any[], item: any): void {
        const target = items.find(a => {
          if (item.parent) {
            return item.parent[this.prop] === a[this.prop] && a.level === item.level - 1;
          }
          return false;
        });
        if (target !== undefined) {
          this.mapOfExpandId[target[this.prop]] = true;
          this.setExpandSearchItem(items, target);
        }
    }


    searchNode(node: any, searchText: string) {
        const item = this.convertNode(node);
        if (node.name.toLowerCase().includes(searchText)) {
          this.mapOfExpandId[item[this.prop]] = false;
          this.listOfDisplayData.forEach(i => {
            this.setExpandSearchItem(this.mapOfExpandedData[i[this.prop]], item);
          });
          // if (node.children) {
          //   node.children = node.children.filter(i => this.searchNode(i, searchText));
          // }
          return true;
        }
        if (node[this.childrenProp]) {
          return (node[this.childrenProp] = node[this.childrenProp].filter(i => this.searchNode(i, searchText))).length;
        }
      }

      // searchData(searchText: string, searchData: any[]) {
      //   const filter = searchText.trim().toLowerCase();

      //   searchData = this.copyArray(this.listOfAllData);
      //   if (filter.length > 0) {
      //     searchData = searchData.filter(i => this.searchNode(i, filter));
      //     searchData.forEach((i) => {
      //       this.mapOfExpandedData[i[this.prop]] = this.convertTreeToList(i);
      //     });
      //   } else {
      //     searchData.forEach((i) => {
      //       this.mapOfExpandedData[i[this.prop]] = this.convertTreeToList(i, false);
      //     });
      //   }
      // }

      abstract searchData(): void;

}
