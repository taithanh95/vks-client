import {ViolationLegislationDocument} from './violation-legislation-document';

export interface ViolationLaw {
  id?: number,
  violationDate?: Date | string;
  violatedAgency?: string;
  violatedUnitsId?: string;
  violatedUnitsName?: string;
  resultCode?: number;
  resultNumber?: string;
  resultDate?: Date | string;
  resultContent?: string;
  note?: string;
  sppId?: string;
  shareInfoLevel?: number;
  violationLegislationDocumentList?: ViolationLegislationDocument[];
}
