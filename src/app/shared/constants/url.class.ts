export class  UrlConstant {
  public static readonly API_QUANLYAN = '/api/quanlyan';
  public static readonly API_QLAHS = '/api/qlahs';
  public static readonly API_DANHMUC = '/api/manage';
  public static readonly API_SSO = '/api/sso/auth/login/';
  public static readonly API_CATEGORY = '/api/category';
  public static readonly LOGIN = '/oauth/token';
  public static readonly LOGOUT = '/api/sso/auth/logout/';
  public static readonly VALIDATE = '/validate';
  public static readonly LIST_USER = '/user';
  public static readonly DELETE_USER = '/users/delete/';
  public static readonly ADD_USER = '/users';
  public static readonly DETAIL_USER = '/users';
  public static readonly UPDATE_USER = '/users/update';
  public static readonly LIST_ROLE = '/role';
  public static readonly LIST_GROUP = '/group';
  public static readonly LIST_ACTION = '/action';
  public static readonly LIST_MENU = '/menu';
  public static readonly LIST_STAFF = '/staff';

 // Apparam
  public static readonly LIST_PARAMS = '/dm/ApParam/getParams';

  // Dang ky lenh quyet dinh
  public static readonly REGISTER_DECISION_CASE = '/api/v1/register-decision-case';
  public static readonly REGISTER_DECISION_ACCU = '/api/sothuly/registerDecision';
  public static readonly REGISTER_DECISION = '/api/v1/register-decision';

  public static readonly SPP = '/api/manage/spp';
  public static readonly DECISION = '/api/manage/decision';
  public static readonly ACCUSED = '/api/manage/accused';
  public static readonly REGISTER = '/api/manage/register';
   // phucnv start 13/4/2021
  public  static readonly SO_THU_LY='/api/sothuly';
  public  static readonly MANAGE='/api/manage';
  // phucnv end 13/4/2021
}
