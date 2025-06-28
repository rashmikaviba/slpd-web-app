import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { AppComponent } from 'src/app/app.component';
import { expenseType } from 'src/app/shared/data/expenseType';
import { MonthlyExpensesService } from 'src/app/shared/services/api-services/monthly-expenses.service';
import { CommonForm } from 'src/app/shared/services/app-common-form';
import { AppMessageService } from 'src/app/shared/services/app-message.service';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { MasterDataService } from 'src/app/shared/services/master-data.service';
import { PopupService } from 'src/app/shared/services/popup.service';
import { SidebarService } from 'src/app/shared/services/sidebar.service';

@Component({
  selector: 'app-edit-monthly-expenses',
  templateUrl: './edit-monthly-expenses.component.html',
  styleUrls: ['./edit-monthly-expenses.component.css']
})
export class EditMonthlyExpensesComponent implements OnInit {
  FV = new CommonForm()
  isEdit: boolean = false;
  monthlyExpenseData: any = null;
  recodes: any[] = [];
  cols: any[] = [];
  expenseType: any[] = expenseType;
  isAddNew: boolean = false;
  editExpenseId: string = '';
  isRefresh: boolean = false;

  minValue: Date = new Date();
  maxValue: Date = new Date();
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
    let data = this.sidebarService.getData();
    if (data) {
      this.isEdit = data.isEdit || false;
      this.monthlyExpenseData = data.monthlyExpenseData || null;
      if (this.monthlyExpenseData) {
        this.FV.setValue('month', this.datePipe.transform(this.monthlyExpenseData.month, 'yyyy MMMM'));
        this.FV.disableField('month');

        let firstDayOfMonth = new Date(this.monthlyExpenseData.month);
        firstDayOfMonth.setDate(1);
        let lastDayOfMonth = new Date(this.monthlyExpenseData.month);
        lastDayOfMonth.setMonth(lastDayOfMonth.getMonth() + 1);
        lastDayOfMonth.setDate(lastDayOfMonth.getDate() - 1);

        this.minValue = firstDayOfMonth;
        this.maxValue = lastDayOfMonth;

        this.recodes = this.monthlyExpenseData.expenses || [];
      }
    }

    if (this.isEdit) {
      this.cols = [
        { field: 'date', header: 'Date', width: '20%' },
        { field: 'expenseTypeName', header: 'Expense Type', width: '20%' },
        { field: 'description', header: 'Description', width: '30%' },
        { field: 'amount', header: 'Amount', width: '20%' },
        { field: 'action', header: 'Action', width: '10%' },
      ]
    } else {
      this.cols = [
        { field: 'date', header: 'Date', width: '20%' },
        { field: 'expenseTypeName', header: 'Expense Type', width: '20%' },
        { field: 'description', header: 'Description', width: '30%' },
        { field: 'amount', header: 'Amount', width: '20%' },
      ]
    }
  }

  createForm() {
    this.FV.formGroup = this.formBuilder.group({
      month: ['', [Validators.required]],

      date: ['', [Validators.required]],
      expenseType: ['', [Validators.required]],
      amount: ['', [Validators.required, Validators.min(0.01)]],
      description: ['', [Validators.required]],
    });
  }

  onClickAddExpense() {
    this.clearValues();
    this.isAddNew = true;
    this.editExpenseId = '';
  }

  clearValues() {
    this.FV.clearValues("date,expenseType,amount,description");

    if (new Date() < this.minValue) {
      this.FV.setValue("date", new Date());
    } else {
      this.FV.setValue("date", this.minValue);
    }
    this.FV.setValue("amount", 0);
  }

  onClickCancel() {
    this.isAddNew = false;
    this.editExpenseId = '';
    this.clearValues();
  }

  onSave() {
    if (this.FV.validateControllers("date,expenseType,amount,description")) {
      return;
    }
    debugger

    let formValue = this.FV.formGroup.value;

    let request = {
      "expenseType": formValue.expenseType.id,
      "date": this.datePipe.transform(formValue.date, 'yyyy-MM-dd'),
      "expenseTypeName": formValue.expenseType.name,
      "description": formValue.description,
      "amount": formValue.amount
    }

    this.monthlyExpensesService.SaveMonthlyExpenses(request, this.monthlyExpenseData._id).subscribe((response) => {
      if (response.IsSuccessful) {
        this.messageService.showSuccessAlert(response.Message);
        this.onClickCancel();
        this.loadExpenses();
        this.isRefresh = true;
      } else {
        this.messageService.showErrorAlert(response.Message);
      }
    });
  }


  loadExpenses() {
    this.monthlyExpensesService.GetMonthlyExpensesById(this.monthlyExpenseData._id).subscribe((response) => {
      if (response.IsSuccessful) {
        this.monthlyExpenseData = response.Result;
        this.recodes = this.monthlyExpenseData.expenses || [];
      }
    })
  }

  onHandleEditClick(rowData) {
    this.clearValues();
    this.editExpenseId = rowData._id;
    this.FV.setValue("date", new Date(rowData.date));
    this.FV.setValue("expenseType", this.expenseType.find(x => x.id == rowData.expenseType) || null);
    this.FV.setValue("amount", rowData.amount);
    this.FV.setValue("description", rowData.description);
  }

  onHandleEditSave() {
    if (this.FV.validateControllers("date,expenseType,amount,description")) {
      return;
    }

    let formValue = this.FV.formGroup.value;

    let request = {
      "expenseType": formValue.expenseType.id,
      "date": this.datePipe.transform(formValue.date, 'yyyy-MM-dd'),
      "expenseTypeName": formValue.expenseType.name,
      "description": formValue.description,
      "amount": formValue.amount
    }

    this.monthlyExpensesService.UpdateMonthlyExpenses(this.monthlyExpenseData._id, this.editExpenseId, request).subscribe((response) => {
      if (response.IsSuccessful) {
        this.messageService.showSuccessAlert(response.Message);
        this.onClickCancel();
        this.loadExpenses();
        this.isRefresh = true;
      } else {
        this.messageService.showErrorAlert(response.Message);
      }
    });
  }

  onDelete(rowData: any) {
    let confirmationConfig = {
      message: "Are you sure you want to remove this expense?",
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
    };

    this.messageService.ConfirmPopUp(
      confirmationConfig,
      (isConfirm: boolean) => {
        if (isConfirm) {
          this.monthlyExpensesService
            .DeleteMonthlyExpenses(this.monthlyExpenseData._id, rowData._id)
            .subscribe((response) => {
              if (response.IsSuccessful) {
                this.messageService.showSuccessAlert(response.Message);
                this.onClickCancel();
                this.loadExpenses();
                this.isRefresh = true;
              } else {
                this.messageService.showErrorAlert(response.Message);
              }
            });
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.sidebarService.sidebarEvent.emit(this.isRefresh);
  }
}
