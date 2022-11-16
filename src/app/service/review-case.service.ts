import {Injectable} from '@angular/core';
import {BaseService} from '../shared/base-service/base-service.service';
import {Observable} from 'rxjs';
import {DenouncementModel} from '../model/denouncement.model';
import {Constant} from '../shared/constants/constant.class';


@Injectable({
  providedIn: 'root'
})
export class ReviewCaseService extends BaseService {

  getSppId(): any {
    const userInfo = JSON.parse(localStorage.getItem(Constant.USER_INFO));
    if (userInfo) {
      return userInfo.sppid;
    }
    return '';
  }

  search(Obj: any, page, size, sort): Observable<any> {
    return this.post(`/reviewCase/getListReviewCase/?page=${page}&size=${size}&sort=${sort}`, Obj);
  }

  getListDecision(payload): Observable<any> { // Quy?t d?nh
    return this.get('/dm/LstDecision/getList', payload);
  }

  saveDenouncement(data) {
    return this.post('/denouncement', data);
  }

  updateDenouncement(data: DenouncementModel) {
    const sppId = this.getSppId();
    return this.post(`/denouncement?sppId=${sppId}`, data);
  }

  getDenouncementDetail(id: number) {
    const sppId = this.getSppId();
    return this.get(`/denouncement/${id}?sppId=${sppId}`);
  }

  deleteDenouncement(data: DenouncementModel) {
    const sppId = this.getSppId();
    return this.post(`/denouncement/deleteData?sppId=${sppId}`, data);
  }

  getDefaultLevelShareInfo(sppId: string): Observable<any> {
    return this.get(`/denouncement/defaultValue?sppId=${sppId}`);
  }

}
