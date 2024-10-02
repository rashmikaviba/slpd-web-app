import { DatePipe } from '@angular/common';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MenuItem } from 'primeng/api';
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
  activeIndex: any = 0;
  items: MenuItem[];
  value: any = { value: 0, label: "General Information" };
  showingIndex: number = 0;
  userDetail: any;
  uploadedImages: any;
  isEdit: boolean = false;

  constructor(
    private sidebarService: SidebarService,
    private messageService: AppMessageService,
  ) { }

  ngOnInit(): void {
    let sideBarData = this.sidebarService.getData();
    this.sidebarService.setFooterTemplate(this.templateRef);

    this.items = [
      {
        value: 0,
        label: "General Information",
      },
      {
        value: 1,
        label: "Guest Information",
      },
      {
        value: 2,
        label: "Trip Information",
      },
      {
        value: 3,
        label: "Other Information",
      },
    ];
  }

  handleClick(index: number): void {
    console.log("index", index);
    this.showingIndex = this.items[index]?.value;
    console.log("value", this.showingIndex);
  }

  handleCancel() { }
  handleUpdate(e: any) { }
  handleSave(e: any) { }
}
