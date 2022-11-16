import {GeneralModelStatus} from '../shared/constants/constant.class';


export interface InvestigationActivityModel {
  id: number;
  investigationActivityType: string;
  procuracyParticipated: boolean;
  executionDate: Date | string;
  investigator: string;
  participatedProcurator: string;
  participatedProcuratorId: string;
  reasonForNotParticipating: string;
  assessment: string;
  result: string;
  processType: string;
  note: string;
  createUser: string;
  createDate: Date | string;
  updateUser: string;
  updateDate: Date | string;
  status: GeneralModelStatus;
}
