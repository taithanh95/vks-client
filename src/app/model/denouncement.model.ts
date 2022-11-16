import {DenouncementStatus, GeneralModelStatus} from '../shared/constants/constant.class';
import {ShareInfoEnum} from '../component/sothuly/denouncement-management/share-info.enum';
import {DenouncedPersonModel} from './denounced-person.model';
import {InvestigationActivityModel} from './investigation-activity.model';
import {SettlementDecisionModel} from './settlement-decision.model';
import {VerificationInvestigationModel} from './verification-investigation.model';
import {Law} from '../component/so-thu-ly/model/so-thu-ly.model';


export interface DenouncementModel {
  investigationActivityList?: InvestigationActivityModel[] | null;
  settlementDecisionList?: SettlementDecisionModel[] | null;
  verificationInvestigationList?: VerificationInvestigationModel[] | null;
  denounceDenouncedPersonList?: DenouncedPersonModel[] | null;
  id?: number;
  sppId?: string;
  shareInfoLevel?: ShareInfoEnum;
  denouncementCode?: number;
  denouncementAgency?: string;
  denouncementUnitsId?: string;
  denouncementUnitsName?: string;
  takenOverAgencyCode?: string;
  takenOverDate?: Date | string; // dd/MM/yyyy
  takenResultDate?: Date | string; // dd/MM/yyyy
  settlementTerm?: Date | string; // dd/MM/yyyy
  crimeReportSource?: string;
  complicatedCircumstance?: boolean;
  takenOverOfficer?: string;
  officerPosition?: string;
  iaHandlingUnit?: string;
  iaHandlingUnitId?: string;
  iaHandlingOfficer?: string;
  iaAssignmentDecisionNumber?: string;
  iaAssignmentDate?: Date | string; // dd/MM/yyyy
  phandlingNumber?: string;
  phandlingDate?: Date | string; // dd/MM/yyyy
  phandlingProsecutor?: string;
  phandlingProsecutorId?: any;
  passignmentDecisionNumber?: string;
  passignmentDate?: Date | string; // dd/MM/yyyy
  rreporter?: string;
  rdateOfBirth?: Date | string; // dd/MM/yyyy
  ryearOfBirth?: number;
  raddress?: string;
  rphoneNumber?: string;
  rdelation?: string;
  rnote?: string;
  rcccd?: number;
  ipnSettlementAgency?: string;
  ipnSettlementUnit?: string;
  ipnSettlementUnitId?: string;
  ipnClassifiedNews?: string;
  ipnEnactment?: string;
  ipnEnactmentId?: any;
  ipnLawClause?: string;
  ipnLawPoint?: string;
  fnCode?: string;
  fnDate?: Date | string; // dd/MM/yyyy
  fnTakenOverAgency?: string;
  fnTakenOverUnit?: string;
  fnNote?: string;
  createUser?: string;
  createDate?: Date | string; // dd/MM/yyyy
  updateUser?: string;
  updateDate?: Date | string; // dd/MM/yyyy
  status?: GeneralModelStatus;
  settlementStatus?: DenouncementStatus;
  statusName?: string;
  corruptionCrime?: boolean;
  economicCrime?: boolean;
  otherCrime?: boolean;
  law?: Law[];
}
