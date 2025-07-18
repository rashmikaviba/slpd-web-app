import { Component, OnInit } from '@angular/core';
import { SidebarService } from 'src/app/shared/services/sidebar.service';

@Component({
  selector: 'app-product-audit-trail',
  templateUrl: './product-audit-trail.component.html',
  styleUrls: ['./product-audit-trail.component.css']
})
export class ProductAuditTrailComponent implements OnInit {
  cols: any[] = []
  recodes: any[] = [];
  constructor(
    private sidebarService: SidebarService
  ) { }

  ngOnInit() {
    let sideBarData = this.sidebarService.getData();

    this.recodes = sideBarData.auditData;
    this.cols = [
      { field: "inventoryLogDate", header: "Date/Time" },
      { field: "inventoryLogType", header: "Log Type" },
      { field: "message", header: "Message" },
      { field: "userName", header: "User" },
    ];
  }

  getLogType(logType: number): string {
    let log: string = '';

    switch (logType) {
      case 1:
        log = 'Approve GRN';
        break;
      case 2:
        log = 'POS Transaction';
        break;
      case 3:
        log = 'POS Audit Return';
        break;
      default:
        log = 'Unknown';
        break;
    }

    return log;
  }
}
