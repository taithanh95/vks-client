import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-admgroups-detail',
  templateUrl: './admgroups-detail.component.html',
  styleUrls: ['./admgroups-detail.component.scss']
})
export class AdmgroupsDetailComponent {

  @Input() data: any;
  @Input() isVisible: boolean;
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter();

  handleCancel(): void {
    this.isVisible = false;
    this.closeModal.emit(false);
  }
}
