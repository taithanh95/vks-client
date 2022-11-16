import {environment} from '../../../environments/environment';

export class Constant {
  public static readonly DATE_FMT = 'dd/MM/yyyy';
  public static readonly MESSAGE_DELETE_SUCCESS = 'Xóa thành công';
  public static readonly MESSAGE_ADD_SUCCESS = 'Tạo mới thành công';
  public static readonly MESSAGE_SERVICE_ERROR = 'Lỗi dữ liệu';
  public static readonly MESSAGE_UPDATE_SUCCESS = 'Cập nhật thành công';
  public static readonly SUCCESS = 'success';
  public static readonly ERROR = 'error';
  public static readonly WARNING = 'warning';
  public static readonly ACCESS_TOKEN = 'access_token';
  public static readonly USER_ROLE_LIST = 'user_role_list';
  public static readonly LOGIN_USER_ID = 'login_user_id';
  public static readonly ID_SPP = 'id_spp';
  public static readonly USER_TYPE = 'user_type';
  public static readonly USERNAME = 'username';
  public static readonly USER_FULL_NAME = 'user_first_name';
  public static readonly USERID = 'userId';
  public static readonly SPP = 'spp';
  public static readonly SPPID_LOGIN = 'sppId_login';
  public static readonly USER_LOGIN = 'user_login';
  public static readonly SPP_LOGIN = 'spp_login';
  public static readonly SPPID = 'sppid';
  public static readonly SPCID = 'spcid';
  public static readonly POLID = 'polid';
  public static readonly ACTION = 'action';
  public static readonly USER_INFO = 'user';
  public static readonly LOGIN_FAIL = 'Tài khoản hoặc mật khẩu không chính xác.';
  public static readonly DELETE = 'Xóa';
  public static readonly CREATE = 'Thêm';
  public static readonly UPDATE = 'Sửa';
  public static readonly WELCOME = 'admin/welcome';
  public static readonly AUTH_URI = environment.GATEWAY_URI + '/api/sso/';
  public static readonly PHONG = 'phong';

  public static readonly DON_HANG = 'donhang';
  public static readonly INIT_DATA = 'initial_data';

  public static readonly SPP_CASECODE = 'casecode'
  public static readonly SPP_ACUUCODE = 'accucode'
  public static readonly DENOUNCEMENT_ID = 'denouncementId'
  public static readonly SPP_CASE = 'spp_case'
  public static readonly SPP_REGISTER = 'register_g6'
  public static readonly SPP_CASE_SPLIT = 'spp_case_split'
  public static readonly SPP_CASE_JOIN = 'spp_case_join'
  public static readonly SPP_CHOICETYPE = 'choicetype'

  // ap_param
  public static readonly DENOUNCEMENT_TYPE = 'DENOUNCEMENT_TYPE';
  public static readonly TAKEN_OVER_AGENCY = 'TAKEN_OVER_AGENCY';
  public static readonly IPN_SETTLEMENT_AGENCY = 'IPN_SETTLEMENT_AGENCY';
  public static readonly IPN_CLASSIFIED_NEWS = 'IPN_CLASSIFIED_NEWS';
  public static readonly FN_TAKEN_OVER_AGENCY = 'FN_TAKEN_OVER_AGENCY';
  public static readonly DENOUNCEMENT_TYPE_NEW = '1';
  public static readonly TAKEN_OVER_AGENCY_CQDT = 'CQĐT';
  public static readonly DENOUNCEMENT_STATUS_TYPE = 'DENOUNCEMENT_STATUS_TYPE';
  public static readonly TAKEN_OVER_AGENCY_VKS = 'VKS';
  public static readonly DECISION_MAKING_AGENCY = 'DECISION_MAKING_AGENCY';
  public static readonly INVESTIGATION_ACTIVITY_TYPE = 'INVESTIGATION_ACTIVITY_TYPE';
  public static readonly DENOUNCEMENT_PROCESS_TYPE = 'DENOUNCEMENT_PROCESS_TYPE';
  public static readonly ARREST_TYPE = 'ARREST_TYPE';
  public static readonly ARREST_DECISION_MAKING_AGENCY = 'ARREST_DECISION_MAKING_AGENCY';

  public static readonly CAUSE_DEATH = 'CAUSE_DEATH';

  public static readonly ACCESSES = [
    {value: 0, name: 0, des: 'Cấp độ 0: Cho phép người khác xem, sửa thông tin'},
    {value: 1, name: 1, des: 'Cấp độ 1: Cho phép người khác xem nhưng không sửa thông tin'},
    {value: 2, name: 2, des: 'Cấp độ 2: Không cho phép xem, sửa thông tin'},
  ]
  public static readonly DOCUMENT_CODE = [
    {value: 1, description: 'Kháng nghị'},
    {value: 2, description: 'Kiến nghị'},
    {value: 3, description: 'Thông báo rút kinh nghiệm'},
    {value: 4, description: 'Yêu cầu'},
    {value: 99, description: 'Khác'},
  ]

  public static readonly PATTERN_ONLY_NUMBER = '^[0-9]*$';
  public static readonly PATTERN_WITHOUT_SPECIAL_CHARACTERS = '^[^%;:\x27\x22,<>{}[\\]\\/!@#$%^&*()-=+?.]*$';

}

export enum GeneralModelStatus {
  INACTIVE,
  ACTIVE
}

export enum DenouncementStatus {
  NOT_BEING_SETTLED = 1, // Chưa thực hiện
  BEING_SETTLED = 2, // đang giải quyết
  SUSPENDED = 3, // tạm đình chỉ
  SETTLED = 4 // đã giải quyết
  // OVERDUE = 5 // quá hạn giải quyết
}

export enum ComponentMode {
  VIEW,
  CREATE,
  UPDATE,
  VIEW_FROM_PARENT,
  COPPY = 4
}
