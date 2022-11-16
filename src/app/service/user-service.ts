import {Injectable} from '@angular/core';
import {BaseService} from '../shared/base-service/base-service.service';
import {Observable} from 'rxjs';
import {SearchUser} from '../model/searchUser.class';
import {UrlConstant} from '../shared/constants/url.class';

@Injectable()
export class UserService  extends  BaseService {
  getUser(search: SearchUser): Observable<any> {
     return this.post(UrlConstant.LIST_USER, search);
  }
  addUser(user): Observable<any> {
     return this.post( UrlConstant.ADD_USER, user);
  }
  deleteUser(id: number): Observable<any> {
    return this.delete( UrlConstant.DELETE_USER + id, null);
  }
  updateUser(user): Observable<any> {
    return this.put( UrlConstant.UPDATE_USER, user);
  }
  getUserByUsername(username): Observable<any> {
    return this.get(UrlConstant.DETAIL_USER + '/' +  username );
  }
}
