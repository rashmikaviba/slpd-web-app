import { OtherInformationComponent } from "./other-information/other-information.component";
import { DatePipe } from "@angular/common";
import { Component, HostListener, TemplateRef, ViewChild } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { MenuItem } from "primeng/api";
import { CommonForm } from "src/app/shared/services/app-common-form";
import { AppMessageService } from "src/app/shared/services/app-message.service";
import { SidebarService } from "src/app/shared/services/sidebar.service";
import { GeneralInformationComponent } from "./general-information/general-information.component";
import { TripManagementFlowService } from "./trip-management-flow.service";
import { GuestInformationComponent } from "./guest-information/guest-information.component";

@Component({
  selector: "app-trip-management-form",
  templateUrl: "./trip-management-form.component.html",
  styleUrls: ["./trip-management-form.component.scss"],
})
export class TripManagementFormComponent {
  @ViewChild("templateRef", { static: true }) templateRef: TemplateRef<any>;
  @ViewChild(GeneralInformationComponent)
  private generalInfoComponent!: GeneralInformationComponent;
  @ViewChild(GuestInformationComponent)
  private guestInfoComponent!: GuestInformationComponent;
  @ViewChild(OtherInformationComponent)
  private otherInfoComponent!: OtherInformationComponent;
  activeIndex: any = 0;
  items: MenuItem[];
  value: any = { value: 0, label: "General Information" };
  showingIndex: number = 0;
  isEdit: boolean = false;

  constructor(
    private sidebarService: SidebarService,
    private messageService: AppMessageService,
    private tripMgtFlowService: TripManagementFlowService
  ) {}

  @HostListener("window:resize", ["$event"])
  onResize(event) {
    this.checkViewport();
  }

  ngOnInit(): void {
    let sideBarData = this.sidebarService.getData();
    this.sidebarService.setFooterTemplate(this.templateRef);

    this.checkViewport();
  }

  checkViewport() {
    let isMobile = window.innerWidth < 768; // Adjust as per your responsive design breakpoints

    this.items = [
      {
        value: 0,
        label: isMobile ? "General" : "General Information",
      },
      {
        value: 1,
        label: isMobile ? "Guest" : "Guest Information",
      },
      {
        value: 2,
        label: isMobile ? "Trip" : "Trip Information",
      },
      {
        value: 3,
        label: isMobile ? "Other" : "Other Information",
      },
    ];

    // if (this.isMobile) {
    //   this.items = this.itemsMobile;
    // } else {
    //   this.items = this.itemsDesktop;
    // }
  }

  handleClick(index: number): void {
    console.log(index);
    let finishSteps = this.tripMgtFlowService.getFinishedStep();

    // switch (index) {
    //   case 0:
    //     this.showingIndex = 0;
    //     break;
    //   case 1:
    //     if (finishSteps?.step0) {
    //       this.showingIndex = 1;
    //     }

    //     break;
    //   case 2:
    //     if (finishSteps?.step0 && finishSteps?.step1) {
    //       this.showingIndex = 2;
    //     }
    //     break;
    //   case 3:
    //     if (finishSteps?.step0 && finishSteps?.step1 && finishSteps?.step2) {
    //       this.showingIndex = 3;
    //     }
    //     break;
    //   default:
    //     break;
    // }

    this.showingIndex = index;
  }

  handleCancel() {}

  handleUpdate(e: any) {}

  handleSave() {
    debugger;
    switch (this.showingIndex) {
      case 0:
        let generalInfo = this.generalInfoComponent.onSave();
        if (generalInfo) {
          this.tripMgtFlowService.setData(generalInfo);
          this.tripMgtFlowService.setFinishedStep(0);
          this.showingIndex = 1;
        }
        break;
      case 1:
        let guestInfo = this.guestInfoComponent.onSaveAndMoveToNext();

        if (guestInfo) {
          this.tripMgtFlowService.setData({ passengers: guestInfo });
          this.tripMgtFlowService.setFinishedStep(1);
          this.showingIndex = 2;
        }
        break;
      case 2:
        this.tripMgtFlowService.setFinishedStep(2);
        this.showingIndex = 3;
        break;
      case 3:
        let confirmationConfig = {
          message:
            "Are you sure you have filled all the information about this trip?",
          header: "Confirmation",
          icon: "pi pi-exclamation-triangle",
        };

        this.messageService.ConfirmPopUp(
          confirmationConfig,
          (isConfirm: boolean) => {
            if (isConfirm) {
              let otherInfo: any = this.otherInfoComponent.onSave();

              if (otherInfo) {
                if (otherInfo?.activities.length > 0) {
                  this.tripMgtFlowService.setData({
                    activities: otherInfo?.activities,
                  });
                } else {
                  this.tripMgtFlowService.setData({
                    activities: [],
                  });
                }

                if (otherInfo?.hotels.length > 0) {
                  this.tripMgtFlowService.setData({
                    hotels: otherInfo?.hotels,
                  });
                } else {
                  this.tripMgtFlowService.setData({
                    hotels: [],
                  });
                }
              }
            }
          }
        );

        console.log(this.tripMgtFlowService.getData());
        break;
    }
  }
}
