export interface TableSelectionInterface {
  currentPageDataChange($event: any[]): void;
  refreshStatus(): void;
  checkAll(value: boolean): void;
  getCheckedIdList();
}
