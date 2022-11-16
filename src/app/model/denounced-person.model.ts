import {GeneralModelStatus} from '../shared/constants/constant.class';


export interface DenouncedPersonModel {
  id?: number;
  fullName: string;
  dateOfBirth: Date | string;
  yearOfBirth: number;
  job: string;
  workplace: string;
  address: string;
  createUser?: string;
  createDate?: Date | string;
  updateUser?: string;
  updateDate?: Date | string;
  status?: GeneralModelStatus;
  cccd?: number;
}
