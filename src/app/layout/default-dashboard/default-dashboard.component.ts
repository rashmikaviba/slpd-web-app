import { DashboardService } from '../../shared/services/api-services/dashboard.service';
import { DatePipe } from "@angular/common";
import { Component } from "@angular/core";
import { UntypedFormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { firstValueFrom } from "rxjs";
import { TripService } from "src/app/shared/services/api-services/trip.service";
import { CommonForm } from "src/app/shared/services/app-common-form";
import { AppMessageService } from "src/app/shared/services/app-message.service";
import { MasterDataService } from "src/app/shared/services/master-data.service";
import { PopupService } from "src/app/shared/services/popup.service";

@Component({
  selector: "app-default-dashboard",
  templateUrl: "./default-dashboard.component.html",
  styleUrls: ["./default-dashboard.component.scss"],
})
export class DefaultDashboardComponent {
  FV = new CommonForm();

  tripSummary: any[] = [];
  inventorySummary: any[] = [];
  today = new Date();
  dashboardStats: any = null;
  monthlyIncomeExpense: any[] = [];
  monthlyIEData: any;
  monthlyIEOptions: any;

  documentStyle = getComputedStyle(document.documentElement);
  textColor = this.documentStyle.getPropertyValue('--text-color');
  textColorSecondary = this.documentStyle.getPropertyValue('--text-color-secondary');
  surfaceBorder = this.documentStyle.getPropertyValue('--surface-border');

  status: any[] = [
    {
      value: 1,
      name: "Pending",
    },
    {
      value: 3,
      name: "Started",
    },
  ];

  constructor(

    private popupService: PopupService,
    private router: Router,
    private messageService: AppMessageService,
    private datePipe: DatePipe,
    private formBuilder: UntypedFormBuilder,
    private masterDataService: MasterDataService,
    private tripService: TripService,
    private dashboardService: DashboardService
  ) {
    this.createForm();
  }


  ngOnInit() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    let today = new Date();
    let befor7Days = new Date();
    befor7Days.setDate(befor7Days.getDate() - 7);
    let after7Days = new Date();
    after7Days.setDate(today.getDate() + 7);
    this.FV.setValue("dateRange", [befor7Days, after7Days]);

    this.getTripSummary();
    this.getInventorySummary();
    this.getDashboardStats();
    this.getMonthlyIncomeExpense();

    this.monthlyIEOptions = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          labels: {
            color: this.textColor
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: this.textColorSecondary,
            font: {
              weight: 500
            }
          },
          grid: {
            color: this.surfaceBorder,
            drawBorder: false
          }
        },
        y: {
          ticks: {
            color: this.textColorSecondary
          },
          grid: {
            color: this.surfaceBorder,
            drawBorder: false
          }
        }

      }
    };
  }

  createForm() {
    this.FV.formGroup = this.formBuilder.group({
      dateRange: [[], [Validators.required]],
      status: [1, [Validators.required]],
      yearPicker: [this.today, [Validators.required]],
    });
  }

  onChangeDateRange() {
    let dateRange = this.FV.getValue("dateRange");
    let status = this.FV.getValue("status");

    let startDate = this.datePipe.transform(dateRange[0], "yyyy-MM-dd");
    let endDate = this.datePipe.transform(dateRange[1], "yyyy-MM-dd");

    if (!startDate || !endDate) return;

    this.getTripSummary();
    this.getInventorySummary();
    this.getDashboardStats();
    this.getMonthlyIncomeExpense();
  }

  async getTripSummary() {
    try {
      let dateRange = this.FV.getValue("dateRange");
      let status = this.FV.getValue("status");

      let startDate = this.datePipe.transform(dateRange[0], "yyyy-MM-dd");
      let endDate = this.datePipe.transform(dateRange[1], "yyyy-MM-dd");

      if (!startDate || !endDate) return;

      const tripResponse = await firstValueFrom(
        this.tripService.GetAllTrips(status, startDate, endDate)
      );

      if (tripResponse?.IsSuccessful) {
        this.tripSummary = tripResponse?.Result;
      }
    } catch (error) {
      this.messageService.showErrorAlert(error.message || error);
    }
  }


  async getInventorySummary() {
    try {
      const inventoryResponse = await firstValueFrom(
        this.dashboardService.GetInventorySummary()
      );

      if (inventoryResponse?.IsSuccessful) {
        this.inventorySummary = inventoryResponse?.Result;
      }

    } catch (error) {
      this.messageService.showErrorAlert(error.message || error);
    }
  }

  async getDashboardStats() {
    try {
      let dateRange = this.FV.getValue("dateRange");
      let status = this.FV.getValue("status");

      let startDate = this.datePipe.transform(dateRange[0], "yyyy-MM-dd");
      let endDate = this.datePipe.transform(dateRange[1], "yyyy-MM-dd");

      if (!startDate || !endDate) return;
      const dashboardStatsResponse = await firstValueFrom(
        this.dashboardService.GetDashboardStats(startDate, endDate)
      );

      if (dashboardStatsResponse?.IsSuccessful) {
        this.dashboardStats = dashboardStatsResponse?.Result;

        console.log(this.dashboardStats);
      }
    } catch (error) {
      this.messageService.showErrorAlert(error.message || error);
    }
  }

  async getMonthlyIncomeExpense() {
    try {
      debugger
      let year = this.FV.getValue("yearPicker").getFullYear();

      if (!year) return;

      const dashboardStatsResponse = await firstValueFrom(
        this.dashboardService.GetMonthlyIncomeExpense(year)
      );

      if (dashboardStatsResponse?.IsSuccessful) {
        this.monthlyIncomeExpense = dashboardStatsResponse?.Result;

        let lables = this.monthlyIncomeExpense.map(x => x.month);
        let incomeData = this.monthlyIncomeExpense.map(x => x.income);
        let expenseData = this.monthlyIncomeExpense.map(x => x.expenses);


        this.monthlyIEData = {
          labels: lables,
          datasets: [
            {
              label: 'Income',
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              borderColor: 'rgb(54, 162, 235)',
              data: incomeData,
              borderWidth: 1
            },
            {
              label: 'Expenses',
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              borderColor: 'rgb(255, 99, 132)',
              data: expenseData,
              borderWidth: 1
            }
          ]
        };
      }

    } catch (error) {
      this.messageService.showErrorAlert(error.message || error);
    }
  }

  onChangeYear() {
    this.getMonthlyIncomeExpense();
  }
}
