import { DatePipe } from "@angular/common";
import { Component, TemplateRef, ViewChild } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { WellKnownUserRole } from "src/app/shared/enums/well-known-user-role.enum";
import { LeaveService } from "src/app/shared/services/api-services/leave.service";
import { CommonForm } from "src/app/shared/services/app-common-form";
import { AppMessageService } from "src/app/shared/services/app-message.service";
import { MasterDataService } from "src/app/shared/services/master-data.service";
import { PopupService } from "src/app/shared/services/popup.service";
import { SidebarService } from "src/app/shared/services/sidebar.service";

@Component({
  selector: "app-request-leave-by-driver",
  templateUrl: "./request-leave-by-driver.component.html",
  styleUrls: ["./request-leave-by-driver.component.scss"],
})
export class RequestLeaveByDriverComponent {
  @ViewChild("templateRef", { static: true }) templateRef: TemplateRef<any>;
  FV = new CommonForm();

  workingYear: number = new Date().getFullYear();
  maxValidateDate: string = "";
  minValidateDate: string = "";
  endDateMinValidateDate: string = "";
  endDateMaxValidateDate: string = "";
  dateCount: number = 0;
  isEdit: boolean = false;
  isView: boolean = false;
  leaveData: any;
  // showAvailableLeave: boolean = false;
  // availableLeave: number = 0;
  constructor(
    private formBuilder: FormBuilder,
    private messageService: AppMessageService,
    private popupService: PopupService,
    private sidebarService: SidebarService,
    private masterDataService: MasterDataService,
    private datePipe: DatePipe,
    private leaveService: LeaveService
  ) {
    this.createForm();
  }

  createForm() {
    this.FV.formGroup = this.formBuilder.group({
      startDate: ["", [Validators.required]],
      endDate: ["", [Validators.required]],
      reason: ["", [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.workingYear = this.masterDataService.WorkingYear;
    this.sidebarService.setFooterTemplate(this.templateRef);

    let sideBarData = this.sidebarService.getData();

    if (sideBarData) {
      this.isEdit = sideBarData.isEdit;
      this.isView = sideBarData.isView;
      this.leaveData = sideBarData.leaveData;

      if (this.isEdit || this.isView) {
        this.setData();
      }
    }

    this.maxValidateDate = this.datePipe.transform(
      new Date(this.workingYear, 11, 31),
      "yyyy-MM-dd"
    );

    this.minValidateDate = this.datePipe.transform(new Date(), "yyyy-MM-dd");
  }

  setData() {
    this.dateCount = this.leaveData.dateCount;
    this.FV.formGroup.patchValue({
      startDate: this.datePipe.transform(
        this.leaveData.startDate,
        "yyyy-MM-dd"
      ),
      endDate: this.datePipe.transform(this.leaveData.endDate, "yyyy-MM-dd"),
      reason: this.leaveData.reason,
    });

    let startDate = new Date(this.FV.getValue("startDate"));
    this.endDateMinValidateDate = this.datePipe.transform(
      startDate,
      "yyyy-MM-dd"
    );

    let tenDaysAfter = new Date(startDate.setDate(startDate.getDate() + 9));
    this.endDateMaxValidateDate = this.datePipe.transform(
      tenDaysAfter,
      "yyyy-MM-dd"
    );

    if (this.isView) {
      this.FV.formGroup.disable();
    }
  }

  handleSave() {
    if (this.FV.validateControllers("startDate,endDate,reason")) {
      return;
    }

    let startDate = this.FV.getValue("startDate");
    let endDate = this.FV.getValue("endDate");
    let reason = this.FV.getValue("reason").trim();

    let request = {
      startDate: startDate,
      endDate: endDate,
      dateCount: this.dateCount,
      reason: reason,
    };

    if (this.isEdit) {
      this.leaveService
        .UpdateLeave(this.leaveData._id, request)
        .subscribe((response) => {
          if (response.IsSuccessful) {
            this.messageService.showSuccessAlert(response.Message);
            this.sidebarService.sidebarEvent.emit(true);
          } else {
            this.messageService.showErrorAlert(response.Message);
          }
        });
    } else {
      this.leaveService.ApplyLeave(request).subscribe((response) => {
        if (response.IsSuccessful) {
          this.messageService.showSuccessAlert(response.Message);
          this.sidebarService.sidebarEvent.emit(true);
        } else {
          this.messageService.showErrorAlert(response.Message);
        }
      });
    }
  }

  handleCancel() {
    this.sidebarService.sidebarEvent.emit(false);
  }

  onChangeStartDate() {
    let startDate = new Date(this.FV.getValue("startDate"));

    this.endDateMinValidateDate = this.datePipe.transform(
      startDate,
      "yyyy-MM-dd"
    );

    this.FV.setValue("endDate", this.endDateMinValidateDate);

    let tenDaysAfter = new Date(startDate.setDate(startDate.getDate() + 9));
    this.endDateMaxValidateDate = this.datePipe.transform(
      tenDaysAfter,
      "yyyy-MM-dd"
    );

    this.calculateDateCount();
  }

  onChangeEndDate() {
    this.calculateDateCount();
  }

  calculateDateCount() {
    let startDate = new Date(this.FV.getValue("startDate"));
    let endDate = new Date(this.FV.getValue("endDate"));

    if (startDate > endDate) {
      [startDate, endDate] = [endDate, startDate];
    }

    const timeDiff = endDate.getTime() - startDate.getTime();

    const dayDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

    const dateCount = dayDiff + 1;

    this.dateCount = dateCount;
  }
}