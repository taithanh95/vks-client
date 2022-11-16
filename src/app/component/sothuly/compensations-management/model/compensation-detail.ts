export interface CompensationDetail {
  id?: number;
  compensationId?: number;
  documentaryNumber?: number;
  documentaryDate?: Date | string;
  financeNumber?: number;
  financeDate?: Date | string;
  compensationEnforceDate?: Date | string;
  restoreHonorDate?: Date | string;
  compensationAmountTemp?: number;
  compensationAmount?: number;
  note?: string;
  status?: number
}
