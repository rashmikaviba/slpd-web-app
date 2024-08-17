import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { CommonForm } from 'src/app/shared/services/app-common-form';
import { AppMessageService } from 'src/app/shared/services/app-message.service';
import { PopupService } from 'src/app/shared/services/popup.service';
import { SidebarService } from 'src/app/shared/services/sidebar.service';

@Component({
  selector: 'app-request-leave-by-admin',
  templateUrl: './request-leave-by-admin.component.html',
  styleUrls: ['./request-leave-by-admin.component.scss']
})
export class RequestLeaveByAdminComponent {
  @ViewChild("templateRef", { static: true }) templateRef: TemplateRef<any>;
  FV = new CommonForm();

  constructor(
    private formBuilder: FormBuilder,
    private messageService: AppMessageService,
    private popupService: PopupService,
    private sidebarService: SidebarService
  ) {
    this.createForm();
  }

  createForm() {
    this.FV.formGroup = this.formBuilder.group({
      startDate: [""],
      endDate: [""],
      dateCount: [""],
      reason: [""]
    });
  }

  ngOnInit(): void {
    this.sidebarService.setFooterTemplate(this.templateRef);
  }

  handleSave() { }
  handleCancel() { }
}
