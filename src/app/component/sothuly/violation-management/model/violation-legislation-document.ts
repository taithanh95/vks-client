export interface ViolationLegislationDocument {
  id?: number;
  violationLawId?: number;
  documentCode?: number;
  documentNumber?: string;
  documentDate?: Date | string;
  content?: string;
  status?: number;
}
