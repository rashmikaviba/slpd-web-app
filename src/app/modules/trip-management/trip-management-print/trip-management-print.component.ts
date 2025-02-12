import { WellKnownUserRole } from "./../../../shared/enums/well-known-user-role.enum";
import { DatePipe } from "@angular/common";
import { Component, TemplateRef, ViewChild } from "@angular/core";
import { CompanyInformation } from "src/app/shared/data/companyInformation";
import { AppMessageService } from "src/app/shared/services/app-message.service";
import { MasterDataService } from "src/app/shared/services/master-data.service";
import { SidebarService } from "src/app/shared/services/sidebar.service";

@Component({
  selector: "app-trip-management-print",
  templateUrl: "./trip-management-print.component.html",
  styleUrls: ["./trip-management-print.component.scss"],
})
export class TripManagementPrintComponent {
  @ViewChild("templateRef", { static: true }) templateRef: TemplateRef<any>;
  hotelName: any;
  poPrintDetails: any;
  ResName: any;
  passengerDetails: any[] = [];
  arrivalDetails: any = null;
  departureDetails: any = null;
  pickUpInfo: any = null;
  dropOffInfo: any = null;
  pickupAndDropOff: any[] = [];
  places: any[] = [];
  hotels: any[] = [];
  activities: any[] = [];
  expensesDetails: any = null;
  activityCost: number = 0;
  tripInfo: any;
  companyInformation: any = CompanyInformation;
  role: number = 0;
  wellKnownUserRole = WellKnownUserRole;
  constructor(
    private sidebarService: SidebarService,
    private messageService: AppMessageService,
    private datePipe: DatePipe,
    private masterDataService: MasterDataService
  ) {}

  ngOnInit(): void {
    this.role = this.masterDataService.Role;
    this.sidebarService.setFooterTemplate(this.templateRef);
    let sideBarData = this.sidebarService.getData();
    this.tripInfo = sideBarData;

    // Bind Passenger Details
    this.passengerDetails = sideBarData.passengers;
    this.arrivalDetails = sideBarData.arrivalInfo;
    this.departureDetails = sideBarData.departureInfo;

    this.pickUpInfo = sideBarData.pickUpInfo;
    this.dropOffInfo = sideBarData.dropOffInfo;
    this.expensesDetails = sideBarData.expenses;

    this.hotels = sideBarData.hotels;
    this.hotels.map((hotel) => {
      let dates = hotel.dates.split(",");
      hotel.showDates = dates
        .map((x) => {
          return this.datePipe.transform(new Date(x), "MMM d");
        })
        .join(", ");
    });

    this.activities = sideBarData.activities;

    this.activityCost = this.activities.reduce(
      (acc, curr) => acc + curr.totalCost,
      0
    );

    this.places = sideBarData.places;

    this.places.map((x) => {
      x.showDates = x.dates
        .map((x) => {
          return this.datePipe.transform(new Date(x), "MMM d");
        })
        .join(", ");
    });
  }
}
