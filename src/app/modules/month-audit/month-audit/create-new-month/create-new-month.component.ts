import { Component, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { CommonForm } from "src/app/shared/services/app-common-form";

@Component({
  selector: "app-create-new-month",
  templateUrl: "./create-new-month.component.html",
  styleUrls: ["./create-new-month.component.css"],
})
export class CreateNewMonthComponent implements OnInit {
  FV = new CommonForm();
  jumpDate = new Date();
  minDate = new Date();
  preventMinDate: any;
  preventMaxDate: any;
  systemDate: string = "";
  constructor(private formBuilder: FormBuilder) {
    this.createForm();
  }

  ngOnInit(): void {}
  createForm() {
    this.FV.formGroup = this.formBuilder.group({
      selectDate: [""],
    });
  }
  finish() {}
}
