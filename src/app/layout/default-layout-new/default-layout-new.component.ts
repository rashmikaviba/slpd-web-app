import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { SidebarService } from "src/app/shared/services/sidebar.service";
import { NotificationsComponent } from "../notifications/notifications.component";
import { MasterDataService } from "src/app/shared/services/master-data.service";
import { AppModule } from "src/app/shared/enums/app-module.enum";

@Component({
  selector: "app-default-layout-new",
  templateUrl: "./default-layout-new.component.html",
  styleUrls: ["./default-layout-new.component.scss"],
})
export class DefaultLayoutNewComponent {
  DynamicItems: any[] = [];
  activeTab: number = -1;
  moduleIds: number[] = [];

  constructor(
    private router: Router,
    private sidebarService: SidebarService,
    private masterDataService: MasterDataService
  ) { }

  ngOnInit(): void {
    this.moduleIds = this.masterDataService.MenuList;
    let module = this.router.url.split("/")[1];

    this.DynamicItems = [
      {
        menuId: 1,
        label: "Dashboard",
        icon: "pi pi-home",
        routerLink: "/dashboard",
        isVisible: this.checkUserAuthorizedToAccess([
          AppModule.SuperAdminDashboard,
        ]),
      },
      {
        menuId: 2,
        label: "User",
        icon: "pi pi-user",
        routerLink: "/user",
        isVisible: this.checkUserAuthorizedToAccess([
          AppModule.SuperAdminUserManagement,
        ]),
      },
      {
        menuId: 3,
        label: "Leave Management",
        icon: "pi pi-user",
        routerLink: "/leave-management",
        isVisible: this.checkUserAuthorizedToAccess([
          AppModule.SuperAdminLeaveManagement,
          AppModule.AdminLeaveManagement,
          AppModule.DriverLeaveManagement,
        ]),
      },
      {
        menuId: 4,
        label: "Month Audit",
        icon: "pi pi-briefcase",
        routerLink: "/month-audit",
        isVisible: this.checkUserAuthorizedToAccess([
          AppModule.SuperAdminMonthAudit,
        ]),
      },
    ];

    this.ModuleActivate(module);
  }

  ModuleActivate(routeModule: any) {
    // debugger;
    this.DynamicItems.forEach((element: any) => {
      if (element.label.toLowerCase().replace(/\s+/g, "-") == routeModule) {
        this.activeTab = element.menuId;
      }
    });
  }

  onClickNotification() {
    let data = {};

    let properties = {
      width: "20vw",
      position: "left",
    };

    this.sidebarService.addComponent(
      "Notifications",
      NotificationsComponent,
      properties,
      data
    );
  }

  checkUserAuthorizedToAccess(moduleIds: number[]): boolean {
    let flag: boolean = false;

    moduleIds.forEach((element) => {
      if (this.moduleIds.includes(element)) {
        flag = true;
      }
    });
    return flag;
  }
}
