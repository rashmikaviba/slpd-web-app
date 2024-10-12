import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CommonForm } from 'src/app/shared/services/app-common-form';
import { SidebarService } from 'src/app/shared/services/sidebar.service';

@Component({
  selector: 'app-add-driver-and-vehicle-form',
  templateUrl: './add-driver-and-vehicle-form.component.html',
  styleUrls: ['./add-driver-and-vehicle-form.component.scss']
})
export class AddDriverAndVehicleFormComponent {
  FV = new CommonForm();
  products: any
  isEdit: any
  driver: any
  vehicle: any

  constructor(
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private sidebarService: SidebarService
  ) {
    this.createForm();
  }

  createForm() {
    this.FV.formGroup = this.formBuilder.group({
      driverName: ["", [Validators.required]],
      vehicle: ["", [Validators.required]],
      passengersCount: ["", [Validators.required]]
    });
  }

  ngOnInit(): void { }

  onClickCancel() { }
  onClickSave() { }
}
