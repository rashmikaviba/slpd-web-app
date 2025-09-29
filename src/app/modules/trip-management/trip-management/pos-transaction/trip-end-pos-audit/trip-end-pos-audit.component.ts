import { PosService } from '../../../../../shared/services/api-services/pos.service';
import { FormBuilder, Validators } from '@angular/forms';
import { AppMessageService } from 'src/app/shared/services/app-message.service';
import { PopupService } from '../../../../../shared/services/popup.service';
import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CommonForm } from 'src/app/shared/services/app-common-form';

@Component({
  selector: 'app-trip-end-pos-audit',
  templateUrl: './trip-end-pos-audit.component.html',
  styleUrls: ['./trip-end-pos-audit.component.css']
})
export class TripEndPosAuditComponent implements OnInit {
  FV = new CommonForm()
  posDetails: any = null
  cols: any[] = []
  recodes: any[] = []
  measureUnits: any[] = []
  editRecordId: String = "";
  constructor(
    private popupService: PopupService,
    private messageService: AppMessageService,
    private config: DynamicDialogConfig,
    private formBuilder: FormBuilder,
    private ref: DynamicDialogRef,
    private posService: PosService
  ) {
    this.createForm();
  }

  ngOnInit() {
    let dialogConfig = this.config.data;

    this.posDetails = dialogConfig.posDetails;
    this.recodes = this.posDetails?.products;
    this.measureUnits = dialogConfig.measureUnits;
    this.cols = [
      { field: 'productName', header: 'Product' },
      { field: 'enteredQuantity', header: 'Quantity' },
      { field: 'isReturnableProduct', header: 'Is Returnable' },
      { field: 'isReturned', header: 'Returned' },
      { field: 'returnQuantity', header: 'Return Quantity' },
      { field: 'notReturnedReason', header: 'Not Returned Reason' },
      { field: 'action', header: 'Action' },
    ]

    this.rearrangeRecords();
  }

  createForm() {
    this.FV.formGroup = this.formBuilder.group({
      returnQuantity: [0, [Validators.required, Validators.min(0)]],
      returnUnitOfMeasure: ["", [Validators.required]],
      isReturned: [false],
      notReturnedReason: ["", [Validators.required]],
    })
  }



  rearrangeRecords() {
    this.recodes.map((x: any) => {
      x.returnQuantity = x?.isReturnableProduct ? x.enteredQuantity : 0;
      x.isReturned = x?.isReturnableProduct ? true : false;
      x.returnUnitOfMeasure = x.enteredUnitOfMeasure;
      x.returnUnitOfMeasureCode = x.enteredUnitOfMeasureCode;
      x.notReturnedReason = "";
      x.measureUnits = this.measureUnits.find((unit: any) => unit.categoryId === x?.productMeasureUnitDetails?.categoryId)?.items || [];

      x.measureUnits.map((unit: any) => {
        unit.label = `${unit.name} (${unit.code})`;
      });
    })
  }

  onHandleEditClick(rowData: any) {
    this.onCancel();
    this.editRecordId = rowData.id;
    this.FV.enableField("returnUnitOfMeasure");
    this.FV.enableField("isReturned");
    this.FV.enableField("notReturnedReason");

    if (!rowData?.productMeasureUnitDetails?.isSaveWithSiUnit || rowData?.isReturnableProduct) {
      this.FV.disableField("returnUnitOfMeasure");
    }

    if (!rowData?.isReturnableProduct) {
      this.FV.disableField("isReturned");
      this.FV.disableField("notReturnedReason");
    }

    this.FV.setValue("returnQuantity", rowData.returnQuantity);
    this.FV.setValue("returnUnitOfMeasure", rowData.returnUnitOfMeasure);
    this.FV.setValue("isReturned", rowData.isReturned);
    this.FV.setValue("notReturnedReason", rowData.notReturnedReason);
  }

  onCancel() {
    this.editRecordId = "";
    this.FV.clearValues("returnQuantity,returnUnitOfMeasure,isReturned,notReturnedReason");
  }

  onSave(rowData: any) {
    debugger;
    let returnQuantity = this.FV.getValue("returnQuantity");
    let returnUnitOfMeasure = this.FV.getValue("returnUnitOfMeasure");
    let isReturned = this.FV.getValue("isReturned");
    let notReturnedReason = this.FV.getValue("notReturnedReason");

    let selectedMesureUnit = rowData.measureUnits.find((unit: any) => unit.unitId === returnUnitOfMeasure);

    if (rowData?.isReturnableProduct && rowData.enteredQuantity != returnQuantity && (notReturnedReason == "" || notReturnedReason == null)) {
      this.messageService.showWarnAlert(
        `If return quantity is changed in returnable product (${rowData.productName}) then, not returned reason is required!`
      )
      return;
    }

    if (rowData?.quantityWithSiUnitOfMeasure < returnQuantity * selectedMesureUnit?.conversionToSi) {
      this.messageService.showWarnAlert(
        `Return quantity is more than available quantity in product (${rowData.productName})!`
      )
      return;
    }

    rowData.returnQuantity = returnQuantity;
    rowData.returnUnitOfMeasure = returnUnitOfMeasure;
    rowData.returnUnitOfMeasureCode = selectedMesureUnit?.code;
    rowData.isReturned = isReturned;
    rowData.notReturnedReason = notReturnedReason;
    this.onCancel();
  }

  onClickCompleteTripAudit() {
    let returnableProducts = this.recodes.filter((x: any) => x?.isReturnableProduct);

    let isNotValid = false;

    returnableProducts.map((x: any) => {
      if (x.returnQuantity != x.enteredQuantity && (x.notReturnedReason == "" || x.notReturnedReason == null)) {
        isNotValid = true;
      }
    })

    if (isNotValid) {
      this.messageService.showWarnAlert(
        `If return quantity is changed in returnable product then, not returned reason is required!`
      );
      return;
    }

    let requestArray: any = [];

    this.recodes.map((recode: any) => {
      let req = {
        id: recode.id,
        returnQuantity: recode.returnQuantity,
        returnUnitOfMeasure: recode.returnUnitOfMeasure,
        isReturned: recode.isReturned,
        notReturnedReason: recode.notReturnedReason,
      }

      requestArray.push(req);
    })

    let request = {
      tripId: this.posDetails.tripId,
      auditRecords: requestArray
    }

    this.posService.TripEndAudit(request).subscribe((response) => {
      if (response.IsSuccessful) {
        this.messageService.showSuccessAlert(response.Message);
        this.ref.close(true);
      } else {
        this.messageService.showErrorAlert(response.Message);
      }
    })

  }
}
