export abstract class TableTreeExpandAbstract {
  prop: string;
  childrenProp: string;
  mapOfExpandedData: { [key: string]: any[] } = {};
  mapOfExpandId: { [key: string]: boolean } = {};
  listOfAllData: any[] = [];

  constructor(prop: string, childrenProp: string) {
    this.prop = prop;
    this.childrenProp = childrenProp;
  }

  setListOfAllData(listOfAllData: any[]) {
    this.listOfAllData = listOfAllData.map(item => {
      return Object.assign({}, item);
    });
  }

  collapse(array: any[], data: any, $event: boolean): void {
    if (!$event) {
      if (data[this.childrenProp]) {
        data[this.childrenProp].forEach(d => {
          const target = array.find(a => a[this.prop] === d[this.prop])!;
          this.mapOfExpandId[target[this.prop]] = false;
          this.collapse(array, target, false);
        });
      } else {
        return;
      }
    }
  }

  convertTreeToList(root: any, expand?: boolean): any[] {
    const stack: any[] = [];
    const array: any[] = [];
    const hashMap = {};
    stack.push({ ...root, level: 0 });
    if (expand !== undefined) {
      this.mapOfExpandId[root[this.prop]] = expand;
    }

    while (stack.length !== 0) {
      const node = stack.pop()!;
      this.visitNode(node, hashMap, array);
      if (node[this.childrenProp]) {
        for (let i = node[this.childrenProp].length - 1; i >= 0; i--) {
          stack.push({ ...node[this.childrenProp][i], level: node.level! + 1, parent: node });
          if ( expand !== undefined ) {
            this.mapOfExpandId[node[this.childrenProp][i][this.prop]] = expand;
          }
        }
      }
    }

    return array;
  }

  visitNode(node: any, hashMap: { [key: string]: boolean }, array: any[]): void {
    if (!hashMap[node[this.prop]]) {
      hashMap[node[this.prop]] = true;
      array.push(node);
    }
  }
}
