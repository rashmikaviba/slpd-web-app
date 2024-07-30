import { Component } from '@angular/core';
import { AddNewUserFormComponent } from './add-new-user-form/add-new-user-form.component';
import { SidebarService } from 'src/app/shared/services/sidebar.service';
import { AppComponent } from 'src/app/app.component';
import { PopupService } from 'src/app/shared/services/popup.service';

@Component({
  selector: 'app-add-new-user',
  templateUrl: './add-new-user.component.html',
  styleUrls: ['./add-new-user.component.scss']
})
export class AddNewUserComponent {
  cols: any
  recodes: any
  loading: any
  sidebarVisible2: boolean = false;

  constructor(
    private sidebarService: SidebarService,
    private appComponent: AppComponent,
    private popupService: PopupService
  ) { }

  ngOnInit(): void {
    this.cols = [
      { field: 'userId', header: 'ID' },
      { field: 'userName', header: 'User Name' },
      { field: 'fullName', header: 'Full Name' },
      { field: 'address', header: 'Address' },
    ]

    this.recodes = [
      { userId: 1, userName: 'Nimna', fullName: 'Nimna Thiranjaya', address: 'Kadawatha' },
      { userId: 2, userName: 'Lahiru', fullName: 'Lahiru Sandaruwan', address: 'Kaduwela' },
    ]
  }


  onClickAddNew() {
    let data = {};

    let properties = {
      width: "50vw",
      position: "right",
    };

    this.sidebarService.addComponent(
      "Add New User",
      AddNewUserFormComponent,
      properties,
      data
    );
  }

  onClickEdit() {
    let data = {};

    let properties = {
      width: "50vw",
      position: "right",
    };

    this.sidebarService.addComponent(
      "Edit User",
      AddNewUserFormComponent,
      properties,
      data
    );
  }
}
