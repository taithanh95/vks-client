import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {AppConfigService} from "../../../../../../app-config.service";

@Component({
  selector: "app-d-register-decision",
  templateUrl: "./d-register-decision.component.html",
  styleUrls: ["./d-register-decision.component.scss"],
})
export class DRegisterDecisionComponent implements OnInit {
  @Input() isVisible: boolean;
  @Input() datas: any[];
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter();
  @Output() submitForm: EventEmitter<any> = new EventEmitter();

  // Data Gridview
  pageSize: any;
  total: any;
  pageIndex: any;
  page: any;
  defaultPage: any;
  selected:any;

  constructor(private configService: AppConfigService) {}

  ngOnInit(): void {
    this.total = 1000;
    this.pageIndex = 1;
    this.pageSize = this.configService.getConfig().pageSize;
    this.page = this.configService.getConfig().page;
    this.defaultPage = this.configService.getConfig().defaultPage;
  }
  ngOnChanges(){
    this.selected = {};
  }

  handleCancel() {
    this.closeModal.emit(false);
  }

  handleOk() {
    this.submitForm.emit(this.selected);
    this.closeModal.emit(false);
  }

  updateCheckedSet(i: any, checked: boolean): void {
    if (checked) {
      this.selected = this.datas[i]
    } else {
      this.selected = {};
    }
  }

  onItemChecked(i: any, checked: boolean): void {
    this.updateCheckedSet(i, checked);
  }

  checkSelected(id): boolean{
    return id===this.selected?.id?true:false;
  }
}
