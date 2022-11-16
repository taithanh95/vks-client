import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-againsresualt-detail',
  templateUrl: './againsresualt-detail.component.html',
  styleUrls: ['./againsresualt-detail.component.scss']
})
export class AgainsresualtDetailComponent {

  @Input() data: any;
  @Input() isVisible: boolean;
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter();

  handleCancel(): void {
    this.isVisible = false;
    this.closeModal.emit(false);
  }
}
