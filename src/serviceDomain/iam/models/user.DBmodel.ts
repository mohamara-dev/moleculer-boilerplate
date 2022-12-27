import { prop, getModelForClass, modelOptions } from "@typegoose/typegoose";
import BaseModel from "@Models/base.DBmodel";
import { UserType, UserVerificationStatus } from "@ServiceDomain/iam/dto/enums/user.enum";

export class User extends BaseModel {
  @prop({ unique: true, type: String, index: true })
  mobile?: string;

  @prop({ unique: true, type: String, index: true })
  email?: string;

  @prop({ unique: true, required: true, type: String, index: true })
  userName: string;

  @prop({ type: String })
  hashedPassword: string;

  @prop({ type: String })
  salt: string;

  @prop({ required: true, enum: UserType, default: UserType.customer, type: String, })
  userType: string;

  @prop({ type: String, index: true })
  firstName?: string;

  @prop({ type: String, index: true })
  lastName?: string;

  @prop({ type: String, index: true })
  fullName?: string;

  // @prop({type: Birthday})
  //   birthday?: Birthday

  // @prop({type: String})
  //   defaultBankAccount?: string

  // @prop({type: String})
  //   address?: string

  // @prop({type: String})
  //   postalCode?: string

  // @prop({required: true, type: InfoValidation, default: new InfoValidation()})
  //   verifications?: InfoValidation

  @prop({ required: true, type: String, enum: UserVerificationStatus, default: UserVerificationStatus.pending_info })
  verificationStatus?: UserVerificationStatus;

  // @prop({type: Date})
  //   verifiedOrRejectedAt?: Date

  // @prop({type: String})
  //   verifiedOrRejectedBy?: string

  @prop({ type: String })
  rejectionReason?: string;

  @prop({ type: Date })
  acceptedTermsAt?: Date;

  // @prop({type: () => [VerificationDocuments]})
  //   verificationDocuments?: VerificationDocuments[]

  @prop({ type: () => [String] })
  oldMobileNumbers?: string[];

  @prop({ type: Boolean, default: false })
  isBanned?: boolean;

  @prop({ required: true, enum: UserType, default: UserType.customer, type: String })
  privileges: string[];

  /// pos system data

  @prop({ type: String })
  inviteCode?: string;

  @prop({ type: String })
  invitedBy?: string;

  public static async migrations(): Promise<void> {
    console.log("USER DATABASE MODEL MIGRATION INITIATED");
    console.log("USER DATABASE MODEL MIGRATION NOTHING TO DO");
  }
}

const UserDBModel = getModelForClass(User);
export default UserDBModel;
