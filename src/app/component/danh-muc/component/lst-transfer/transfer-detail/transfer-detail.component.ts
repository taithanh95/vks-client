import { Component, EventEmitter, Input, Output } from '@angular/core';


@Component({
  selector: 'app-transfer-detail',
  templateUrl: './transfer-detail.component.html',
  styleUrls: ['./transfer-detail.component.scss']
})
export class TransferDetailComponent {

  @Input() data: any;
  @Input() isVisible: boolean;
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter();

  handleCancel(): void {
    this.isVisible = false;
    this.closeModal.emit(false);
  }
}
