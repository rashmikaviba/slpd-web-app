import { DatePipe } from '@angular/common';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CommonForm } from 'src/app/shared/services/app-common-form';
import { AppMessageService } from 'src/app/shared/services/app-message.service';
import { SidebarService } from 'src/app/shared/services/sidebar.service';

@Component({
  selector: 'app-general-information',
  templateUrl: './general-information.component.html',
  styleUrls: ['./general-information.component.scss']
})
export class GeneralInformationComponent {
  // @ViewChild("templateRef", { static: true }) templateRef: TemplateRef<any>;
  FV = new CommonForm();
  products: any
  isEdit: any
  isAddNewDesigation: boolean = false
  cols: any;
  recodes: any;
  loading: any;
  filteredItems: any[];
  items: any[];
  isAddNewGuest: boolean = false

  constructor(
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private sidebarService: SidebarService,
    private messageService: AppMessageService
  ) {
    this.createForm();
  }

  createForm() {
    this.FV.formGroup = this.formBuilder.group({
      startDate: ["", [Validators.required]],
      endDate: ["", [Validators.required]],
      dateCount: [''],
      estimatedCost: [''],
      totalINcome: [''],
      arrivalDate: [''],
      arrivalTime: [''],
      flightNumber: [''],
      departureDate: [''],
      departureTime: [''],
      departureFlightNumber: [''],
      pickUpDate: [''],
      pickUpTime: [''],
      pickUpCity: [''],
      pickUpAddress: [''],
      dropOffDate: [''],
      dropOffTime: [''],
      dropOffCity: [''],
      dropOffAddress: [''],
      email: [''],
      mobile: ['']
    });
  }

  ngOnInit(): void {
    let sideBarData = this.sidebarService.getData();
    this.isEdit = sideBarData.isEdit
    console.log("isEdit", this.isEdit)
    // this.sidebarService.setFooterTemplate(this.templateRef);

    this.cols = [
      { field: 'guestName', header: 'Guest Name' },
      { field: 'nationality', header: 'Nationality' },
      { field: 'age', header: 'Ages' }
    ]

    this.recodes = [
      { guestName: 'Lahiru', nationality: 'Sri Lankan', age: 25 },
      { guestName: 'Lahiru', nationality: 'Sri Lankan', age: 25 },
      { guestName: 'Lahiru', nationality: 'Sri Lankan', age: 25 },
      { guestName: 'Lahiru', nationality: 'Sri Lankan', age: 25 },
      { guestName: 'Lahiru', nationality: 'Sri Lankan', age: 25 },
      { guestName: 'Lahiru', nationality: 'Sri Lankan', age: 25 },
    ]

    this.products = [
      { name: 'Colombo', category: 'Place', distance: '100 KM' },
      { name: 'Galle', category: 'Place', distance: '50 KM' },
      { name: 'Matara', category: 'Place', distance: '60 KM' },
      { name: 'Kurunagala', category: 'Place', distance: '80 KM' },
    ]
  }

  onClickAddNew() {
    try {
      this.isAddNewDesigation = !this.isAddNewDesigation
    } catch (error: any) {
      this.messageService.showErrorAlert(error)
    }
  }

  onClickAddNewGuest() {
    this.isAddNewGuest = !this.isAddNewGuest
  }

  onClickSaveGuest() {
    this.isAddNewGuest = false
  }

  onClickDeleteGuest() { }

  onClickSave() { }
  onClickCancel() { }
  onClickSubmit() { }
  onClickDelete() { }

  toggleMenu(menu: any, event: any, rowData: any) {
    this.filteredItems = [];

    this.filteredItems = this.items.filter((menuItem: any) => {
      if (rowData?.isBlackListed && menuItem.id === 3) {
        return false;
      } else if (!rowData?.isBlackListed && menuItem.id === 4) {
        return false;
      } else {
        return true;
      }
    });

    this.filteredItems.forEach((menuItem) => {
      menuItem.data = rowData;
    });
    menu.toggle(event);
  }
}
