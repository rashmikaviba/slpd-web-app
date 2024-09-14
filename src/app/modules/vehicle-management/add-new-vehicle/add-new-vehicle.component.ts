import { DatePipe } from '@angular/common';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CommonForm } from 'src/app/shared/services/app-common-form';
import { SidebarService } from 'src/app/shared/services/sidebar.service';

@Component({
  selector: 'app-add-new-vehicle',
  templateUrl: './add-new-vehicle.component.html',
  styleUrls: ['./add-new-vehicle.component.scss']
})
export class AddNewVehicleComponent {
  @ViewChild("templateRef", { static: true }) templateRef: TemplateRef<any>;

  FV = new CommonForm();
  showAdmin = false;
  showDriver = false;
  userDetail: any;
  minDate: string = "";
  maxDate: string = "";
  type: any
  nicImageUrl: any
  constructor(
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private sidebarService: SidebarService
  ) {
    this.createForm();
  }

  createForm() {
    this.FV.formGroup = this.formBuilder.group({
      vehicleNumber: ["", [Validators.required]],
      ownerName: ["", [Validators.required]],
      vehicleType: ["", [Validators.required]],
      regNumber: ["", [Validators.required]],
      regDate: ["", [Validators.required]],

      capacity: ["", [Validators.required]],
      noOFSeats: [""],
      basicSalary: ["", [Validators.required]],
      languages: [[], [Validators.required]],
      role: ["", [Validators.required]],
    });
  }

  ngOnInit(): void {
    let sideBarData = this.sidebarService.getData();
    this.sidebarService.setFooterTemplate(this.templateRef);
  }

  onClickSave() { }
  onClickCancel() { }

}
