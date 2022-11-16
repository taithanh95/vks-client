import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-admdepartment-detail',
  templateUrl: './admdepartment-detail.component.html',
  styleUrls: ['./admdepartment-detail.component.scss']
})
export class AdmdepartmentDetailComponent{

  @Input() data: any;
  @Input() isVisible: boolean;
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter();

  handleCancel(): void {
    this.isVisible = false;
    this.closeModal.emit(false);
  }
}
