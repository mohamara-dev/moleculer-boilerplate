export enum UserVerificationStatus {
  pending_info = 'pending_info',
  rejected = 'rejected',
  pending_verification = 'pending_verification',
  verified_level_0 = 'verified_level_0',
}

export enum AdminsPrivilegesType {
  superAdmin = 'superAdmin',
  financialSupervisor = 'financialSupervisor',
  payUser = 'payUser',
  kyc = 'kyc'
}

export enum UserType {
  customer = 'customer',
  admin = 'admin',
  staff = 'staff',
  merchant = 'merchant'
}
