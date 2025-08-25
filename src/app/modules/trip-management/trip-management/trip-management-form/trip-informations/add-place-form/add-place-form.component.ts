import { DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { CommonForm } from "src/app/shared/services/app-common-form";
import { AppMessageService } from "src/app/shared/services/app-message.service";

@Component({
  selector: "app-add-place-form",
  templateUrl: "./add-place-form.component.html",
  styleUrls: ["./add-place-form.component.css"],
})
export class AddPlaceFormComponent implements OnInit {
  FV = new CommonForm();
  maxDate: Date = new Date();
  minDate: Date = new Date();
  isEdit: boolean = false;
  selectedPlaceData: any = null;
  constructor(
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private messageService: AppMessageService,
    private config: DynamicDialogConfig,
    private ref: DynamicDialogRef
  ) {
    this.createForm();
  }

  createForm() {
    this.FV.formGroup = this.formBuilder.group({
      description: ["", [Validators.required]],
      dates: [[], [Validators.required]],
    });
  }

  ngOnInit() {
    let dialogConfig = this.config.data;
    this.minDate = new Date(dialogConfig.startDate);
    this.maxDate = new Date(dialogConfig.endDate);
    this.isEdit = dialogConfig.isEdit;

    if (this.isEdit) {
      let placeData = dialogConfig.placeData;
      this.selectedPlaceData = placeData;

      this.setValues();
    }
  }

  setValues() {
    if (this.selectedPlaceData) {
      this.FV.formGroup.patchValue({
        description: this.selectedPlaceData.description,
        dates: this.selectedPlaceData.dates ? this.selectedPlaceData.dates.map((x) => new Date(x)) : [],
      });
    }
  }


  handleCancel() {
    this.FV.formGroup.reset();
  }

  handleSave() {
    if (this.FV.formGroup.invalid) {
      this.FV.showErrors();
      return;
    }

    let formData = this.FV.formGroup.value;
    let request = {
      description: formData.description,
      dates: formData.dates,
    };

    this.ref.close(request);
  }
}
