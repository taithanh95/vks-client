export interface DisciplineViolationModel {
  id: number;
  violationDate: Date;
  arresteeId: number;
  punishmentType: string;
  violationContent: string;
  createdBy: string;
  createdAt: any;
  updatedBy: string;
  updatedAt: any;
  status: number;
}
