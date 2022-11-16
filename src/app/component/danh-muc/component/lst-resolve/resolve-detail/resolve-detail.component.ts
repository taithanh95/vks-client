import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-resolve-detail',
  templateUrl: './resolve-detail.component.html',
  styleUrls: ['./resolve-detail.component.scss']
})
export class ResolveDetailComponent {

  @Input() data: any;
  @Input() isVisible: boolean;
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter();

  handleCancel(): void {
    this.isVisible = false;
    this.closeModal.emit(false);
  }
}
