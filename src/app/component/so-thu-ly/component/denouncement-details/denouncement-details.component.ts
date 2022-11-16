import {Component, Input, OnInit} from '@angular/core';
import {DenouncedPerson, Denouncement} from '../../model/so-thu-ly.model';

@Component({
  selector: 'app-denouncement-details',
  templateUrl: './denouncement-details.component.html',
  styleUrls: ['./denouncement-details.component.scss']
})
export class DenouncementDetailsComponent implements OnInit {
  @Input() denouncement: Denouncement;
  collapse: boolean[] = [];
  @Input() listOfItems: DenouncedPerson[] = [];

  constructor() {
  }

  ngOnInit(): void {
    this.collapse[0] = true;
    this.collapse[1] = true;
  }

  toggleCollapse(num: number) {
    this.collapse[num] = !this.collapse[num];
  }

}
