export interface DecisionJudicial {
  deciJudicialId?: number;
  setnum?: string;
  indate?: Date | string;
  decisionAgency?: string;
  decisionUnitId?: string;
  decisionUnitName?: string;
  fromDate?: Date | string;
  toDate?: Date | string;
  enforceMeasure?: string;
  enforceMeasureUnit?: string;
  enforceDate?: Date | string;
  certificationNumber?: string;
  certificationDate?: Date | string;
  time_reduction?: string;
  signer?: string;
  signerPosition?: string;
  note?: string;
  isDead?: number;
  deathDate?: Date | string;
  escaped?: number;
  escapingDate?: Date | string;
  causeOfDeathId?: number;
  causeOfDeathName?: string;
}
