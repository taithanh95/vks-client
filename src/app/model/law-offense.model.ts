export interface LawOffenseModel {
  id: number;
  lawId: string;
  arresteeId: number;
  lawName: string;
  enactmentId: string;
  enactmentName: string;
  createdBy: string;
  createdAt: any;
  updatedBy: string;
  updatedAt: any;
  point?:string;
  item?:string;
  status: number;
}
