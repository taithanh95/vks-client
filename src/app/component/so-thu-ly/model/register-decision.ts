import {Accused, Law} from './so-thu-ly.model';

export class RegisterDecision {
  id?: number;
  stage?: string;
  stageName?: string;
  issuesDate?: string | Date;
  decisionCode?: string;
  decisionName?: string;
  decisionNum?: any;
  decisionNumAuto?: any;
  fromDate?: string | Date;
  toDate?: string | Date;
  sppCode?: string;
  sppName?: string;
  caseCode?: string;
  caseName?: string;
  accusedCode?: string;
  accusedName?: string;
  denouncementId?: number;
  denouncementCode?: string;
  sreporter?: string;
  type?: number;
  law?: Law | null;
  firstAccused?: Accused | null;
  note?: string;
  rutgon?: string;
  sppid?: string;
  signer?: string;
  position?: string;

  constructor(
    id?: number,
    stage?: string,
    stageName?: string,
    issuesDate?: string,
    decisionCode?: string,
    decisionName?: string,
    decisionNum?: string,
    fromDate?: string,
    toDate?: string,
    sppCode?: string,
    sppName?: string,
    caseCode?: string,
    caseName?: string,
    accusedCode?: string,
    accusedName?: string,
    type?: number,
    rutgon?: string
  ) {
    this.id = id;
    this.stage = stage;
    this.stageName = stageName;
    this.issuesDate = issuesDate;
    this.decisionCode = decisionCode;
    this.decisionName = decisionName;
    this.decisionNum = decisionNum;
    this.fromDate = fromDate;
    this.toDate = toDate;
    this.sppCode = sppCode;
    this.caseCode = caseCode;
    this.caseName = caseName;
    this.accusedCode = accusedCode;
    this.accusedName = accusedName;
    this.type = type;
    this.rutgon = rutgon;
  }

}
