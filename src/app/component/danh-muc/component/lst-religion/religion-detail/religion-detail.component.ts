import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-religion-detail',
  templateUrl: './religion-detail.component.html',
  styleUrls: ['./religion-detail.component.scss']
})
export class ReligionDetailComponent {

  @Input() data: any;
  @Input() isVisible: boolean;
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter();

  handleCancel(): void {
    this.isVisible = false;
    this.closeModal.emit(false);
  }
}
