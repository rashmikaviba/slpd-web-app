import { DatePipe } from '@angular/common';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ApiConfigService } from 'src/app/shared/services/api-config.service';
import { CommonForm } from 'src/app/shared/services/app-common-form';
import { AppMessageService } from 'src/app/shared/services/app-message.service';
import { SidebarService } from 'src/app/shared/services/sidebar.service';

@Component({
  selector: 'app-trip-management-by-driver',
  templateUrl: './trip-management-by-driver.component.html',
  styleUrls: ['./trip-management-by-driver.component.scss']
})
export class TripManagementByDriverComponent {
  @ViewChild("templateRef", { static: true }) templateRef: TemplateRef<any>;
  FV = new CommonForm();
  tasks: any
  isResponded: any = false
  products: any

  constructor(
    private apiConfigService: ApiConfigService,
    private messageService: AppMessageService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private sidebarService: SidebarService
  ) {
    this.createForm()
  }

  createForm() {
    this.FV.formGroup = this.formBuilder.group({
      guestName: ["", [Validators.required]],
      endDate: ["", [Validators.required]],
      passengersCount: ["", [Validators.required]],
      placeName: [''],
      distance: [''],
      date: [''],
      time: ['']
    });
  }

  ngOnInit(): void {
    let sideBarData = this.sidebarService.getData();
    this.sidebarService.setFooterTemplate(this.templateRef);

    this.products = [
      { name: 'Colombo', category: 'Place', distance: '100 KM' },
      { name: 'Galle', category: 'Place', distance: '50 KM' },
      { name: 'Matara', category: 'Place', distance: '60 KM' },
      { name: 'Kurunagala', category: 'Place', distance: '80 KM' },
    ]
  }

  loadAllDriverTasks() {
    try {
      this.apiConfigService.getDriverTasksJSON().subscribe((result) => {
        if (result) {
          let data = result
          this.tasks = result
          console.log("Data", data)
        }
      })
    } catch (error: any) {
      this.messageService.showErrorAlert(error)
    }
  }

  onClickYes(e: any) {
    e.status = true
    this.isResponded = true
  }
  onClickNo(e: any) {
    e.status = true
    this.isResponded = true
  }
  onClickCancel() { }
  onClickSave() { }
}
