import {GeneralModelStatus} from '../../../../shared/constants/constant.class';

export interface ReviewCaseModel {
  id: number,
  caseCode: string,
  caseName: string,
  conclusionNumber: string,
  dConclusionDate: Date,
  conclusionDate: string,
  conclusionId: string,
  note: string,
  fromBeginIndate: string,
  toBeginIndate: string,
  reviewCaseAccusedList: ReviewCaseAccusedModel[];
  reviewCaseRequestList: ReviewCaseRequestModel[];
  status?: GeneralModelStatus;
  isReviewed?: boolean;
  accuCode?: string;
  fullName?: string;
  byear?: string;
  fullAccusedList: ReviewCaseAccusedModel[];
  reviewCaseId: number;
  reviewCaseAccusedId: number;
  accusedCode?: string;
}

export interface ReviewCaseAccusedModel {
  id?: number;
  accusedCode: string;
  accuCode: string;
  fullName: string;
  stage: string;
  judgmentCode: string;
  judgmentNum: string;
  dJudgmentDate: Date;
  judgmentDate: string;
  judgmentContent: string;
  status?: GeneralModelStatus;
  isReviewed?: boolean;
}

export interface ReviewCaseRequestModel {
  id?: number;
  accusedCode: string;
  accuCode: string;
  fullName: string;
  requestNum: string;
  dRequestDate: Date;
  requestDate: string;
  requestOffice: string;
  status?: GeneralModelStatus;
}
