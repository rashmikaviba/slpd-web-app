import { Component, TemplateRef, ViewChild } from '@angular/core';
import { AppMessageService } from 'src/app/shared/services/app-message.service';
import { SidebarService } from 'src/app/shared/services/sidebar.service';

@Component({
  selector: 'app-trip-management-print',
  templateUrl: './trip-management-print.component.html',
  styleUrls: ['./trip-management-print.component.scss']
})
export class TripManagementPrintComponent {
  @ViewChild("templateRef", { static: true }) templateRef: TemplateRef<any>;
  hotelName: any
  poPrintDetails: any
  ResName: any
  passengerDetails: any[] = []
  flightDetails: any[] = []
  pickupAndDropOff: any[] = []
  clearItinerary: any[] = []
  hotelDetails: any[] = []
  activityCost: any[] = []

  constructor(
    private sidebarService: SidebarService,
    private messageService: AppMessageService,
  ) { }

  ngOnInit(): void {
    this.sidebarService.setFooterTemplate(this.templateRef);
    let sideBarData = this.sidebarService.getData();
    console.log("sideBarData Trip", sideBarData)

    // Bind Passenger Details
    this.passengerDetails = sideBarData.passengers

    // Bind Flight Details
    sideBarData.arrivalInfo.status = "Arrival";
    sideBarData.departureInfo.status = "Departure";

    const flightDetails = [sideBarData.arrivalInfo, sideBarData.departureInfo];

    this.flightDetails = flightDetails.map((flightData) => {
      const {
        status,
        arrivalDate,
        departureDate,
        arrivalTime,
        departureTime,
        arrivalFlightNumber,
        departureFlightNumber,
      } = flightData;

      return {
        status,
        date: status === "Arrival" ? arrivalDate : departureDate,
        time: status === "Arrival" ? arrivalTime : departureTime,
        number: status === "Arrival" ? arrivalFlightNumber : departureFlightNumber,
      };
    });

    // Bind pickup And DropOff
    sideBarData.pickUpInfo.status = "Pick-up";
    sideBarData.dropOffInfo.status = "Drop off";

    const pickupAndDropOff = [sideBarData.pickUpInfo, sideBarData.dropOffInfo]

    this.pickupAndDropOff = pickupAndDropOff.map((pickupAndDropOff) => {
      const {
        status,
        pickupDate,
        dropOffDate,
        pickupTime,
        dropOffTime,
        pickupCity,
        dropOffCity,
        pickupAddress,
        dropOffAddress
      } = pickupAndDropOff;

      return {
        status,
        date: status === "Pick-up" ? pickupDate : dropOffDate,
        time: status === "Pick-up" ? pickupTime : dropOffTime,
        address: status === "Pick-up" ? pickupAddress : dropOffAddress,
        city: status === "Pick-up" ? pickupCity : dropOffCity,
      };
    });

    this.clearItinerary = [
      { date: '01st August', details: 'COLOMBO 5.25AM - TRANSFER NEGOMBO -- GALLE 155KM (2H) - NIGHT IN: GALLE' },
      { date: '02nd August', details: 'TRANSFER GALLE -- Yala - NIGHT IN: Yala' },
      { date: '03rd August', details: 'YALA NATIONAL PARK - NIGHT IN: TISSAMAHARAMA' },
      { date: '04th August', details: 'TRANSFER TISSAMAHARAMA -- ELLA 90KM (2H) - NIGHT IN: ELLA' }
    ]

    this.hotelDetails = [
      { date: '01st August', name: 'Brixia Cafe & Guest', city: 'Galle' },
      { date: '01st August', name: 'Brixia Cafe & Guest', city: 'Galle' }
    ]

    this.activityCost = [
      { date: '04th August', activity: 'Half day Udawalawe Safari', passengers: '02 Adults and 01 child ( 4yd)', cost: '120.USD' },
      { date: '06th August', activity: 'Train Ella to Nuwara Eliya ( Nanu oya)', passengers: '02 Adults and 01 child ( 4yd)', cost: '500.USD' },
      { date: '14th August', activity: 'Esala perehara tickets', passengers: '02 Adults and 01 child ( 4yd)', cost: '150.USD' }
    ]
  }
}
