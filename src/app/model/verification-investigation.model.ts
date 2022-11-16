import {GeneralModelStatus} from '../shared/constants/constant.class';


export interface VerificationInvestigationModel {
  id: number;
  verificationInvestigationCode: string;
  verificationDate: Date | string;
  procuratorsRequestId: string;
  procuratorsRequest: string;
  contentRequest: string;
  result: string;
  note: string;
  createUser: string;
  createDate: Date | string;
  updateUser: string;
  updateDate: Date | string;
  status: GeneralModelStatus;
  type: number | null;
}
