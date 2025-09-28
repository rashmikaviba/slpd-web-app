import { DatePipe } from "@angular/common";
import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { CompanyInformation } from "src/app/shared/data/companyInformation";
import { AppMessageService } from "src/app/shared/services/app-message.service";
import { ExcelService } from "src/app/shared/services/excel.service";
import { SidebarService } from "src/app/shared/services/sidebar.service";

@Component({
  selector: "app-destination-summary-print",
  templateUrl: "./destination-summary-print.component.html",
  styleUrls: ["./destination-summary-print.component.css"],
})
export class DestinationSummaryPrintComponent implements OnInit {
  @ViewChild("templateRef", { static: true }) templateRef: TemplateRef<any>;
  reportDetails: any[] = [];
  cols: any[] = [];
  totalDistance: number = 0;
  companyInformation: any = CompanyInformation;
  tripConfirmedNumber: string = "";
  constructor(
    private sidebarService: SidebarService,
    private messageService: AppMessageService,
    private datePipe: DatePipe,
    private excelService: ExcelService
  ) { }

  ngOnInit(): void {
    this.sidebarService.setFooterTemplate(this.templateRef);
    let sideBarData = this.sidebarService.getData();
    this.reportDetails = sideBarData?.places;
    this.tripConfirmedNumber = sideBarData?.tripConfirmedNumber;
    this.cols = [
      { field: "description", header: "Destination" },
      { field: "startMilage", header: "Start Milage (KM)" },
      { field: "endMilage", header: "End Milage (KM)" },
      { field: "reachedDate", header: "Reached Date" },
      { field: "calcDistance", header: "Calculate Milage (KM)" },
    ];

    this.preprocessData();
  }

  preprocessData() {
    if (this.reportDetails?.length > 0) {
      this.totalDistance = this.reportDetails.reduce(
        (total: number, report: any) => {
          return (total += report.calcDistance);
        },
        0
      );
    }
  }
}
