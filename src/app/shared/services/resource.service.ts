import { Injectable } from "@angular/core";
import { get } from "jquery";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class ResourceService {
  constructor() {}

  public rptHotsUrl: string = environment.rptURL;
  public appHostURL: string = environment.appURL;

  private Common = "/common";
  private SecurityService = "/authentication";
  private System = "/system";
  private Amenity = "/amenities";
  private RoomType = "/roomTypes";
  private BedType = "/bedType";
  private RoomCategory = "/roomCategories";
  private Tax = "/tax";
  private Room = "/rooms";
  private RoomStatus = "/roomstatus";
  private RoomOwner = "/roomOwner";
  private Title = "/title";
  private Currency = "/currency";
  private PaymentMode = "/paymentModes";
  private CardType = "/cardTypes";
  private ExtraCharge = "/extraCharge";
  private Discount = "/discount";
  private IdentityType = "/identityType";
  private TransportationMode = "/transportMode";
  private PayOut = "/payOuts";
  private ReservationType = "/reservationTypes";
  private VipStatus = "/vipStatus";
  private MealType = "/mealType";
  private EmailTemplateCategory = "/templateCategory";
  private EmailTemplate = "/templates";
  private EmailAccount = "/emailAccounts";
  private PreferenceType = "/preferenceType";
  private Preference = "/preference";
  private Reason = "/reason";
  private ReasonCategory = "/reasonCategory";
  private Holiday = "/holiday";
  private MarketingSource = "/marketingSources";
  private ReviewType = "/reviewTypes";
  private GuestCategory = "/guestCategory";
  private BusinessSource = "/businessSources";
  private User = "/user";
  private UserLevel = "/userLevel";
  private Privileges = "/privilege";
  private Menu = "/menu";
  private NonRentalUnit = "/nonRentalUnit";
  private HouseKeepingStatus = "/houseKeepingStatus";
  private HouseKeepingRemark = "/houseKeepingRemarks";
  private RateType = "/rateType";
  private Season = "/season";
  private RoomRate = "/roomRates";
  private Country = "/country";
  private Booking = "/booking";
  private BookingRemark = "/bookingRemarks";
  private Message = "/bookingMessage";
  private Task = "/bookingTask";
  private BookingPreferences = "/bookingPreference";
  private Calender = "/calenderBooking";
  private TransactionTax = "/transactiontax";
  private RoomMove = "/roomMove";
  private AmendStay = "/amendStay";
  private Payment = "/payment";
  private Guest = "/guests";
  private Nationality = "/nationality";
  private City = "/city";
  private BillingInstructions = "/billingInstructions";
  private CityLedger = "/CityLedger";
  private CheckingCheckoutSetting = "/reservationSettings";
  private AuditTrail = "/auditTrial";
  private PrintOptionSetting = "/printSetting";
  private Expense = "/expenses";
  private nightaudit = "/nightaudit";
  private Hotel = "/hotel";
  private MaintenanceBlock = "/maintenanceblock";
  private WorkOrder = "/workorder";
  private ReportParams = "/reportParams";
  private Pos = "/pos";
  private TimeZone = "/timeZones";
  private PMSSystemSettings = "/pmsSystemSettings";
  private PrintTemplate = "/printtemplate";
  private FieldValidationDatas = "/fieldValidationDatas";
  private Notice = "/notices";
  private Formula = "/formula";
  private Pagination = "/paginationSetting";
  private DocumentNumbering = "/numberingSystems";
  private Report = "/report";
  private UploadFIle = "/fileupload";
  private LostFound = "/lostFound";
  private ServiceCharge = "/serviceCharge";
  private EmailSetting = "/emailSetting";

  auth = {
    signIn: this.SecurityService,
    refreshToken: this.SecurityService,
  };

  common = {
    getVersionNo: this.Common + "/GetSystemInformation",
    getImageTypes: this.Common + "/GetAllImageTypes",
    getBusinessSourceCategories: this.Common + "/GetAllBusinessCategory",
    getCommissionPlans: this.Common + "/GetAllComisionPlan",
    getTaskDepartmentTypes: this.Common + "/GetAllTaskDepartmentType",
    getTaskAlertPoints: this.Common + "/GetAllAlertPoints",
    getAllChargeTypes: this.Common + "/GetAllFolioChargeTypes",
    getFolioRoomCharges: this.Common + "/GetChargeByTypeId",
    getAllDiscountRules: this.Common + "/GetAllDiscountRule",
    getAllPostingRules: this.Common + "/GetAllPostingRule",
    getAllChargingRule: this.Common + "/GetAllChargingRule",
    getPaginationSize: this.Common + "/GetAllSystemDefinePagination",
  };

  system = {
    getSystemWorkingDate: this.System + "/GetSystemWorkingDate",
  };

  amenity = {
    getAllAmenities: this.Amenity + "/GetAll",
    searchByParams: this.Amenity + "/SearchByParams",
    saveAmenity: this.Amenity,
    updateAmenity: this.Amenity,
    deleteAmenity: this.Amenity,
    getAmenityById: this.Amenity,
    getAmenityByTypeId: this.Amenity + "/GetByTypeId",
    activeInactiveAmenity: this.Amenity,
    deleteMultiple: this.Amenity,
  };

  roomType = {
    getAllRoomTypes: this.RoomType + "/GetAll",
    searchRoomTypesByName: this.RoomType + "/SearchByName",
    deleteRoomType: this.RoomType,
    sortRoomType: this.RoomType + "/SortRoomType",
    getRoomTypeByCategoryId: this.RoomType + "/GetByCategory",
    saveRoomType: this.RoomType,
    getRoomTypeById: this.RoomType,
    updateRoomType: this.RoomType,
    activeInactiveRoomType: this.RoomType,
    deleteMultiple: this.RoomType,
  };

  bedType = {
    getAllBedTypes: this.BedType + "/GetAll",
    searchBedTypesByName: this.BedType + "/SearchByName",
    saveBedType: this.BedType,
    updateBedType: this.BedType,
    deleteBedType: this.BedType,
    getBedTypeById: this.BedType,
    activeInactiveBedType: this.BedType,
    deleteMultiple: this.BedType,
  };

  roomCategory = {
    getAllRoomCategories: this.RoomCategory + "/GetAll",
  };

  tax = {
    getAllTaxes: this.Tax + "/GetAll",
    searchTaxesByName: this.Tax + "/SearchByName",
    saveTax: this.Tax + "/Save",
    updateTax: this.Tax,
    deleteTax: this.Tax,
    getTaxById: this.Tax,
    activeInactiveTax: this.Tax,
    deleteMultiple: this.Tax,
  };

  room = {
    getAllRooms: this.Room + "/GetAll",
    deleteRoom: this.Room + "/Delete",
    getRoomByRoomType: this.Room + "/RoomType",
    sortRoom: this.Room + "/SortRooms",
    getAvailableRoom: this.Room + "/Available",
    updateHouseStatus: this.Room + "/UpdateHouseStatus",
    updateHouseStatusList: this.Room + "/UpdateHouseStatusList",
    getAllRoomsForHouseStatus: this.Room + "/GetAllRoomsForHouseStatus",
    searchByParams: this.Room + "/SearchByParams",
    activeInactiveRoom: this.Room,
    deleteMultiple: this.Room,
    saveRoom: this.Room + "/Save",
    updateRoom: this.Room + "/Update",
    getRoomViewData: this.Room + "/GetRoomViewData",
    updatePositions: this.Room + "/UpdatePositions",
  };

  roomStatus = {
    getAllStatus: this.RoomStatus + "/GetAll",
    updateStatus: this.RoomStatus + "/Update",
    getStatusById: this.RoomStatus + "/GetById",
    getAllStatusForStayView: this.RoomStatus + "/GetStatusColorForStayview",
    activeInactiveStatus: this.RoomStatus,
    searchByName: this.RoomStatus + "/SearchByName",
  };

  roomOwner = {
    getAllRoomOwners: this.RoomOwner + "/GetAll",
    searchRoomOwnersByName: this.RoomOwner + "/SearchByName",
    deleteRoomOwner: this.RoomOwner + "/delete",
    getRoomOwnerById: this.RoomOwner,
    saveRoomOwner: this.RoomOwner + "/Save",
    updateRoomOwner: this.RoomOwner + "/Update",
    activeInactiveRoomOwner: this.RoomOwner,
    deleteMultiple: this.RoomOwner,
  };

  title = {
    getAllTitles: this.Title + "/GetAll",
    getTitleById: this.Title + "/GetById",
  };

  currency = {
    getAllCurrencies: this.Currency + "/GetAll",
    searchCurrencyByName: this.Currency + "/SearchByName",
    getBaseCurrency: this.Currency + "/Base",
    updateCurrency: this.Currency + "/Update",
    activeInactiveCurrency: this.Currency,
    getCurrencyById: this.Currency + "/GetById",
    updateAll: this.Currency + "/UpdateAll",
  };

  paymentMode = {
    getAllPaymentMethods: this.PaymentMode + "/GetAll",
    searchPaymentMethodByName: this.PaymentMode + "/SearchByName",
    savePaymentMethod: this.PaymentMode,
    deletePaymentMethod: this.PaymentMode,
    updatePaymentMethod: this.PaymentMode,
    getPaymentMethodById: this.PaymentMode,
    getPaymentMethodByParems: this.PaymentMode + "/GetByParems",
    activeInactivePaymentMethod: this.PaymentMode,
    deleteMultiple: this.PaymentMode,
  };

  cardType = {
    getAllCardTypes: this.CardType + "/GetAll",
    searchCardTypeByName: this.CardType + "/SearchByName",
    saveCardType: this.CardType,
    deleteCardType: this.CardType,
    updateCardType: this.CardType,
    getCardTypeById: this.CardType,
    activeInactiveCardType: this.CardType,
    deleteMultiple: this.CardType,
  };

  extraCharge = {
    saveExtraCharge: this.ExtraCharge,
    getAllExtraCharges: this.ExtraCharge + "/GetAll",
    searchExtraChargesByName: this.ExtraCharge + "/SearchByName",
    deleteExtraCharge: this.ExtraCharge,
    getActiveExtraCharges: this.ExtraCharge + "/GetActiveExtraCharges",
    getById: this.ExtraCharge,
    updateExtraCharge: this.ExtraCharge,
    activeInactiveExtraCharge: this.ExtraCharge,
    deleteMultiple: this.ExtraCharge,
  };

  discount = {
    getAllDiscounts: this.Discount + "/GetAll",
    searchDiscountsByName: this.Discount + "/SearchByName",
    deleteDiscount: this.Discount,
    saveDiscount: this.Discount + "/Save",
    updateDiscount: this.Discount,
    getDiscountById: this.Discount,
    getDiscountByOperation: this.Discount + "/getByOperation",
    activeInactiveDiscount: this.Discount,
    deleteMultiple: this.Discount,
  };

  identityType = {
    getAllIdentityTypes: this.IdentityType + "/GetAll",
    searchIdentityTypeByName: this.IdentityType + "/SearchByName",
    saveIdentityType: this.IdentityType + "/Save",
    deleteIdentityType: this.IdentityType,
    updateIdentityType: this.IdentityType,
    getIdentityTypeById: this.IdentityType,
    activeInactiveIdentityType: this.IdentityType,
    deleteMultiple: this.IdentityType,
  };

  transportationMode = {
    getAllTransportationModes: this.TransportationMode + "/GetAll",
    searchTransportationModeByName: this.TransportationMode + "/SearchByName",
    saveTransportationMode: this.TransportationMode,
    deleteTransportationMode: this.TransportationMode,
    updateTransportationMode: this.TransportationMode,
    getTransportationModeById: this.TransportationMode,
    activeInactiveTransportationMode: this.TransportationMode,
    deleteMultiple: this.TransportationMode,
  };

  payOut = {
    getAllPayOuts: this.PayOut + "/GetAll",
    searchPayOutByName: this.PayOut + "/SearchByName",
    savePayOut: this.PayOut + "/Save",
    deletePayOut: this.PayOut + "/Delete",
    updatePayOut: this.PayOut + "/Update",
    getPayOutById: this.PayOut,
    activeInactivePayOut: this.PayOut,
    deleteMultiple: this.PayOut,
  };

  reservationType = {
    getAllReservationTypes: this.ReservationType + "/GetAll",
    searchReservationTypeByName: this.ReservationType + "/SearchByName",
    saveReservationType: this.ReservationType + "/Save",
    deleteReservationType: this.ReservationType + "/Delete",
    updateReservationType: this.ReservationType + "/Update",
    getReservationTypeById: this.ReservationType,
    activeInactiveReservationType: this.ReservationType,
    deleteMultiple: this.ReservationType,
  };

  vipStatus = {
    getAllVipStatus: this.VipStatus + "/GetAll",
    searchVipStatusByName: this.VipStatus + "/SearchByName",
    saveVipStatus: this.VipStatus,
    deleteVipStatus: this.VipStatus,
    updateVipStatus: this.VipStatus,
    getVipStatusById: this.VipStatus,
    activeInactiveVipStatus: this.VipStatus,
    deleteMultiple: this.VipStatus,
  };

  mealType = {
    getAllMealTypes: this.MealType + "/GetAll",
    saveMealType: this.MealType,
    deleteMealType: this.MealType,
    updateMealType: this.MealType + "/Update",
    getMealTypeById: this.MealType,
  };

  templateCategory = {
    getAllTemplateCategories: this.EmailTemplateCategory + "/GetAll",
    saveTemplateCategory: this.EmailTemplateCategory,
    deleteTemplateCategory: this.EmailTemplateCategory,
    updateTemplateCategory: this.EmailTemplateCategory,
    getTemplateCategoryById: this.EmailTemplateCategory,
    searchTemplateCategoryByName: this.EmailTemplateCategory + "/SearchByName",
    activeInactiveTemplateCategory: this.EmailTemplateCategory,
    deleteMultiple: this.EmailTemplateCategory,
  };

  emailTemplate = {
    getAllEmailTemplates: this.EmailTemplate + "/GetAll",
    saveEmailTemplate: this.EmailTemplate,
    deleteEmailTemplate: this.EmailTemplate,
    updateEmailTemplate: this.EmailTemplate,
    getEmailTemplateById: this.EmailTemplate,
    searchEmailTemplateByName: this.EmailTemplate + "/SearchByName",
    activeInactiveEmailTemplate: this.EmailTemplate,
    deleteMultiple: this.EmailTemplate,
    getAllTemplateByCategoryId: this.EmailTemplate + "/GetByCategoryId",
  };

  emailAccount = {
    getAllEmailAccounts: this.EmailAccount + "/GetAll",
    saveEmailAccount: this.EmailAccount + "/Save",
    deleteEmailAccount: this.EmailAccount + "/Delete/",
    updateEmailAccount: this.EmailAccount,
    getEmailAccountById: this.EmailAccount,
    searchEmailAccountByName: this.EmailAccount + "/SearchByName",
    updateEmailAcc: this.EmailAccount + "/Update/",
    activeInactiveEmailAccount: this.EmailAccount,
  };

  preferenceType = {
    getAllPreferenceTypes: this.PreferenceType + "/GetAll",
    savePreferenceType: this.PreferenceType,
    deletePreferenceType: this.PreferenceType,
    updatePreferenceType: this.PreferenceType,
    getPreferenceTypeById: this.PreferenceType,
    searchPreferenceTypeByName: this.PreferenceType + "/SearchByName",
    activeInactivePreferenceType: this.PreferenceType,
    deleteMultiple: this.PreferenceType,
  };

  preference = {
    getAllPreferences: this.Preference + "/GetAll",
    savePreference: this.Preference,
    deletePreference: this.Preference,
    updatePreference: this.Preference,
    getPreferenceById: this.Preference,
    searchPreferenceByName: this.Preference + "/SearchByName",
    getPreferenceByTypeId: this.Preference + "/GetByTypeId",
    activeInactivePreference: this.Preference,
    deleteMultiple: this.Preference,
  };

  reason = {
    getAllReasons: this.Reason + "/GetAll",
    saveReason: this.Reason,
    deleteReason: this.Reason,
    updateReason: this.Reason,
    getReasonById: this.Reason,
    searchReasonByName: this.Reason + "/SearchByName",
    getByCategoryId: this.Reason + "/GetByCategory",
    activeInactiveReason: this.Reason,
    deleteMultiple: this.Reason,
  };

  reasonCategory = {
    getAllReasonCategories: this.ReasonCategory + "/GetAll",
    saveReasonCategory: this.ReasonCategory,
    deleteReasonCategory: this.ReasonCategory,
    updateReasonCategory: this.ReasonCategory,
    getReasonCategoryById: this.ReasonCategory,
    searchReasonCategoryByName: this.ReasonCategory + "/SearchByName",
    activeInactiveReasonCategory: this.ReasonCategory,
    deleteMultiple: this.ReasonCategory,
  };

  holiday = {
    getAllHolidays: this.Holiday + "/GetAll",
    saveHoliday: this.Holiday,
    deleteHoliday: this.Holiday,
    updateHoliday: this.Holiday,
    getHolidayById: this.Holiday,
    searchHolidayByName: this.Holiday + "/SearchByName",
    activeInactiveHoliday: this.Holiday,
    deleteMultiple: this.Holiday,
  };

  marketingSource = {
    getAllMarketingSources: this.MarketingSource + "/GetAll",
    saveMarketingSource: this.MarketingSource + "/Save",
    deleteMarketingSource: this.MarketingSource + "/Delete",
    updateMarketingSource: this.MarketingSource + "/Update",
    getMarketingSourceById: this.MarketingSource,
    searchMarketingSourceByName: this.MarketingSource + "/SearchByName",
    activeInactiveMarketingSource: this.MarketingSource,
    deleteMultiple: this.MarketingSource,
  };

  reviewType = {
    getAllReviewTypes: this.ReviewType + "/GetAll",
    saveReviewType: this.ReviewType + "/Save",
    deleteReviewType: this.ReviewType + "/Delete",
    updateReviewType: this.ReviewType + "/Update",
    getReviewTypeById: this.ReviewType,
    searchReviewTypeByName: this.ReviewType + "/SearchByName",
    activeInactiveReviewType: this.ReviewType,
    deleteMultiple: this.ReviewType,
  };

  guestCategory = {
    getAllGuestCategories: this.GuestCategory + "/GetAll",
    saveGuestCategory: this.GuestCategory,
    deleteGuestCategory: this.GuestCategory,
    updateGuestCategory: this.GuestCategory,
    getGuestCategoryById: this.GuestCategory,
    searchGuestCategoryByName: this.GuestCategory + "/SearchByName",
    activeInactiveGuestCategory: this.GuestCategory,
    deleteMultiple: this.GuestCategory,
  };

  businessSource = {
    getAllBusinessSources: this.BusinessSource + "/GetAll",
    saveBusinessSource: this.BusinessSource + "/Save",
    deleteBusinessSource: this.BusinessSource + "/Delete",
    updateBusinessSource: this.BusinessSource + "/Update",
    getBusinessSourceById: this.BusinessSource + "/GetById",
    searchBusinessSourceByName: this.BusinessSource + "/SearchByName",
    searchTravelAgentAdvance: this.BusinessSource + "/advanceSearchTravelAgent",
    getRateSources: this.BusinessSource + "/getratesource",
    getBusinessSourceByCategory: this.BusinessSource + "/GetByCategoryId",
    getByCategoryId: this.BusinessSource + "/GetByCategoryId/",
    activeInactiveBusinessSource: this.BusinessSource,
    deleteMultiple: this.BusinessSource,
    getOnAction: this.BusinessSource + "/GetOnAction",
  };

  user = {
    getAllUsers: this.User + "/GetAll",
    saveUser: this.User + "/Save",
    deleteUser: this.User + "/Delete",
    updateUser: this.User + "/Update",
    getUserById: this.User + "/GetById",
    searchUserByName: this.User + "/Search",
    resetPassword: this.User + "/passwordReset",
    checkPrivilege: this.User + "/CheckPrivilage",
    changePassword: this.User + "/ChangePassword",
    getAllHouseKeeper: this.User + "/GetHouseKeepers",
    getAllUsersWithSuperUser: this.User + "/GetAllUserWithSuperAdmin",
    activeInactiveUser: this.User,
    deleteMultiple: this.User,
  };

  userLevel = {
    getAllUserLevels: this.UserLevel + "/GetAll",
    saveUserLevel: this.UserLevel + "/Save",
    deleteUserLevel: this.UserLevel + "/Delete",
    updateUserLevel: this.UserLevel + "/Update",
    getUserLevelById: this.UserLevel + "/GetById",
    searchUserLevelByName: this.UserLevel + "/SearchByName",
    activeInactiveUserLevel: this.UserLevel,
    deleteMultiple: this.UserLevel,
  };

  menu = {
    getAllMenus: this.Menu + "/GetAll",
  };

  privilege = {
    getAllPrivileges: this.Privileges + "/GetAll",
  };

  nonRentalUnit = {
    getAllNonRentalUnits: this.NonRentalUnit + "/GetAll",
    saveNonRentalUnit: this.NonRentalUnit + "/Save",
    deleteNonRentalUnit: this.NonRentalUnit + "/Delete",
    updateNonRentalUnit: this.NonRentalUnit + "/Update",
    getNonRentalUnitById: this.NonRentalUnit + "/GetById",
    searchNonRentalUnitByName: this.NonRentalUnit + "/SearchByName",
    activeInactiveNonRentalUnit: this.NonRentalUnit,
    deleteMultiple: this.NonRentalUnit,
  };

  houseKeepingStatus = {
    getAllRoomsForHouseStatus: "/rooms/GetAllRoomsForHouseStatus",
    getAllHouseKeepingStatus: this.HouseKeepingStatus + "/GetAll",
    saveHouseKeepingStatus: this.HouseKeepingStatus + "/Save",
    deleteHouseKeepingStatus: this.HouseKeepingStatus,
    updateHouseKeepingStatus: this.HouseKeepingStatus + "/Update",
    getHouseKeepingStatusById: this.HouseKeepingStatus + "/GetById",
    searchHouseKeepingStatusByName: this.HouseKeepingStatus + "/SearchByName",
    activeInactiveHouseKeepingStatus: this.HouseKeepingStatus,
    deleteMultiple: this.HouseKeepingStatus,
  };

  houseKeepingRemark = {
    getAllHouseKeepingRemarks: this.HouseKeepingRemark + "/GetAll",
    saveHouseKeepingRemark: this.HouseKeepingRemark,
    deleteHouseKeepingRemark: this.HouseKeepingRemark,
    updateHouseKeepingRemark: this.HouseKeepingRemark,
    getHouseKeepingRemarkById: this.HouseKeepingRemark,
    searchHouseKeepingRemarkByName: this.HouseKeepingRemark + "/SearchByName",
    activeInactiveHouseKeepingRemark: this.HouseKeepingRemark,
    deleteMultiple: this.HouseKeepingRemark,
  };

  rateType = {
    getAllRateTypes: this.RateType + "/GetAll",
    getOneRateType: this.RateType + "/GetById",
    sortRateTypes: this.RateType + "/SortRateType",
    searchRateTypeByName: this.RateType + "/SearchByName",
    saveRateType: this.RateType + "/Save",
    deleteRateType: this.RateType + "/Delete",
    updateRateType: this.RateType + "/Update",
    getRateTypeById: this.RateType + "/GetById",
    getRateTypeForRoomType: this.RateType + "/GetRateTypeForRoomType",
    activeInactiveRateType: this.RateType,
    deleteMultiple: this.RateType,
  };

  season = {
    getAllSeasons: this.Season + "/GetAll",
    saveSeason: this.Season + "/Save",
    deleteSeason: this.Season + "/Delete",
    updateSeason: this.Season + "/Update",
    getSeasonById: this.Season + "/GetById",
    searchSeasonByName: this.Season + "/SearchByName",
    activeInactiveSeason: this.Season,
    deleteMultiple: this.Season,
  };

  roomRate = {
    getAllRoomRates: this.RoomRate + "/GetAll",
    saveRoomRate: this.RoomRate + "/Save",
    deleteRoomRate: this.RoomRate + "/Delete",
    updateRoomRate: this.RoomRate + "/Update",
    getRoomRateById: this.RoomRate + "/GetById",
    searchRoomRateByName: this.RoomRate + "/SearchByName",
    updateStopSales: this.RoomRate + "/UpdateStopSale",
    UpdateAllRoomRate: this.RoomRate + "/Save",
  };

  country = {
    getAllCountries: this.Country + "/GetAll",
    saveCountry: this.Country + "/Save",
    getCountryById: this.Country + "/GetById",
  };

  booking = {
    getPaginatedBookingHistory: this.Booking + "/GetPaginatedBookingHistory",
    getReservationList: this.Booking + "/GetReservationList",
    makeGroup: this.Booking + "/makegroup",
    getBookingByBookingRoomId: this.Booking + "/GetByBookingRoomId",
    getFolioDetails: this.Booking + "/getfolios",
    updateBooking: this.Booking + "/updateBooking",
    roomMove: this.RoomMove,
    guestChecking: this.Booking + "/checkIn",
    addmultipleChecking: this.Booking + "/multipleCheckIn",
    undoCheckout: this.Booking + "/undoCheckOut",
    amendStay: this.AmendStay,
    getExistLateCheckOutCharge: this.Booking + "/getExistLateCheckOutCharge",
    bookingByDateRoomRoomType: this.Booking + "/bookingByDateRoomRoomType",
    saveFolioCharge: this.Booking + "/SaveFolioCharge",
    getCheckout: this.Booking + "/checkOut",
    createBooking: this.Booking + "/save",
    getUnsettledFolioList: this.Booking + "/GetUnsettledFolioList",
    getFoliosByBookingId: this.Booking + "/getFoliosByBookingId",
    addBookingGuest: this.Guest + "/AddBookingGuest",
    updateOtherInformation: this.Booking + "/otherInformation",
    addBookingSharer: this.Guest + "/AddBookingSharer",
    updateBookingShearer: this.Guest + "/UpdateBookingSharer",
    getRateInfo: this.Booking + "/rateInformation",
    billingInformation: this.Booking + "/billingInformation",
    getFolioCharges: this.Booking + "/GetFolioChargeByFolioId",
    voidFolio: this.Booking + "/VoidFolio",
    getBookingTaxByFolioChargeId: this.Booking + "/GetFolioChargeTaxes",
    guestFolioSearch: this.Booking + "/GuestFolioSearch",
    updateBillTo: this.Booking + "/UpdateBillTo",
    getBookingSharer: this.Booking + "/GetBookingRoomSharers",
    createFolio: this.Booking + "/NewFolio",
    getFolioChargesAdvance: this.Booking + "/GetFolioChargeAdvanceSearch",
    splitFolio: this.Booking + "/SplitFolio",
    getChargeListByBookingRoomId:
      this.Booking + "/getChargeListByBookingRoomId",
    assignNewTax: this.Booking + "/assignNewTax",
    getGroupBookings: this.Booking + "/GetGroupBookings",
    getById: this.Booking + "/GetById",
    addBookingFolioLineDiscount: this.Booking + "/addLineDiscount",
    searchBookingForDateRange: this.Booking + "/SearchRoomBookingForDateRange",
    saveInclusion: this.Booking + "/SaveInclusion",
    getInclusionsByBookingRoomId: this.Booking + "/inclusion/roomBooking",
    getInclusionsByBookingId: this.Booking + "/inclusion/booking",
    getAllLockReservations: this.Booking + "/GetAllLockReservations",
    checkReservationIsLock: this.Booking + "/CheckReservationIsLock",
    lockReservation: this.Booking + "/lock",
    addBookingFolioFullDiscount: this.Booking + "/addDiscount",
  };

  calender = {
    getCalenderDetailsByDate: this.Calender + "/GetBookingDetailsByDate",
    getQuickOverview: this.Calender + "/GetQuickOverview",
  };

  bookingRemark = {
    getAllBookingRemark: this.BookingRemark + "/GetAll",
    saveBookingRemark: this.BookingRemark + "/Save",
    saveBookingRemarkForGroup: this.BookingRemark + "/GroupSave",
    deleteBookingRemark: this.BookingRemark,
    getAllByBookingRoomId: this.BookingRemark + "/GetAllByBookingId",
    saveGroupBooking: this.BookingRemark + "/GroupSave",
  };

  bookingMessage = {
    getAllMessage: this.Message + "/GetAll",
    getMessage: this.Message + "/GetById",
    saveMessage: this.Message + "/Save",
    updateMessage: this.Message,
    deleteMessage: this.Message,
    pendingMsgCount: this.Message + "/GetCount",
    GetCountForBookingId: this.Message + "/GetCountForBookingId",
  };

  bookingTask = {
    getAllTask: this.Task + "/GetAll",
    getTask: this.Task + "/GetById",
    saveTask: this.Task + "/Save",
    pendingTaskCount: this.Task + "/GetCount",
    GetCountForBookingId: this.Task + "/GetCountForBookingId",
    updateTask: this.Task,
    deleteTask: this.Task,
  };

  bookingPreferences = {
    getAllBookingPreferences: this.BookingPreferences + "/GetAll",
    getBookingPreferences: this.BookingPreferences + "/GetById",
    saveBookingPreferences: this.BookingPreferences + "/Save",
    pendingBookingPreferencesCount: this.BookingPreferences + "/GetCount",
    GetCountByBookingId: this.BookingPreferences + "/GetCountByBookingId",
    updateBookingPreferences: this.BookingPreferences,
    deleteBookingPreferences: this.BookingPreferences,
  };

  transactionTax = {
    updateAllTransactionTax: this.TransactionTax + "/UpdateAll",
    getAllTransactionTax: this.TransactionTax + "/GetAll",
    getActiveTaxesByTypeId: this.TransactionTax + "/GetActiveTaxesByTypeId",
  };

  payments = {
    getFolioPayments: this.Payment + "/GetFolioPayments",
    saveFolioPayments: this.Payment + "/save",
    UpdateFolioTarrif: this.Booking + "/hideTarrif",
    voidPayments: this.Payment + "/VoidPayment",
    CityLedgerPayments: this.Payment + "/CityLedgerPayments",
    settleCityLedger: this.Payment + "/SettleCityLedger",
    AvailableBalance: this.Payment + "/AvailableBalance",
    getTotalBalanceByBookingRoomId:
      this.Payment + "/GetTotalBalanceByBookingRoomId",
  };

  guest = {
    getGuestByName: this.Guest + "/SearchByName",
    getAllGuest: this.Guest + "/GetAll",
    guestSearchByParam: this.Guest + "/GuestSearchByParem",
    getBookingDetails: this.Guest + "/SearchBookingByGuestID",
    getPreviousBookingDetails: this.Guest + "/SearchBookingRoomByGuestID",
    addBookingGuest: this.Guest + "/AddBookingGuest",
    addBookingShear: this.Guest + "/AddBookingSharer",
    updateBookingShear: this.Guest + "/UpdateBookingSharer",
    saveGuest: this.Guest + "/Save",
    updateGuest: this.Guest + "/Update",
    deleteGuest: this.Guest + "/delete",
    advanceSearchGuest: this.Guest + "/AdvanceSearch",
    deleteMultiple: this.Guest,
    addMultipleShares: this.Guest + "/AddMultipleBookingSharers",
  };

  nationality = {
    getAllNationalities: this.Nationality + "/GetAll",
  };

  city = {
    getAllCities: this.City + "/GetAll",
    saveCity: this.City + "/Save",
  };

  Billing = {
    getBillingInstructions: this.BillingInstructions,
  };

  cityLedger = {
    getAllCityLedgers: this.CityLedger + "/GetAll",
    searchByName: this.CityLedger + "/Search",
    saveCityLedger: this.CityLedger + "/Save",
    getCityLedgerById: this.CityLedger,
    updateCiyLedger: this.CityLedger + "/Update",
    deleteCityLedger: this.CityLedger + "/Delete",
    deleteMultiple: this.CityLedger,
    activeInactive: this.CityLedger,
  };

  setting = {
    checkingCheckoutSetting: {
      getAllCheckingCheckoutSetting: this.CheckingCheckoutSetting,
      updateAllCheckingCheckoutSetting:
        this.CheckingCheckoutSetting + "/Update",
      getAllReservationSettings: "/reservationSettings",
    },
    getAllSystemSettings: this.PMSSystemSettings,
    updatePMSSystemSettings: this.PMSSystemSettings + "/Update",
  };

  auditTrail = {
    readAll: this.AuditTrail + "/getAuditTrial",
    getMaintenanceBlockAudit: this.AuditTrail + "/getMaintenanceBlockAudit",
    getGuestAudit: this.AuditTrail + "/guestAudit",
    getNightAudit: this.AuditTrail + "/nightAudit",
    getLostFoundAudit: this.AuditTrail + "/lostFound",
    getReportAudit: this.AuditTrail + "/reportAudit",
  };

  printOptionSetting = {
    getPrintOptionSetting: this.PrintOptionSetting + "/GetAll",
    updatePrintOptionSetting: this.PrintOptionSetting + "/Update",
  };

  quickView = {
    getQuickOverview: this.Calender + "/GetQuickOverview",
  };

  exchangeVoucher = {
    getAllExpenses: this.Expense + "/GetAllExpenses",
    saveExpenseVoucher: this.Expense + "/SaveExpense",
    searchExpenseVoucher: this.Expense + "/SearchExpenses",
    getExpenseVoucherById: this.Expense + "/GetExpenseById",
    deleteExpenseVoucher: this.Expense,
  };

  nightAudit = {
    getPendingReservations: this.nightaudit + "/GetPendingReservation",
    getPendingReleasedReservations:
      this.nightaudit + "/GetPendingReleaseReservation",
    getRoomWithStatus: this.nightaudit + "/GetRoomStatusList",
    getUnsettledFolios: this.nightaudit + "/UnsettledFolios",
    getnightlyCharges: this.nightaudit + "/NightlyCharges",
    createNewDay: this.nightaudit + "/createnewday",
    postInnightAudit: this.nightaudit + "/post",
    changeReleaseDate: this.nightaudit + "/releaseDate",
    isNightAuditCanBeDone: this.nightaudit + "/nightAuditCanBeDone",
  };

  groupReservation = {
    groupreservationView: {
      getGroupBookings: this.Booking + "/GetGroupBookings",
    },
  };

  hotel = {
    getHotelDetails: this.Hotel,
    updateHotelinfo: this.Hotel + "/",
  };

  maintenanceBlock = {
    saveMaintenanceBlock: this.MaintenanceBlock + "/save",
    getAllMaintenanceBlock: this.MaintenanceBlock + "/GetAll",
    getNextReservation: this.MaintenanceBlock + "/GetNextReservation",
    updateMaintenanceBlock: this.MaintenanceBlock + "/Update",
    unblockDateRange: this.MaintenanceBlock + "/UnblockDateRange",
    unblockRoom: this.MaintenanceBlock + "/Unblock",
    unblockAll: this.MaintenanceBlock + "/UnblockAll",
    getMaintenanceBlockById: this.MaintenanceBlock + "/GetById",
  };

  workOrder = {
    getWorkOrderList: this.WorkOrder + "/GetAll",
    searchWorkOrderList: this.WorkOrder + "/Search",
    createWorkOrder: this.WorkOrder + "/save",
    updateWorkOrder: this.WorkOrder + "/Update",
    postNote: this.WorkOrder + "/PostNote",
  };

  report = {
    getAllReport: this.Report + "/GetAll",
    getOneReport: this.Report + "/GetById",
    saveReportGenerationAuditLog: this.Report + "/SaveAuditLog",
  };

  reportParams = {
    getTravelAgents: this.ReportParams + "/GetTravalAgent",
    getCompany: this.ReportParams + "/GetCompany",
    getCityLedger: this.ReportParams + "/GetCityLedger",
    getPaymentMethod: this.ReportParams + "/GetPaymentMethod",
    getRoom: this.ReportParams + "/GetRoom",
    getWorkingCategory: this.ReportParams + "/GetWorkOrderCategory",
    getRevenueType: this.ReportParams + "/GetRevenueType",
    getWellKnownPriority: this.ReportParams + "/GetWellKnownPriority",
    getOperations: this.ReportParams + "/GetOperation",
    getWorkOrderStatus: this.ReportParams + "/GetWorkOrderStatus",
    getTaskFor: this.ReportParams + "/GetTaskFor",
    getAlertType: this.ReportParams + "/GetAlertType",
    getTaskStatus: this.ReportParams + "/GetTaskStatus",
    getSeasons: this.ReportParams + "/GetSeason",
    getWorkOrderUnit: this.ReportParams + "/GetWorkOrderUnit",
    getWorkOrderPriority: this.ReportParams + "/GetWellKnownPriority",
    getWorkOrderCategory: this.ReportParams + "/GetWorkOrderCategory",
    getRoomSaleSortBy: this.ReportParams + "/GetRoomSaleSortBy",
    getStatisticalBy: this.ReportParams + "/GetStatisticalBy",
    getCountryBy: this.ReportParams + "/GetCountryBy",
    getPaymentFor: this.ReportParams + "/GetPaymentFor",
  };

  pos = {
    saveTransaction: this.Pos + "/SaveTransaction",
    getTransaction: this.Pos,
    updateTransaction: this.Pos + "/UpdateTransaction",
  };

  timeZones = {
    getAlltimeZones: this.TimeZone + "/GetAll",
  };

  pmsSystemSettings = {
    getAllPMSSystemSettings: this.PMSSystemSettings,
    updatePMSSystemSettings: this.PMSSystemSettings,
  };

  printTemplate = {
    getPrintTemplate: this.PrintTemplate + "/GetAll",
  };

  checkinReservationSettings = {
    getAllFieldValidationDatas: this.FieldValidationDatas + "/GetAll",
    updateFieldValidationData: this.FieldValidationDatas + "/Update",
    getMandatoryFields: this.FieldValidationDatas + "/GetAllMandatoryFeilds",
  };

  notices = {
    getAllNotice: this.Notice + "/GetAll",
    getNotice: this.Notice + "/GetById",
    saveNotice: this.Notice + "/Save",
    updateNotice: this.Notice + "/Update",
    updateAllNotice: this.Notice + "/UpdateAll",
    deleteNotice: this.Notice + "/Delete",
  };

  formula = {
    getAllFormula: this.Formula + "/GetAll",
    updateAllFormula: this.Formula + "/Update",
  };

  paginationSetting = {
    getPaginationSetting: this.Pagination + "/GetAll",
    updatePaginationSetting: this.Pagination + "/Update",
  };

  documentNumbering = {
    getAllDocumentNumbering: this.DocumentNumbering,
    updateDocumentNumbering: this.DocumentNumbering + "/Update",
  };

  uploadFile = {
    uploadFile: this.UploadFIle + "/Upload",
    uploadFileBR: this.UploadFIle + "/bookingRoom",
    GetFilesByParam: this.UploadFIle + "/GetFilesByParem",
    deleteFile: this.UploadFIle,
  };

  lostFound = {
    saveLostFound: this.LostFound,
    searchLostFound: this.LostFound + "/AdvanceSearch",
    getById: this.LostFound,
    updateLostFound: this.LostFound,
    voidLostFound: this.LostFound,
  };

  serviceCharge = {
    getServiceCharge: this.ServiceCharge + "/GetServiceCharge",
    updateServiceCharge: this.ServiceCharge,
  };

  emailSetting = {
    getEmailOptionSetting: this.EmailSetting + "/GetAll",
    updateEmailOptionSetting: this.EmailSetting + "/Update",
  };
}
