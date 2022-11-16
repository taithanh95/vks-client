import {Injectable} from '@angular/core';
import {BaseService} from '../shared/base-service/base-service.service';
import {Observable} from 'rxjs';
import {UrlConstant} from '../shared/constants/url.class';
import {Menu} from '../model/menu.class';

@Injectable()
export class MenuService  extends  BaseService {
  getMenu(): Observable<Menu[]> {
    return this.get(UrlConstant.LIST_MENU);
  }
  addMenu(menu: Menu): Observable<Menu> {
    return this.post(UrlConstant.LIST_MENU, menu);
  }
  deleteMenu(id: number): Observable<number> {
    return this.delete(UrlConstant.LIST_MENU + '/' + id, null);
  }
  updateMenu(menu: Menu): Observable<Menu> {
    return this.put(UrlConstant.LIST_MENU, menu);
  }
  getMenuByUser(): Observable<Menu[]> {
    return this.get(UrlConstant.LIST_MENU + '/username');
  }
}
