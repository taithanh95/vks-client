import {SppViolantion} from './spp-violantion';
import {SppAccAdditionInfo} from './spp-acc-addition-info';
import {Penalty} from './penalty';

export interface SppExecution {
  accuCode?: string;
  regiCode?: string;
  setNum: string;
  inDate?: Date;
  exeDate?: Date;
  prisonId?: string;
  penaltyId?: string;
  numMoney?: number | string;
  numYear: number;
  numMonth: number;
  numDay: number;
  fromDate?: Date;
  toDate?: Date;
  suspended?: boolean;
  disinherit?: string;
  confiscation?: string;
  fullName?: string;
  checked?: boolean;
  certificationNumber?: number;
  certificationDate?: Date;
  certificationNumberBPTP?: number;
  certificationDateBPTP?: Date;
  ngayPhamToiMoi?: Date;
  hanhViPhamToi?: string;
  sppViolantion?: SppViolantion[];
  sppAccAdditionInfo?: SppAccAdditionInfo;
  theConvictIsOutOnBail: boolean;
  ngayApDung?: Date;
  isCuongChe?: boolean;
}
