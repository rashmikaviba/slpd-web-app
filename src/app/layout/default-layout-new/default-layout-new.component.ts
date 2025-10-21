import { firstValueFrom, Subscription } from "rxjs";
import { NotificationService } from "../../shared/services/api-services/notification.service";
import { Component } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { SidebarService } from "src/app/shared/services/sidebar.service";
import { NotificationsComponent } from "../../shared/components/notifications/notifications.component";
import { MasterDataService } from "src/app/shared/services/master-data.service";
import { AppModule } from "src/app/shared/enums/app-module.enum";
import { AppMessageService } from "src/app/shared/services/app-message.service";
import { DatePipe } from "@angular/common";
import { PopupService } from "src/app/shared/services/popup.service";
import { ChangePasswordComponent } from "src/app/modules/user/change-password/change-password.component";
import { Store } from "@ngrx/store";
import { AppState } from "src/app/store/app.state";
import {
  addNotification,
  initiallySetState,
  removeNotification,
} from "src/app/store/action/notification.action";
import { selectNotificationCount } from "src/app/store/selector/notification.selector";
import { ExpenseExtensionService } from "src/app/shared/services/api-services/expense-extension.service";
import { WellKnownUserRole } from "src/app/shared/enums/well-known-user-role.enum";

@Component({
  selector: "app-default-layout-new",
  templateUrl: "./default-layout-new.component.html",
  styleUrls: ["./default-layout-new.component.scss"],
})
export class DefaultLayoutNewComponent {
  DynamicItems: any[] = [];
  activeTab: number = -1;
  activeMainTab: number = -1;
  moduleIds: number[] = [];
  workingDate: string = "";
  showWorkingDate: string = "";
  items: any[];
  notificationCount: number = 0;
  private subscriptions: Subscription[] = [];
  constructor(
    private router: Router,
    private sidebarService: SidebarService,
    private masterDataService: MasterDataService,
    private messageService: AppMessageService,
    private datePipe: DatePipe,
    private popupService: PopupService,
    private notificationService: NotificationService,
    private store: Store<AppState>, // private webSocketService: WebSocketService
    private expenseRequestService: ExpenseExtensionService
  ) {

    let module = this.router.url.split("/")[1];

    // check route end every route change
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        let module = this.router.url.split("/")[1];
        this.ModuleActivate(module);
      }
    })

  }

  ngOnInit(): void {
    this.workingDate = this.masterDataService.WorkingDate;

    this.showWorkingDate = this.datePipe.transform(
      this.workingDate,
      "y - MMMM",
      "Asia/Colombo"
    );
    this.moduleIds = this.masterDataService.MenuList;
    let module = this.router.url.split("/")[1];

    this.DynamicItems = [
      {
        menuId: 1,
        label: "Dashboard",
        icon: "pi pi-home",
        routerLink: "/dashboard",
        labelForRoute: "Dashboard",
        isExpanded: false,
        isVisible: this.checkUserAuthorizedToAccess([
          AppModule.SuperAdminDashboard, AppModule.AdminDashboard
        ]),
      },
      {
        menuId: 2,
        label: "User",
        icon: "pi pi-user",
        routerLink: "/user",
        labelForRoute: "User",
        isExpanded: false,
        isVisible: this.checkUserAuthorizedToAccess([
          AppModule.SuperAdminUserManagement,
        ]),
      },
      {
        menuId: 3,
        label: "Leave Management",
        icon: "pi pi-user",
        routerLink: "/leave-management",
        labelForRoute: "Leave Management",
        isExpanded: false,
        isVisible: this.checkUserAuthorizedToAccess([
          AppModule.SuperAdminLeaveManagement,
          AppModule.AdminLeaveManagement,
          AppModule.DriverLeaveManagement,
        ]),
      },
      {
        menuId: 4,
        label: "Trip Management",
        icon: "pi pi-map",
        routerLink: "/trip-management",
        labelForRoute: "Trip Management",
        isExpanded: false,
        isVisible: this.checkUserAuthorizedToAccess([
          AppModule.AdminTripManagement,
          AppModule.SuperAdminTripManagement,
        ]),
      },
      {
        menuId: 6,
        label: "Your Trips",
        icon: "pi pi-map",
        routerLink: "/trip-management",
        labelForRoute: "Trip Management",
        isExpanded: false,
        isVisible: this.checkUserAuthorizedToAccess([
          AppModule.DriverTripManagement,
        ]),
      },
      {
        menuId: 13,
        label: "Monthly Expense Management",
        icon: "pi pi-money-bill",
        routerLink: "/monthly-expenses",
        labelForRoute: "Monthly Expenses",
        isExpanded: false,
        isVisible: this.checkUserAuthorizedToAccess([
          AppModule.AdminMonthlyExpensesManagement,
          AppModule.SUperAdminMonthlyExpensesManagement,
        ]),
      },
      {
        menuId: 7,
        label: "Month Audit",
        icon: "pi pi-briefcase",
        labelForRoute: "Month Audit",
        // routerLink: "/month-audit",
        isExpanded: false,
        isVisible: this.checkUserAuthorizedToAccess([
          AppModule.SuperAdminMonthAudit,
        ]),
        command: (event: any) => {
          this.openMonthAudit();
        },
      },
      {
        menuId: 10,
        label: "Inventory Management",
        icon: "pi pi-warehouse",
        labelForRoute: "Inventory Management",
        isVisible: this.checkUserAuthorizedToAccess([
          AppModule.SuperAdminInventoryManagement, AppModule.AdminInventoryManagement
        ]),
        isExpanded: true,
        items: [
          {
            menuId: 11,
            label: "Product Management",
            icon: "pi pi-box",
            routerLink: "/inventory-management/product-management",
            labelForRoute: "Product Management",
            isVisible: this.checkUserAuthorizedToAccess([
              AppModule.SuperAdminProductManagement, AppModule.AdminProductManagement
            ]),
          },

          {
            menuId: 12,
            label: "Good Received Note",
            icon: "pi pi-file-check",
            routerLink: "/inventory-management/good-received-note",
            labelForRoute: "Good Received Note",
            isVisible: this.checkUserAuthorizedToAccess([
              AppModule.SuperAdminGrnManagement, AppModule.AdminGrnManagement
            ]),
          }
        ],
      },
      {
        menuId: 13,
        label: "Master Configuration",
        icon: "pi pi-cog",
        labelForRoute: "Master Configuration",
        isVisible: this.checkUserAuthorizedToAccess([
          AppModule.SuperAdminMasterConfiguration, AppModule.AdminMasterConfiguration
        ]),
        isExpanded: true,
        items: [
          {
            menuId: 5,
            label: "Vehicle Management",
            icon: "pi pi-car",
            routerLink: "/master-configuration/vehicle-management",
            labelForRoute: "Vehicle Management",
            isExpanded: false,
            isVisible: this.checkUserAuthorizedToAccess([
              AppModule.SuperAdminVehicleManagement,
              AppModule.AdminVehicleManagement,
            ]),
          },
          {
            menuId: 14,
            label: "Garage Management",
            icon: "pi pi-wrench",
            routerLink: "/master-configuration/garage-management",
            labelForRoute: "Garage Management",
            isVisible: this.checkUserAuthorizedToAccess([
              AppModule.SuperAdminGarageManagement, AppModule.AdminGarageManagement
            ]),
          },
        ],
      },
      {
        menuId: 9,
        label: "Reports",
        icon: "pi pi-file",
        routerLink: "/reports",
        labelForRoute: "Reports",
        isExpanded: false,
        isVisible: this.checkUserAuthorizedToAccess([
          AppModule.AdminReportManagement,
          AppModule.SuperAdminReportManagement,
        ]),
      },
      {
        menuId: 15,
        label: "Recommended Garage",
        icon: "pi pi-wrench",
        routerLink: "/recommended-garage",
        labelForRoute: "Recommended Garage",
        isVisible: this.checkUserAuthorizedToAccess([
          AppModule.DriverRecomendedGarage
        ]),
      },
    ];

    this.items = [
      {
        label: "Change Password",
        icon: "pi pi-file",
      },
    ];
    this.ModuleActivate(module);

    // ngrx store
    let isLoaded = this.notificationService.getNotificationLoaded();
    if (!isLoaded) {
      this.getAllNotifications();
    }
    this.store.select(selectNotificationCount).subscribe((count) => {
      this.notificationCount = count;
    });

    this.subscriptions.push(
      this.expenseRequestService.onNewExpenseRequest().subscribe({
        next: (expense: any) => {
          this.messageService.showNotificationAlert(expense?.message);
          this.store.dispatch(addNotification({ notification: expense.data }));
        },

        error: (error) => {
          console.error("Socket error:", error);
        },
      })
    );

    this.subscriptions.push(
      this.expenseRequestService.onApproveExpenseRequest().subscribe({
        next: (expense: any) => {
          this.store.dispatch(
            removeNotification({ notification: expense.data })
          );
        },
        error: (error) => {
          console.error("Socket error:", error);
        },
      })
    );

    this.subscriptions.push(
      this.expenseRequestService.onRejectExpenseRequest().subscribe({
        next: (expense: any) => {
          this.store.dispatch(
            removeNotification({ notification: expense.data })
          );
        },
        error: (error) => {
          console.error("Socket error:", error);
        },
      })
    );
  }

  ModuleActivate(routeModule: any) {
    this.DynamicItems.forEach((element: any) => {
      if (!element?.isExpanded) {
        if (
          element.labelForRoute.toLowerCase().replace(/\s+/g, "-") == routeModule
        ) {
          this.activeTab = element.menuId;
          this.activeMainTab = -1;
        }
      } else {
        element.items.forEach((item: any) => {
          let expandedEnd = this.router.url.split("/")[2];
          if (
            item.labelForRoute.toLowerCase().replace(/\s+/g, "-") ==
            expandedEnd
          ) {
            this.activeTab = item.menuId;
            this.activeMainTab = element.menuId;
          }
        });
      }

      // console.log(element.labelForRoute.toLowerCase().replace(/\s+/g, "-"));
      if (
        routeModule == "trip-management" &&
        this.masterDataService.Role == WellKnownUserRole.DRIVER
      ) {
        this.activeTab = 6;
        this.activeMainTab = -1;
      }

      if (
        routeModule == "trip-management" &&
        this.masterDataService.Role != WellKnownUserRole.DRIVER
      ) {
        this.activeTab = 4;
        this.activeMainTab = -1;
      }


    });
  }

  onClickNotification() {
    let data = {};

    let properties = {
      width: "320px",
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

  onClickLogout() {
    let confirmationConfig = {
      message: "Are you sure you want to cancel this leave?",
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
    };

    this.messageService.ConfirmPopUp(
      confirmationConfig,
      (isConfirm: boolean) => {
        if (isConfirm) {
          this.router.navigate(["/login"]);
        }
      }
    );
  }

  onClickSettings() {
    this.popupService
      .OpenModel(ChangePasswordComponent, {
        header: "CHANGE PASSWORD",
        width: "30vw",
      })
      .subscribe((res) => { });
  }

  openMonthAudit() {
    let systemMonth = this.masterDataService.WorkingMonth;
    let systemYear = this.masterDataService.WorkingYear;

    let today = new Date();

    let lastDayOfSystemDate = new Date(systemYear, systemMonth, 0).getDate();
    let systemDate = new Date(systemYear, systemMonth - 1, lastDayOfSystemDate);

    if (today >= systemDate) {
      this.router.navigate(["/month-audit"]);
    } else {
      this.messageService.showInfoAlert(
        `Month Audit is closed. You can do monthly audit for this month on or after the last day of this month (${systemYear}-${systemMonth}-${lastDayOfSystemDate})!`
      );
    }
  }

  moveToRouter(routerLink: string) {
    this.router.navigate([routerLink]);
  }

  // Handle Notification
  async getAllNotifications() {
    this.store.dispatch(initiallySetState({ notifications: [] }));

    const notificationResult = await firstValueFrom(
      this.notificationService.GetAllNotifications()
    );

    if (notificationResult.IsSuccessful) {
      this.notificationService.setNotificationLoaded(true);
      this.store.dispatch(
        initiallySetState({ notifications: notificationResult.Result || [] })
      );
    }
  }

  ngOnDestroy() {
    // Clean up all subscriptions
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
