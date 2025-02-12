import { InternalTripService } from "../../../../../shared/services/api-services/internal-trip.service";
import { DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { firstValueFrom } from "rxjs";
import { WellKnownUserRole } from "src/app/shared/enums/well-known-user-role.enum";
import { CommonService } from "src/app/shared/services/api-services/common.service";
import { UserService } from "src/app/shared/services/api-services/user.service";
import { CommonForm } from "src/app/shared/services/app-common-form";
import { AppMessageService } from "src/app/shared/services/app-message.service";
import { SidebarService } from "src/app/shared/services/sidebar.service";

@Component({
  selector: "app-add-other-trip",
  templateUrl: "./add-other-trip.component.html",
  styleUrls: ["./add-other-trip.component.css"],
})
export class AddOtherTripComponent implements OnInit {
  isEdit: boolean = false;
  isView: boolean = false;
  FV = new CommonForm();
  minDate: Date = new Date();
  driverArr: any[] = [];
  tripDetails: any = null;
  constructor(
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private messageService: AppMessageService,
    private commonService: CommonService,
    private internalTripService: InternalTripService,
    private userService: UserService,
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig
  ) {
    this.createForm();
  }

  ngOnInit() {
    let dialogConfig = this.config.data;
    this.isEdit = dialogConfig.isEdit;
    this.isView = dialogConfig.isView;

    this.tripDetails = dialogConfig.tripDetails;

    this.loadInitialData();
  }

  createForm() {
    this.FV.formGroup = this.formBuilder.group({
      startDate: ["", [Validators.required]],
      endDate: ["", [Validators.required]],
      dateCount: ["", [Validators.required]],
      meterReading: ["", [Validators.required]],
      driver: ["", [Validators.required]],
      reason: ["", [Validators.required]],
    });
  }

  async loadInitialData() {
    try {
      const driverResult = await firstValueFrom(
        this.userService.GetAllUsersByRole(WellKnownUserRole.DRIVER)
      );

      if (driverResult.IsSuccessful) {
        this.driverArr = driverResult.Result;
      }

      if (this.isEdit || this.isView) {
        this.setValues();
      }
    } catch (error) {
      this, this.messageService.showErrorAlert(error.message || error);
    }
  }

  setValues() {
    this.FV.setValue("startDate", new Date(this.tripDetails?.startDate));
    this.FV.setValue("endDate", new Date(this.tripDetails?.endDate));
    this.FV.setValue("dateCount", this.tripDetails?.dateCount);
    this.FV.setValue("meterReading", this.tripDetails?.meterReading);
    this.FV.setValue("driver", this.tripDetails?.driver);
    this.FV.setValue("reason", this.tripDetails?.reason);

    this.FV.disableField("meterReading");

    if (this.isView) {
      this.FV.disableFormControlls();
    }
  }

  onChangeStartDate() {
    let startDate = this.FV.getValue("startDate");
    if (startDate) {
      this.minDate = startDate;
      this.FV.clearValue("endDate");
    }

    let endDate = this.FV.getValue("endDate");

    if (startDate && endDate) {
      this.FV.setValue("dateCount", this.calcDateCount(startDate, endDate));
    }
  }

  onChangeEndDate() {
    let startDate = this.FV.getValue("startDate");
    let endDate = this.FV.getValue("endDate");

    if (startDate && endDate) {
      this.FV.setValue("dateCount", this.calcDateCount(startDate, endDate));
    }
  }

  calcDateCount(startDate: string, endDate: string): Number {
    let sDate = new Date(startDate);
    let eDate = new Date(endDate);
    let timeDiff = eDate.getTime() - sDate.getTime();
    let dayDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

    if (dayDiff == 0) {
      dayDiff = 1;
    }

    return dayDiff;
  }

  onClickCancel() {
    this.ref.close(false);
  }

  onClickSave() {
    debugger;
    if (this.FV.formGroup.invalid) {
      this.FV.showErrors();
      return;
    }

    const formData = this.FV.formGroup.value;

    let request = {
      startDate: formData?.startDate,
      endDate: formData?.endDate,
      dateCount: formData?.dateCount,
      vehicle: this.tripDetails?.vehicle,
      meterReading: formData?.meterReading,
      driver: formData?.driver,
      reason: formData?.reason,
    };

    if (this.isEdit) {
    } else {
      this.internalTripService
        .SaveInternalTrip(request)
        .subscribe((response) => {
          if (response.IsSuccessful) {
            this.messageService.showSuccessAlert(response.Message);
            this.ref.close(true);
          } else {
            this.messageService.showErrorAlert(response.Message);
          }
        });
    }
  }
}
