import { ExpenseService } from "./../../../../shared/services/api-services/expense.service";
import { DatePipe } from "@angular/common";
import { Component } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { firstValueFrom } from "rxjs";
import { WebcamViewComponent } from "src/app/shared/components/webcam-view/webcam-view.component";
import { expenseCategory } from "src/app/shared/data/expensesCategory";
import { WellKnownUploadType } from "src/app/shared/enums/well-known-upload-type.enum";
import { StoreService } from "src/app/shared/services/api-services/store.service";
import { TripService } from "src/app/shared/services/api-services/trip.service";
import { UserService } from "src/app/shared/services/api-services/user.service";
import { VehicleService } from "src/app/shared/services/api-services/vehicle.service";
import { CommonForm } from "src/app/shared/services/app-common-form";
import { AppMessageService } from "src/app/shared/services/app-message.service";
import { PopupService } from "src/app/shared/services/popup.service";
import { SidebarService } from "src/app/shared/services/sidebar.service";

@Component({
  selector: "app-expense-management-form",
  templateUrl: "./expense-management-form.component.html",
  styleUrls: ["./expense-management-form.component.scss"],
})
export class ExpenseManagementFormComponent {
  FV = new CommonForm();
  expenseType: any[] = expenseCategory;
  minDate: string = "";
  maxDate: string = "";
  receiptImageUrl: string | ArrayBuffer | null = null;
  uploadReceiptImage: any = null;
  selectedReceiptImage: File = null;
  type: string = "";
  userType: string = "";
  tripInfo: any = null;
  expensesInfo: any = null;
  isView: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private messageService: AppMessageService,
    private config: DynamicDialogConfig,
    private ref: DynamicDialogRef,
    private popUpService: PopupService,
    private storeService: StoreService,
    private expenseService: ExpenseService
  ) {
    this.createForm();
  }

  createForm() {
    this.FV.formGroup = this.formBuilder.group({
      expenseType: ["", [Validators.required]],
      amount: ["", [Validators.required, Validators.min(0.01)]],
      date: ["", [Validators.required]],
      description: ["", [Validators.maxLength(500)]],
    });
  }

  ngOnInit(): void {
    let dialogConfig = this.config.data;
    this.userType = dialogConfig.userType;
    this.type = dialogConfig.type;
    this.tripInfo = dialogConfig.tripInfo;

    if (this.type == "add") {
      this.minDate = this.datePipe.transform(
        new Date(this.tripInfo.startDate),
        "yyyy-MM-dd",
        "Asia/Colombo"
      );
      this.maxDate = this.datePipe.transform(
        new Date(this.tripInfo.endDate),
        "yyyy-MM-dd",
        "Asia/Colombo"
      );

      let today = this.datePipe.transform(
        new Date(),
        "yyyy-MM-dd",
        "Asia/Colombo"
      );

      if (today > this.maxDate) {
        this.FV.setValue("date", this.maxDate);
      } else {
        this.FV.setValue("date", today);
      }
    } else if (this.type == "edit") {
      this.expensesInfo = dialogConfig.expensesInfo;
      this.setValues();

      this.minDate = this.datePipe.transform(
        new Date(this.tripInfo.startDate),
        "yyyy-MM-dd",
        "Asia/Colombo"
      );
      this.maxDate = this.datePipe.transform(
        new Date(this.tripInfo.endDate),
        "yyyy-MM-dd",
        "Asia/Colombo"
      );
    } else if (this.type == "view") {
      this.expensesInfo = dialogConfig.expensesInfo;
      this.isView = true;
      this.setValues();
      this.FV.formGroup.disable();
    }

    if (this.userType == "driver") {
      this.FV.disableField("date");
    }
  }

  setValues() {
    let selectedType = this.expenseType.find(
      (x) => x.id == this.expensesInfo.typeId
    );

    this.FV.setValue("expenseType", selectedType ? selectedType : null);
    this.FV.setValue("amount", this.expensesInfo.amount);
    this.FV.setValue(
      "date",
      this.datePipe.transform(
        this.expensesInfo.date,
        "yyyy-MM-dd",
        "Asia/Colombo"
      )
    );
    this.FV.setValue("description", this.expensesInfo.description);

    if (this.expensesInfo.receiptUrl) {
      this.receiptImageUrl = this.expensesInfo.receiptUrl;
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
      let validateParams = "expenseType,amount,date,description";
      if (this.FV.validateControllers(validateParams)) {
        return;
      }
      let formData = this.FV.formGroup.value;
      let date = this.FV.getValue("date");

      let receiptUrl = this.type == "add" ? "" : this.expensesInfo.receiptUrl;
      if (this.selectedReceiptImage != null) {
        const receptResult = await firstValueFrom(
          this.storeService.UploadImage(
            this.selectedReceiptImage,
            WellKnownUploadType.ExpensesRecept
          )
        );

        if (receptResult.IsSuccessful) {
          receiptUrl = receptResult.Result;
        }
      }

      let request = {
        typeId: formData.expenseType.id,
        typeName: formData.expenseType.name,
        amount: formData.amount,
        description: formData.description || "",
        date: date,
        receiptUrl: receiptUrl,
      };

      if (this.type == "add") {
        this.expenseService
          .SaveExpense(request, this.tripInfo.id)
          .subscribe((response) => {
            if (response.IsSuccessful) {
              this.messageService.showSuccessAlert(response.Message);
              this.ref.close(true);
            } else {
              this.messageService.showErrorAlert(response.Message);
            }
          });
      } else if (this.type == "edit") {
        this.expenseService
          .UpdateExpense(request, this.tripInfo.id, this.expensesInfo._id)
          .subscribe((response) => {
            if (response.IsSuccessful) {
              this.messageService.showSuccessAlert(response.Message);
              this.ref.close(true);
            } else {
              this.messageService.showErrorAlert(response.Message);
            }
          });
      }
    } catch (e) {
      this.messageService.showErrorAlert(e?.message || e);
    }
  }

  onClickCancel() {
    this.ref.close(false);
  }
}
