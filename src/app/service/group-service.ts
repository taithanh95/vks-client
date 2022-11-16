import {Injectable} from '@angular/core';
import {BaseService} from '../shared/base-service/base-service.service';
import {Observable} from 'rxjs';
import {UrlConstant} from '../shared/constants/url.class';
import {Group} from '../model/group.class';

@Injectable()
export class GroupService  extends  BaseService {
  getGroup(): Observable<Group[]> {
    return this.get(UrlConstant.LIST_GROUP);
  }
  deleteGroup(id: number): Observable<number> {
    return this.delete(UrlConstant.LIST_GROUP + '/' + id, null);
  }
  addGroup(group: Group): Observable<Group> {
    return this.post(UrlConstant.LIST_GROUP, group);
  }
  updateGroup(group: Group): Observable<Group> {
    return this.put(UrlConstant.LIST_GROUP, group);
  }
}
