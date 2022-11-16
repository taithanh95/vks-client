import {GeneralModelStatus} from '../../../../shared/constants/constant.class';

export interface ViolationResult {
  id?: number;
  violationLawId?: number;
  resultCode?: number;
  resultNumber?: number;
  resultDate?: Date | string;
  resultContent?: string;
  note?: string;
  chapNhan?: string;
  chapNhanMotPhan?: string;
  khongChapNhan?: string;
  khongChapNhanMotPhan?: string;
  status?: GeneralModelStatus;
}
