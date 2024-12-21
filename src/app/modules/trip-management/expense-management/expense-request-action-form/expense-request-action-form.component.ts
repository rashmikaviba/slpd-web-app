import { DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { ExpenseExtensionService } from "src/app/shared/services/api-services/expense-extension.service";
import { CommonForm } from "src/app/shared/services/app-common-form";
import { AppMessageService } from "src/app/shared/services/app-message.service";

@Component({
  selector: "app-expense-request-action-form",
  templateUrl: "./expense-request-action-form.component.html",
  styleUrls: ["./expense-request-action-form.component.css"],
})
export class ExpenseRequestActionFormComponent implements OnInit {
  FV = new CommonForm();
  stateOptions: any[] = [];
  selectedState: number = 1;
  expenseReqData: any = null;
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
    this.expenseReqData = dialogConfig.expenseReqData;
    this.stateOptions = [
      { label: "Approve Extension", value: 1 },
      { label: "Reject Extension", value: 2 },
    ];

    this.FV.setValue("approvedAmount", this.expenseReqData.requestedAmount);
  }

  createForm() {
    this.FV.formGroup = this.formBuilder.group({
      approvedAmount: [
        null,
        [Validators.required, Validators.min(0.01), Validators.max(100000)],
      ],
      rejectReason: ["", [Validators.maxLength(500)]],
      selectedState: [1],
    });
  }

  onChangeState() {
    this.selectedState = this.FV.getValue("selectedState");
  }

  onClickCancel() {
    this.ref.close(false);
  }

  onClickSave() {
    let validateString = "";
    if (this.selectedState == 1) {
      validateString = "approvedAmount";
    } else if (this.selectedState == 2) {
      validateString = "rejectReason";
    }

    if (this.FV.validateControllers(validateString)) {
      return;
    }

    let formData = this.FV.formGroup.value;

    if (this.selectedState == 1) {
      let request = {
        approvedAmount: formData.approvedAmount,
      };

      this.expenseExtensionService
        .approveExpenseRequest(this.expenseReqData._id, request)
        .subscribe((response: any) => {
          if (response.IsSuccessful) {
            this.messageService.showSuccessAlert(response.Message);
            this.ref.close(true);
          } else {
            this.messageService.showErrorAlert(response.Message);
          }
        });
    } else if (this.selectedState == 2) {
      let confirmationConfig = {
        message: "Are you sure you want to reject this expense request?",
        header: "Confirmation",
        icon: "pi pi-exclamation-triangle",
      };

      this.messageService.ConfirmPopUp(
        confirmationConfig,
        (isConfirm: boolean) => {
          if (isConfirm) {
            let request = {
              rejectRemark: formData.rejectReason,
            };

            this.expenseExtensionService
              .rejectExpenseRequest(this.expenseReqData._id, request)
              .subscribe((response: any) => {
                if (response.IsSuccessful) {
                  this.messageService.showSuccessAlert(response.Message);
                  this.ref.close(true);
                } else {
                  this.messageService.showErrorAlert(response.Message);
                }
              });
          }
        }
      );
    }
  }
}
