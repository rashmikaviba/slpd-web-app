import { DatePipe } from "@angular/common";
import { Component, TemplateRef, ViewChild } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { PrimeNGConfig } from "primeng/api";
import { firstValueFrom } from "rxjs";
import { WebcamViewComponent } from "src/app/shared/components/webcam-view/webcam-view.component";
import { driverTaskData } from "src/app/shared/data/driverTaskData";
import { WellKnownUploadType } from "src/app/shared/enums/well-known-upload-type.enum";
import { ApiConfigService } from "src/app/shared/services/api-config.service";
import { StoreService } from "src/app/shared/services/api-services/store.service";
import { TripService } from "src/app/shared/services/api-services/trip.service";
import { CommonForm } from "src/app/shared/services/app-common-form";
import { AppMessageService } from "src/app/shared/services/app-message.service";
import { HelperService } from "src/app/shared/services/helper.service";
import { PopupService } from "src/app/shared/services/popup.service";
import { SidebarService } from "src/app/shared/services/sidebar.service";

@Component({
  selector: "app-driver-task-form",
  templateUrl: "./driver-task-form.component.html",
  styleUrls: ["./driver-task-form.component.scss"],
})
export class DriverTaskFormComponent {
  @ViewChild("templateRef", { static: true }) templateRef: TemplateRef<any>;
  FV = new CommonForm();
  tasks: any;
  tripInfo: any;
  isView: boolean = false;
  checkListInfo: any = null;
  selectedVehicle: any = null;

  vehicleImages: any = [];

  constructor(
    private apiConfigService: ApiConfigService,
    private messageService: AppMessageService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private sidebarService: SidebarService,
    private tripService: TripService,
    private config: PrimeNGConfig,
    private popUpService: PopupService,
    private helperService: HelperService,
    private storeService: StoreService
  ) {
    this.createForm();
  }

  createForm() {
    this.FV.formGroup = this.formBuilder.group({
      isTermChecked1: [false, [Validators.required, Validators.requiredTrue]],
      isTermChecked2: [false, [Validators.required, Validators.requiredTrue]],
      umbrellaCount: [null, [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit(): void {
    debugger;
    let sideBarData = this.sidebarService.getData();
    this.tripInfo = sideBarData.tripInfo;
    this.checkListInfo = sideBarData.checkListInfo;
    this.selectedVehicle = this.tripInfo.vehicles.find(
      (x) => x.isActive
    )
    this.isView = sideBarData.isView;
    // status 1 = pending, 2 = responded as yes and 3 = responded as no
    this.tasks = JSON.parse(JSON.stringify(driverTaskData));

    if (this.isView) {
      this.arrangeTasksByCheckListAndSetData();
    } else {
      this.sidebarService.setFooterTemplate(this.templateRef);
    }
  }

  arrangeTasksByCheckListAndSetData() {
    this.tasks.vehicleChecklist.forEach((x) => {
      x.status = this.checkListInfo[x.id];
    });

    this.tasks.healthcareChecklist.forEach((x) => {
      x.status = this.checkListInfo[x.id];
    });

    this.FV.formGroup.patchValue({
      isTermChecked1: this.checkListInfo.isTermsConditionsChecked1,
      isTermChecked2: this.checkListInfo.isTermsConditionsChecked2,
      umbrellaCount: this.checkListInfo.umbrellaCount || 0,
    });

    this.vehicleImages = this.checkListInfo.vehicleDamageImages.map((x: any) => {
      return {
        url: x,
      };
    });

    this.FV.formGroup.disable();
  }

  onClickYes(e: any) {
    e.status = 2;
  }
  onClickNo(e: any) {
    e.status = 3;
  }

  onClickRefresh(e: any) {
    e.status = 1;
  }

  onClickCancel() {
    this.sidebarService.sidebarEvent.emit({
      action: "clear",
    });
  }

  async onClickSave() {
    try {
      if (
        this.tasks.vehicleChecklist.find((x) => x.status == 1) != undefined &&
        this.tasks.healthcareChecklist.find((x) => x.status == 1) != undefined
      ) {
        return;
      }

      if (
        this.FV.validateControllers("isTermChecked1,isTermChecked2,umbrellaCount")
      ) {
        return;
      }

      let requestObj = Object.create(null);

      this.tasks.vehicleChecklist.forEach((x) => {
        requestObj[x.id] = x.status;
      });

      this.tasks.healthcareChecklist.forEach((x) => {
        requestObj[x.id] = x.status;
      });

      let formData: any = this.FV.formGroup.value;
      requestObj["isTermsConditionsChecked1"] = formData.isTermChecked1 || false;
      requestObj["isTermsConditionsChecked2"] = formData.isTermChecked2 || false;
      requestObj["umbrellaCount"] = formData.umbrellaCount || 0;

      let uploadedImages: any[] = [];
      if (this.vehicleImages.length > 0) {
        let images: File[] = this.vehicleImages.map((x) => x.file);

        const uploadedResult: any = await firstValueFrom(this.storeService.UploadMultipleImages(
          images,
          WellKnownUploadType.VehicleDamage
        ));

        if (uploadedResult.IsSuccessful) {
          uploadedImages = uploadedResult.Result || [];
        }
      }

      requestObj["vehicleDamageImages"] = uploadedImages;

      const saveResult = await firstValueFrom(this.tripService
        .SaveCheckList(this.tripInfo.id, requestObj));

      if (saveResult.IsSuccessful) {
        this.messageService.showSuccessAlert(saveResult.Message);
        this.sidebarService.sidebarEvent.emit({
          action: "refresh",
        });
      } else {
        this.messageService.showErrorAlert(saveResult.Message);
      }

    } catch (error) {
      this.messageService.showErrorAlert(error.message || error);
    }


  }

  openCameraView() {

    if (this.vehicleImages.length >= 5) {
      this.messageService.showWarnAlert("You can upload maximum 5 images");
      return;
    }

    let header = "Capture Damage";

    this.popUpService
      .OpenModel(WebcamViewComponent, {
        header: header,
        width: "35vw",
        height: "35vh",
      })
      .subscribe((res) => {
        if (res?.isSave) {
          this.vehicleImages.push({
            id: this.helperService.generateUniqueId("img"),
            res: res,
            url: res.imageUrl,
            file: res.file
          });
        }
      });
  }

  removeImage(id: string) {
    this.vehicleImages = this.vehicleImages.filter((x) => x.id != id);
  }
}
