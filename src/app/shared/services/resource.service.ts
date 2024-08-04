import { Injectable } from "@angular/core";
import { get } from "jquery";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class ResourceService {
  constructor() {}

  public appHostURL: string = environment.appURL;

  private Store = "/store";

  store = {
    uploadFile: this.Store + "/upload",
    uploadMultipleFiles: this.Store + "/uploadMultiple",
  };
}
