import { DatePipe } from "@angular/common";
import { Component } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { CommonForm } from "src/app/shared/services/app-common-form";
import { AppMessageService } from "src/app/shared/services/app-message.service";
import { SidebarService } from "src/app/shared/services/sidebar.service";

@Component({
  selector: "app-trip-informations",
  templateUrl: "./trip-informations.component.html",
  styleUrls: ["./trip-informations.component.scss"],
})
export class TripInformationsComponent {
  FV = new CommonForm();
  products: any;
  isEdit: any;
  isAddNewDesigation: boolean = false;
  cols: any;
  recodes: any;
  loading: any;
  filteredItems: any[];
  items: any[];
  isAddNewGuest: boolean = false;
  dates: Date[] | undefined;

  constructor(
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private sidebarService: SidebarService,
    private messageService: AppMessageService
  ) {
    this.createForm();
  }

  createForm() {
    this.FV.formGroup = this.formBuilder.group({
      date: [""],
      description: [""],
    });
  }

  ngOnInit(): void {
    this.products = [
      {
        date: "2024-09-10 / 2024-09-12",
        description: "Description is Required!",
      },
      {
        date: "2024-09-10 / 2024-09-12",
        description: "Description is Required!",
      },
      {
        date: "2024-09-10 / 2024-09-12",
        description: "Description is Required!",
      },
      {
        date: "2024-09-10 / 2024-09-12",
        description: "Description is Required!",
      },
      {
        date: "2024-09-10 / 2024-09-12",
        description: "Description is Required!",
      },
      {
        date: "2024-09-10 / 2024-09-12",
        description: "Description is Required!",
      },
      {
        date: "2024-09-10 / 2024-09-12",
        description: "Description is Required!",
      },
      {
        date: "2024-09-10 / 2024-09-12",
        description: "Description is Required!",
      },
      {
        date: "2024-09-10 / 2024-09-12",
        description: "Description is Required!",
      },
      {
        date: "2024-09-10 / 2024-09-12",
        description: "Description is Required!",
      },
      {
        date: "2024-09-10 / 2024-09-12",
        description: "Description is Required!",
      },
      {
        date: "2024-09-10 / 2024-09-12",
        description: "Description is Required!",
      },
      {
        date: "2024-09-10 / 2024-09-12",
        description: "Description is Required!",
      },
      {
        date: "2024-09-10 / 2024-09-12",
        description: "Description is Required!",
      },
      {
        date: "2024-09-10 / 2024-09-12",
        description: "Description is Required!",
      },
      {
        date: "2024-09-10 / 2024-09-12",
        description: "Description is Required!",
      },
    ];
  }

  onClickAddNew() {
    try {
      this.isAddNewDesigation = !this.isAddNewDesigation;
    } catch (error: any) {
      this.messageService.showErrorAlert(error);
    }
  }

  onClickAddNewActivity() {
    this.isAddNewGuest = !this.isAddNewGuest;
  }

  onClickSaveGuest() {
    this.isAddNewGuest = false;
  }

  onClickDeleteGuest() {}

  onClickSave() {}
  onClickCancel() {}
  onClickSubmit() {}
  onClickDelete() {}

  toggleMenu(menu: any, event: any, rowData: any) {
    this.filteredItems = [];

    this.filteredItems = this.items.filter((menuItem: any) => {
      if (rowData?.isBlackListed && menuItem.id === 3) {
        return false;
      } else if (!rowData?.isBlackListed && menuItem.id === 4) {
        return false;
      } else {
        return true;
      }
    });

    this.filteredItems.forEach((menuItem) => {
      menuItem.data = rowData;
    });
    menu.toggle(event);
  }

  onClickSavePlace() {}
}
