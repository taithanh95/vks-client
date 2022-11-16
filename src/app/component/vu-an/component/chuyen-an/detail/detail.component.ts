import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {
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
  
  f(f): any {
    return f === 'G1' ? 'Kiểm sát điều tra' : 
    f === 'G2' ? 'Truy tố' : 
    f === 'G3' ? 'Sơ thẩm' : 
    f === 'G4' ? 'Phúc thẩm' : 
    f === 'G5' ? 'Giám đốc thẩm/Tái thẩm' : null
  }
}
