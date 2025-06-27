import { Injectable } from '@angular/core';
import { ResourceService } from '../resource.service';
import { DataAccessService } from '../data-access.service';

@Injectable({
  providedIn: 'root'
})
export class GrnService {

  constructor(private dataAccess: DataAccessService,
    private resource: ResourceService) { }

  SaveGrn(body: any) {
    return this.dataAccess
      .POST(this.resource.grn.save, body)
      .pipe((response) => {
        return response;
      });
  }

  GrnAdvanceSearch(body: any) {
    return this.dataAccess
      .POST(this.resource.grn.advanceSearch, body)
      .pipe((response) => {
        return response;
      });
  }

  GetGrnById(id: string) {
    return this.dataAccess
      .GET(this.resource.grn.getById + `/${id}`)
      .pipe((response) => {
        return response;
      });
  }

  UpdateGrn(id: string, body: any) {
    return this.dataAccess
      .PUT(this.resource.grn.update + `/${id}`, body)
      .pipe((response) => {
        return response;
      });
  }

  DeleteGrn(id: string) {
    return this.dataAccess
      .DELETE(this.resource.grn.deleteById + `/${id}`)
      .pipe((response) => {
        return response;
      });
  }

  ApproveGrn(id: string, body: any) {
    return this.dataAccess
      .PUT(this.resource.grn.approveGrn + `/${id}`, body)
      .pipe((response) => {
        return response;
      });
  }

  RejectGrn(id: string, body: any) {
    return this.dataAccess
      .PUT(this.resource.grn.rejectGrn + `/${id}`, body)
      .pipe((response) => {
        return response;
      });
  }

  GetNextGrnNumber() {
    return this.dataAccess
      .GET(this.resource.grn.getNextGrnNumber)
      .pipe((response) => {
        return response;
      });
  }

  CancelGrn(id: string) {
    return this.dataAccess
      .DELETE(this.resource.grn.cancelById + `/${id}`, null)
      .pipe((response) => {
        return response;
      });
  }
}
