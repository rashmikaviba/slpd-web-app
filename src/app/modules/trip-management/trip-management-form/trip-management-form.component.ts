import { DatePipe } from '@angular/common';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CommonForm } from 'src/app/shared/services/app-common-form';
import { AppMessageService } from 'src/app/shared/services/app-message.service';
import { SidebarService } from 'src/app/shared/services/sidebar.service';

@Component({
  selector: 'app-trip-management-form',
  templateUrl: './trip-management-form.component.html',
  styleUrls: ['./trip-management-form.component.scss']
})
export class TripManagementFormComponent {
  @ViewChild("templateRef", { static: true }) templateRef: TemplateRef<any>;
  FV = new CommonForm();
  products: any
  isEdit: any
  isAddNewDesigation: boolean = false

  constructor(
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private sidebarService: SidebarService,
    private messageService: AppMessageService
  ) {
    this.createForm();
  }

  createForm() {
    this.FV.formGroup = this.formBuilder.group({
      startDate: ["", [Validators.required]],
      endDate: ["", [Validators.required]],
      passengersCount: ["", [Validators.required]],
      placeName: [''],
      distance: ['']
    });
  }

  ngOnInit(): void {
    let sideBarData = this.sidebarService.getData();
    this.isEdit = sideBarData.isEdit
    console.log("isEdit", this.isEdit)
    this.sidebarService.setFooterTemplate(this.templateRef);

    this.products = [
      { name: 'Colombo', category: 'Place', distance: '100 KM' },
      { name: 'Galle', category: 'Place', distance: '50 KM' },
      { name: 'Matara', category: 'Place', distance: '60 KM' },
      { name: 'Kurunagala', category: 'Place', distance: '80 KM' },
    ]
  }

  onClickAddNew() {
    try {
      this.isAddNewDesigation = !this.isAddNewDesigation
    } catch (error: any) {
      this.messageService.showErrorAlert(error)
    }
  }
  onClickSave() { }
  onClickCancel() { }
  onClickSubmit() { }
}
