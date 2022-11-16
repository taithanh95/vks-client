import { TableTreeExpandAbstract } from './table-tree-expand.abstract';
import { TableSelectionInterface } from './table-selection.interface';

export abstract class TableTreeSelectionAbstract extends TableTreeExpandAbstract implements TableSelectionInterface {

  isAllDisplayDataChecked = false;
  isOperating = false;
  isAllIndeterminate = false;
  listOfDisplayData: any[] = [];
  mapOfCheckedId: { [key: string]: boolean } = {};
  mapOfIndeterminateId: { [key: string]: boolean } = {};
  numberOfChecked = 0;

  currentPageDataChange($event: any[]): void {
    this.listOfDisplayData = $event;
    this.refreshStatus();
  }

  refreshStatus(node?: any): void {
    if (node !== undefined) {
      this.mapOfIndeterminateId[node[this.prop]] = false;
    }

    this.listOfDisplayData.forEach(item => {
      if (item[this.childrenProp] !== undefined) {
        if (node !== undefined) {
          this.setChecked(this.mapOfExpandedData[item[this.prop]], node, this.mapOfCheckedId[node[this.prop]]);
          this.setIndeterminate(this.mapOfExpandedData[item[this.prop]], node);
        }
      }
    });
    this.isAllDisplayDataChecked = this.listOfDisplayData
      .every(item =>
        this.mapOfExpandedData[item[this.prop]].every(element => this.mapOfCheckedId[element[this.prop]])
      );
    this.isAllIndeterminate =
      this.listOfDisplayData.some(item =>
        this.mapOfExpandedData[item[this.prop]].some(element => this.mapOfCheckedId[element[this.prop]])) &&
      !this.isAllDisplayDataChecked;
    this.numberOfChecked = this.getCheckedIdList().length;
  }

  setIndeterminate(items: any[], item: any): void {
    const target = items.filter(a => {
      if (item.parent) {
        return item.parent[this.prop] === a[this.prop] && a.level === item.level - 1;
      }
      return false;
    });

    target.forEach(element => {
      const value = element[this.childrenProp].every(el => this.mapOfCheckedId[el[this.prop]]);
      this.mapOfCheckedId[element[this.prop]] = value;
      if (element[this.childrenProp].every(el => !this.mapOfCheckedId[el[this.prop]])) {
        this.mapOfIndeterminateId[element[this.prop]]  = this.mapOfIndeterminateId[item[this.prop]] ? true : false;
      }else {
        this.mapOfIndeterminateId[element[this.prop]] = this.mapOfIndeterminateId[item[this.prop]] ? true : !value ;
      }

      this.setIndeterminate(items, element);
    });
  }

  setChecked(items: any[], item: any, value: boolean) {
    const target = items.filter(a => {
      if (a.parent) {
        return a.parent[this.prop] === item[this.prop] && a.level === item.level + 1;
      }
      return false;
    });
    target.forEach(element => {
      this.mapOfIndeterminateId[element[this.prop]] = false;
      this.mapOfCheckedId[element[this.prop]] = value;
      this.setChecked(items, element, value);
    });
  }

  checkAll(value: boolean): void {
    this.listOfDisplayData.forEach(
      item => {
        this.mapOfExpandedData[item[this.prop]].forEach(element => {
          this.mapOfCheckedId[element[this.prop]] = value;
          this.mapOfIndeterminateId[element[this.prop]] = false;
        });
      }
    );
    this.refreshStatus();
  }

  convertNode(node: any): any {
    let obj: any = null;
    this.listOfDisplayData.forEach(item => {
      const result = this.mapOfExpandedData[item[this.prop]].find(a => (a[this.prop] === node[this.prop]));

      if (result !== undefined) { obj = result; return; }
    });
    return obj;
  }

  getCheckedIdList(searchText?: string, searchData?: any[]): number[] {
    const listIds = [];
    // let isChecked = false;

    Object.keys(this.mapOfCheckedId).forEach(key => {
      if (this.mapOfCheckedId[key]) {
        listIds.push(Number(key));
        // isChecked = true;
      }
    });

    // if (searchData !== undefined
    //   && searchText !== undefined
    //   && (searchText.trim()).length > 0
    //   && !isChecked
    // ) {
    //   searchData.forEach((item) => function f(item: any) {
    //     listIds.push(item[this.prop]);
    //     if (item[this.childrenProp]) {
    //       item[this.childrenProp].forEach(i => {
    //         f(i);
    //       });
    //     }
    //   });
    // }
    return listIds;
  }
}
