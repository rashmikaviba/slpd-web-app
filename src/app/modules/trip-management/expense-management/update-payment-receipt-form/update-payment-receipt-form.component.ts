import { DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { firstValueFrom } from "rxjs";
import { WebcamViewComponent } from "src/app/shared/components/webcam-view/webcam-view.component";
import { paymentMethod } from "src/app/shared/data/commonData";
import { WellKnownUploadType } from "src/app/shared/enums/well-known-upload-type.enum";
import { ExpenseService } from "src/app/shared/services/api-services/expense.service";
import { StoreService } from "src/app/shared/services/api-services/store.service";
import { TripService } from "src/app/shared/services/api-services/trip.service";
import { CommonForm } from "src/app/shared/services/app-common-form";
import { AppMessageService } from "src/app/shared/services/app-message.service";
import { PopupService } from "src/app/shared/services/popup.service";

@Component({
  selector: "app-update-payment-receipt-form",
  templateUrl: "./update-payment-receipt-form.component.html",
  styleUrls: ["./update-payment-receipt-form.component.css"],
})
export class UpdatePaymentReceiptFormComponent implements OnInit {
  FV = new CommonForm();
  minDate: string = "";
  maxDate: string = "";
  paymentMethodArr: any = paymentMethod;
  receiptImageUrl: string | ArrayBuffer | null = null;
  uploadReceiptImage: any = null;
  selectedReceiptImage: File = null;
  type: string = "";
  tripInfo: any = null;
  receiptInfo: any = null;
  isView: boolean = false;
  actionType: number = 0;

  constructor(
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private messageService: AppMessageService,
    private config: DynamicDialogConfig,
    private ref: DynamicDialogRef,
    private popUpService: PopupService,
    private storeService: StoreService,
    private tripService: TripService
  ) {
    this.createForm();
  }

  createForm() {
    this.FV.formGroup = this.formBuilder.group({
      paymentMode: ["", [Validators.required]],
      amount: ["", [Validators.required, Validators.min(0.01)]],
      date: ["", [Validators.required]],
      description: ["", [Validators.maxLength(500)]],
    });
  }

  ngOnInit(): void {
    let dialogConfig = this.config.data;
    this.type = dialogConfig.type;
    this.tripInfo = dialogConfig.tripInfo;
    this.actionType = dialogConfig.actionType;
    this.receiptInfo = dialogConfig.receiptInfo;

    if (this.type == "add") {
      this.minDate = this.datePipe.transform(
        new Date(this.tripInfo.startDate),
        "yyyy-MM-dd"
      );
      this.maxDate = this.datePipe.transform(
        new Date(this.tripInfo.endDate),
        "yyyy-MM-dd"
      );

      let today = this.datePipe.transform(new Date(), "yyyy-MM-dd");

      if (today > this.maxDate) {
        this.FV.setValue("date", this.maxDate);
      } else {
        this.FV.setValue("date", today);
      }
    } else if (this.type == "view") {
      this.isView = true;
      this.setValues();
      this.FV.formGroup.disable();
    }
  }

  setValues() {
    let selectedMode = this.paymentMethodArr.find(
      (x) => x.value == this.receiptInfo.paymentMode
    );

    this.FV.setValue("paymentMode", selectedMode ? selectedMode : null);
    this.FV.setValue("amount", this.receiptInfo.paymentAmount);
    this.FV.setValue(
      "date",
      this.datePipe.transform(this.receiptInfo.paymentDate, "yyyy-MM-dd")
    );
    this.FV.setValue("description", this.receiptInfo.paymentRemark);

    if (this.receiptInfo.receiptImageUrl) {
      this.receiptImageUrl = this.receiptInfo.receiptImageUrl;
    }
  }

  onChangeDate() {}

  openUploadDialog() {
    let header = "Capture ";
    this.popUpService
      .OpenModel(WebcamViewComponent, {
        header: header,
        width: "35vw",
        height: "35vh",
      })
      .subscribe((res) => {
        if (res?.isSave) {
          this.receiptImageUrl = res.imageUrl;
          this.selectedReceiptImage = res.file;
          this.uploadReceiptImage = res;
        }
      });
  }

  removeImage() {
    this.receiptImageUrl = null;
    this.selectedReceiptImage = null;
    this.uploadReceiptImage = null;
  }

  async onClickSave() {
    try {
      let validateParams = "paymentMode,amount,date,description";
      if (this.FV.validateControllers(validateParams)) {
        return;
      }
      let formData = this.FV.formGroup.value;
      let date = this.FV.getValue("date");

      let receiptImageUrl =
        this.type == "add" ? "" : this.receiptInfo.receiptImageUrl;
      if (this.selectedReceiptImage != null) {
        const receptResult = await firstValueFrom(
          this.storeService.UploadImage(
            this.selectedReceiptImage,
            WellKnownUploadType.ExpensesRecept
          )
        );

        if (receptResult.IsSuccessful) {
          receiptImageUrl = receptResult.Result;
        }
      }

      let request = {
        objectId: this.receiptInfo._id,
        paymentAmount: formData.amount || 0,
        paymentDate: date,
        paymentRemark: formData.description || "",
        paymentMode: formData.paymentMode.value,
        receiptImageUrl: receiptImageUrl,
        type: this.actionType || 0,
      };

      this.tripService
        .UpdateTripHotelsAndActivitiesPayment(this.tripInfo.id, request)
        .subscribe((response) => {
          if (response.IsSuccessful) {
            this.messageService.showSuccessAlert(response.Message);
            this.ref.close(true);
          } else {
            this.messageService.showErrorAlert(response.Message);
          }
        });
    } catch (e) {
      this.messageService.showErrorAlert(e?.message || e);
    }
  }

  onClickCancel() {
    this.ref.close(false);
  }
}
