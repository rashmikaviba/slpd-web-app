import { Component, TemplateRef, ViewChild } from "@angular/core";
import { MenuItem } from "primeng/api";
import { CommonForm } from "src/app/shared/services/app-common-form";
import { SidebarService } from "src/app/shared/services/sidebar.service";

@Component({
  selector: "app-add-new-user-form",
  templateUrl: "./add-new-user-form.component.html",
  styleUrls: ["./add-new-user-form.component.scss"],
})
export class AddNewUserFormComponent {
  @ViewChild("templateRef", { static: true }) templateRef: TemplateRef<any>;

  activeIndex: any = 0;
  items: MenuItem[];
  genders: any = [{ name: "Male" }, { name: "Female" }, { name: "Other" }];
  banks: any[] = [
    { name: "BOC Bank" },
    { name: "Commercial Bank" },
    { name: "HNB Bank" },
  ];
  branch: any[] = [
    { name: "Kadawatha" },
    { name: "Kaduwela" },
    { name: "Kiribathgoda" },
  ];
  role: any[] = [{ name: "Admin" }, { name: "Cashier" }, { name: "Sales" }];

  value: any = { value: 0, label: "Personal" };
  showingIndex: number = 0;

  constructor(private sidebarService: SidebarService) {}

  ngOnInit(): void {
    this.sidebarService.setFooterTemplate(this.templateRef);

    this.items = [
      {
        value: 0,
        label: "Personal",
      },
      {
        value: 1,
        label: "Bank Details",
      },
      {
        value: 2,
        label: "Upload",
      },
    ];
  }

  handleClick(index: number): void {
    console.log("index", index);
    this.showingIndex = this.items[index]?.value;
    console.log("value", this.showingIndex);
  }
  nextPage() {}
  onUpload(data: any) {}
}
