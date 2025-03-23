import { DatePipe } from "@angular/common";
import { Component, TemplateRef, ViewChild } from "@angular/core";
import { CompanyInformation } from "src/app/shared/data/companyInformation";
import { AppMessageService } from "src/app/shared/services/app-message.service";
import { ExcelService } from "src/app/shared/services/excel.service";
import { SidebarService } from "src/app/shared/services/sidebar.service";

@Component({
  selector: "app-monthly-driver-salary",
  templateUrl: "./monthly-driver-salary.component.html",
  styleUrls: ["./monthly-driver-salary.component.scss"],
})
export class MonthlyDriverSalaryComponent {
  @ViewChild("templateRef", { static: true }) templateRef: TemplateRef<any>;
  month = new Date();
  reportDetails: any[] = [];
  cols: any[] = [];
  totalSalary: number = 0;
  companyInformation: any = CompanyInformation;

  constructor(
    private sidebarService: SidebarService,
    private messageService: AppMessageService,
    private datePipe: DatePipe,
    private excelService: ExcelService
  ) {}

  ngOnInit(): void {
    this.sidebarService.setFooterTemplate(this.templateRef);
    let sideBarData = this.sidebarService.getData();
    this.month = new Date(sideBarData.month);
    this.reportDetails = sideBarData?.reportDetails;
    this.preprocessData();

    this.cols = [
      { field: "tripConfirmationNumber", header: "Trip No" },
      { field: "driverName", header: "Driver" },
      { field: "salaryPerDay", header: "Salary Per Day" },
      { field: "totalAddition", header: "Addition" },
      { field: "totalDeduction", header: "Deduction" },
      { field: "remainingExpenses", header: "Rem. Expenses" },
      { field: "showRemainingToDriver", header: "Rem. To Driver" },
      { field: "totalSalary", header: "Salary (LKR)" },
    ];
  }

  preprocessData() {
    if (this.reportDetails?.length > 0) {
      this.reportDetails.map((report: any) => {
        report.showCreatedDate = this.datePipe.transform(
          report.createdDate,
          "yyyy-MM-dd HH:mm",
          "Asia/Colombo"
        );
        report.showUpdatedDate = this.datePipe.transform(
          report.updatedDate,
          "yyyy-MM-dd HH:mm",
          "Asia/Colombo"
        );
        report.showRemainingToDriver = report?.isRemainingToDriver
          ? "Yes"
          : "No";
      });

      this.totalSalary = this.reportDetails.reduce(
        (total: number, report: any) => {
          return (total += report.totalSalary);
        },
        0
      );
    }
  }

  exportXls() {
    let cols = [
      { field: "tripConfirmationNumber", header: "Trip No" },
      { field: "driverName", header: "Driver" },
      { field: "salaryPerDay", header: "Salary Per Day" },
      { field: "totalAddition", header: "Addition" },
      { field: "totalDeduction", header: "Deduction" },
      { field: "remainingExpenses", header: "Rem. Expenses" },
      { field: "showRemainingToDriver", header: "Rem. To Driver" },
      { field: "totalSalary", header: "Salary (LKR)" },
      { field: "createdUser", header: "Created By" },
      { field: "updatedUser", header: "Last Updated By" },
      { field: "showCreatedDate", header: "Created Date" },
      { field: "showUpdatedDate", header: "Last Modified Date" },
    ];

    let name = `Driver Salary Report (${this.datePipe.transform(
      this.month,
      "yyyy-MM",
      "Asia/Colombo"
    )})`;
    this.excelService.GenerateExcelFileWithCustomHeader(
      cols,
      this.reportDetails,
      name
    );
  }
}
