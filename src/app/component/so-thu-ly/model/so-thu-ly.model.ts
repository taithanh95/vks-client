export interface Spp {
  sppId?: string;
  sppCode?: string;
  sppName?: string;
  name?: string;
  isDePart?: string;
  sppParent?: string;
}

export interface Law {
  lawId?: string;
  lawName?: string;
  lawCode?: string;
  item?: string;
  point?: string;
  label?: string;
}

export interface CCase {
  caseCode?: string;
  caseName?: string;
  sppId?: any;
  address?: any;
  caseType?: any,
  remark?: any;
  spcCaseCode?: any;
  crimWhere?: any;
  crimDate?: any;
  crimTime?: any;
  oriSppId?: any;
  beginSetnum?: any;
  beginIndate?: any;
  beginSpp?: any;
  beginSpc?: any,
  beginPol?: any;
  lawCode?: any;
  firstAcc?: any;
  alias?: any;
  lawId?: any;
  status?: any;
  statusDate?: any;
  crimDate1?: any;
  crimWhere1?: any;
  autoLaw?: any;
  beginOffice?: any;
  beginOfficeId?: any;
  sync?: any;
  caseIsnew?: any;
  ghiHinh?: any;
  dienThoai?: any;
  knht?: any;
  khamXet?: any;
  kntt?: any;
  nbgn?: any;
  tndt?: any;
  doiChat?: any;
  ycKhoiTo?: any;
  ttHoiCung?: any;
  ttLkNbdDs?: any;
  tgHoiCung?: any;
  ttLkBbTg?: any;
  lastTime?: any;
  corruption?: any;
  ttLkNlc?: any;
  ttLkNbh?: any;
  tgLk?: any;
  ttLkNbbNtgNlcNbh?: any;
  khamNghiemHienTruongKo?: any;
  khamNghiemTuThiKo?: any;
  doiChatKo?: any;
  nhanDangKo?: any;
  nhanBietGiongNoiKo?: any;
  thucNghiemDieuTraKo?: any;
  khamXetKo?: any;
  drug?: any;
  fromDate?: any;
  setTime?: any;
  eSetTime?: any;
  signName?: any;
  signOffice?: any;
  finishDate?: any;
  law?: Law | undefined;
  firstAccused?: Accused | undefined;
}

export interface Accused {
  beginIndate?: any;
  beginSetnum?: any;
  accuCode?: any;
  fullName?: any;
  birthDay?: any,
  sex?: any;
  lawId?: any;
  lawName?: any;
  caseCode?: any;
  caseName?: any;
  law?: Law;
  ccase?: CCase;
}

export interface Denouncement {
  id?: number;
  crimeReportSource?: string; // Loại tin báo
  denouncementCode?: string; // Mã tin báo
  rreporter?: string; // Người báo tin
  rdelation?: string; // Nội dung tố giác
  fullName?: string; // Người bị tố giác
  accusedName?: string; // Người bị tố giác
  takenOverDate?: string; // Ngày VKS tiếp nhận
  law?: Law;
  lawId?: string;
  lawName?: string;
  denounceDenouncedPersonList?: DenouncedPerson[];
}

export interface DenouncedPerson {
  id?: number;
  fullName?: string;
  dateOfBirth?: Date | string;
  yearOfBirth?: number;
  job?: string;
  workplace?: string;
  address?: string;
}
