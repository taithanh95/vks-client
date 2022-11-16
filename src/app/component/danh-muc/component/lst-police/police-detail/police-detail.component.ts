import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-police-detail',
  templateUrl: './police-detail.component.html',
  styleUrls: ['./police-detail.component.scss']
})
export class PoliceDetailComponent implements OnInit {
  @Input() data: any;
  @Input() isVisible: boolean;
  @Output() closeModal: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  handleCancel(): void {
    this.isVisible = false;
    this.closeModal.emit(false);
  }

}
