import { AdminsPrivilegesType } from "@ServiceDomain/iam/dto/enums/user.enum"
const { MoleculerError, MoleculerRetryableError } = require("moleculer").Errors
const logger = require("moleculer").logger
export class YFTErrorMol {

  public statusCode: number
  public code: number;
  private uri: string;
  private meta: any;
  private message: string
  private retryable: boolean;


  constructor(message: string, code: number, statusCode: number, retryable: boolean, meta?: any) {
    this.message = message
    this.code = code
    this.statusCode = statusCode
    this.retryable = retryable
    this.meta = meta;
  }

  public issue(): any {
    let e: any
    if (this.retryable) {
      e = new MoleculerRetryableError(this.message, this.code, this.statusCode, this.meta)
    } else {
      e = new MoleculerError(this.message, this.code, this.statusCode, this.meta)
    }

    console.log('error issued ', Date.now(), this.message, this.meta)

    return JSON.stringify({
      message: this.message,
      code: e.code,
      retryable: e.retryable,
      // data: e.data
    })
  }
}

export class YFTError {
  public errorCode: number
  private uri: string
  private retryable = false;
  public statusCode = 400;
  private meta: any
  message: string
  constructor(message: string, code: number, uri: string, statusCode: number, retryable = false, meta?: any) {
    // super(message || `yft general Error`, code, "YFTError", meta)
    // if (meta && meta instanceof Error) {
    //   this.callLogger(meta);
    //   this.meta = undefined;
    // } else {
    //   this.callLogger();
    // }
  }
  // constructor(
  //   message: string,
  //   code: number,
  //   uri: string,
  //   statusCode: number,
  //   retryable = false,
  //   meta?: any
  // ) {
  //   super(message);
  //   this.errorCode = code;
  //   this.uri = uri;
  //   this.statusCode = statusCode;
  //   this.retryable = retryable;
  //   this.meta = meta;
  //   if (meta && meta instanceof Error) {
  //     this.callLogger(meta);
  //     this.meta = undefined;
  //   } else {
  //     this.callLogger();
  //   }
  // }



  static InternalServerError = (error?: Error): YFTError =>
    new YFTError("Internal Server Error", 0, "", 500, true, error);
  static UnknownInternalServerError = new YFTErrorMol("Unknown Error", 500, -3, true).issue();
  static EncryptionFailure = (): YFTError =>
    new YFTError("Encryption Error", -4, "", 500, false);

  static AccessDenied = new YFTError("Access Denied", -1, "", 401, false);
  static TokenIsValidButAccessToThisEndpointIsDenied = (): YFTError =>
    new YFTError("Access Denied", -1, "", 403, false);
  static TokenExpired = new YFTError("Access Token Expired", -2, "", 401, false);
  // static ServiceNotSupportThisAction = new YFTError("Service Does Not Support This Action", -1, "", 500, false);
  // static ServiceNotSupportThisAction = (serviceName: string, nodeId: string) => new MoleculerError("Service Does Not Support This Action", 501, "-1", { serviceName, nodeId });
  static ServiceNotSupportThisAction = (serviceName: string, nodeId: string) => new YFTErrorMol("Service Does Not Support This Action", 501, -1, false, { serviceName, nodeId }).issue();

  static SessionAccessDenied = (): YFTError => new YFTError("Access Denied", -4, "", 401, false);

  static InvalidRequest = (): YFTError =>
    new YFTError("Invalid Request", -1, "", 400, false);

  static UploaderCannotReadFile = (): YFTError =>
    new YFTError("Invalid File", -1, "", 400, false);

  static TemporaryTokenInvalidOrExpired = (): YFTError =>
    new YFTError("Temporary Token Invalid or Expired", -3, "", 401, false);

  static OnlyInDevMode = (): YFTError =>
    new YFTError("Available Only In Dev Mode", -1, "", 403, false);
  static DuplicatedContent = (): YFTError =>
    new YFTError("Duplicated Content", 1001, "", 404, false);

  static NotFound = (): YFTError =>
    new YFTError("Not Found", 1000, "", 404, false);

  // Authentication :: 200xx
  static SecretStringSigningTimeExpired = (): YFTError =>
    new YFTError("Secret String Signing Time Expired", 10_000, "", 400, false);
  static UserWithThisWalletAlreadyExists = (): YFTError =>
    new YFTError("User already Exists", 10_001, "", 400, false);
  static SignatureIsNotMatchWithThisWallet = (): YFTError =>
    new YFTError("Invalid Signed Message", 10_003, "", 400, false);
  static AuthenticationInvalidWalletAddress = (): YFTError =>
    new YFTError("Invalid Wallet Address", 10_004, "", 400, false);
  static AuthenticationInvalidPassword = (): YFTError =>
    new YFTError("Invalid Password", 20000, "", 401, false);
  static UserNotFound = (): YFTError =>
    new YFTError("No such user", 20001, "", 404, false);
  static AuthenticationInvalidTokenType = (): YFTError =>
    new YFTError("Invalid Token Type", 20002, "", 401, false);
  static AuthenticationInvalidOneTimeToken = (): YFTError =>
    new YFTError("Invalid One Time Token", 20003, "", 401, false);
  static AuthenticationWeakPassword = (): YFTError =>
    new YFTError("Password is not strong enough", 20004, "", 401, false);
  static UserAccessDeniedByAdmin = (): YFTError =>
    new YFTError("Access Denied [Banned]", 20005, "", 401, false);
  static SessionNotFound = (): YFTError =>
    new YFTError("Session is expired", 20006, "", 401, false);

  // User info errors :: 100xx
  static UserInfoEditingNotPermitted = (): YFTError =>
    new YFTError("User Info Editing Not Permitted", 10000, "", 400, false);
  static UserInfoInvalidOrEmptyFirstName = (): YFTError =>
    new YFTError("Invalid or Empty First Name", 10001, "", 400, false);
  static UserInfoInvalidOrEmptyLastName = (): YFTError =>
    new YFTError("Invalid or Empty Last Name", 10002, "", 400, false);
  static UserInfoInvalidOrEmptyNationalId = (): YFTError =>
    new YFTError("Invalid or Empty National Id", 10003, "", 400, false);
  static UserInfoNationalIdDoesNotMatchPhone = (): YFTError =>
    new YFTError(
      "National Id Does Not Match Phone Number",
      10004,
      "",
      400,
      false
    );
  static UserInfoInvalidOrEmptyBankCard = (): YFTError =>
    new YFTError("Invalid or Empty Bank Card", 10005, "", 400, false);
  static UserInfoInvalidOrEmptyAddress = (): YFTError =>
    new YFTError("Invalid or Empty Address", 10006, "", 400, false);
  static UserInfoBankAccountAlreadyAdded = (): YFTError =>
    new YFTError("Bank Account Is Already Added", 10007, "", 400, false);
  static UserInfoBankAccountNotFound = (): YFTError =>
    new YFTError("Bank Account Not Found", 10008, "", 404, false);
  static UserInfoBankAccountCannotBeAdded = (): YFTError =>
    new YFTError("Bank Account Cannot Be Added", 10009, "", 400, false);
  static UserInfoChangePasswordInvalidOldPassword = (): YFTError =>
    new YFTError("Invalid old password", 10010, "", 400, false);
  static UserInfoChangePasswordOldPassNotVerifiedYet = (): YFTError =>
    new YFTError("Please Verify Old Password First", 10011, "", 400, false);
  static UserInfoChangeMobileNumberCannotChangeToSelf = (): YFTError =>
    new YFTError(
      "This is already your current mobile number!",
      10012,
      "",
      400,
      false
    );
  static UserInfoChangeMobileNumberMobileAlreadyExists = (): YFTError =>
    new YFTError(
      "A user with this mobile number already exists",
      10013,
      "",
      400,
      false
    );
  static UserInfoChangeMobileNumberInvalidCode = (): YFTError =>
    new YFTError("Invalid Code", 10014, "", 400, false);
  static UserInfoInvalidOrEmptyNationalIdFront = (): YFTError =>
    new YFTError("Please upload national id", 10015, "", 400, false);
  static UserInfoInvalidOrEmptyNationalIdBack = (): YFTError =>
    new YFTError("Please upload national id back", 10016, "", 400, false);
  static UserInfoInvalidOrEmptySelfieImage = (): YFTError =>
    new YFTError("Please upload selfie image", 10017, "", 400, false);
  static UserInfoInvalidOrEmptySelfieVideo = (): YFTError =>
    new YFTError("Please upload selfie video", 10018, "", 400, false);
  static UserInfoVerificationDocumentNotFound = (): YFTError =>
    new YFTError("Verification doc not found", 10019, "", 404, false);
  static UserInfoUserCannotVerifyUserInfoChange = (): YFTError =>
    new YFTError("You cannot change user info", 10020, "", 400, false);
  static UserInfoUserCannotAcceptTOS = (): YFTError =>
    new YFTError("You cannot accept TOS at this step", 10021, "", 400, false);
  static UserInfoUserCannotAddMoreBankAccount = (): YFTError =>
    new YFTError(
      "You cannot add more than 4 bank accounts",
      10022,
      "",
      400,
      false
    );
  static UserInfoInvalidOrEmptyBirthday = (): YFTError =>
    new YFTError("Invalid or Empty Birthday", 10023, "", 400, false);
  static UserInfoBankAccountCannotBeSetAsDefault = (): YFTError =>
    new YFTError(
      "Bank Account Cannot Be Set As Default",
      10024,
      "",
      400,
      false
    );
  static UserInfoSubWalletIsAlreadyCreated = (): YFTError =>
    new YFTError("SubWallet Is Already Created", 10025, "", 400, false);
  static UserInfoSubWalletIsLocked = (): YFTError =>
    new YFTError("SubWallet Is Locked", 10026, "", 400, false);
  static UserInfoSubWalletHasNotEnoughBalance = (): YFTError =>
    new YFTError("SubWallet Has Not Enough Balance", 10027, "", 400, false);
  static UserInfoSubWalletLevelHasRestriction = (): YFTError =>
    new YFTError("SubWallet Has Level Restriction", 10028, "", 400, false);
  static UserInfoWalletIsAlreadyCreated = (): YFTError =>
    new YFTError("Wallet Is Already Created", 10027, "", 400, false);

  // Admin :: KYC :: 501xx
  static AdminKYCCannotAddBirthdayInvalidDate = (): YFTError =>
    new YFTError("Invalid Birthday", 50100, "", 400, false);
  static AdminKYCCannotAddBirthdayAlreadyAdded = (): YFTError =>
    new YFTError(
      "You cannot add birthday as it is already set this user already ",
      50104,
      "",
      400,
      false
    );
  static AdminKYCCannotAddBirthdayThirdPartyError = (): YFTError =>
    new YFTError(
      "There was an error getting data from our thirdparty validator",
      50105,
      "",
      500,
      false
    );

  // Section :: 601xx
  static SectionNotFound = () =>
    new YFTError("Section Not Found", 60100, "", 404, false);
  static SectionIsNotFree = () =>
    new YFTError("Section Is Not Free", 60200, "", 400, false);
  // Course :: 701xx
  static CourseNotFound = () =>
    new YFTError("Course Not Found", 70100, "", 404, false);
  // Video :: 801xx
  static VideoNotFound = () =>
    new YFTError("Video Not Found", 80100, "", 404, false);

  //wallet
  static YourCoinBalanceIsNotSufficient = (): YFTError =>
    new YFTError("Your Coin Balance Is Not Sufficient", 90100, "", 400, false);
  //coupon
  static YouCannotUseCouponMoreThanOneTime = (): YFTError =>
    new YFTError(
      "You Cannot Use Coupon More Than One Time",
      100100,
      "",
      400,
      false
    );
  static ThisCouponIsOutOfDate = (): YFTError =>
    new YFTError("This Coupon Is Out Of Date ", 100200, "", 400, false);
  //comment
  static YouCannotEditOthersComment = (): YFTError =>
    new YFTError("You Cannot Edit Others Comment", 110100, "", 400, false);
  //chat
  static YouCannotEditOthersChat = (): YFTError =>
    new YFTError("You Cannot Edit Others Chat", 120100, "", 400, false);
  static YouCannotEditOthersChatRoom = (): YFTError =>
    new YFTError("You Cannot Edit Others ChatRoom", 120200, "", 400, false);
  //comment
  static youHaveBeenEnrolledThisCourse = (): YFTError =>
    new YFTError("you Have Been Enrolled This Course", 120100, "", 400, false);
  //clip
  static clipsFinished = new YFTError("Clips Finished", 130100, "", 400, false);
}

export class AdminsPrivileges {
  static AllPossiblePrivileges = AdminsPrivilegesType
  static SuperAdmin: AdminsPrivilegesType.superAdmin
  static FinancialSupervisor: AdminsPrivilegesType.financialSupervisor
  static PayUsers: AdminsPrivilegesType.payUser
  static KYC: AdminsPrivilegesType.kyc
}

export class Bank {
  public englishName: string;
  public persianName: string;
  public swiftCode: string;
  public imageUrl: string;

  constructor(
    englishName: string,
    persianName: string,
    swiftCode: string,
    imageUrl: string
  ) {
    this.englishName = englishName;
    this.persianName = persianName;
    this.swiftCode = swiftCode;
    this.imageUrl = imageUrl;
  }

  static fromJibitBankName(jibitBankName: string): Bank {
    switch (jibitBankName) {
      case "MARKAZI":
        return Bank.fromSwiftCode("BMJIIR");
      case "":
      case "SANAT_VA_MADAN":
        return Bank.fromSwiftCode("BOIMIR");
      case "MELLAT":
        return Bank.fromSwiftCode("BKMTIR");
      case "REFAH":
        return Bank.fromSwiftCode("REFAIR");
      case "MASKAN":
        return Bank.fromSwiftCode("BKMNIR");
      case "SEPAH":
        return Bank.fromSwiftCode("SEPBIR");
      case "KESHAVARZI":
        return Bank.fromSwiftCode("KESHIR");
      case "MELLI":
        return Bank.fromSwiftCode("MELIIR");
      case "TEJARAT":
        return Bank.fromSwiftCode("BTEJIR");
      case "SADERAT":
        return Bank.fromSwiftCode("BSIRIR");
      case "TOSEAH_SADERAT":
        return Bank.fromSwiftCode("EDBIIR");
      case "POST":
        return Bank.fromSwiftCode("PBIRIR");
      case "TOSEAH_TAAVON":
        return Bank.fromSwiftCode("TTBIIR");
      case "TOSEAH":
        return Bank.fromSwiftCode("BTOSIR");
      case "GHAVAMIN":
        return Bank.fromSwiftCode("GHAVIR");
      case "KARAFARIN":
        return Bank.fromSwiftCode("KBIDIR");
      case "PARSIAN":
        return Bank.fromSwiftCode("BKPAIR");
      case "EGHTESAD_NOVIN":
        return Bank.fromSwiftCode("BEGNIR");
      case "SAMAN":
        return Bank.fromSwiftCode("SABCIR");
      case "PASARGAD":
        return Bank.fromSwiftCode("BKBPIR");
      case "SARMAYEH":
        return Bank.fromSwiftCode("SRMBIR");
      case "SINA":
        return Bank.fromSwiftCode("SINAIR");
      case "MEHR_IRAN":
        return Bank.fromSwiftCode("MEHRIR");
      case "SHAHR":
        return Bank.fromSwiftCode("CIYBIR");
      case "AYANDEH":
        return Bank.fromSwiftCode("AYBKIR");
      case "ANSAR":
        return Bank.fromSwiftCode("ANSBIR");
      case "GARDESHGARI":
        return Bank.fromSwiftCode("TOSMIR");
      case "HEKMAT_IRANIAN":
        return Bank.fromSwiftCode("HEKMIR");
      case "DAY":
        return Bank.fromSwiftCode("DAYBIR");
      case "IRANZAMIN":
        return Bank.fromSwiftCode("IRZAIR");
      case "RESALAT":
        return Bank.fromSwiftCode("RESBIR");
      case "MELAL":
        return Bank.fromSwiftCode("MELLIR");
      case "KHAVARMIANEH":
        return Bank.fromSwiftCode("KHMIIR");
      case "IRAN_VENEZUELA":
        return Bank.fromSwiftCode("IVBBIR");
      case "NOOR":
      case "MEHR_EGHTESAD":
      default:
        throw YFTError.InvalidRequest;
    }
    return;
  }

  static fromSwiftCode(swiftCode: string): Bank {
    switch (swiftCode) {
      case "BMJIIR":
        return new Bank(
          "Central Bank of the Islamic Republic of Iran",
          "بانک مرکزی",
          swiftCode,
          ""
        );
      case "BOIMIR":
        return new Bank(
          "Bank of Industry and Mine",
          "بانک صنعت و معدن",
          swiftCode,
          ""
        );
      case "BKMTIR":
        return new Bank("Bank Mellat", "بانک ملت", swiftCode, "");
      case "REFAIR":
        return new Bank("Refah Bank", "بانک رفاه", swiftCode, "");
      case "BKMNIR":
        return new Bank("Bank Maskan", "بانک مسکن", swiftCode, "");
      case "SEPBIR":
        return new Bank("Bank Sepah", "بانک سپه", swiftCode, "");
      case "KESHIR":
        return new Bank("Bank Keshavarzi Iran", "بانک کشاورزی", swiftCode, "");
      case "MELIIR":
        return new Bank("Bank Melli Iran", "بانک ملی", swiftCode, "");
      case "BTEJIR":
        return new Bank("Tejarat Bank", "بانک تجارت", swiftCode, "");
      case "BSIRIR":
        return new Bank("Bank Saderat Iran", "بانک صادرات", swiftCode, "");
      case "EDBIIR":
        return new Bank(
          "Export Development Bank of Iran",
          "بانک توسعه صادرات",
          swiftCode,
          ""
        );
      case "PBIRIR":
        return new Bank("Post Bank", "پست بانک", swiftCode, "");
      case "TTBIIR":
        return new Bank(
          "Tose'e Ta'avon Bank",
          "بانک توسعه تعاون",
          swiftCode,
          ""
        );
      case "BTOSIR":
        return new Bank("Tose'e", "بانک توسعه", swiftCode, "");
      case "GHAVIR":
        return new Bank("Ghavamin Bank", "بانک قوامین", swiftCode, "");
      case "KBIDIR":
        return new Bank("Karafarin Bank", "بانک کارآفرین", swiftCode, "");
      case "BKPAIR":
        return new Bank("Parsian Bank", "بانک پارسیان", swiftCode, "");
      case "BEGNIR":
        return new Bank("EN Bank", "بانک اقتصاد نوین", swiftCode, "");
      case "SABCIR":
        return new Bank("Saman Bank", "بانک سامان", swiftCode, "");
      case "BKBPIR":
        return new Bank("Bank Pasargad", "بانک پاسارگاد", swiftCode, "");
      case "SRMBIR":
        return new Bank("Sarmayeh Bank", "بانک سرمایه", swiftCode, "");
      case "SINAIR":
        return new Bank("Sina Bank", "بانک سینا", swiftCode, "");
      case "MEHRIR":
        return new Bank("Mehr Iranian", "بانک مهر ایرانیان", swiftCode, "");
      case "CIYBIR":
        return new Bank("Shahr ‌Bank", "بانک شهر", swiftCode, "");
      case "AYBKIR":
        return new Bank("Ayandeh Bank", "بانک آینده", swiftCode, "");
      case "ANSBIR":
        return new Bank("Ansar Bank", "بانک انصار", swiftCode, "");
      case "TOSMIR":
        return new Bank("Tourism Bank", "بانک گردشگری", swiftCode, "");
      case "HEKMIR":
        return new Bank(
          "Bank Hekmat Iranian",
          "بانک حکمت ابرانیان",
          swiftCode,
          ""
        );
      case "DAYBIR":
        return new Bank("Bank Day", "بانک دی", swiftCode, "");
      case "IRZAIR":
        return new Bank("Iran Zamin Bank", "بانک ایران‌زمین", swiftCode, "");
      case "RESBIR":
        return new Bank("Resalat Bank", "بانک قرض‌الحسنه رسالت", swiftCode, "");
      case "MELLIR":
        return new Bank(
          "Melal Credit Institution",
          " موسسه مالی و اعتباری ملل",
          swiftCode,
          ""
        );
      case "KHMIIR":
        return new Bank("Middle East Bank", "بانک خاورمیانه", swiftCode, "");
      case "IVBBIR":
        return new Bank(
          "Iran-Venezuela BiNational Bank",
          "بانک مشترک ایران و ونزوئلا",
          swiftCode,
          ""
        );
      default:
        throw YFTError.InvalidRequest;
    }
  }
}
