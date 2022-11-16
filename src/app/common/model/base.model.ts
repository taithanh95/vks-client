import {OnDestroy, OnInit} from '@angular/core';

export class BaseModel implements OnInit, OnDestroy {
  ngOnInit() {
  }

  ngOnDestroy() {
  }
}

export interface Base {
  id?: number;
  stt?: number;
  createdBy?: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface BaseSearch {
  code?: string;
  name?: string;
  type?: number;
  status?: number;
  fromDate?: string;
  toDate?: string;
}

export interface Response {
  responseCode?: string;
  responseMessage?: string;
  responseData?: any;
}
export interface PageResponse {
  pageNumber?: number;
  pageSize?: number;
  totalPages?: number;
  totalElements?: number;
  data?: any[];
}
