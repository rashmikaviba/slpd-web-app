/* tslint:disable:no-unused-variable */

import { TestBed, async } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { AppComponent } from "./app.component";
// import { AppTopBarComponent } from "./layout/app.topbar.component";
// import { AppFooterComponent } from "./layout/app.footer.component";
// import { AppSideBarComponent } from "./layout/app.sidebar.component";
// import { AppSideBarTabContentComponent } from "./layout/app.sidebartabcontent.component";
// import { AppMenuComponent } from "./layout/app.menu.component";

describe("AppComponent", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [
        AppComponent,
        // AppTopBarComponent,
        // AppMenuComponent,
        // AppFooterComponent,
        // AppSideBarComponent,
        // AppSideBarTabContentComponent,
      ],
    });
    TestBed.compileComponents();
  });

  it("should create the app", async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});
