import {SppCase} from './sppcase.class';

export class FilterSppCaseClass {
  accused: Accused;
  centence: any;
  pageSize: number;
  register: Register;
  rowIndex: number;
  sortField: string;
  sortOrder: string;
  sppId: string;
  sppcase?: SppCase;
}
export class Accused {
  fullname: string;
  birthdayfrom?: Date;
  birthdayto?: Date;
  addrname: string;
  locaname: string;
}

export class Register {
  regiclosed: string;
  setnum: string;
  fromdate?: Date;
  todate?: Date;
  fullname: string;
  addrname: string;
  locaname: string;
}

