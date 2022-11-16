import {Component, Input, OnInit} from '@angular/core';
import {Accused} from '../../model/so-thu-ly.model';

@Component({
  selector: 'app-accused-details',
  templateUrl: './accused-details.component.html',
  styleUrls: ['./accused-details.component.scss']
})
export class AccusedDetailsComponent implements OnInit {
  @Input() accused: Accused;
  collapse = true;

  constructor() {
  }

  ngOnInit(): void {
  }

  toggleCollapse() {
    this.collapse = !this.collapse;
  }

}
