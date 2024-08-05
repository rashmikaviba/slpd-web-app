import { Component, TemplateRef, ViewChild } from "@angular/core";
import { AddNewUserFormComponent } from "./add-new-user-form/add-new-user-form.component";
import { SidebarService } from "src/app/shared/services/sidebar.service";
import { AppComponent } from "src/app/app.component";
import { PopupService } from "src/app/shared/services/popup.service";
import { Router } from "@angular/router";
import { AddUserControlFlowService } from "./add-new-user-form/add-user-control-flow.service";
import { UserService } from "src/app/shared/services/api-services/user.service";
import { firstValueFrom } from "rxjs";

@Component({
  selector: "app-add-new-user",
  templateUrl: "./add-new-user.component.html",
  styleUrls: ["./add-new-user.component.scss"],
})
export class AddNewUserComponent {
  cols: any;
  recodes: any;
  loading: any;
  sidebarVisible2: boolean = false;
  template: TemplateRef<any>;

  constructor(
    private sidebarService: SidebarService,
    private appComponent: AppComponent,
    private popupService: PopupService,
    private router: Router,
    private addUserControlFlowService: AddUserControlFlowService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.cols = [
      { field: "fullName", header: "Full Name" },
      { field: "userName", header: "User Name" },
      { field: "address", header: "Address" },
      { field: "email", header: "Email" },
      { field: "phoneNumber1", header: "Phone" },
      { field: "phoneNumber2", header: "Phone 2" },
      { field: "roleName", header: "Role" },
    ];

    this.getAllUsers();

    this.sidebarService.sidebarEvent.subscribe((response) => {
      if (response) {
        this.getAllUsers();
      }

      this.sidebarService.removeComponent();
      this.appComponent.sidebarVisible = false;
      this.addUserControlFlowService.resetData();
    });
  }

  getAllUsers() {
    this.userService.getAllUsers().subscribe((response) => {
      if (response.IsSuccessful) {
        this.recodes = response.Result;
      }
    });
  }

  onClickAddNew() {
    let data = {
      userData: null,
      isEdit: false,
    };

    this.addUserControlFlowService.resetData();

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

  async onClickEdit(rowData: any) {
    let data = {
      userData: null,
      isEdit: true,
    };

    const userResult = await firstValueFrom(
      this.userService.getUserById(rowData._id)
    );

    if (userResult.IsSuccessful) {
      data.userData = userResult.Result;
      this.addUserControlFlowService.setUserDetail(data.userData);
    }

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

  // sendTemplate() {
  //   this.templateTestService.setTemplate(this.templateRef);
  //   this.router.navigate(["/user-test"]);
  // }
}
