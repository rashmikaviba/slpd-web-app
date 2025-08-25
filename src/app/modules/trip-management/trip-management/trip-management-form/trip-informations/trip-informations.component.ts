import { DatePipe } from "@angular/common";
import { ChangeDetectorRef, Component, ViewChild } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { CommonForm } from "src/app/shared/services/app-common-form";
import { AppMessageService } from "src/app/shared/services/app-message.service";
import { SidebarService } from "src/app/shared/services/sidebar.service";
import { TripManagementFlowService } from "../trip-management-flow.service";
import { PopupService } from "src/app/shared/services/popup.service";
import { AddPlaceFormComponent } from "./add-place-form/add-place-form.component";
import { OrderList } from "primeng/orderlist";

@Component({
  selector: "app-trip-informations",
  templateUrl: "./trip-informations.component.html",
  styleUrls: ["./trip-informations.component.scss"],
})
export class TripInformationsComponent {
  recodes: any[] = [];
  isView: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private sidebarService: SidebarService,
    private messageService: AppMessageService,
    private tripManagementFlowService: TripManagementFlowService,
    private popUpService: PopupService,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.isView = this.tripManagementFlowService.getIsView();

    this.recodes = JSON.parse(
      JSON.stringify(this.tripManagementFlowService.getData().places || [])
    ); // this.tripManagementFlowService.getData().places || [];
    this.recodes.map((x) => {
      x.showDate = x.dates
        .map((x) => {
          return this.datePipe.transform(x, "yyyy-MM-dd", "Asia/Colombo");
        })
        .join(" / ");
    });
  }

  onClickAddNew() {
    let data = {
      startDate: this.tripManagementFlowService.getData().startDate,
      endDate: this.tripManagementFlowService.getData().endDate,
      isEdit: false,
    };

    this.popUpService
      .OpenModel(AddPlaceFormComponent, {
        header: "Add Place",
        width: "40vw",
        data,
      })
      .subscribe((result) => {
        if (result) {
          let obj = {
            _id: this.generateUniqueId(),
            description: result?.description,
            dates: result?.dates,
            showDate: result?.dates
              .map((x) => {
                return this.datePipe.transform(x, "yyyy-MM-dd", "Asia/Colombo");
              })
              .join(" / "),
            isReached: false,
            index: this.recodes.length + 1,
          };

          this.recodes = [...this.recodes, obj];
        }
      });
  }

  generateUniqueId() {
    let generatedId =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
    while (this.recodes.findIndex((x) => x._id == generatedId) != -1) {
      generatedId =
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);
    }
    return generatedId;
  }

  onClickDelete(id: string) {
    let confirmationConfig = {
      message: `Are you sure you want to delete this place?`,
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
    };

    this.messageService.ConfirmPopUp(
      confirmationConfig,
      (isConfirm: boolean) => {
        if (isConfirm) {
          this.recodes = this.recodes.filter((x) => x._id != id);
        }
      }
    );
  }

  onSave() {
    if (this.recodes.length <= 0) {
      this.messageService.showWarnAlert(
        "Please add at least one place to continue!"
      );
      return null;
    }

    // udpate index and remove showDate tempory
    let resultResponse: any[] = [];
    this.recodes.forEach((x, i) => {
      resultResponse.push({
        _id: x?._id,
        description: x?.description,
        dates: x?.dates,
        isReached: x?.isReached,
        index: i + 1,
      });
    });

    return resultResponse;
  }

  onClickEdit(rowData: any) {
    let data = {
      startDate: this.tripManagementFlowService.getData().startDate,
      endDate: this.tripManagementFlowService.getData().endDate,
      isEdit: true,
      placeData: rowData,
    };

    this.popUpService
      .OpenModel(AddPlaceFormComponent, {
        header: "Edit Place",
        width: "40vw",
        data,
      })
      .subscribe((result) => {
        if (result) {
          // let obj = {
          //   _id: this.generateUniqueId(),
          //   description: result?.description,
          //   dates: result?.dates,
          //   showDate: result?.dates
          //     .map((x) => {
          //       return this.datePipe.transform(x, "yyyy-MM-dd", "Asia/Colombo");
          //     })
          //     .join(" / "),
          //   isReached: false,
          //   index: this.recodes.length + 1,
          // };

          // this.recodes = [...this.recodes, obj];
          debugger;
          let index = this.recodes.findIndex((x) => x._id == rowData._id);
          if (index != -1) {
            this.recodes[index].description = result?.description;
            this.recodes[index].dates = result?.dates;
            this.recodes[index].showDate = result?.dates
              .map((x) => {
                return this.datePipe.transform(x, "yyyy-MM-dd", "Asia/Colombo");
              })
              .join(" / ");
          }
        }
      });
  }
}
