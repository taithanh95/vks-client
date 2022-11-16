export interface SppAccAdditionInfo {
  accuCode?: string;
  dead: boolean;
  deadDay?: Date | string;
  causeOfDeath?: number;
  fled: boolean;
  dayOfHiding?: Date | string;
  reCaptureDate?: Date | string;
  reasonForHiding?: string;
  moveToOtherPlace: boolean;
  moveOutDate?: Date | string;
  movedToAnotherPlace: boolean;
  moveInDate?: Date | string;
  reason?: string;
  ngayHetThoiHanTu?: Date | string;
}
