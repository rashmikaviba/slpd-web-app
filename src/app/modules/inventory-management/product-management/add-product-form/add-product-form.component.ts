import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { CommonService } from 'src/app/shared/services/api-services/common.service';
import { ProductService } from 'src/app/shared/services/api-services/product.service';
import { CommonForm } from 'src/app/shared/services/app-common-form';
import { AppMessageService } from 'src/app/shared/services/app-message.service';
import { SidebarService } from 'src/app/shared/services/sidebar.service';

@Component({
  selector: 'app-add-product-form',
  templateUrl: './add-product-form.component.html',
  styleUrls: ['./add-product-form.component.scss']
})
export class AddProductFormComponent {
  @ViewChild("templateRef", { static: true }) templateRef: TemplateRef<any>;
  FV = new CommonForm();
  isEdit: boolean = false;
  measureUnits: any[] = [];
  productTypes: any[] = [
    { label: "Consumable Product", value: 0 },
    { label: "Returnable Product", value: 1 },
  ];
  productData: any;

  constructor(private sidebarService: SidebarService,
    private formBuilder: FormBuilder,
    private commonService: CommonService,
    private messageService: AppMessageService,
    private productService: ProductService) {
    this.createForm();
  }


  ngOnInit(): void {
    this.sidebarService.setFooterTemplate(this.templateRef);

    let data = this.sidebarService.getData();

    this.isEdit = data.isEdit;
    this.productData = data.productData;

    if (this.isEdit) {
      this.setValues();
    }

    this.loadInitialData();
  }

  createForm() {
    this.FV.formGroup = this.formBuilder.group({
      productName: ["", [Validators.required]],
      productShortCode: ["", [Validators.required]],
      measureUnit: ["", [Validators.required]],
      isReturnableProduct: ["", [Validators.required]],
      unitPrice: [0, [Validators.min(0), Validators.required]],
      inventory: [""],
      productDescription: ["", [Validators.max(500)]],
    });
  }

  async loadInitialData() {
    try {
      const measureUnitResult = await firstValueFrom(
        this.commonService.GetMeasureUnits()
      )

      if (measureUnitResult.IsSuccessful) {
        this.measureUnits = measureUnitResult.Result;

        this.measureUnits.map((x) => {
          x.label = `${x.categoryName}`

          x.items.map((y) => {
            y.label = `${y.name} (${y.code})`
            y.value = y.unitId
          })
        })
      }
    } catch (error) {
      this.messageService.showErrorAlert(error.message || error);

    }
  }

  setValues() {
    this.FV.setValue("productName", this.productData.productName);
    this.FV.setValue("productShortCode", this.productData.productShortCode);
    this.FV.setValue("measureUnit", this.productData.measureUnit);
    this.FV.setValue("isReturnableProduct", this.productData.isReturnableProduct ? 1 : 0);
    this.FV.setValue("unitPrice", this.productData.unitPrice);
    this.FV.setValue("productDescription", this.productData.description);
  }


  onSave() {
    if (this.FV.validateControllers("productName,productShortCode,measureUnit,unitPrice,productDescription,isReturnableProduct")) {
      return;
    }

    let formValue = this.FV.formGroup.value;

    let request = {
      "productName": formValue.productName,
      "productShortCode": formValue.productShortCode,
      "measureUnit": formValue.measureUnit,
      "isReturnableProduct": formValue.isReturnableProduct == 1 ? true : false,
      "unitPrice": formValue.unitPrice,
      "description": formValue.productDescription
    }

    if (this.isEdit) {
      this.productService.UpdateProduct(this.productData._id, request).subscribe((response) => {
        if (response.IsSuccessful) {
          this.messageService.showSuccessAlert(response.Message);
          this.sidebarService.sidebarEvent.emit(true);
        } else {
          this.messageService.showErrorAlert(response.Message);
        }
      })

    } else {
      this.productService.SaveProduct(request).subscribe((response) => {
        if (response.IsSuccessful) {
          this.messageService.showSuccessAlert(response.Message);
          this.sidebarService.sidebarEvent.emit(true);
        } else {
          this.messageService.showErrorAlert(response.Message);
        }
      })
    }
  }

  onCancel() {
    this.sidebarService.sidebarEvent.emit(false);
  }
}
