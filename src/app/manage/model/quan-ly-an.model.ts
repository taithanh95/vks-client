import {OnDestroy, OnInit} from '@angular/core';

export class QuanLyAnModel implements OnInit, OnDestroy {
  ngOnInit() {
  }

  ngOnDestroy() {
  }
}

export interface Conclusion {
  concId?: string;
  content?: string;
}
