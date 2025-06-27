import { HelperService } from './../../../../shared/services/helper.service';
import { DatePipe } from '@angular/common';
import { GrnService } from './../../../../shared/services/api-services/grn.service';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { firstValueFrom, forkJoin, of } from 'rxjs';
import { CommonService } from 'src/app/shared/services/api-services/common.service';
import { ProductService } from 'src/app/shared/services/api-services/product.service';
import { CommonForm } from 'src/app/shared/services/app-common-form';
import { AppMessageService } from 'src/app/shared/services/app-message.service';
import { SidebarService } from 'src/app/shared/services/sidebar.service';

@Component({
  selector: 'app-add-grn-form',
  templateUrl: './add-grn-form.component.html',
  styleUrls: ['./add-grn-form.component.css']
})
export class AddGrnFormComponent implements OnInit {
  @ViewChild("templateRef", { static: true }) templateRef: TemplateRef<any>;
  FV = new CommonForm();
  isEdit: boolean = false;
  products: any[] = [];
  measureUnits: any[] = [];
  selectedProduct: any = null;
  cols: any[] = []
  recodes: any[] = [];
  isAddNewProduct: boolean = false;
  grnData: any = null;

  isApproved: boolean = false;
  isRejected: boolean = false;
  isViewOnly: boolean = false;

  constructor(private sidebarService: SidebarService,
    private formBuilder: FormBuilder,
    private messageService: AppMessageService,
    private productService: ProductService,
    private commonService: CommonService,
    private grnService: GrnService,
    private datePipe: DatePipe,
    private helperService: HelperService) {
    this.createForm();
  }

  ngOnInit() {
    this.sidebarService.setFooterTemplate(this.templateRef);
    let data = this.sidebarService.getData();

    this.cols = [
      { field: 'productName', header: 'Product Name' },
      { field: 'quantity', header: 'Quantity' },
      { field: 'measureUnit', header: 'Measure Unit' },
      { field: 'remarks', header: 'Comment' },
    ]

    this.isEdit = data.isEdit;
    this.isApproved = data.isApproved;
    this.isRejected = data.isRejected;
    this.isViewOnly = data.isViewOnly;
    this.grnData = data.grnData;

    this.loadInitialData();
  }

  createForm() {
    this.FV.formGroup = this.formBuilder.group({
      grnNumber: ["", []],
      grnDate: ["", []],
      grnRemarks: ["", [Validators.maxLength(500)]],

      product: ["", [Validators.required]],
      productMeasureUnit: ["", [Validators.required]],
      quantity: [0, [Validators.required, Validators.min(1)]],
      remarks: ["", [Validators.maxLength(500)]],
      measureUnit: ["", [Validators.required]],

      approveRemarks: ["", [Validators.maxLength(500)]],
      rejectRemarks: ["", [Validators.maxLength(500)]],

    });
  }

  async loadInitialData() {
    try {
      const [productResult, measureUnitResult, grnNumberResult] = await firstValueFrom(
        forkJoin([
          this.productService.GetAllProducts(false),
          this.commonService.GetMeasureUnits(),
          this.isEdit == false ? this.grnService.GetNextGrnNumber() : of(null)
        ])
      )
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

      if (!this.isEdit && grnNumberResult?.IsSuccessful) {
        this.FV.setValue("grnNumber", grnNumberResult.Result);
        this.FV.disableField("grnNumber");
      }

      if (!this.isEdit) {
        this.FV.setValue("grnDate", this.datePipe.transform(new Date(), 'yyyy-MM-dd') || '');
        this.FV.disableField("grnDate");
      } else {
        this.setValues();
      }

      if (this.isApproved || this.isRejected || this.isViewOnly) {
        this.setValues();
      }
    } catch (error) {
      this.messageService.showErrorAlert(error?.message || error);
    }
  }

  setValues() {
    this.FV.setValue("grnNumber", this.grnData?.grnNumberWithPrefix || "");
    this.FV.setValue("grnDate", this.datePipe.transform(this.grnData?.grnDate, 'yyyy-MM-dd') || '');
    this.FV.setValue("grnRemarks", this.grnData?.grnRemarks || "");

    this.FV.disableField("grnNumber");
    this.FV.disableField("grnDate");

    if (this.grnData?.products && this.grnData.products.length > 0) {
      this.recodes = this.grnData.products;
    }

    if (this.isApproved || this.isRejected || this.isViewOnly) {
      this.FV.disableField("grnRemarks");
    }

    if (this.grnData?.status == 2) {
      this.FV.setValue("approveRemarks", this.grnData?.approvedRejectedRemarks || "");
      this.FV.disableField("approveRemarks");
    } else if (this.grnData?.status == 3) {
      this.FV.setValue("rejectRemarks", this.grnData?.approvedRejectedRemarks || "");
      this.FV.disableField("rejectRemarks");
    }
  }

  onClickAddProduct() {
    this.isAddNewProduct = true;
  }

  onChangeProduct() {
    let product = this.FV.getValue("product");
    this.FV.enableField("productMeasureUnit");
    this.FV.enableField("measureUnit");


    let selectedProduct = this.products.find((x: any) => x._id === product);
    if (selectedProduct) {
      this.selectedProduct = selectedProduct;
      this.FV.setValue("productMeasureUnit", selectedProduct.measureUnitDetails?.unitId || "");
      this.FV.disableField("productMeasureUnit");

      this.FV.setValue("measureUnit", selectedProduct.measureUnitDetails?.unitId || "");

      if (!selectedProduct?.measureUnitDetails?.isSaveWithSiUnit) {
        this.FV.disableField("measureUnit");
      }
      // this.FV.setValue("selectedMeasureUnit", selectedProduct.measureUnitDetails?.unitId || "");
    }
  }

  onClickSaveProduct() {
    if (this.FV.validateControllers("product,productMeasureUnit,quantity,remarks,measureUnit")) {
      return;
    }

    let product = this.FV.getValue("product");
    let quantity = this.FV.getValue("quantity");
    let measureUnit = this.FV.getValue("measureUnit");
    let remarks = this.FV.getValue("remarks");

    if (this.recodes.some(x => x.productId === product)) {
      this.messageService.showErrorAlert("This product is already added to this GRN!");
      return;
    }

    let selectedProduct = this.products.find((x: any) => x._id === product);

    let selectedMeasureUnit = selectedProduct?.measureUnits.find((x: any) => x.unitId === measureUnit);

    let request = {
      "_id": this.helperService.generateUniqueId(),
      "productName": selectedProduct?.productName,
      "productId": product,
      "quantity": quantity,
      "remarks": remarks,
      "enteredMeasureUnitId": measureUnit,
      "measureUnit": selectedMeasureUnit,
    }

    this.recodes.push(request);
    this.clearForm();
  }

  onClickCancelProduct() {
    this.isAddNewProduct = false;
    this.clearForm();
  }


  clearForm() {
    // this.FV.clea
    this.FV.clearValues("product,productMeasureUnit,quantity,remarks,measureUnit");
    this.selectedProduct = null;
    this.isAddNewProduct = false;

  }

  onDeleteProduct(rowData: any) {
    let confirmationConfig = {
      message: "Are you sure you want to delete this product?",
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
    };

    this.messageService.ConfirmPopUp(
      confirmationConfig,
      (isConfirm: boolean) => {
        if (isConfirm) {
          this.recodes = this.recodes.filter((x: any) => x._id !== rowData._id);
          this.messageService.showSuccessAlert("Product removed successfully!");
        }
      }
    );
  }

  onSave() {
    if (this.FV.validateControllers("grnNumber,grnDate,grnRemarks")) {
      return;
    }

    let grnRemarks = this.FV.getValue("grnRemarks");

    let products: any[] = [];
    this.recodes.forEach((rec: any) => {
      products.push({
        "_id": rec._id,
        "productId": rec.productId,
        "enteredMeasureUnitId": rec.enteredMeasureUnitId,
        "quantity": rec.quantity,
        "remarks": rec.remarks
      });
    });

    if (products.length <= 0) {
      this.messageService.showErrorAlert("Please add at least one product to proceed!");
      return;
    }

    let request = {
      "grnRemarks": grnRemarks,
      "products": products
    }

    if (this.isEdit) {
      this.grnService.UpdateGrn(this.sidebarService.getData().grnData._id, request).subscribe((response) => {
        if (response.IsSuccessful) {
          this.messageService.showSuccessAlert(response.Message);
          this.sidebarService.sidebarEvent.emit(true);
        } else {
          this.messageService.showErrorAlert(response.Message);
        }
      });
    } else {
      this.grnService.SaveGrn(request).subscribe((response) => {
        if (response.IsSuccessful) {
          this.messageService.showSuccessAlert(response.Message);
          this.sidebarService.sidebarEvent.emit(true);
        } else {
          this.messageService.showErrorAlert(response.Message);
        }
      });
    }
  }

  onCancel() {
    this.sidebarService.sidebarEvent.emit(false);
  }

  onApprove() {
    let confirmationConfig = {
      message: "Are you sure you want to approve this GRN?",
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
    };

    this.messageService.ConfirmPopUp(
      confirmationConfig,
      (isConfirm: boolean) => {
        if (isConfirm) {

          let approveRemarks = this.FV.getValue("approveRemarks");
          let request = {
            "remark": approveRemarks
          };

          this.grnService
            .ApproveGrn(this.grnData?._id, request)
            .subscribe((response) => {
              if (response.IsSuccessful) {
                this.messageService.showSuccessAlert(response.Message);
                this.sidebarService.sidebarEvent.emit(true);
              } else {
                this.messageService.showErrorAlert(response.Message);
              }
            });
        }
      }
    );
  }

  onReject() {
    let confirmationConfig = {
      message: "Are you sure you want to reject this GRN?",
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
    };

    this.messageService.ConfirmPopUp(
      confirmationConfig,
      (isConfirm: boolean) => {
        if (isConfirm) {

          let rejectRemarks = this.FV.getValue("rejectRemarks");
          let request = {
            "remark": rejectRemarks
          };

          this.grnService
            .RejectGrn(this.grnData?._id, request)
            .subscribe((response) => {
              if (response.IsSuccessful) {
                this.messageService.showSuccessAlert(response.Message);
                this.sidebarService.sidebarEvent.emit(true);
              } else {
                this.messageService.showErrorAlert(response.Message);
              }
            });
        }
      }
    );
  }
}
