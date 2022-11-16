import {GeneralModelStatus} from '../shared/constants/constant.class';


export interface SettlementDecisionModel {
  id: number;
  decisionNumber: string;
  decisionId: string;
  decisionName: string;
  description: string;
  decisionDate: Date | string;
  decisionMakingAgency: string;
  decisionMakingUnit: string;
  decisionMakingUnitId: string;
  effectStartDate: Date | string;
  effectEndDate: Date | string;
  signer: string;
  position: string;
  executeOrder: number;
  createUser: string;
  createDate: Date | string;
  updateUser: string;
  updateDate: Date | string;
  status: GeneralModelStatus;
}
