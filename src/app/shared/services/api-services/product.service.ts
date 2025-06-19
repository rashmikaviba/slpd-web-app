import { Injectable } from '@angular/core';
import { ResourceService } from '../resource.service';
import { DataAccessService } from '../data-access.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private dataAccess: DataAccessService,
    private resource: ResourceService) { }

  SaveProduct(body: any) {
    return this.dataAccess
      .POST(this.resource.inventoryProduct.save, body)
      .pipe((response) => {
        return response;
      });
  }

  GetAllProducts(isWithInactive: boolean = false) {
    return this.dataAccess
      .GET(this.resource.inventoryProduct.getAll + `?isWithInactive=${isWithInactive}`)
      .pipe((response) => {
        return response;
      });
  }

  GetProductById(id: string) {
    return this.dataAccess
      .GET(this.resource.inventoryProduct.getById + `/${id}`)
      .pipe((response) => {
        return response;
      });
  }

  UpdateProduct(id: string, body: any) {
    return this.dataAccess
      .PUT(this.resource.inventoryProduct.update + `/${id}`, body)
      .pipe((response) => {
        return response;
      });
  }

  DeleteProduct(id: string) {
    return this.dataAccess
      .DELETE(this.resource.inventoryProduct.deleteById + `/${id}`)
      .pipe((response) => {
        return response;
      });
  }

  ActiveInactiveProduct(id: string) {
    return this.dataAccess
      .PUT(this.resource.inventoryProduct.activeInactive + `/${id}`, null)
      .pipe((response) => {
        return response;
      });
  }

  GetProductAuditLog(id: string) {
    return this.dataAccess
      .GET(this.resource.inventoryProduct.getAuditLog + `/${id}`)
      .pipe((response) => {
        return response;
      });
  }

}
