import { AppComponent } from 'src/app/app.component';
import { PopupService } from './../../../shared/services/popup.service';
import { Component } from '@angular/core';
import { AddProductFormComponent } from './add-product-form/add-product-form.component';
import { SidebarService } from 'src/app/shared/services/sidebar.service';
import { ProductService } from 'src/app/shared/services/api-services/product.service';
import { AppMessageService } from 'src/app/shared/services/app-message.service';
import { firstValueFrom } from 'rxjs';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { DatePipe } from '@angular/common';
import { ProductAuditTrailComponent } from './product-audit-trail/product-audit-trail.component';

@Component({
  selector: 'app-product-management',
  templateUrl: './product-management.component.html',
  styleUrls: ['./product-management.component.scss']
})
export class ProductManagementComponent {
  cols: any[] = [];
  recodes: any[] = [];
  items: any[] = [];
  constructor(
    private sidebarService: SidebarService,
    private appComponent: AppComponent,
    private productService: ProductService,
    private messageService: AppMessageService,
    private excelService: ExcelService,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {

    this.cols = [
      { field: "productShortCode", header: "Short Code" },
      { field: "productName", header: "Product Name" },
      { field: "measureUnit", header: "Measure Unit" },
      { field: "inventory", header: "Inventory" },
      { field: "status", header: "Status" },
      { field: "createdAt", header: "Created By" },
      { field: "updatedAt", header: "Last Updated By" },
    ]

    this.getAllProducts();


    this.items = [
      {
        id: 1,
        label: "Edit Product",
        icon: "pi pi-pencil",
        command: (event: any) => {
          this.onClickEdit(event.item.data);
        },
      },
      {
        id: 2,
        label: "Delete Product",
        icon: "pi pi-trash",
        command: (event: any) => {
          this.onClickDelete(event.item.data);
        },
      },
      {
        id: 3,
        label: "Audit Log",
        icon: "pi pi-briefcase",
        command: (event: any) => {
          this.onClickProductAudit(event.item.data);
        },
      },
    ];

    this.sidebarService.sidebarEvent.subscribe((response) => {
      if (response) {
        this.getAllProducts();
      }

      this.sidebarService.removeComponent();
      this.appComponent.sidebarVisible = false;
    });
  }

  toggleMenu(menu: any, event: any, rowData: any) {
    // this.filteredItems = [...this.items];
    this.items.forEach((menuItem) => {
      menuItem.data = rowData;
    });
    menu.toggle(event);
  }

  onClickAddNew() {
    let data = {
      productData: null,
      isEdit: false,
    }

    let properties = {
      width: "45vw",
      position: "right",
    };

    this.sidebarService.addComponent(
      "Add New Product",
      AddProductFormComponent,
      properties,
      data
    );
  }


  async onClickEdit(rowData: any) {
    try {
      let data = {
        productData: null,
        isEdit: true,
      }
      const productResult = await firstValueFrom(
        this.productService.GetProductById(rowData?._id)
      )

      if (productResult.IsSuccessful) {
        data.productData = productResult.Result;
      }

      let properties = {
        width: "45vw",
        position: "right",
      };

      this.sidebarService.addComponent(
        "Edit Product",
        AddProductFormComponent,
        properties,
        data
      );
    } catch (error) {
      this.messageService.showErrorAlert(error);
    }
  }

  getAllProducts() {
    this.productService.GetAllProducts(true).subscribe((response) => {
      if (response.IsSuccessful) {
        this.recodes = response.Result;
      }
    })
  }

  onStatusChange(rowData: any) {
    let confirmationConfig = {
      message: `Are you sure you want to ${rowData?.status == 1 ? "Deactivate" : "Activate"
        } this vehicle?`,
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
    };

    this.messageService.ConfirmPopUp(
      confirmationConfig,
      (isConfirm: boolean) => {
        if (isConfirm) {
          this.productService
            .ActiveInactiveProduct(rowData?._id)
            .subscribe((response) => {
              if (response.IsSuccessful) {
                this.messageService.showSuccessAlert(response.Message);
                this.getAllProducts();
              } else {
                this.messageService.showErrorAlert(response.Message);
              }
            });
        }
      }
    );
  }

  onClickDelete(rowData: any) {
    let confirmationConfig = {
      message: "Are you sure you want to delete this product?",
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
    };

    this.messageService.ConfirmPopUp(
      confirmationConfig,
      (isConfirm: boolean) => {
        if (isConfirm) {
          this.productService
            .DeleteProduct(rowData?._id)
            .subscribe((response) => {
              if (response.IsSuccessful) {
                this.messageService.showSuccessAlert(response.Message);
                this.getAllProducts();
              } else {
                this.messageService.showErrorAlert(response.Message);
              }
            });
        }
      }
    );
  }

  async onClickProductAudit(rowData: any) {
    try {
      debugger
      let data = {
        auditData: null,
        isEdit: true,
      }
      const productAuditResult = await firstValueFrom(
        this.productService.GetProductAuditLog(rowData?._id)
      )

      if (productAuditResult.IsSuccessful) {
        data.auditData = productAuditResult.Result;
      }

      let properties = {
        width: "65vw",
        position: "right",
      };

      this.sidebarService.addComponent(
        "Product Audit Trail",
        ProductAuditTrailComponent,
        properties,
        data
      );
    } catch (error) {
      this.messageService.showErrorAlert(error);
    }
  }

  exportToExcel() {
    let reportCols = [
      { field: "productShortCode", header: "Short Code" },
      { field: "productName", header: "Product Name" },
      { field: "measureUnit", header: "Measure Unit" },
      { field: "isReturnableProduct", header: "Returnable" },
      { field: "unitPrice", header: "Unit Price" },
      { field: "inventory", header: "Inventory" },
      { field: "description", header: "Description" },
      { field: "statusName", header: "Status" },
      { field: "createdUser", header: "Created User" },
      { field: "updatedUser", header: "Updated User" },
      { field: "createdAt", header: "Created Date" },
      { field: "updatedAt", header: "Updated Date" },
    ];

    let excelData: any[] = [];
    this.recodes.forEach((item: any) => {
      let obj = {
        productShortCode: item.productShortCode,
        productName: item.productName,
        measureUnit: item.measureUnitDetails.name + " (" + item.measureUnitDetails.code + ")",
        isReturnableProduct: item.isReturnableProduct ? "YES" : "NO",
        unitPrice: item.unitPrice,
        inventory: item.measureUnitDetails.isAllowDecimal ? item.inventory.toFixed(2) + " " + item.measureUnitDetails.code : item.inventory + " " + item.measureUnitDetails.code,
        description: item.description,
        createdAt: this.datePipe.transform(
          item.createdAt,
          "dd/MM/yyyy",
          "Asia/Colombo"
        ),
        updatedAt: this.datePipe.transform(
          item.updatedAt,
          "dd/MM/yyyy",
          "Asia/Colombo"
        ),
        statusName: item.statusName,
        createdUser: item.createdUser,
        updatedUser: item.updatedByUser,
      };

      excelData.push(obj);
    });

    this.excelService.GenerateExcelFileWithCustomHeader(
      reportCols,
      excelData,
      "Inventory Products"
    );
  }
}
