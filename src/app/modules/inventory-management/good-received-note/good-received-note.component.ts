import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { AppComponent } from 'src/app/app.component';
import { CommonForm } from 'src/app/shared/services/app-common-form';
import { AppMessageService } from 'src/app/shared/services/app-message.service';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { MasterDataService } from 'src/app/shared/services/master-data.service';
import { PopupService } from 'src/app/shared/services/popup.service';
import { SidebarService } from 'src/app/shared/services/sidebar.service';

@Component({
  selector: 'app-good-received-note',
  templateUrl: './good-received-note.component.html',
  styleUrls: ['./good-received-note.component.scss']
})
export class GoodReceivedNoteComponent {
  cols: any[] = []
  recodes: any[] = []
  FV = new CommonForm()
  status: any[] = [
    {
      label: "All",
      value: -1,
    },
    {
      label: "Pending",
      value: 1,
    },
    {
      label: "Approved",
      value: 2,
    },
    {
      label: "Rejected",
      value: 3,
    },
  ];

  constructor(
    private sidebarService: SidebarService,
    private appComponent: AppComponent,
    private popupService: PopupService,
    private messageService: AppMessageService,
    private excelService: ExcelService,
    private datePipe: DatePipe,
    private formBuilder: UntypedFormBuilder,
    private masterDataService: MasterDataService) {
    this.createForm();
  }

  ngOnInit(): void {
    let thisMonthFirstDate = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1
    );

    let lastDateOfNextMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth() + 2,
      0
    );

    this.FV.setValue("dateRange", [thisMonthFirstDate, lastDateOfNextMonth]);
  }

  createForm() {
    this.FV.formGroup = this.formBuilder.group({
      status: [-1, [Validators.required]],
      dateRange: [[], [Validators.required]],
    });
  }


  onClickAddNew() { }

}
