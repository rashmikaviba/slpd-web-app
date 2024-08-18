import { Component, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { CommonForm } from "src/app/shared/services/app-common-form";
import { MasterDataService } from "src/app/shared/services/master-data.service";
import { DatePipe } from "@angular/common";

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
    private datePipe: DatePipe
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.workingDate = this.masterDataService.WorkingDate;

    this.showWorkingDate = this.datePipe.transform(this.workingDate, "y MMMM");

    let nextMonth = new Date(this.workingDate);
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    this.preventMinMonth = this.datePipe.transform(nextMonth, "y-MM");
    this.preventMaxMonth = this.datePipe.transform(nextMonth, "y-MM");
    this.FV.setValue("selectMonth", this.preventMaxMonth);
  }
  createForm() {
    this.FV.formGroup = this.formBuilder.group({
      selectMonth: [""],
    });
  }

  finish() {}
}
