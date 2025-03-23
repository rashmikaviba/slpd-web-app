import { DatePipe } from "@angular/common";
import { Component } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { LeaveService } from "src/app/shared/services/api-services/leave.service";
import { CommonForm } from "src/app/shared/services/app-common-form";
import { AppMessageService } from "src/app/shared/services/app-message.service";

@Component({
  selector: "app-leave-confirmation",
  templateUrl: "./leave-confirmation.component.html",
  styleUrls: ["./leave-confirmation.component.scss"],
})
export class LeaveConfirmationComponent {
  FV = new CommonForm();
  isApproved: boolean = false;
  leaveData: any;
  dateCount: number = 0;
  constructor(
    private formBuilder: FormBuilder,
    private messageService: AppMessageService,
    private config: DynamicDialogConfig,
    private ref: DynamicDialogRef,
    private datePipe: DatePipe,
    private leaveService: LeaveService
  ) {
    this.createForm();
  }

  createForm() {
    this.FV.formGroup = this.formBuilder.group({
      employeeName: [""],
      leaveDates: [""],
      reason: [""],
      leaveReason: [""],
    });
  }

  ngOnInit(): void {
    let data = this.config.data;
    this.isApproved = data.isApproved;
    this.leaveData = data.leaveData;

    this.setData();
  }

  onSubmit() {}

  setData() {
    this.dateCount = this.leaveData.dateCount;
    this.FV.formGroup.patchValue({
      employeeName: this.leaveData.appliedUserName,
      leaveDates:
        this.leaveData.dateCount == 1
          ? `${this.datePipe.transform(
              this.leaveData.startDate,
              "dd-MM-yyyy",
              "Asia/Colombo"
            )}`
          : `${this.datePipe.transform(
              this.leaveData.startDate,
              "dd-MM-yyyy",
              "Asia/Colombo"
            )} - ${this.datePipe.transform(
              this.leaveData.endDate,
              "dd-MM-yyyy",
              "Asia/Colombo"
            )}`,
      leaveReason: this.leaveData.reason,
    });

    this.FV.disableField("employeeName");
    this.FV.disableField("leaveDates");
    this.FV.disableField("leaveReason");
  }

  onClickReject() {
    let request = {
      remark: this.FV.getValue("reason")?.trim() || "",
    };

    if (this.isApproved) {
      this.leaveService
        .ApproveLeave(this.leaveData._id, request)
        .subscribe((response) => {
          if (response.IsSuccessful) {
            this.messageService.showSuccessAlert(response.Message);
            this.ref.close(true);
          } else {
            this.messageService.showErrorAlert(response.Message);
          }
        });
    } else {
      this.leaveService
        .RejectLeave(this.leaveData._id, request)
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

  onClickCancel() {
    this.ref.close(false);
  }
}
