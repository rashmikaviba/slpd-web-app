import { DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { UntypedFormBuilder, Validators } from "@angular/forms";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { WellKnownUserRole } from "src/app/shared/enums/well-known-user-role.enum";
import { CommonForm } from "src/app/shared/services/app-common-form";
import { AppMessageService } from "src/app/shared/services/app-message.service";
import { MasterDataService } from "src/app/shared/services/master-data.service";

@Component({
  selector: "app-add-trip-summary-form",
  templateUrl: "./add-trip-summary-form.component.html",
  styleUrls: ["./add-trip-summary-form.component.css"],
})
export class AddTripSummaryFormComponent implements OnInit {
  FV = new CommonForm();
  minDate: string = "";
  maxDate: string = "";
  tripInfo: any;
  isAdd: boolean = false;
  isEdit: boolean = false;
  constructor(
    private formBuilder: UntypedFormBuilder,
    private datePipe: DatePipe,
    private config: DynamicDialogConfig,
    private masterDataService: MasterDataService,
    private ref: DynamicDialogRef,
    private messageService: AppMessageService
  ) {
    this.createForm();
  }

  ngOnInit() {
    let dialogConfig = this.config.data;
    this.isAdd = dialogConfig.isAdd;
    this.isEdit = dialogConfig.isEdit;
    this.tripInfo = dialogConfig.tripInfo;

    if (this.isAdd) {
      this.minDate = this.datePipe.transform(
        new Date(this.tripInfo.startDate),
        "yyyy-MM-dd"
      );
      this.maxDate = this.datePipe.transform(
        new Date(this.tripInfo.endDate),
        "yyyy-MM-dd"
      );

      let today = this.datePipe.transform(new Date(), "yyyy-MM-dd");

      if (today > this.maxDate) {
        this.FV.setValue("date", this.maxDate);
      } else {
        this.FV.setValue("date", today);
      }
    }

    // if (this.masterDataService.Role == WellKnownUserRole.DRIVER) {
    //   this.FV.disableField("date");
    // }
  }

  ngAfterViewChecked(): void {
    let startingKm = this.FV.getValue("startingKm") || 0;
    let endingKm = this.FV.getValue("endingKm") || 0;

    if (startingKm < endingKm) {
      this.FV.setValue("totalKm", endingKm - startingKm);
    }
  }

  createForm() {
    this.FV.formGroup = this.formBuilder.group({
      date: ["", [Validators.required]],
      startTime: ["", [Validators.required]],
      endTime: [""],
      startingKm: ["", [Validators.required]],
      endingKm: [""],
      totalKm: [""],
      fuel: [""],
      description: [""],
    });
  }
  onClickCancel() {
    this.ref.close(false);
  }

  onClickSave() {
    if (
      this.FV.validateControllers(
        "date,startTime,startingKm,endingKm,totalKm,fuel,description"
      )
    ) {
      return;
    }

    let date = this.FV.getValue("date");
    let startTime = this.FV.getValue("startTime");
    let endTime = this.FV.getValue("endTime");
    let startingKm = this.FV.getValue("startingKm");
    let endingKm = this.FV.getValue("endingKm");
    let totalKm = this.FV.getValue("totalKm");
    let fuel = this.FV.getValue("fuel");
    let description = this.FV.getValue("description");

    if (endingKm < startingKm && endingKm > 0 && startingKm > 0) {
      this.messageService.showErrorAlert(
        "Ending KM should be greater than Starting KM!"
      );
      return;
    } else {
      totalKm = endingKm - startingKm;
    }

    if (startTime > endTime) {
      this.messageService.showErrorAlert(
        "Start Time should be less than End Time!"
      );
      return;
    }

    let request = {
      tripId: this.tripInfo.id,
      date: date,
      startTime: startTime,
      endTime: endTime,
      startingKm: startingKm,
      endingKm: endingKm,
      totalKm: totalKm,
      fuel: fuel,
      description: description,
    };

    if (this.isAdd) {
    } else if (this.isEdit) {
    }
  }
}
