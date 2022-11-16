export interface CompensationDocument {
  id?: number;
  compensationId?: number;
  documentName?: string;
  deadlines?: Date | string;
  finish?: number;
  note?: string;
  status?: number
}
