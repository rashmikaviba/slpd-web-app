import { Injectable } from "@angular/core";
import { HelperService } from "./helper.service";
@Injectable({
  providedIn: "root",
})
export class MasterDataService {
  constructor(private helper: HelperService) {}

  setUserData(loginData: any) {
    this.RefreshToken = loginData.refresh_token;
    this.UserLevelPrivilagesList = loginData.Privileges;
    this.MenuList = loginData.Menus;
    this.SessionKey = loginData.access_token;
    this.TokenExpiration = loginData.expires_in;
    this.ClientId = loginData.userid;
    this.CurrentUserName = loginData.userName;
    this.TimedOut = "false";
  }

  setSystemDate(date: any) {
    this.SystemDate = date.systemDate;
  }
  getSystemDate() {
    return this.SystemDate;
  }

  get TimedOut(): any {
    return localStorage.getItem(AppKeys.TimedOut) ?? "false";
  }

  set TimedOut(value: any) {
    localStorage.setItem(AppKeys.TimedOut, value);
  }

  get SessionKey(): string {
    return localStorage.getItem(AppKeys.SessionKey) ?? "";
  }

  set SessionKey(key: string) {
    localStorage.setItem(AppKeys.SessionKey, key);
  }

  set TokenExpiration(expiration: any) {
    localStorage.setItem(AppKeys.TokenExpiration, expiration);
  }

  get TokenExpiration(): any {
    return localStorage.getItem(AppKeys.TokenExpiration) ?? "";
  }

  set RefreshToken(key: string) {
    localStorage.setItem(AppKeys.RefreshToken, key);
  }

  get RefreshToken(): string {
    return localStorage.getItem(AppKeys.RefreshToken) ?? "";
  }

  get MenuList(): any {
    let menus = localStorage.getItem(AppKeys.MenuList) ?? "";
    return JSON.parse(menus);
  }

  set MenuList(key: any) {
    localStorage.setItem(AppKeys.MenuList, JSON.stringify(key));
  }

  get UserLevelPrivilagesList(): any {
    let locations = localStorage.getItem(AppKeys.UserLevelPrivilagesList) ?? "";
    return JSON.parse(locations);
  }

  set UserLevelPrivilagesList(key: any) {
    localStorage.setItem(AppKeys.UserLevelPrivilagesList, JSON.stringify(key));
  }

  get CurrentUserName(): any {
    return localStorage.getItem(AppKeys.CurrentUserName) ?? "";
  }

  set CurrentUserName(name: any) {
    localStorage.setItem(AppKeys.CurrentUserName, name);
  }

  get ClientId(): any {
    return localStorage.getItem(AppKeys.ClientId) ?? "";
  }

  set ClientId(id: any) {
    localStorage.setItem(AppKeys.ClientId, id);
  }

  get HotelId(): any {
    return localStorage.getItem(AppKeys.HotelId) ?? "";
  }

  set HotelId(id: any) {
    localStorage.setItem(AppKeys.HotelId, id);
  }

  set ClientIpAddress(ip: any) {
    localStorage.setItem(AppKeys.ClientIpAddress, ip);
  }

  get ClientIpAddress(): any {
    return localStorage.getItem(AppKeys.ClientIpAddress) ?? "";
  }

  set SystemDate(date: any) {
    localStorage.setItem(AppKeys.SystemDate, JSON.stringify(date));
  }

  get SystemDate(): any {
    let userData = localStorage.getItem(AppKeys.SystemDate) ?? "";
    return JSON.parse(userData);
  }

  set FocusPosition(id: number) {
    localStorage.setItem("FocusPosition", id.toString());
  }

  get FocusPosition(): any {
    return localStorage.getItem("FocusPosition");
  }

  set CheckingCheckoutSetting(setting: any) {
    localStorage.setItem("CheckingCheckoutSetting", JSON.stringify(setting));
  }

  get CheckingCheckoutSetting(): any {
    return JSON.parse(localStorage.getItem("CheckingCheckoutSetting"));
  }

  set PrintSetting(setting: any) {
    localStorage.setItem("PrintSetting", JSON.stringify(setting));
  }

  get PrintSetting(): any {
    return JSON.parse(localStorage.getItem("PrintSetting"));
  }

  set PaginationSetting(setting: any) {
    localStorage.setItem("PaginationSetting", JSON.stringify(setting));
  }

  get PaginationSetting(): any {
    return JSON.parse(localStorage.getItem("PaginationSetting"));
  }

  set SystemSetting(setting: any) {
    localStorage.setItem("SystemSetting", JSON.stringify(setting));
  }

  get SystemSetting(): any {
    return JSON.parse(localStorage.getItem("SystemSetting"));
  }

  set MandatoryFields(setting: any) {
    localStorage.setItem("MandatoryFields", JSON.stringify(setting));
  }

  get MandatoryFields(): any {
    return JSON.parse(localStorage.getItem("MandatoryFields"));
  }

  set BaseCurrency(currency: any) {
    localStorage.setItem("BaseCurrency", JSON.stringify(currency));
  }

  get BaseCurrency(): any {
    return JSON.parse(localStorage.getItem("BaseCurrency"));
  }

  clearLoginData() {
    localStorage.removeItem(AppKeys.SessionKey);
    localStorage.removeItem(AppKeys.UserLevelPrivilagesList);
    localStorage.removeItem(AppKeys.MenuList);
    localStorage.removeItem(AppKeys.TokenExpiration);
    localStorage.removeItem(AppKeys.RefreshToken);
    localStorage.removeItem(AppKeys.CurrentUserName);
    localStorage.removeItem(AppKeys.ClientId);
    localStorage.removeItem(AppKeys.HotelId);
    localStorage.removeItem(AppKeys.ClientIpAddress);
    localStorage.removeItem(AppKeys.SystemDate);
    localStorage.removeItem(AppKeys.FocusPosition);
    localStorage.removeItem(AppKeys.CheckingCheckoutSetting);
    localStorage.removeItem(AppKeys.PrintSetting);
    localStorage.removeItem(AppKeys.TimedOut);
    localStorage.removeItem(AppKeys.PaginationSetting);
    localStorage.removeItem(AppKeys.SystemSetting);
    localStorage.removeItem(AppKeys.MandatoryFields);
    localStorage.removeItem(AppKeys.BaseCurrency);
  }
}

export class AppKeys {
  static readonly SessionKey = "SessionKey";
  static readonly MenuList = "MenuList";
  static readonly UserLevelPrivilagesList = "UserLevelPrivilagesList";
  static readonly TokenExpiration = "TokenExpiration";
  static readonly RefreshToken = "RefreshToken";
  static readonly CurrentUserName = "CurrentUserName";
  static readonly ClientId = "ClientId";
  static readonly HotelId = "HotelId";
  static readonly ClientIpAddress = "ClientIpAddress";
  static readonly SystemDate = "SystemDate";
  static readonly FocusPosition = "FocusPosition";
  static readonly CheckingCheckoutSetting = "CheckingCheckoutSetting";
  static readonly PrintSetting = "PrintSetting";
  static readonly TimedOut = "TimedOut";
  static readonly PaginationSetting = "PaginationSetting";
  static readonly SystemSetting = "SystemSetting";
  static readonly MandatoryFields = "MandatoryFields";
  static readonly BaseCurrency = "BaseCurrency";
}
