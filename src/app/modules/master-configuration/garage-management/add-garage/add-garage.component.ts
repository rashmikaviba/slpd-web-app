import { GarageService } from './../../../../shared/services/api-services/garage.service';
import { DatePipe } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { garageSpecializations } from 'src/app/shared/data/garageSpecializations';
import { CommonService } from 'src/app/shared/services/api-services/common.service';
import { CommonForm } from 'src/app/shared/services/app-common-form';
import { AppMessageService } from 'src/app/shared/services/app-message.service';
import { SidebarService } from 'src/app/shared/services/sidebar.service';

@Component({
  selector: 'app-add-garage',
  templateUrl: './add-garage.component.html',
  styleUrls: ['./add-garage.component.css']
})
export class AddGarageComponent implements OnInit {
  @ViewChild("templateRef", { static: true }) templateRef: TemplateRef<any>;
  garageData: any;
  isEdit: boolean = false;
  isView: boolean = false;
  garageSpecializations = garageSpecializations;
  FV = new CommonForm();

  constructor(
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private sidebarService: SidebarService,
    private messageService: AppMessageService,
    private commonService: CommonService,
    private garageService: GarageService
  ) {
    this.createForm();
  }

  createForm() {
    this.FV.formGroup = this.formBuilder.group({
      name: ["", [Validators.required, Validators.maxLength(100)]],
      address: ["", [Validators.maxLength(300)]],
      city: ["", [Validators.maxLength(100)]],
      contactNumber1: ["", [Validators.maxLength(14)]],
      contactNumber2: ["", [Validators.maxLength(14)]],
      googleMapUrl: ["", [Validators.maxLength(500)]],
      specializations: [[], [Validators.required]],
      specializationNames: [""],
      description: ["", [Validators.maxLength(500)]],
    });
  }

  ngOnInit() {
    this.sidebarService.setFooterTemplate(this.templateRef);
    let sideBarData = this.sidebarService.getData();
    this.isEdit = sideBarData.isEdit;
    this.isView = sideBarData.isView;
    this.garageData = sideBarData.garageData;
    this.setData();
  }


  setData() {
    if ((this.isEdit || this.isView) && this.garageData) {
      this.FV.setValue("name", this.garageData.name);
      this.FV.setValue("address", this.garageData.address);
      this.FV.setValue("city", this.garageData.city);
      this.FV.setValue("contactNumber1", this.garageData.contactNumber1);
      this.FV.setValue("contactNumber2", this.garageData.contactNumber2);
      this.FV.setValue("googleMapUrl", this.garageData.googleMapUrl);

      // specialization array removing _id from object
      let specializations: any[] = this.garageData.specializations.map((spec: any) => {
        return {
          id: spec.id,
          name: spec.name,
        };
      });

      this.FV.setValue("specializations", specializations);
      this.FV.setValue("description", this.garageData.description);

      if (this.isView) {
        let specializationNames = specializations.map((spec: any) => spec.name).join(", ");
        this.FV.setValue("specializationNames", specializationNames);
        this.FV.formGroup.disable();
      }
    }
  }

  onClickCancel() {
    this.sidebarService.sidebarEvent.emit(false);
  }

  onClickSave() {
    let validateParams = "name,specializations,description,googleMapUrl,address,city,contactNumber1,contactNumber2";

    if (this.FV.validateControllers(validateParams)) {
      return;
    }

    let request = {
      name: this.FV.getTrimValue("name"),
      address: this.FV.getTrimValue("address"),
      city: this.FV.getTrimValue("city"),
      contactNumber1: this.FV.getTrimValue("contactNumber1"),
      contactNumber2: this.FV.getTrimValue("contactNumber2"),
      googleMapUrl: this.FV.getTrimValue("googleMapUrl"),
      specializations: this.FV.getValue("specializations"),
      description: this.FV.getTrimValue("description"),
    }

    if (!this.isEdit) {
      this.garageService.SaveGarage(request).subscribe((response) => {
        if (response.IsSuccessful) {
          this.messageService.showSuccessAlert(response.Message);
          this.sidebarService.sidebarEvent.emit(true);
        } else {
          this.messageService.showErrorAlert(response.Message);
        }
      });
    } else {
      this.garageService.UpdateGarage(this.garageData._id, request).subscribe((response) => {
        if (response.IsSuccessful) {
          this.messageService.showSuccessAlert(response.Message);
          this.sidebarService.sidebarEvent.emit(true);
        } else {
          this.messageService.showErrorAlert(response.Message);
        }
      });
    }
  }

  onClickOpenGoogleMap() {
    let googleMapUrl = this.FV.getTrimValue("googleMapUrl");
    if (googleMapUrl) {
      window.open(googleMapUrl, "_blank");
    }
  }

}
