import { DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { UntypedFormBuilder, Validators } from "@angular/forms";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { WellKnownUserRole } from "src/app/shared/enums/well-known-user-role.enum";
import { TripSummaryService } from "src/app/shared/services/api-services/trip-summary.service";
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
  tripSummaryData: any;
  constructor(
    private formBuilder: UntypedFormBuilder,
    private datePipe: DatePipe,
    private config: DynamicDialogConfig,
    private masterDataService: MasterDataService,
    private ref: DynamicDialogRef,
    private messageService: AppMessageService,
    private tripSummary: TripSummaryService
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
    } else if (this.isEdit) {
      this.tripSummaryData = dialogConfig.tripSummaryData;
      this.setValues();
    }

    // if (this.masterDataService.Role == WellKnownUserRole.DRIVER) {
    //   this.FV.disableField("date");
    // }
  }

  setValues() {
    debugger;
    this.FV.setValue(
      "date",
      this.datePipe.transform(this.tripSummaryData.date, "yyyy-MM-dd")
    );
    this.FV.setValue(
      "startTime",
      this.datePipe.transform(this.tripSummaryData.startingTime, "HH:mm")
    );
    this.FV.setValue(
      "endTime",
      this.datePipe.transform(this.tripSummaryData.endingTime, "HH:mm")
    );
    this.FV.setValue("startingKm", this.tripSummaryData.startingKm);
    this.FV.setValue("endingKm", this.tripSummaryData.endingKm);
    this.FV.setValue("totalKm", this.tripSummaryData.totalKm);
    this.FV.setValue("fuel", this.tripSummaryData.fuel);
    this.FV.setValue("description", this.tripSummaryData.description);
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
    let startingKm = this.FV.getValue("startingKm") || 0;
    let endingKm = this.FV.getValue("endingKm") || 0;
    let totalKm = this.FV.getValue("totalKm") || 0;
    let fuel = this.FV.getValue("fuel") || 0;
    let description = this.FV.getValue("description");

    if (endingKm < startingKm && endingKm > 0 && startingKm > 0) {
      this.messageService.showErrorAlert(
        "Ending KM should be greater than Starting KM!"
      );
      return;
    } else if (endingKm > 0 && startingKm > 0) {
      totalKm = endingKm - startingKm;
    }

    if (startTime && endTime && startTime > endTime) {
      this.messageService.showErrorAlert(
        "Start Time should be less than End Time!"
      );
      return;
    }

    let request = {
      tripId: this.tripInfo.id,
      date: date,
      startTime: new Date(date + " " + startTime),
      endTime: endTime ? new Date(date + " " + endTime) : null,
      startingKm: startingKm,
      endingKm: endingKm,
      totalKm: totalKm,
      fuel: fuel,
      description: description,
    };

    if (this.isAdd) {
      this.tripSummary.SaveTripSUmmary(request).subscribe((response) => {
        if (response.IsSuccessful) {
          this.messageService.showSuccessAlert(response.Message);
          this.ref.close(true);
        } else {
          this.messageService.showErrorAlert(response.Message);
        }
      });
    } else if (this.isEdit) {
      this.tripSummary
        .UpdateTripSummary(this.tripSummaryData._id, request)
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
