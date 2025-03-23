import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { CommonForm } from "src/app/shared/services/app-common-form";
import { MasterDataService } from "src/app/shared/services/master-data.service";
import { DatePipe } from "@angular/common";
import { MonthAditService } from "src/app/shared/services/api-services/month-adit.service";
import { AppMessageService } from "src/app/shared/services/app-message.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-create-new-month",
  templateUrl: "./create-new-month.component.html",
  styleUrls: ["./create-new-month.component.css"],
})
export class CreateNewMonthComponent implements OnInit {
  FV = new CommonForm();
  jumpDate = new Date();
  minDate = new Date();
  preventMinMonth: any;
  preventMaxMonth: any;
  workingDate: string = "";
  showWorkingDate: string = "";
  constructor(
    private formBuilder: FormBuilder,
    private masterDataService: MasterDataService,
    private datePipe: DatePipe,
    private mothAuditService: MonthAditService,
    private messageService: AppMessageService,
    private router: Router
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.workingDate = this.masterDataService.WorkingDate;

    this.showWorkingDate = this.datePipe.transform(
      this.workingDate,
      "y MMMM",
      "Asia/Colombo"
    );

    let nextMonth = new Date(this.workingDate);
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    this.preventMinMonth = this.datePipe.transform(
      nextMonth,
      "y-MM",
      "Asia/Colombo"
    );
    this.preventMaxMonth = this.datePipe.transform(
      nextMonth,
      "y-MM",
      "Asia/Colombo"
    );
    this.FV.setValue("selectMonth", this.preventMaxMonth);
  }
  createForm() {
    this.FV.formGroup = this.formBuilder.group({
      selectMonth: ["", [Validators.required]],
    });
  }

  finish() {
    if (this.FV.formGroup.invalid) {
      this.FV.showErrors();
      return;
    }

    let month = this.FV.getValue("selectMonth");
    let monthConToDate = new Date(month);

    let request = {
      month: monthConToDate.getMonth() + 1,
      year: monthConToDate.getFullYear(),
    };

    this.mothAuditService.CreateNewMonth(request).subscribe((response) => {
      if (response.IsSuccessful) {
        this.messageService.showSuccessAlert(response.Message);

        this.mothAuditService.GetWorkingInformation().subscribe((response) => {
          if (response.IsSuccessful) {
            this.masterDataService.setWorkingInfo(response.Result);

            this.router.navigate(["/dashboard"], { skipLocationChange: true });
          }
        });
      } else {
        this.messageService.showErrorAlert(response.Message);
      }
    });
  }
}
