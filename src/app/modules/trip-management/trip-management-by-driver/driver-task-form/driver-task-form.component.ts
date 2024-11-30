import { DatePipe } from "@angular/common";
import { Component, TemplateRef, ViewChild } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { driverTaskData } from "src/app/shared/data/driverTaskData";
import { ApiConfigService } from "src/app/shared/services/api-config.service";
import { TripService } from "src/app/shared/services/api-services/trip.service";
import { CommonForm } from "src/app/shared/services/app-common-form";
import { AppMessageService } from "src/app/shared/services/app-message.service";
import { SidebarService } from "src/app/shared/services/sidebar.service";

@Component({
  selector: "app-driver-task-form",
  templateUrl: "./driver-task-form.component.html",
  styleUrls: ["./driver-task-form.component.scss"],
})
export class DriverTaskFormComponent {
  @ViewChild("templateRef", { static: true }) templateRef: TemplateRef<any>;
  FV = new CommonForm();
  tasks: any;
  tripInfo: any;
  isView: boolean = false;
  checkListInfo: any = null;
  constructor(
    private apiConfigService: ApiConfigService,
    private messageService: AppMessageService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private sidebarService: SidebarService,
    private tripService: TripService
  ) {
    this.createForm();
  }

  createForm() {
    this.FV.formGroup = this.formBuilder.group({
      isTermChecked1: [false, [Validators.required, Validators.requiredTrue]],
      isTermChecked2: [false, [Validators.required, Validators.requiredTrue]],
    });
  }

  ngOnInit(): void {
    let sideBarData = this.sidebarService.getData();
    this.tripInfo = sideBarData.tripInfo;
    this.checkListInfo = sideBarData.checkListInfo;
    this.isView = sideBarData.isView;
    // status 1 = pending, 2 = responded as yes and 3 = responded as no
    this.tasks = JSON.parse(JSON.stringify(driverTaskData));

    if (this.isView) {
      this.arrangeTasksByCheckListAndSetData();
    } else {
      this.sidebarService.setFooterTemplate(this.templateRef);
    }
  }

  arrangeTasksByCheckListAndSetData() {
    this.tasks.vehicleChecklist.forEach((x) => {
      x.status = this.checkListInfo[x.id];
    });

    this.tasks.healthcareChecklist.forEach((x) => {
      x.status = this.checkListInfo[x.id];
    });

    this.FV.formGroup.patchValue({
      isTermChecked1: this.checkListInfo.isTermsConditionsChecked1,
      isTermChecked2: this.checkListInfo.isTermsConditionsChecked2,
    });

    this.FV.formGroup.disable();
  }

  onClickYes(e: any) {
    e.status = 2;
  }
  onClickNo(e: any) {
    e.status = 3;
  }

  onClickRefresh(e: any) {
    e.status = 1;
  }

  onClickCancel() {
    this.sidebarService.sidebarEvent.emit({
      action: "clear",
    });
  }

  onClickSave() {
    if (
      this.tasks.vehicleChecklist.find((x) => x.status == 1) != undefined &&
      this.tasks.healthcareChecklist.find((x) => x.status == 1) != undefined
    ) {
      return;
    }

    if (this.FV.validateControllers("isTermChecked1,isTermChecked2")) {
      return;
    }

    let requestObj = Object.create(null);

    this.tasks.vehicleChecklist.forEach((x) => {
      requestObj[x.id] = x.status;
    });

    this.tasks.healthcareChecklist.forEach((x) => {
      requestObj[x.id] = x.status;
    });
    // isTermsConditionsChecked1;
    // isTermsConditionsChecked2;
    let formData: any = this.FV.formGroup.value;
    requestObj["isTermsConditionsChecked1"] = formData.isTermChecked1 || false;
    requestObj["isTermsConditionsChecked2"] = formData.isTermChecked2 || false;

    this.tripService
      .SaveCheckList(this.tripInfo.id, requestObj)
      .subscribe((response) => {
        if (response.IsSuccessful) {
          this.messageService.showSuccessAlert(response.Message);
          this.sidebarService.sidebarEvent.emit({
            action: "refresh",
          });
        } else {
          this.messageService.showErrorAlert(response.Message);
        }
      });
  }
}
