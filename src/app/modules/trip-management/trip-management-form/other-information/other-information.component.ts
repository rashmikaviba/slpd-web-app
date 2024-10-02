import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CommonForm } from 'src/app/shared/services/app-common-form';
import { AppMessageService } from 'src/app/shared/services/app-message.service';
import { SidebarService } from 'src/app/shared/services/sidebar.service';

@Component({
  selector: 'app-other-information',
  templateUrl: './other-information.component.html',
  styleUrls: ['./other-information.component.scss']
})
export class OtherInformationComponent {
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
  hotelCols: any
  hotelRecords: any[] = []
  isAddNewHotel: boolean = false
  dates: Date[] | undefined;

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
      date: [''],
      adultCount: [''],
      totalCost: [''],
      childCount: [''],
      description: [''],
      hotelDate: [''],
      hotelName: [''],
      city: ['']
    });
  }

  ngOnInit(): void {
    let sideBarData = this.sidebarService.getData();
    this.isEdit = sideBarData.isEdit
    console.log("isEdit", this.isEdit)
    // this.sidebarService.setFooterTemplate(this.templateRef);

    this.cols = [
      { field: 'date', header: 'Date' },
      { field: 'adultCount', header: 'Adult Count' },
      { field: 'childCount', header: 'Child Count' },
      { field: 'description', header: 'Description' },
      { field: 'totalCost', header: 'Total Cost' }
    ]

    this.recodes = [
      { date: '2024-09-30', adultCount: '5', childCount: '5', description: 'Description 01', totalCost: '1000.00' },
      { date: '2024-09-30', adultCount: '10', childCount: '5', description: 'Description 01', totalCost: '1000.00' },
      { date: '2024-09-30', adultCount: '3', childCount: '5', description: 'Description 01', totalCost: '1000.00' },
      { date: '2024-09-30', adultCount: '3', childCount: '5', description: 'Description 01', totalCost: '1000.00' },
      { date: '2024-09-30', adultCount: '3', childCount: '5', description: 'Description 01', totalCost: '1000.00' },
      { date: '2024-09-30', adultCount: '3', childCount: '5', description: 'Description 01', totalCost: '1000.00' },
    ]

    this.hotelCols = [
      { field: 'date', header: 'Date' },
      { field: 'hotelName', header: 'Hotel Name (Address)' },
      { field: 'city', header: 'City' },
    ]


  }

  onClickAddNew() {
    try {
      this.isAddNewDesigation = !this.isAddNewDesigation
    } catch (error: any) {
      this.messageService.showErrorAlert(error)
    }
  }

  onClickAddNewActivity() {
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

  onClickAddNewHotel() {
    this.isAddNewHotel = !this.isAddNewHotel
  }
}
