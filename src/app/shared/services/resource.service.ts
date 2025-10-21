import { Injectable } from "@angular/core";
import { get } from "jquery";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class ResourceService {
  constructor() { }

  private host: string = environment.apiURL + "/api/v1";

  private Auth = this.host + "/auth";
  private Store = this.host + "/store";
  private User = this.host + "/user";
  private Leave = this.host + "/leave";
  private MonthAudit = this.host + "/monthAudit";
  private Common = this.host + "/common";
  private Vehicle = this.host + "/vehicle";
  private Trip = this.host + "/trip";
  private Expenses = this.host + "/expense";
  private Report = this.host + "/report";
  private ExpenseRequest = this.host + "/expenseRequest";
  private Notification = this.host + "/notification";
  private InternalTrip = this.host + "/internalTrip";
  private TripSummary = this.host + "/tripSummary";
  private Inventory = this.host + "/inventory";
  private Product = "/product";
  private GRN = "/grn";
  private MonthlyExpenses = this.host + "/monthlyExpenses";
  private Pos = this.host + "/pos";
  private Dashboard = this.host + "/dashboard";
  private Garage = this.host + "/garage";

  auth = {
    login: this.Auth + "/login",
    resetPassword: this.Auth + "/resetPassword",
    changePassword: this.Auth + "/changePassword",
    refreshAuth: this.Auth + "/refreshAuth",
  };

  store = {
    uploadFile: this.Store + "/upload",
    uploadMultipleFiles: this.Store + "/uploadMultiple",
  };

  user = {
    validateUser: this.User + "/validateUser",
    saveUser: this.User,
    getAllUsers: this.User,
    getUserById: this.User,
    blockUser: this.User + "/block",
    unblockUser: this.User + "/unblock",
    updateUser: this.User,
    deleteUser: this.User,
    getUsersByRole: this.User + "/userByRole",
    getDriversForTrip: this.User + "/getDriversForTrip",
  };

  leave = {
    saveLeave: this.Leave + "/apply",
    getAllLeaves: this.Leave,
    getLeaveById: this.Leave,
    approveLeave: this.Leave + "/approve",
    rejectLeave: this.Leave + "/reject",
    cancel: this.Leave + "/cancel",
    getLeaveCount: this.Leave + "/leaveCount",
    updateLeave: this.Leave + "/update",
    getEligibleLeaveForAdmin: this.Leave + "/eligibleLeaves",
  };

  monthAudit = {
    getPendingLeaves: this.MonthAudit + "/pendingLeaves",
    createNewMonth: this.MonthAudit + "/createNewMonth",
    getWorkingInfo: this.MonthAudit + "/workingInfo",
    getPendingTrips: this.MonthAudit + "/pendingTrip",
  };

  wegaShine = {
    session: "/session",
    devices: "/devices",
  };

  common = {
    getDataByType: this.Common + "/data",
    getGenders: this.Common + "/gender",
    getMeasureUnits: this.Common + "/measureUnits",
  };

  vehicle = {
    saveVehicle: this.Vehicle,
    getAllVehicles: this.Vehicle,
    getVehicleById: this.Vehicle,
    updateVehicle: this.Vehicle,
    deleteVehicleById: this.Vehicle,
    activeInactiveVehicles: this.Vehicle + "/activeInactive",
    getAllVehiclesByCount: this.Vehicle + "/passengerCount",
  };

  trip = {
    saveTrip: this.Trip,
    getAllTrips: this.Trip,
    getTripById: this.Trip,
    updateTrip: this.Trip,
    cancelTrip: this.Trip,
    assignDriver: this.Trip + "/assignDriver",
    updateTripStatus: this.Trip,
    getTripForPrint: this.Trip + "/tripForPrint",
    getTripForQR: this.Trip + "/tripForQrCode",
    getHotelsAndActivities: this.Trip + "/hotelsAndActivities",
    updateHotelActivityPayment: this.Trip + "/updateHotelActivityPayment",

    // checkList routes
    saveCheckList: this.Trip + "/checkList",
    getCheckList: this.Trip + "/checkList",

    // trip places
    getPlacesByTripId: this.Trip + "/places",
    updatePlaceAsMarked: this.Trip,

    // summary report
    getDestinationSummary: this.Trip + "/destinationSummary",
  };

  expense = {
    saveExpense: this.Expenses,
    updateExpense: this.Expenses,
    deleteExpense: this.Expenses,
    getAllExpensesByTrip: this.Expenses,
    getExpenseById: this.Expenses,
    getExpensesById: this.Expenses,
    saveDriverSalary: this.Expenses + "/saveSalary",
  };

  report = {
    monthlyTripReport: this.Report + "/monthlyTripReport",
    monthlyExpensesReport: this.Report + "/monthlyExpensesReport",
    monthlyDriverSalary: this.Report + "/monthlyDriverSalary",
    monthlyIncomeReport: this.Report + "/monthlyIncomeReport",
  };

  expenseRequest = {
    save: this.ExpenseRequest,
    approveExpense: this.ExpenseRequest + "/approve",
    rejectExpense: this.ExpenseRequest + "/reject",
    getExpenseExtensionById: this.ExpenseRequest,
  };

  notification = {
    getAllNotifications: this.Notification,
  };

  internalTrip = {
    save: this.InternalTrip,
    getByVehicle: this.InternalTrip + "/getByVehicle",
    getById: this.InternalTrip,
    update: this.InternalTrip,
    deleteById: this.InternalTrip,
  };

  tripSummary = {
    save: this.TripSummary,
    getByTripId: this.TripSummary + "/trip",
    update: this.TripSummary,
    deleteById: this.TripSummary,
    getById: this.TripSummary,
  };

  inventoryProduct = {
    save: this.Inventory + this.Product,
    getAll: this.Inventory + this.Product,
    getById: this.Inventory + this.Product,
    update: this.Inventory + this.Product,
    deleteById: this.Inventory + this.Product,
    activeInactive: this.Inventory + this.Product + "/activeInactive",
    getAuditLog: this.Inventory + this.Product + "/productAuditLog",
  }

  grn = {
    save: this.Inventory + this.GRN,
    advanceSearch: this.Inventory + this.GRN + "/advanceSearch",
    getById: this.Inventory + this.GRN,
    update: this.Inventory + this.GRN,
    deleteById: this.Inventory + this.GRN,
    approveGrn: this.Inventory + this.GRN + "/approve",
    rejectGrn: this.Inventory + this.GRN + "/reject",
    getGrnById: this.Inventory + this.GRN,
    getNextGrnNumber: this.Inventory + this.GRN + "/getNextGrnNumber",
    cancelById: this.Inventory + this.GRN,
  }

  monthlyExpenses = {
    save: this.MonthlyExpenses + "/save",
    advanceSearch: this.MonthlyExpenses + "/advanceSearch",
    update: this.MonthlyExpenses + "/update",
    deleteById: this.MonthlyExpenses + "/delete",
    getById: this.MonthlyExpenses,
  }

  posTransaction = {
    save: this.Pos + "/savePosProduct",
    voidProduct: this.Pos + "/voidPosProduct",
    tripEndAudit: this.Pos + "/tripEndAudit",
    getPosByTrip: this.Pos + "/getPosByTrip"
  }

  dashboard = {
    getInventorySummary: this.Dashboard + "/inventorySummary",
    getDashboardstats: this.Dashboard + "/getDashboardstats",
    getMonthlyIncomeExpense: this.Dashboard + "/monthlyIncomeExpense",
  }

  garage = {
    save: this.Garage,
    getAll: this.Garage,
    getById: this.Garage,
    update: this.Garage,
    deleteById: this.Garage,
    activeInactiveGarages: this.Garage + "/activeInactiveGarage",
  }
}
