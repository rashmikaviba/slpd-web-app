import { DatePipe } from "@angular/common";
import { Component, TemplateRef, ViewChild } from "@angular/core";
import { AppMessageService } from "src/app/shared/services/app-message.service";
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
  activityCost: number = 0;
  tripInfo: any;

  constructor(
    private sidebarService: SidebarService,
    private messageService: AppMessageService,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.sidebarService.setFooterTemplate(this.templateRef);
    let sideBarData = this.sidebarService.getData();
    this.tripInfo = sideBarData;
    console.log("sideBarData Trip", sideBarData);

    // Bind Passenger Details
    this.passengerDetails = sideBarData.passengers;
    this.arrivalDetails = sideBarData.arrivalInfo;
    this.departureDetails = sideBarData.departureInfo;

    this.pickUpInfo = sideBarData.pickUpInfo;
    this.dropOffInfo = sideBarData.dropOffInfo;

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
    // this.clearItinerary = [
    //   {
    //     date: "01st August",
    //     details:
    //       "COLOMBO 5.25AM - TRANSFER NEGOMBO -- GALLE 155KM (2H) - NIGHT IN: GALLE",
    //   },
    //   {
    //     date: "02nd August",
    //     details: "TRANSFER GALLE -- Yala - NIGHT IN: Yala",
    //   },
    //   {
    //     date: "03rd August",
    //     details: "YALA NATIONAL PARK - NIGHT IN: TISSAMAHARAMA",
    //   },
    //   {
    //     date: "04th August",
    //     details: "TRANSFER TISSAMAHARAMA -- ELLA 90KM (2H) - NIGHT IN: ELLA",
    //   },
    // ];
  }
}
