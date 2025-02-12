import { DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { ExpenseExtensionService } from "src/app/shared/services/api-services/expense-extension.service";
import { CommonForm } from "src/app/shared/services/app-common-form";
import { AppMessageService } from "src/app/shared/services/app-message.service";

@Component({
  selector: "app-expense-request-form",
  templateUrl: "./expense-request-form.component.html",
  styleUrls: ["./expense-request-form.component.css"],
})
export class ExpenseRequestFormComponent implements OnInit {
  FV = new CommonForm();
  tripInfo: any = null;
  constructor(
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private messageService: AppMessageService,
    private config: DynamicDialogConfig,
    private ref: DynamicDialogRef,
    private expenseExtensionService: ExpenseExtensionService
  ) {
    this.createForm();
  }

  ngOnInit() {
    let dialogConfig = this.config.data;
    this.tripInfo = dialogConfig.tripInfo;
  }

  createForm() {
    this.FV.formGroup = this.formBuilder.group({
      requestedAmount: [
        "",
        [Validators.required, Validators.min(0.01), Validators.max(100000)],
      ],
      description: ["", [Validators.maxLength(500)]],
    });
  }

  onClickSave() {
    if (this.FV.formGroup.invalid) {
      this.FV.showErrors();
      return;
    }

    let formData = this.FV.formGroup.value;

    let request = {
      tripId: this.tripInfo.id,
      requestedAmount: formData.requestedAmount,
      description: formData.description,
    };

    this.expenseExtensionService
      .saveExpenseRequest(request)
      .subscribe((response: any) => {
        if (response.IsSuccessful) {
          this.messageService.showSuccessAlert(response.Message);
          this.ref.close(true);
        } else {
          this.messageService.showErrorAlert(response.Message);
        }
      });
  }

  onClickCancel() {
    this.ref.close(false);
  }
}
