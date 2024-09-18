import { DatePipe } from '@angular/common';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ApiConfigService } from 'src/app/shared/services/api-config.service';
import { CommonForm } from 'src/app/shared/services/app-common-form';
import { AppMessageService } from 'src/app/shared/services/app-message.service';
import { SidebarService } from 'src/app/shared/services/sidebar.service';

@Component({
  selector: 'app-driver-task-form',
  templateUrl: './driver-task-form.component.html',
  styleUrls: ['./driver-task-form.component.scss']
})
export class DriverTaskFormComponent {
  @ViewChild("templateRef", { static: true }) templateRef: TemplateRef<any>;
  FV = new CommonForm();
  tasks: any
  isResponded: any = false

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
      driverName: ["", [Validators.required]],
      date: ["", [Validators.required]],
      tripId: ["", [Validators.required]]
    });
  }

  ngOnInit(): void {
    let sideBarData = this.sidebarService.getData();
    this.sidebarService.setFooterTemplate(this.templateRef);
    this.loadAllDriverTasks()
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
