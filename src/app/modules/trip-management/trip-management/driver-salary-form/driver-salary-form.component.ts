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
  driverArr: any[] = [];
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
      driver: ["", [Validators.required]],
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
    this.driverArr = this.tripInfo?.drivers;

    this.setValues();
  }

  setValues() {
    // checkBox logic
    debugger;
    let selectedDriver = this.driverArr.find((x) => x.isActive == true);
    this.FV.setValue("driver", selectedDriver ? selectedDriver : null);

    let selectedSalary = this.expensesInfo.driverSalaries.find(
      (x) => x.driver == selectedDriver.driver
    );

    this.FV.setValue(
      "remainingExpenses",
      this.expensesInfo.remainingTripExpensesAmount
    );

    this.FV.setValue("noOfDays", this.tripInfo?.dateCount);

    if (this.expensesInfo.remainingTripExpensesAmount > 0 && selectedDriver) {
      this.isShowToDriver = true;
    } else {
      this.isShowToDriver = false;
    }

    if (selectedSalary) {
      this.salaryInfo = selectedSalary;
      this.FV.setValue("salaryPerDay", selectedSalary.salaryPerDay);
      this.FV.setValue("noOfDays", selectedSalary.noOfDays);
      this.FV.setValue("totalAddition", selectedSalary.totalAddition);
      this.FV.setValue("totalDeduction", selectedSalary.totalDeduction);
      this.FV.setValue(
        "isRemainingToDriver",
        selectedSalary.isRemainingToDriver
      );

      this.calculatedSalary = selectedSalary.totalSalary;
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
    let validateParams =
      "driver,noOfDays,salaryPerDay,totalAddition,totalDeduction";

    if (this.FV.validateControllers(validateParams)) {
      return;
    }

    let salaryPerDay = this.FV.getValue("salaryPerDay") || 0;
    let noOfDays = this.FV.getValue("noOfDays") || 0;
    let totalAddition = this.FV.getValue("totalAddition") || 0;
    let totalDeduction = this.FV.getValue("totalDeduction") || 0;
    let isRemainingToDriver = this.FV.getValue("isRemainingToDriver") || false;
    let driver = this.FV.getValue("driver").driver || 0;

    let request = {
      driver: driver,
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

  onChangeDriver() {
    let driver = this.FV.getValue("driver").driver || 0;
    let activeDriverId =
      this.driverArr.find((x) => x.isActive == true)?.driver || 0;

    let selectedSalary = this.expensesInfo.driverSalaries.find(
      (x) => x.driver == driver
    );

    this.FV.setValue("noOfDays", this.tripInfo?.dateCount);
    this.FV.setValue("salaryPerDay", 0);
    this.FV.setValue("totalAddition", 0);
    this.FV.setValue("totalDeduction", 0);
    this.FV.setValue("isRemainingToDriver", false);

    if (selectedSalary) {
      this.salaryInfo = selectedSalary;
      this.FV.setValue("salaryPerDay", selectedSalary.salaryPerDay);
      this.FV.setValue("noOfDays", selectedSalary.noOfDays);
      this.FV.setValue("totalAddition", selectedSalary.totalAddition);
      this.FV.setValue("totalDeduction", selectedSalary.totalDeduction);
      this.FV.setValue(
        "isRemainingToDriver",
        selectedSalary.isRemainingToDriver
      );
    }

    if (driver == activeDriverId) {
      this.isShowToDriver = true;
    } else {
      this.isShowToDriver = false;
      this.FV.setValue("isRemainingToDriver", false);
    }

    this.calculateSalary();
  }
}
