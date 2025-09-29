import { Injectable } from '@angular/core';
import { ResourceService } from '../resource.service';
import { DataAccessService } from '../data-access.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(
    private dataAccess: DataAccessService,
    private resource: ResourceService,
  ) { }

  GetInventorySummary() {
    return this.dataAccess
      .GET(this.resource.dashboard.getInventorySummary)
      .pipe((response) => {
        return response;
      });
  }

  GetDashboardStats(startDate: string, endDate: string) {
    return this.dataAccess
      .GET(this.resource.dashboard.getDashboardstats + `?startDate=${startDate}&endDate=${endDate}`)
      .pipe((response) => {
        return response;
      });
  }

  GetMonthlyIncomeExpense(year: number) {
    return this.dataAccess
      .GET(this.resource.dashboard.getMonthlyIncomeExpense + `?year=${year}`)
      .pipe((response) => {
        return response;
      });
  }
}
