import { DatePipe } from "@angular/common";
import { Component, TemplateRef, ViewChild } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { firstValueFrom } from "rxjs";
import { CommonService } from "src/app/shared/services/api-services/common.service";
import { VehicleService } from "src/app/shared/services/api-services/vehicle.service";
import { CommonForm } from "src/app/shared/services/app-common-form";
import { AppMessageService } from "src/app/shared/services/app-message.service";
import { SidebarService } from "src/app/shared/services/sidebar.service";

@Component({
  selector: "app-add-new-vehicle",
  templateUrl: "./add-new-vehicle.component.html",
  styleUrls: ["./add-new-vehicle.component.scss"],
})
export class AddNewVehicleComponent {
  @ViewChild("templateRef", { static: true }) templateRef: TemplateRef<any>;
  vehicleData: any;
  isEdit: boolean = false;
  FV = new CommonForm();
  typeArr: any;
  minDate: Date = new Date();
  constructor(
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private sidebarService: SidebarService,
    private messageService: AppMessageService,
    private commonService: CommonService,
    private vehicleService: VehicleService
  ) {
    this.createForm();

    this.FV.disableField("currentMileage");
  }

  createForm() {
    this.FV.formGroup = this.formBuilder.group({
      ownerName: ["", [Validators.required]],
      vehicleType: ["", [Validators.required]],
      regNumber: ["", [Validators.required]],
      gpsTracker: [""],
      capacity: [
        "",
        [Validators.required, Validators.min(1), Validators.max(6000)],
      ],
      noOFSeats: [
        "",
        [Validators.required, Validators.min(1), Validators.max(60)],
      ],
      description: [""],

      licenseRenewalDate: ["", [Validators.required]],
      insuranceRenewalDate: ["", [Validators.required]],
      gearOil: [""],
      airFilter: [""],
      oilFilter: [""],
      initialMileage: ["", [Validators.min(0), Validators.required]],
      currentMileage: [""],
      isFreelanceVehicle: [false],
      isRentalVehicle: [false],
    });
  }

  ngOnInit(): void {
    this.sidebarService.setFooterTemplate(this.templateRef);
    let sideBarData = this.sidebarService.getData();
    this.isEdit = sideBarData.isEdit;
    this.vehicleData = sideBarData.vehicleData;

    this.loadInitialData();
  }

  async loadInitialData() {
    try {
      const vTypeResult = await firstValueFrom(
        this.commonService.GetCommonDataByType("VehicleTypes")
      );

      if (vTypeResult.IsSuccessful) {
        this.typeArr = vTypeResult.Result;
      }

      if (this.isEdit) {
        this.setValues();
      }
    } catch (error) {
      this.messageService.showErrorAlert(error);
    }
  }

  setValues() {
    if (this.vehicleData) {
      debugger;
      this.FV.setValue(
        "isFreelanceVehicle",
        this.vehicleData.isFreelanceVehicle
      );
      this.FV.setValue("isRentalVehicle", this.vehicleData.isRentalVehicle);
      this.FV.setValue("ownerName", this.vehicleData.vehicleOwner);
      this.FV.setValue("vehicleType", this.vehicleData.vehicleType);
      this.FV.setValue("regNumber", this.vehicleData.registrationNumber);
      this.FV.setValue("gpsTracker", this.vehicleData.gpsTracker);
      this.FV.setValue("capacity", this.vehicleData.capacity);
      this.FV.setValue("noOFSeats", this.vehicleData.availableSeats);
      this.FV.setValue("description", this.vehicleData.description);

      this.FV.setValue(
        "licenseRenewalDate",
        this.vehicleData.licenseRenewalDate
          ? new Date(this.vehicleData.licenseRenewalDate)
          : ""
      );
      this.FV.setValue(
        "insuranceRenewalDate",
        this.vehicleData.insuranceRenewalDate
          ? new Date(this.vehicleData.insuranceRenewalDate)
          : ""
      );
      this.FV.setValue("gearOil", this.vehicleData.gearOil);
      this.FV.setValue("airFilter", this.vehicleData.airFilter);
      this.FV.setValue("oilFilter", this.vehicleData.oilFilter);
      this.FV.setValue("initialMileage", this.vehicleData.initialMileage);
      this.FV.setValue("currentMileage", this.vehicleData.currentMileage);

      this.onChangeCheckbox();
    }
  }

  onClickSave() {
    let isFreelanceVehicle = this.FV.getValue("isFreelanceVehicle") || false;
    let isRentalVehicle = this.FV.getValue("isRentalVehicle") || false;

    let validateParams = "ownerName,vehicleType,regNumber,noOFSeats";

    if (!isFreelanceVehicle && !isRentalVehicle) {
      validateParams +=
        ",capacity,licenseRenewalDate,insuranceRenewalDate,initialMileage";
    }

    if (this.FV.validateControllers(validateParams)) {
      return;
    }

    let ownerName = this.FV.getValue("ownerName") || "";
    let vehicleType = this.FV.getValue("vehicleType");
    let regNumber = this.FV.getValue("regNumber");
    let gpsTracker = this.FV.getValue("gpsTracker");
    let capacity = this.FV.getValue("capacity") || 0;
    let noOFSeats = this.FV.getValue("noOFSeats") || 0;
    let description = this.FV.getValue("description") || "";

    let licenseRenewalDate = this.FV.getValue("licenseRenewalDate") || null;
    let insuranceRenewalDate = this.FV.getValue("insuranceRenewalDate") || null;
    let gearOil = this.FV.getValue("gearOil") || "";
    let airFilter = this.FV.getValue("airFilter") || "";
    let oilFilter = this.FV.getValue("oilFilter") || "";
    let initialMileage = this.FV.getValue("initialMileage") || 0;

    let freelanceOrRentalVehicle = isFreelanceVehicle || isRentalVehicle;

    let request: any = {
      vehicleType: vehicleType,
      vehicleOwner: ownerName,
      registrationNumber: regNumber,
      availableSeats: noOFSeats,
      isFreelanceVehicle: isFreelanceVehicle,
      isRentalVehicle: isRentalVehicle,

      gpsTracker: freelanceOrRentalVehicle ? "" : gpsTracker,
      capacity: freelanceOrRentalVehicle ? 0 : capacity,
      description: description,
      licenseRenewalDate: freelanceOrRentalVehicle ? "" : licenseRenewalDate,
      insuranceRenewalDate: freelanceOrRentalVehicle ? "" : insuranceRenewalDate,
      gearOil: freelanceOrRentalVehicle ? "" : gearOil,
      airFilter: freelanceOrRentalVehicle ? "" : airFilter,
      oilFilter: freelanceOrRentalVehicle ? "" : oilFilter,
      initialMileage: freelanceOrRentalVehicle ? 0 : initialMileage,
    };

    if (this.isEdit) {
      this.vehicleService
        .UpdateVehicle(this.vehicleData?._id, request)
        .subscribe((response) => {
          if (response.IsSuccessful) {
            this.messageService.showSuccessAlert(response.Message);
            this.sidebarService.sidebarEvent.emit(true);
          } else {
            this.messageService.showErrorAlert(response.Message);
          }
        });
    } else {
      this.vehicleService.SaveVehicle(request).subscribe((response) => {
        if (response.IsSuccessful) {
          this.messageService.showSuccessAlert(response.Message);
          this.sidebarService.sidebarEvent.emit(true);
        } else {
          this.messageService.showErrorAlert(response.Message);
        }
      });
    }
  }

  onClickCancel() {
    this.sidebarService.sidebarEvent.emit(false);
  }

  OnChangeMileage(e: any) {
    this.FV.setValue("currentMileage", e.value);
  }

  onChangeCheckbox() {
    let isFreelanceVehicle = this.FV.getValue("isFreelanceVehicle");
    let isRentalVehicle = this.FV.getValue("isRentalVehicle");

    if (isFreelanceVehicle) {
      this.FV.disableField("isRentalVehicle");
    } else {
      this.FV.enableField("isRentalVehicle");
    }

    if (isRentalVehicle) {
      this.FV.disableField("isFreelanceVehicle");
    } else {
      this.FV.enableField("isFreelanceVehicle");
    }
  }
}
