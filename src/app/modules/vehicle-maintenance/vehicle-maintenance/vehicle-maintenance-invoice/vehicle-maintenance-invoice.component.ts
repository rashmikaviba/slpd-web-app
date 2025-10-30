import { MasterDataService } from 'src/app/shared/services/master-data.service';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CompanyInformation } from 'src/app/shared/data/companyInformation';
import { SidebarService } from 'src/app/shared/services/sidebar.service';

@Component({
  selector: 'app-vehicle-maintenance-invoice',
  templateUrl: './vehicle-maintenance-invoice.component.html',
  styleUrls: ['./vehicle-maintenance-invoice.component.css']
})
export class VehicleMaintenanceInvoiceComponent implements OnInit {
  companyInformation: any = CompanyInformation;
  @ViewChild("templateRef", { static: true }) templateRef: TemplateRef<any>;
  vehicleMaintenance: any = null;
  genaratedUser = "";
  genaratedDate = new Date();
  constructor(
    private sidebarService: SidebarService,
    private masterDataService: MasterDataService
  ) { }

  ngOnInit() {
    this.sidebarService.setFooterTemplate(this.templateRef);
    let sideBarData = this.sidebarService.getData();

    this.vehicleMaintenance = sideBarData.vehicleMaintenance;
    this.genaratedUser = this.masterDataService.CurrentUserName;
  }

}
