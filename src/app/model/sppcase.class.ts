export interface SppCaseInput {
  isTachvu: boolean;
  sppId: string;
  sppcase: SppCase;
  userId: string;
  withWarn: boolean;
}
export class SppCase {
  //General object
  accucode: string;
  actdate: Date;
  address: string;
  alias: string;
  autolaw: boolean;
  begin_indate: Date;
  begin_indatefrom: Date;
  begin_indateto: Date;
  begin_office: string;
  begin_officeid: string;
  begin_pol: string;
  begin_setnum: string;
  begin_spc: string;
  begin_spp: string;
  casecode: string;
  caseisnew: string;
  casename: string;
  casestatus_txt: string;
  casetype: string;
  casetypename: string;
  cday: string;
  checkcrimdate: boolean;
  checkorisppid: boolean;
  checktrans: string;
  cmonth: string;
  codeid: string;
  crimdate: Date;
  crimdate1: string;
  crimdate_from: Date;
  crimdate_to: Date;
  crimtime: string;
  crimwhere: string;
  crimwhere1: string;
  crimwhere_txt: string;
  cyear: string;
  dienthoai: boolean;
  dientu: boolean;
  doi_chat: string;
  doi_chat_ko: string;
  editable: boolean;
  esettime: number;
  finishdate: Date;
  firstacc: string;
  firstacc_txt: string;
  fromDate: Date;
  fullname: string;
  ghihinh: boolean;
  indate: Date;
  indate_BA: Date;
  kham_nghiem_hien_truong: string;
  kham_nghiem_hien_truong_ko: string;
  kham_nghiem_tu_thi: string;
  kham_nghiem_tu_thi_ko: string;
  kham_xet: string;
  kham_xet_ko: string;
  lawcode: string;
  lawcode_txt: string;
  lawid: string;
  name: string;
  nhan_biet_giong_noi: string;
  nhan_biet_giong_noi_ko: string;
  nhan_dang: string;
  nhan_dang_ko: string;
  orisppid: string;
  regicode: string;
  remark: string;
  remark_name: string;
  rname: string;
  setnum: string;
  setnum_BA: string;
  settime: number;
  sid: string;
  sid_txt: string;
  signname: string;
  signoffice: string;
  spccasecode: string;
  sppid: string;
  sppspcid: string;
  status: string;
  statusdate: string;
  tg_hoi_cung: string;
  tg_lk: string;
  thuc_nghiem_dieu_tra: string;
  thuc_nghiem_dieu_tra_ko: string;
  transcode: string;
  transfer: string;
  transid: string;
  tt_hoi_cung: string;
  tt_lk_bb_tg: string;
  tt_lk_nbb_ntg_nlc_nbh: string;
  tt_lk_nbd_ds: string;
  tt_lk_nbh: string;
  tt_lk_nlc: string;
  userfor: string;
  vks_y_c_khoi_to: boolean;

  //ATX object
  atxArmy: any;
  atxBorderGuards: any;
  atxCustoms: any;
  atxLaw: any;
  atxLocation: string;
  atxPol: any;
  atxRanger: any;
  atxSpc: any;
  atxSpp: any;
  acLstLocation: any;
}
