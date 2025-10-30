import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CompanyInformation } from 'src/app/shared/data/companyInformation';
import { MasterDataService } from 'src/app/shared/services/master-data.service';
import { SidebarService } from 'src/app/shared/services/sidebar.service';

@Component({
  selector: 'app-monthly-vehicle-payment-maintenance-report',
  templateUrl: './monthly-vehicle-payment-maintenance-report.component.html',
  styleUrls: ['./monthly-vehicle-payment-maintenance-report.component.css']
})
export class MonthlyVehiclePaymentMaintenanceReportComponent implements OnInit {
  companyInformation: any = CompanyInformation;
  @ViewChild("templateRef", { static: true }) templateRef: TemplateRef<any>;
  vehicleMaintenances: any[] = [];
  vehicle: any = null
  reportDetail: any = null;
  genaratedUser = "";
  genaratedDate = new Date();
  constructor(
    private sidebarService: SidebarService,
    private masterDataService: MasterDataService
  ) { }

  ngOnInit() {
    this.sidebarService.setFooterTemplate(this.templateRef);
    let sideBarData = this.sidebarService.getData();

    this.reportDetail = sideBarData.reportDetail;

    this.vehicleMaintenances = this.reportDetail.vehicleMaintenances;
    this.vehicle = this.reportDetail.vehicle;
    this.genaratedUser = this.masterDataService.CurrentUserName;
  }

}
