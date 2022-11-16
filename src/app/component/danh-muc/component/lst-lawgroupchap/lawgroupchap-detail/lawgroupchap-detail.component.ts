import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-lawgroupchap-detail',
  templateUrl: './lawgroupchap-detail.component.html',
  styleUrls: ['./lawgroupchap-detail.component.scss']
})
export class LawgroupchapDetailComponent {

  @Input() data: any;
  @Input() isVisible: boolean;
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter();

  handleCancel(): void {
    this.isVisible = false;
    this.closeModal.emit(false);
  }
}
