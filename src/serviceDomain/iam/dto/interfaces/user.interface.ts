export interface preparedUserForClient {
  id: string
  firstName: string
  lastName: string
  mobile: string
  nationalId: string
  verificationStatus: string
}

export interface getAll {
  count: string;
  isRequestedByAdmin?: boolean;
}

export interface getOne {
  id: string;
  isRequestedByAdmin?: boolean;
}

export interface deleteOne {
  id: string;
}

export interface GetUserById {
  userId: string;
}

export interface createOrUpdateOne {
  id?: string;
  firstName: string;
  lastName: string;
  mobile: string;
  nationalId: string;
}

export interface BankAccountInfoVerificationResponse {
  bankSwiftCode: string;
  accountNumber: string;
  iban: string;
  ownerFirstName: string;
  ownerLastName: string;
  ownerName: string;
}
