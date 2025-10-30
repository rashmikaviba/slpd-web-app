import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { GarageService } from 'src/app/shared/services/api-services/garage.service';
import { AppMessageService } from 'src/app/shared/services/app-message.service';
import { PopupService } from 'src/app/shared/services/popup.service';
import { SidebarService } from 'src/app/shared/services/sidebar.service';
import { TransactionHandlerService } from 'src/app/shared/services/transaction-handler.service';
import { AddGarageComponent } from '../master-configuration/garage-management/add-garage/add-garage.component';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-recommended-garage',
  templateUrl: './recommended-garage.component.html',
  styleUrls: ['./recommended-garage.component.css']
})
export class RecommendedGarageComponent implements OnInit {
  cols: any;
  recodes: any;
  loading: any;
  sidebarVisible2: boolean = false;
  items: any[];
  filteredItems: any[];
  constructor(
    private sidebarService: SidebarService,
    private appComponent: AppComponent,
    private popupService: PopupService,
    private router: Router,
    private messageService: AppMessageService,
    private transactionService: TransactionHandlerService,
    private datePipe: DatePipe,
    private garageService: GarageService
  ) { }

  ngOnInit(): void {
    this.cols = [
      { field: "name", header: "Name" },
      { field: "address", header: "Address" },
      { field: "city", header: "City" },
      { field: "contactNumber1", header: "Contact Number 01" },
      { field: "contactNumber2", header: "Contact Number 02" },
      { field: "specializations", header: "Specializations" },
    ];

    this.sidebarService.sidebarEvent.subscribe((response) => {
      if (response) {
        this.loadAllGarages();
      }

      this.sidebarService.removeComponent();
      this.appComponent.sidebarVisible = false;
    });

    this.loadAllGarages();
  }

  loadAllGarages() {
    this.garageService.GetAllGarages().subscribe((response) => {
      if (response.IsSuccessful) {
        this.recodes = response.Result;
      }
    });
  }

  async onClickView(rowData: any) {
    try {
      let garageResponse = await firstValueFrom(this.garageService.GetGarageById(rowData?._id));

      if (garageResponse.IsSuccessful) {
        let data = {
          garageData: garageResponse.Result,
          isEdit: false,
          isView: true
        };

        let properties = {
          width: "50vw",
          position: "right",
        };

        this.sidebarService.addComponent(
          "View Garage",
          AddGarageComponent,
          properties,
          data
        );
      } else {
        this.messageService.showErrorAlert(garageResponse.Message);
      }

    } catch (error) {
      this.messageService.showErrorAlert(error);
    }
  }
}
