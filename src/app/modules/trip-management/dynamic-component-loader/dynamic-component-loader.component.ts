import {
  Component,
  OnInit,
  ViewContainerRef,
  ComponentFactoryResolver,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-dynamic-component-loader",
  template: "<ng-container #container></ng-container>",
})
export class DynamicComponentLoaderComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private resolver: ComponentFactoryResolver,
    private viewContainerRef: ViewContainerRef
  ) {}

  ngOnInit(): void {
    const component = this.route.snapshot.data["dynamicComponent"];
    if (component) {
      const factory = this.resolver.resolveComponentFactory(component);
      this.viewContainerRef.createComponent(factory);
    }
  }
}
