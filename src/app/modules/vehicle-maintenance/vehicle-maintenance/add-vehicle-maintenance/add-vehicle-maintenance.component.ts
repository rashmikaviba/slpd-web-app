import { DatePipe } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { firstValueFrom, forkJoin } from 'rxjs';
import { WebcamViewComponent } from 'src/app/shared/components/webcam-view/webcam-view.component';
import { WellKnownUploadType } from 'src/app/shared/enums/well-known-upload-type.enum';
import { GarageService } from 'src/app/shared/services/api-services/garage.service';
import { StoreService } from 'src/app/shared/services/api-services/store.service';
import { VehicleMaintenanceService } from 'src/app/shared/services/api-services/vehicle-maintenance.service';
import { VehicleService } from 'src/app/shared/services/api-services/vehicle.service';
import { CommonForm } from 'src/app/shared/services/app-common-form';
import { AppMessageService } from 'src/app/shared/services/app-message.service';
import { HelperService } from 'src/app/shared/services/helper.service';
import { MasterDataService } from 'src/app/shared/services/master-data.service';
import { PopupService } from 'src/app/shared/services/popup.service';
import { SidebarService } from 'src/app/shared/services/sidebar.service';

@Component({
  selector: 'app-add-vehicle-maintenance',
  templateUrl: './add-vehicle-maintenance.component.html',
  styleUrls: ['./add-vehicle-maintenance.component.css']
})
export class AddVehicleMaintenanceComponent implements OnInit {
  @ViewChild("templateRef", { static: true }) templateRef: TemplateRef<any>;
  FV = new CommonForm()
  garages: any[] = []
  vehicles: any[] = []
  isView: boolean = false
  isEdit: boolean = false
  invoiceImages: any = [];
  minDate: Date = new Date();
  maxDate: Date = new Date();
  vehicleMaintenance: any = null

  constructor(
    private formBuilder: UntypedFormBuilder,
    private messageService: AppMessageService,
    private datePipe: DatePipe,
    private garageService: GarageService,
    private vehicleMaintenanceService: VehicleMaintenanceService,
    private vehicleService: VehicleService,
    private sidebarService: SidebarService,
    private popUpService: PopupService,
    private helperService: HelperService,
    private storeService: StoreService,
    private masterDataService: MasterDataService
  ) {
    this.createForm()
  }

  ngOnInit() {
    this.sidebarService.setFooterTemplate(this.templateRef);
    let sideBarData = this.sidebarService.getData();

    this.minDate = new Date(this.masterDataService.WorkingYear, this.masterDataService.WorkingMonth - 1, 1);
    // this.maxDate = new Date(this.masterDataService.WorkingYear, this.masterDataService.WorkingMonth, 0);

    this.FV.setValue("maintenanceDate", this.minDate);
    this.vehicleMaintenance = sideBarData.vehicleMaintenance
    this.isEdit = sideBarData.isEdit;
    this.isView = sideBarData.isView;

    this.loadInitialData();
  }

  async loadInitialData() {
    try {
      const [garageResult, vehicleResult] = await forkJoin([
        this.garageService.GetAllGarages(),
        this.vehicleService.GetAllVehicles()
      ]).toPromise();

      if (garageResult.IsSuccessful) {
        this.garages = garageResult.Result;
      }
      if (vehicleResult.IsSuccessful) {
        this.vehicles = vehicleResult.Result;
      }

      if (this.isEdit || this.isView) {
        this.setValues();
      }
    } catch (error) {
      this.messageService.showErrorAlert(error.message || error);
    }
  }
  createForm() {
    this.FV.formGroup = this.formBuilder.group({
      vehicle: ['', [Validators.required]],
      maintenancePart: ['', [Validators.required]],
      garage: ['', [Validators.required]],
      maintenanceDate: ['', [Validators.required]],
      cost: ['', [Validators.required, Validators.min(0.01)]],
      note: ['', [Validators.maxLength(500)]],
    });
  }

  setValues() {
    this.FV.setValue("vehicle", this.vehicleMaintenance.vehicle);
    this.FV.setValue("maintenancePart", this.vehicleMaintenance.maintenancePart);
    this.FV.setValue("garage", this.vehicleMaintenance.garage);
    this.FV.setValue("maintenanceDate", new Date(this.vehicleMaintenance.maintenanceDate));
    this.FV.setValue("cost", this.vehicleMaintenance.cost);
    this.FV.setValue("note", this.vehicleMaintenance.note);

    debugger
    if (this.vehicleMaintenance.billImageUrls && this.vehicleMaintenance.billImageUrls.length > 0) {
      this.invoiceImages = this.vehicleMaintenance.billImageUrls.map((x: any) => {
        return {
          _id: this.helperService.generateUniqueId("existingInvoiceImg"),
          url: x,
        }
      });
    }

    if (this.isView) {
      this.FV.formGroup.disable();
    }
  }

  openCameraView() {

    if (this.invoiceImages.length >= 5) {
      this.messageService.showWarnAlert("You can upload maximum 5 images");
      return;
    }

    let header = "Invoice Images";

    this.popUpService
      .OpenModel(WebcamViewComponent, {
        header: header,
        width: "35vw",
        height: "35vh",
      })
      .subscribe((res) => {
        if (res?.isSave) {
          this.invoiceImages.push({
            _id: this.helperService.generateUniqueId("newInvoiceImg"),
            res: res,
            url: res.imageUrl,
            file: res.file
          });
        }
      });
  }

  removeImage(id: string) {
    debugger
    this.invoiceImages = this.invoiceImages.filter((x) => x._id != id);
  }

  onClickCancel() {
    this.sidebarService.sidebarEvent.emit(false);
  }

  async onClickSave() {
    let validationParams = "vehicle,maintenancePart,garage,maintenanceDate,cost,note";
    if (this.FV.validateControllers(validationParams)) {
      return;
    }

    debugger
    try {
      let toBeUpload: File[] = [];
      let billImageUrls: any[] = [];
      if (this.invoiceImages.length > 0) {
        this.invoiceImages.map((x) => {
          if (x._id.toString().startsWith("newInvoiceImg")) {
            toBeUpload.push(x.file);
          } else if (x._id.toString().startsWith("existingInvoiceImg")) {
            billImageUrls.push(x.url);
          }
        });

      } else {
        toBeUpload = [];
        billImageUrls = [];
      }
      debugger
      if (toBeUpload.length > 0) {
        const uploadedResult: any = await firstValueFrom(this.storeService.UploadMultipleImages(
          toBeUpload,
          WellKnownUploadType.MaintenanceInvoice
        ));

        if (uploadedResult.IsSuccessful) {
          billImageUrls = [...billImageUrls, ...uploadedResult.Result];
        }
      }
      debugger
      let vehicle = this.FV.getValue("vehicle");
      let maintenancePart = this.FV.getTrimValue("maintenancePart");
      let garage = this.FV.getValue("garage");
      let maintenanceDate = this.FV.getValue("maintenanceDate");
      let cost = this.FV.getValue("cost");
      let note = this.FV.getValue("note");

      let request = {
        "vehicle": vehicle,
        "maintenancePart": maintenancePart,
        "garage": garage,
        "maintenanceDate": maintenanceDate,
        "cost": cost,
        "note": note,
        "billImageUrls": billImageUrls
      }


      if (!this.isEdit) {
        this.vehicleMaintenanceService.SaveVehicleMaintenance(request).subscribe((response) => {
          if (response.IsSuccessful) {
            this.messageService.showSuccessAlert(response.Message);
            this.sidebarService.sidebarEvent.emit(true);
          } else {
            this.messageService.showErrorAlert(response.Message);
          }
        });
      } else {
        this.vehicleMaintenanceService.UpdateVehicleMaintenance(this.vehicleMaintenance._id, request).subscribe((response) => {
          if (response.IsSuccessful) {
            this.messageService.showSuccessAlert(response.Message);
            this.sidebarService.sidebarEvent.emit(true);
          } else {
            this.messageService.showErrorAlert(response.Message);
          }
        });
      }

    } catch (error) {
      this.messageService.showErrorAlert(error.message || error);
    }
  }
}
