import { Component, OnInit } from "@angular/core";
import { CommonForm } from "../../services/app-common-form";
import { FormBuilder, Validators } from "@angular/forms";
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { AppMessageService } from "../../services/app-message.service";
import { MasterDataService } from "../../services/master-data.service";
import { TransactionHandlerService } from "../../services/transaction-handler.service";

@Component({
  selector: "app-inactive-login",
  templateUrl: "./inactive-login.component.html",
  styleUrls: ["./inactive-login.component.css"],
})
export class InactiveLoginComponent implements OnInit {
  FV = new CommonForm();
  attempts: number = 0;
  constructor(
    private formBuilder: FormBuilder,
    private ref: DynamicDialogRef,
    private messageService: AppMessageService,
    private masterDataService: MasterDataService,
    private transactionService: TransactionHandlerService
  ) {
    this.createForm();
  }

  ngOnInit() {}

  createForm() {
    this.FV.formGroup = this.formBuilder.group({
      password: ["", [Validators.required]],
    });
  }

  confirm() {
    if (this.FV.formGroup.invalid) {
      this.FV.showErrors();
      return;
    }

    this.attempts++;
    if (this.attempts > 2) {
      this.messageService.showErrorAlert(
        "You have exceeded the maximum number of attempts!"
      );
      this.cancel();
      return;
    }

    let password = this.FV.getValue("password");

    let request = {
      username: this.masterDataService.CurrentUserName,
      password: password,
      HotelId: this.masterDataService.HotelId,
      grant_type: "password",
    };

    this.transactionService.SignIn(request).subscribe((result: any) => {
      if (result.access_token) {
        this.masterDataService.setUserData(result);
        this.masterDataService.HotelId = this.masterDataService.HotelId;
        this.messageService.showSuccessAlert("Session restored successfully!");
        this.ref.close(true);
      } else {
        this.messageService.showErrorAlert(
          "Invalid password! Please try again!"
        );
      }
    });
  }

  cancel() {
    this.ref.close(false);
  }
}
