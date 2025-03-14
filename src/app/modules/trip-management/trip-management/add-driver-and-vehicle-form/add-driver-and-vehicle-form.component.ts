import { VehicleService } from "src/app/shared/services/api-services/vehicle.service";
import { DatePipe } from "@angular/common";
import { Component } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { UserService } from "src/app/shared/services/api-services/user.service";
import { CommonForm } from "src/app/shared/services/app-common-form";
import { SidebarService } from "src/app/shared/services/sidebar.service";
import { AppMessageService } from "src/app/shared/services/app-message.service";
import { forkJoin, lastValueFrom } from "rxjs";
import { WellKnownUserRole } from "src/app/shared/enums/well-known-user-role.enum";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { TripService } from "src/app/shared/services/api-services/trip.service";
import { languages } from "src/app/shared/data/languages";

@Component({
  selector: "app-add-driver-and-vehicle-form",
  templateUrl: "./add-driver-and-vehicle-form.component.html",
  styleUrls: ["./add-driver-and-vehicle-form.component.scss"],
})
export class AddDriverAndVehicleFormComponent {
  FV = new CommonForm();
  isEdit: any;
  driversArr: any[] = [];
  vehiclesArr: any[] = [];
  tripInformation: any;
  isShowPreviousDrivers: boolean = false;
  isShowPreviousVehicles: boolean = false;
  withoutActiveDriver: any[] = [];
  withoutActiveVehicle: any[] = [];
  constructor(
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private sidebarService: SidebarService,
    private userService: UserService,
    private vehicleService: VehicleService,
    private messageService: AppMessageService,
    private config: DynamicDialogConfig,
    private ref: DynamicDialogRef,
    private tripService: TripService
  ) {
    this.createForm();
  }

  createForm() {
    this.FV.formGroup = this.formBuilder.group({
      driverName: [""],
      vehicle: [""],
    });
  }

  ngOnInit(): void {
    let dialogConfig = this.config.data;
    this.tripInformation = dialogConfig.tripInformation;

    this.withoutActiveDriver =
      this.tripInformation?.drivers.filter((x: any) => x.isActive != true) ||
      [];
    this.withoutActiveVehicle =
      this.tripInformation?.vehicles.filter((x: any) => x.isActive != true) ||
      [];

    this.isShowPreviousDrivers =
      this.withoutActiveDriver.length > 0 ? true : false;

    this.isShowPreviousVehicles =
      this.withoutActiveVehicle.length > 0 ? true : false;

    this.loadInitialData();
  }

  async loadInitialData() {
    try {
      const [driverResult, vehicleResult] = await lastValueFrom(
        forkJoin([
          this.userService.GetAllDriversForTrip(
            this.tripInformation?.startDate,
            this.tripInformation?.endDate,
            this.tripInformation?.id
          ),
          this.vehicleService.GetByPassengerCountAndDate(
            this.tripInformation?.passengersCount,
            this.tripInformation?.startDate,
            this.tripInformation?.endDate,
            this.tripInformation?.id
          ),
        ])
      );

      if (driverResult?.IsSuccessful) {
        this.driversArr = driverResult.Result;
        debugger;
        this.driversArr.map((x) => {
          let languagesStr = "";
          if (x.languages.length > 0) {
            languagesStr = x.languages
              .map((x) => {
                return languages.find((y) => y.id == x)?.englishName;
              })
              .join(", ");
          }
          x.languagesStr = languagesStr;
        });
      }

      if (vehicleResult?.IsSuccessful) {
        this.vehiclesArr = vehicleResult.Result;
      }

      if (this.tripInformation?.activeVehicleId) {
        this.FV.setValue("vehicle", this.tripInformation?.activeVehicleId);
      }

      if (this.tripInformation?.activeDriverId) {
        this.FV.setValue("driverName", this.tripInformation?.activeDriverId);
      }
    } catch (error) {
      this.messageService.showErrorAlert(error.message || error);
    }
  }
  onClickCancel() {
    this.ref.close(false);
  }

  onClickSave() {
    let data = this.FV.formGroup.value;

    if (!data?.driverName && !data?.vehicle) {
      this.messageService.showErrorAlert(
        "Please select driver or vehicle to proceed"
      );
      return;
    }

    let request = {
      vehicleId: data?.vehicle,
      driverId: data?.driverName,
    };

    this.tripService
      .AssignDriverAndVehicle(this.tripInformation?.id, request)
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
