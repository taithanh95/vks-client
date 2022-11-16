import {ArresteeModel} from "./arrestee.model";
import {Law} from "../component/so-thu-ly/model/so-thu-ly.model";

export interface ArrestDetentionInfoModel {
  id: number;
  shareInfoLvl: number;
  code: number;
  arrestingUnitId: string;
  arrestingUnitName: string;
  procuracyTakenOverDate: Date;
  takenOverProsecutorId: string;
  takenOverProcuratorName: string;
  procuratorAssignmentDecisionNumber: string;
  procuratorAssignmentDate: Date;
  arrestContent: string;
  arrestEnactmentId: string;
  arrestEnactmentName: string;
  lawClauseId: string;
  lawClauseName: string;
  lawPointId: string;
  lawPointName: string;
  createdBy: string;
  createdAt: Date;
  updatedBy: string;
  updatedAt: Date;
  status: number;
  arrestees: ArresteeModel[];
  sppId:string;
  law?: Law;

  // bổ sung để kiểm tra bảo mật
  createUser?: string;
  shareInfoLevel?: number;
}
