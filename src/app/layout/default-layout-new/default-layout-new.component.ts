import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SidebarService } from 'src/app/shared/services/sidebar.service';
import { NotificationsComponent } from '../notifications/notifications.component';

@Component({
  selector: 'app-default-layout-new',
  templateUrl: './default-layout-new.component.html',
  styleUrls: ['./default-layout-new.component.scss']
})
export class DefaultLayoutNewComponent {
  DynamicItems: any[] = []
  activeTab: number = -1;

  constructor(
    private router: Router,
    private sidebarService: SidebarService,
  ) { }

  ngOnInit(): void {

    let module = this.router.url.split('/')[1];

    this.DynamicItems = [
      { menuId: 1, label: 'Dashboard', icon: 'pi pi-home', routerLink: '/dashboard' },
      { menuId: 2, label: 'User', icon: 'pi pi-user', routerLink: '/user' },
      { menuId: 3, label: 'Leave Management', icon: 'pi pi-user', routerLink: '/leave-management' },
    ]

    this.ModuleActivate(module);
  }

  ModuleActivate(routeModule: any) {
    this.DynamicItems.forEach((element: any) => {
      if (element.label.toLowerCase().replace(/\s+/g, '-') == routeModule) {
        this.activeTab = element.menuId;
      }
    })
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
}
