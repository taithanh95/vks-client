export interface SppViolantion {
  id?: number;
  typeOfViolations?: number;
  typeName?: string;
  dateOfViolation?: Date | string;
  timeOfViolation?: number;
  contentViolations?: string;
  processing?: string;
  accuCode?: string;
  violCode?: string;
  index?: number;
  caseCode?: string;
  stage?: string;
}
