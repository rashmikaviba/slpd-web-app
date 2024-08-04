import { Component } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { CommonForm } from "src/app/shared/services/app-common-form";
import { AddUserControlFlowService } from "../add-user-control-flow.service";

@Component({
  selector: "app-bank-details",
  templateUrl: "./bank-details.component.html",
  styleUrls: ["./bank-details.component.scss"],
})
export class BankDetailsComponent {
  FV = new CommonForm();
  userDetail: any;
  constructor(
    private formBuilder: FormBuilder,
    private addUserControlFlowService: AddUserControlFlowService
  ) {
    this.createForm();
  }

  createForm() {
    this.FV.formGroup = this.formBuilder.group({
      bankName: ["", [Validators.required]],
      branchName: ["", [Validators.required]],
      accNumber: ["", [Validators.required]],
      accHolderName: ["", [Validators.required]],
      accHolderAddress: ["", [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.userDetail = this.addUserControlFlowService.getUserDetail();
    this.setValues();
  }

  setValues() {
    this.FV.setValue("bankName", this.userDetail.bankName);
    this.FV.setValue("branchName", this.userDetail.branch);
    this.FV.setValue("accNumber", this.userDetail.accountNumber);
    this.FV.setValue("accHolderName", this.userDetail.accountHolderName);
    this.FV.setValue("accHolderAddress", this.userDetail.accountHolderAddress);
  }
}
