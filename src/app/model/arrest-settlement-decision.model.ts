export interface ArrestSettlementDecisionModel {
  id: number;
  arresteeId: number;
  decisionMakingAgency: string;
  decisionMakingUnitId: string;
  decisionMakingUnitName: string;
  decisionNumber: string;
  decisionId: string;
  decisionName: string;
  decisionDate: Date;
  reason: string;
  effectStartDate: Date;
  effectEndDate: Date;
  signer: string;
  singerPosition: string;
  note: string;
  createdBy: string;
  createdAt: Date;
  updatedBy: string;
  updatedAt: Date;
  status: number;
  excecuteOrder?: number;
  typeDate?: string;
  dayMonthYear?: number;
}
