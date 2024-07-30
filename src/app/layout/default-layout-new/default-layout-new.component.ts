import { Component } from '@angular/core';
import { Router } from '@angular/router';

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
  ) { }

  ngOnInit(): void {

    let module = this.router.url.split('/')[1];

    this.DynamicItems = [
      { menuId: 1, label: 'Dashboard', icon: 'pi pi-home', routerLink: '/dashboard' },
      { menuId: 2, label: 'User', icon: 'pi pi-user', routerLink: '/user' },
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
}
