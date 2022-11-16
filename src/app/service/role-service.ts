import {Injectable} from '@angular/core';
import {BaseService} from '../shared/base-service/base-service.service';
import {Observable} from 'rxjs';
import {UrlConstant} from '../shared/constants/url.class';
import {Role} from '../model/role.class';

@Injectable()
export class RoleService  extends  BaseService {

  getRole(): Observable<Role[]> {
    return this.get(UrlConstant.LIST_ROLE);
  }
  deleteRole(id: number): Observable<number> {
    return this.delete(UrlConstant.LIST_ROLE + '/' + id, null);
  }
  addRole(role: Role): Observable<Role> {
    return this.post(UrlConstant.LIST_ROLE, role);
  }
  updateRole(role: Role): Observable<Role> {
    return this.put(UrlConstant.LIST_ROLE, role);
  }

}
