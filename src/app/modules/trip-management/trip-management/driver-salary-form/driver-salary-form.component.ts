import { ExpenseService } from "src/app/shared/services/api-services/expense.service";
import { DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { TripService } from "src/app/shared/services/api-services/trip.service";
import { UserService } from "src/app/shared/services/api-services/user.service";
import { CommonForm } from "src/app/shared/services/app-common-form";
import { AppMessageService } from "src/app/shared/services/app-message.service";
import { SidebarService } from "src/app/shared/services/sidebar.service";

@Component({
  selector: "app-driver-salary-form",
  templateUrl: "./driver-salary-form.component.html",
  styleUrls: ["./driver-salary-form.component.css"],
})
export class DriverSalaryFormComponent implements OnInit {
  FV = new CommonForm();
  expensesInfo: any = null;
  tripInfo: any = null;
  salaryInfo: any = null;
  isShowToDriver: any = false;
  calculatedSalary: any = 0;
  constructor(
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private messageService: AppMessageService,
    private config: DynamicDialogConfig,
    private ref: DynamicDialogRef,
    private tripService: TripService,
    private expenseService: ExpenseService
  ) {
    this.createForm();
  }

  createForm() {
    this.FV.formGroup = this.formBuilder.group({
      salaryPerDay: [0, [Validators.required, Validators.min(0.01)]],
      noOfDays: [0, [Validators.required]],
      totalAddition: [0],
      totalDeduction: [0],
      remainingExpenses: [""],
      isRemainingToDriver: [false],
    });
  }

  ngOnInit() {
    let dialogConfig = this.config.data;
    this.expensesInfo = dialogConfig.expensesInfo;
    this.tripInfo = dialogConfig.tripInformation;
    this.salaryInfo = dialogConfig?.expensesInfo?.driverSalary;

    this.setValues();
  }

  setValues() {
    // checkBox logic
    this.FV.setValue(
      "remainingExpenses",
      this.expensesInfo.remainingTripExpensesAmount
    );

    this.FV.setValue("noOfDays", this.tripInfo?.dateCount);

    if (this.expensesInfo.remainingTripExpensesAmount > 0) {
      this.isShowToDriver = true;
    } else {
      this.isShowToDriver = false;
    }

    if (this.salaryInfo) {
      this.FV.setValue("salaryPerDay", this.salaryInfo.salaryPerDay);
      this.FV.setValue("noOfDays", this.salaryInfo.noOfDays);
      this.FV.setValue("totalAddition", this.salaryInfo.totalAddition);
      this.FV.setValue("totalDeduction", this.salaryInfo.totalDeduction);
      this.FV.setValue(
        "isRemainingToDriver",
        this.salaryInfo.isRemainingToDriver
      );

      this.calculatedSalary = this.salaryInfo.totalSalary;
    }
  }

  calculateSalary() {
    let totalSalary: number = 0;

    let salaryPerDay = this.FV.getValue("salaryPerDay") || 0;
    let noOfDays = this.FV.getValue("noOfDays") || 0;
    let totalAddition = this.FV.getValue("totalAddition") || 0;
    let totalDeduction = this.FV.getValue("totalDeduction") || 0;
    let isRemainingToDriver = this.FV.getValue("isRemainingToDriver") || false;
    let remainingExpenses = this.FV.getValue("remainingExpenses") || 0;

    if (totalAddition > 0) {
      totalSalary += totalAddition;
    }

    if (totalDeduction > 0) {
      totalSalary -= totalDeduction;
    }

    if (salaryPerDay > 0 && noOfDays > 0) {
      totalSalary += salaryPerDay * noOfDays;
    }

    if (remainingExpenses > 0) {
      if (isRemainingToDriver) {
        totalSalary -= remainingExpenses;
      }
    } else {
      totalSalary += Math.abs(remainingExpenses);
    }

    this.calculatedSalary = totalSalary;
  }

  onClickCancel() {
    this.ref.close(false);
  }

  onClickSave() {
    let validateParams = "noOfDays,salaryPerDay,totalAddition,totalDeduction";

    if (this.FV.validateControllers(validateParams)) {
      return;
    }

    let salaryPerDay = this.FV.getValue("salaryPerDay") || 0;
    let noOfDays = this.FV.getValue("noOfDays") || 0;
    let totalAddition = this.FV.getValue("totalAddition") || 0;
    let totalDeduction = this.FV.getValue("totalDeduction") || 0;
    let isRemainingToDriver = this.FV.getValue("isRemainingToDriver") || false;

    let request = {
      salaryPerDay: salaryPerDay,
      noOfDays: noOfDays,
      totalAddition: totalAddition,
      totalDeduction: totalDeduction,
      isRemainingToDriver: isRemainingToDriver,
    };

    this.expenseService
      .SaveDriverSalary(request, this.tripInfo?.id)
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
