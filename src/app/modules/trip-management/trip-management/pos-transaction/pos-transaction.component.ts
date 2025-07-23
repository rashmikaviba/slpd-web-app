import { PopupService } from './../../../../shared/services/popup.service';
import { PosService } from './../../../../shared/services/api-services/pos.service';
import { DatePipe } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AppMessageService } from 'src/app/shared/services/app-message.service';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { SidebarService } from 'src/app/shared/services/sidebar.service';
import { CommonForm } from 'src/app/shared/services/app-common-form';
import { FormBuilder, Validators } from '@angular/forms';
import { firstValueFrom, forkJoin, of } from 'rxjs';
import { ProductService } from 'src/app/shared/services/api-services/product.service';
import { CommonService } from 'src/app/shared/services/api-services/common.service';
import { TripEndPosAuditComponent } from './trip-end-pos-audit/trip-end-pos-audit.component';
import { WellKnownTripStatus } from 'src/app/shared/enums/well-known-trip-status.enum';

@Component({
  selector: 'app-pos-transaction',
  templateUrl: './pos-transaction.component.html',
  styleUrls: ['./pos-transaction.component.css']
})
export class PosTransactionComponent implements OnInit {
  @ViewChild("templateRef", { static: true }) templateRef: TemplateRef<any>;
  FV = new CommonForm();
  posDetails: any = null;
  tripInfo: any = null;
  cols: any[] = [];
  recodes: any[] = [];
  auditEndCols: any[] = [];
  products: any[] = [];
  isAddNewTransaction: boolean = false;
  selectedProduct: any = null;
  measureUnits: any[] = [];

  isCanEdit: boolean = false;

  constructor(
    private sidebarService: SidebarService,
    private messageService: AppMessageService,
    private datePipe: DatePipe,
    private posService: PosService,
    private popupService: PopupService,
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private commonService: CommonService
  ) {
    this.createForm();
  }


  ngOnInit() {
    debugger;
    this.sidebarService.setFooterTemplate(this.templateRef);
    let sideBarData = this.sidebarService.getData();

    this.tripInfo = sideBarData.tripInfo;

    this.cols = [
      { field: "createdAt", header: "Date" },
      { field: "productName", header: "Product Name" },
      { field: "enteredQuantity", header: "Quantity" },
      { field: "isReturnableProduct", header: "Is Returnable" },
    ]

    this.auditEndCols = [
      { field: "createdAt", header: "Date" },
      { field: "productName", header: "Product Name" },
      { field: "enteredQuantity", header: "Quantity" },
      { field: "isReturnableProduct", header: "Is Returnable" },
      { field: "returnedQuantity", header: "Returned Quantity" },
      { field: "consiumedQuantity", header: "Consiumed Quantity" },
      { field: "notReturnedReason", header: "Not Returned Reason" },
    ]
    this.loadInitialData();
  }

  createForm() {
    this.FV.formGroup = this.formBuilder.group({
      product: ["", [Validators.required]],
      inventory: ["", [Validators.required]],
      quantity: [0, [Validators.required, Validators.min(1)]],
      measureUnit: ["", [Validators.required]],
    });
  }

  async loadInitialData() {
    try {
      const [productResult, measureUnitResult, posResult] = await firstValueFrom(
        forkJoin([
          this.productService.GetAllProducts(false),
          this.commonService.GetMeasureUnits(),
          this.posService.GetPosByTrip(this.tripInfo?.id)
        ])
      )

      if (posResult.IsSuccessful) {
        this.posDetails = posResult.Result;
        this.recodes = this.posDetails?.products;

        this.isCanEdit = this.tripInfo.status == WellKnownTripStatus.START && !this.posDetails?.isTripEndAuditDone;
      }

      if (measureUnitResult.IsSuccessful) {
        this.measureUnits = measureUnitResult.Result;
      }

      if (productResult.IsSuccessful) {
        this.products = productResult.Result;

        if (this.products.length > 0) {
          this.products.map((product: any) => {
            let productMeasureUnitCategory = this.measureUnits.find((unit: any) => unit.categoryId === product?.measureUnitDetails?.categoryId);
            product.measureUnits = productMeasureUnitCategory?.items || [];
            product.measureUnits.map((unit: any) => {
              unit.label = `${unit.name} (${unit.code})`;
            });

          })
        }
      }
    } catch (error) {
      this.messageService.showErrorAlert(error?.message || error);
    }
  }


  onVoidTransaction(rowData: any) {
    let confirmationConfig = {
      message: "Are you sure you want to void this transaction?",
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
    };

    this.messageService.ConfirmPopUp(
      confirmationConfig,
      (isConfirm: boolean) => {
        if (isConfirm) {
          this.posService.VoidPosTransacrion(this.posDetails?.tripId, rowData?.id).subscribe((response) => {
            if (response.IsSuccessful) {
              this.messageService.showSuccessAlert(response.Message);
              this.loadPosDetailsByTrip();
            } else {
              this.messageService.showErrorAlert(response.Message);
            }
          })
        }
      }
    );
  }

  loadPosDetailsByTrip() {
    this.posService.GetPosByTrip(this.posDetails?.tripId).subscribe((response) => {
      if (response.IsSuccessful) {
        this.posDetails = response.Result;
        this.recodes = this.posDetails?.products;
      } else {
        this.messageService.showErrorAlert(response.Message);
      }
    })
  }

  onClickAddTransaction() {
    this.clearData();
    this.isAddNewTransaction = true;
  }

  clearData() {
    this.FV.clearValues("product,quantity,measureUnit,inventory");
  }


  onChangeProduct() {
    let product = this.FV.getValue("product");
    this.FV.enableField("measureUnit");


    let selectedProduct = this.products.find((x: any) => x._id === product);
    if (selectedProduct) {
      this.selectedProduct = selectedProduct;
      this.FV.setValue("inventory", `${selectedProduct?.inventory || 0} ${selectedProduct.measureUnitDetails?.code} (${selectedProduct.measureUnitDetails?.name})` || "");

      this.FV.setValue("measureUnit", selectedProduct.measureUnitDetails?.unitId || "");

      if (!selectedProduct?.measureUnitDetails?.isSaveWithSiUnit) {
        this.FV.disableField("measureUnit");
      }
    }
  }

  onCancle() {
    this.isAddNewTransaction = false;
    this.clearData();
  }

  onSave() {
    if (this.FV.validateControllers("product,quantity,measureUnit")) {
      return;
    }

    let product = this.FV.getValue("product");
    let quantity = this.FV.getValue("quantity");
    let measureUnit = this.FV.getValue("measureUnit");

    let request = {
      "productId": product,
      "quantity": quantity,
      "unitOfMeasure": measureUnit
    }

    this.posService.SavePosTransaction(this.posDetails?.tripId, request).subscribe((response) => {
      if (response.IsSuccessful) {
        this.messageService.showSuccessAlert(response.Message);
        this.loadInitialData();
        this.isAddNewTransaction = false;
        this.clearData();
      } else {
        this.messageService.showErrorAlert(response.Message);
      }
    })


  }

  async onClickTripEndAudit() {
    try {
      let data = {
        tripId: this.posDetails?.tripId,
        posDetails: this.posDetails,
        measureUnits: this.measureUnits
      }

      const posResult = await firstValueFrom(
        this.posService.GetPosByTrip(this.posDetails?.tripId)
      )

      if (posResult.IsSuccessful) {
        data.posDetails = posResult.Result;

      }

      this.popupService.OpenModel(TripEndPosAuditComponent, {
        header: "Trip End Audit",
        width: "80vw",
        data,
      }).subscribe((result) => {
        if (result) {
          this.loadInitialData();
        }
      });

    } catch (error) {
      this.messageService.showErrorAlert(error?.message || error);
    }

  }
}
