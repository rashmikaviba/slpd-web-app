import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CommonForm } from 'src/app/shared/services/app-common-form';

@Component({
  selector: 'app-super-admin-leave-form',
  templateUrl: './super-admin-leave-form.component.html',
  styleUrls: ['./super-admin-leave-form.component.scss']
})
export class SuperAdminLeaveFormComponent {
  FV = new CommonForm();
  cols: any;
  recodes: any;
  loading: any;
  sidebarVisible2: boolean = false;
  items: any[];
  filteredItems: any[];
  leaveTypes: any[] = [
    { id: 2, name: 'Pending' },
    { id: 1, name: 'Approve' },
    { id: 3, name: 'Reject' },
  ]

  constructor(
    private formBuilder: FormBuilder,
  ) {
    this.createForm();
  }

  createForm() {
    this.FV.formGroup = this.formBuilder.group({
      leaveType: ["", [Validators.required]],
    });
  }
}
