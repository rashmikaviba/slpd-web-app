import { map } from "rxjs/operators";
import { DatePipe } from "@angular/common";
import { Component, Input, OnInit } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { TripService } from "src/app/shared/services/api-services/trip.service";
import { CommonForm } from "src/app/shared/services/app-common-form";
import { AppMessageService } from "src/app/shared/services/app-message.service";
import { GeolocationService } from "src/app/shared/services/geolocation.service";
import { SidebarService } from "src/app/shared/services/sidebar.service";

@Component({
  selector: "app-update-location-form",
  templateUrl: "./update-location-form.component.html",
  styleUrls: ["./update-location-form.component.css"],
})
export class UpdateLocationFormComponent implements OnInit {
  layout: "grid" | "list" = "list";
  places: any[] = [];
  tripInfo: any = null;
  isView: boolean = false;
  FV = new CommonForm();
  constructor(
    private messageService: AppMessageService,
    private geolocationService: GeolocationService,
    private tripService: TripService,
    private sideBarService: SidebarService,
    private datePipe: DatePipe
  ) {}

  ngOnInit() {
    let sideBarData: any = this.sideBarService.getData();
    this.tripInfo = sideBarData.tripInfo;
    this.isView = sideBarData.isView;
    this.loadInitialData();
  }

  async loadInitialData() {
    try {
      const tripPlacesResult = await firstValueFrom(
        this.tripService.GetTripPlacesByTripId(this.tripInfo?.id)
      );

      if (tripPlacesResult.IsSuccessful) {
        this.places = tripPlacesResult.Result;
        this.places.map((x) => {
          x.showDate = x.dates
            .map((x) => {
              return this.datePipe.transform(x, "yyyy-MM-dd");
            })
            .join(" / ");
          // replce <p> with n<p style="line-height: 1.2;">
          x.description = x.description.replace(
            /<p>/g,
            "<p style='margin: 0 0 3px 0'>"
          );
        });
      }

      console.log(this.places);
    } catch (error) {
      this.messageService.showErrorAlert(error.message || error);
    }
  }

  async markAsReached(item: any) {
    try {
      let location = {
        lat: null,
        lng: null,
      };
      const locationResult = await firstValueFrom(
        this.geolocationService.getCurrentLocation()
      );

      if (locationResult) {
        location.lat = locationResult.latitude;
        location.lng = locationResult.longitude;
      }

      let confirmationConfig = {
        message: "Are you sure you want to mark this location as reached?",
        header: "Confirmation",
        icon: "pi pi-exclamation-triangle",
      };

      this.messageService.ConfirmPopUp(
        confirmationConfig,
        (isConfirm: boolean) => {
          if (isConfirm) {
            let request = {
              location: location,
            };

            this.tripService
              .UpdateTripPlaceAsMarked(this.tripInfo?.id, item._id, request)
              .subscribe((response) => {
                if (response.IsSuccessful) {
                  this.messageService.showSuccessAlert(response.Message);
                  this.loadInitialData();
                } else {
                  this.messageService.showErrorAlert(response.Message);
                }
              });
          }
        }
      );
    } catch (error) {
      this.messageService.showErrorAlert(error.message || error);
    }
  }
}
