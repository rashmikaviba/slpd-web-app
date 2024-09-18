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
  constructor(
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private sidebarService: SidebarService,
    private messageService: AppMessageService,
    private commonService: CommonService,
    private vehicleService: VehicleService
  ) {
    this.createForm();
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
      this.FV.setValue("ownerName", this.vehicleData.vehicleOwner);
      this.FV.setValue("vehicleType", this.vehicleData.vehicleType);
      this.FV.setValue("regNumber", this.vehicleData.registrationNumber);
      this.FV.setValue("gpsTracker", this.vehicleData.gpsTracker);
      this.FV.setValue("capacity", this.vehicleData.capacity);
      this.FV.setValue("noOFSeats", this.vehicleData.availableSeats);
      this.FV.setValue("description", this.vehicleData.description);
    }
  }

  onClickSave() {
    if (this.FV.formGroup.invalid) {
      this.FV.showErrors();
      return;
    }

    let ownerName = this.FV.getValue("ownerName") || "";
    let vehicleType = this.FV.getValue("vehicleType");
    let regNumber = this.FV.getValue("regNumber");
    let gpsTracker = this.FV.getValue("gpsTracker");
    let capacity = this.FV.getValue("capacity") || 0;
    let noOFSeats = this.FV.getValue("noOFSeats") || 0;
    let description = this.FV.getValue("description") || "";

    let request = {
      vehicleType: vehicleType,
      vehicleOwner: ownerName,
      registrationNumber: regNumber,
      gpsTracker: gpsTracker,
      capacity: capacity,
      availableSeats: noOFSeats,
      description: description,
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
}
