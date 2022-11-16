import {Injectable} from '@angular/core';
import {Headers, Http, RequestOptions} from '@angular/http';
import {environment} from '../../environments/environment';
import {Constant} from '../shared/constants/constant.class';
import {CookieService} from 'ngx-cookie-service';

@Injectable()
export class ConstantService {
  SSO_URL = environment.GATEWAY_URI + '/api/sso/';
  CATEGORY_URL = environment.GATEWAY_URI + '/api/category/';
  MANAGE_URL = environment.GATEWAY_URI + '/api/manage/';
  SOTHULY_URL = environment.GATEWAY_URI + '/api/sothuly/';
  QUANLYAN_URL = environment.GATEWAY_URI + '/api/quanlyan/';
  QLAHS_URL = environment.GATEWAY_URI + '/api/qlahs/';
  QUANLYAN_HS_URL = environment.GATEWAY_URI + '/api/qlahs/';

   public static readonly LIST_TYPE_ACCUSED = new Map<string, string>([
     ["1","Báo cáo thông tin về bị can"],
     ["11","Báo cáo thông tin bị can đã XXST không nhập hình phạt"],
     ["2","Báo cáo thông tin bị can mới khởi tố"],
     ["3","Báo cáo thông tin bị can mới khởi tố là đảng viên"],
     ["4","Danh sách các bị can Công an đã đề nghị truy tố mà Viện kiểm sát không thụ lý cùng tháng"],
     ["5","Danh sách các bị can Viện kiểm sát không truy tố mà Tòa thụ lý"],
     ["6","Báo cáo thông tin bị can mới theo án"],
     ["7","Báo cáo thông tin bị can mới khởi tố chưa thành niên"],
     ["8","Danh sách các bị can Viện kiểm sát đã truy tố mà Tòa không thụ lý cùng tháng"]
  ]);
  public static readonly LIST_USE_FOR = new Map<string, string>([
    ["G1", "Kiểm sát điều tra"],
    ["G2", "Kiểm sát giải quyết án - Truy tố"],
    ["G3", "Xét xử sơ thẩm"],
    ["G4", "Xét xử phúc thẩm"],
    ["G5", "Xét xử giám đốc thẩm"],
    ["G6", "Thi hành án"]
  ]);
  public static readonly LIST_TYPE_TRANSFER = new Map<string, string>([
    ["cqdt_vks", "Cơ quan điều tra <-> Viện kiểm sát"],
    ["vks_ta", "Viện kiểm sát <-> Tòa án"],
    ["vks_vks", "Viện kiểm sát <-> Viện kiểm sát"]
  ]);
  public static readonly LIST_TYPE_VERIFY = new Map<string, string>([
    ["case_dupplicate", "Vụ án có khả năng bị nhập trùng lặp (kiểm tra theo số, ngày và cơ quan ra quyết định khởi tố)"],
    ["case_register_dupplicate", "Vụ án có khả năng thụ lý bị nhập trùng lặp (kiểm tra theo số, ngày và đơn vị thụ lý)"],
    ["case_no_accu", "Vụ án chưa nhập bị can/bị cáo"],
    ["case_reg_no_accu", "Vụ án thụ lý nhưng chưa chọn bị can/bị cáo"],
    ["case_susp_no_accu_susp", "Đình chỉ vụ án nhưng chưa nhập đủ QĐ đỉnh chỉ bị can/bị cáo (tìm theo ngày ra QĐ đình chỉ)"],
    ["case_temp_susp_no_accu_temp_susp", "Tạm đình chỉ vụ án nhưng chưa nhập đủ QĐ tạm đình chỉ bị can/bị cáo (tìm theo ngày ra QĐ đình chỉ)"],
    ["case_accu_no_reg", "Vụ án có bị can bị cáo nhưng chưa có thụ lý (trong bất cứ giai đoạn nào và tìm theo ngày khởi tố vụ án)"]

  ]);

  constructor(
    private http: Http,
    private cookieService: CookieService
  ) {
  }

  getSppId(): string {
    return this.cookieService.get(Constant.SPPID);
  }

  getUsername(): string {
    return this.cookieService.get(Constant.USERNAME);
  }

  getRequestHeader() {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json; charset=utf-8');
    headers.append('Authorization', 'Bearer ' + this.cookieService.get(Constant.ACCESS_TOKEN));
    return new RequestOptions({headers});
  }

  postRequest(url: string, body: any) {
    return this.http.post(url, body, this.getRequestHeader());
  }
}
