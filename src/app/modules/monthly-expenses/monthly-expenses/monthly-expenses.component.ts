import { MonthlyExpensesService } from '../../../shared/services/api-services/monthly-expenses.service';
import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { AppComponent } from 'src/app/app.component';
import { CommonForm } from 'src/app/shared/services/app-common-form';
import { AppMessageService } from 'src/app/shared/services/app-message.service';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { MasterDataService } from 'src/app/shared/services/master-data.service';
import { PopupService } from 'src/app/shared/services/popup.service';
import { SidebarService } from 'src/app/shared/services/sidebar.service';
import { EditMonthlyExpensesComponent } from './edit-monthly-expenses/edit-monthly-expenses.component';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-monthly-expenses',
  templateUrl: './monthly-expenses.component.html',
  styleUrls: ['./monthly-expenses.component.css']
})
export class MonthlyExpensesComponent implements OnInit {
  FV = new CommonForm()
  recodes: any[] = [];
  cols: any[] = [];
  constructor(private sidebarService: SidebarService,
    private appComponent: AppComponent,
    private popupService: PopupService,
    private messageService: AppMessageService,
    private excelService: ExcelService,
    private datePipe: DatePipe,
    private formBuilder: UntypedFormBuilder,
    private masterDataService: MasterDataService,
    private monthlyExpensesService: MonthlyExpensesService
  ) { this.createForm(); }

  ngOnInit() {
    let firstDayOfYear = new Date(new Date().getFullYear(), 0, 1);
    let lastDayOfYear = new Date(new Date().getFullYear(), 11, 31);
    this.FV.formGroup.patchValue({
      dateRange: [firstDayOfYear, lastDayOfYear],
    });

    this.cols = [
      { field: 'month', header: 'Month' },
      { field: 'totalExpenses', header: 'Total Expenses' },
      { field: 'updatedByUser', header: 'Last Updated By' },
      { field: 'isMonthEndDone', header: 'Month Status' },
    ]
    this.loadInitialData();

    this.sidebarService.sidebarEvent.subscribe((response) => {
      if (response) {
        this.loadInitialData();
      }

      this.sidebarService.removeComponent();
      this.appComponent.sidebarVisible = false;
    });
  }

  createForm() {
    this.FV.formGroup = this.formBuilder.group({
      dateRange: [[], [Validators.required]],
    });
  }

  loadInitialData() {
    this.onSearch();
  }

  onSearch() {
    if (this.FV.validateControllers("dateRange")) {
      return;
    }

    let startMonth = this.FV.formGroup.value.dateRange[0];
    let endMonth = this.FV.formGroup.value.dateRange[1];

    if (startMonth && endMonth) {
      startMonth.setDate(1);
      endMonth.setDate(1);
      endMonth.setMonth(endMonth.getMonth() + 1);
      endMonth.setDate(endMonth.getDate() - 1);
    } else {
      return;
    }

    let startDate = this.datePipe.transform(startMonth, 'yyyy-MM-dd');
    let endDate = this.datePipe.transform(endMonth, 'yyyy-MM-dd');

    let request = {
      "startMonth": startDate,
      "endMonth": endDate
    }

    this.monthlyExpensesService.AdvanceSearchMonthlyExpenses(request).subscribe((response) => {
      if (response.IsSuccessful) {
        this.recodes = response.Result;
      }
    })
  }


  async onEdit(rowData: any) {
    try {
      let data = {
        monthlyExpenseData: null,
        isEdit: true,
      }

      const monthlyExpensesResult = await firstValueFrom(
        this.monthlyExpensesService.GetMonthlyExpensesById(rowData._id)
      )

      if (monthlyExpensesResult.IsSuccessful) {
        data.monthlyExpenseData = monthlyExpensesResult.Result;
      }

      let properties = {
        width: "70vw",
        position: "right",
      };

      this.sidebarService.addComponent(
        "Edit Monthly Expenses",
        EditMonthlyExpensesComponent,
        properties,
        data
      );
    } catch (error) {
      this.messageService.showErrorAlert(error.message || error);
    }
  }


  async onView(rowData: any) {
    try {
      let data = {
        monthlyExpenseData: null,
        isEdit: false,
      }

      const monthlyExpensesResult = await firstValueFrom(
        this.monthlyExpensesService.GetMonthlyExpensesById(rowData._id)
      )

      if (monthlyExpensesResult.IsSuccessful) {
        data.monthlyExpenseData = monthlyExpensesResult.Result;
      }

      let properties = {
        width: "70vw",
        position: "right",
      };

      this.sidebarService.addComponent(
        "Edit Monthly Expenses",
        EditMonthlyExpensesComponent,
        properties,
        data
      );
    } catch (error) {
      this.messageService.showErrorAlert(error.message || error);
    }
  }
}
