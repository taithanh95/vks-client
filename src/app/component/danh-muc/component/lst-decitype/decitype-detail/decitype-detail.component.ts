import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-decitype-detail',
  templateUrl: './decitype-detail.component.html',
  styleUrls: ['./decitype-detail.component.scss']
})
export class DecitypeDetailComponent {

  @Input() data: any;
  @Input() isVisible: boolean;
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter();

  handleCancel(): void {
    this.isVisible = false;
    this.closeModal.emit(false);
  }
}
