
export enum BinanceDepositStatus {
  PENDING = 0,
  CREATED_NOT_WITHDRAW = 6,
  SUCCESS = 1
}

export enum BinanceWithdrawStatus {
  EMAIL_SENT = 0,
  CANCELLED = 1,
  AWAITING_APPROVAL = 2,
  REJECTED = 3,
  PROCESSING = 4,
  FAILURE = 5,
  COMPLETED = 6
}

export enum BinanceSide {
  BUY = 'BUY',
  SELL = 'SELL'
}

export enum BinanceTypes {
  Limit = 'LIMIT',
  MARKET = 'MARKET',
  STOP = 'STOP',
  TAKE_PROFIT = 'TAKE_PROFIT',
  STOP_MARKET = 'STOP_MARKET',
  TAKE_PROFIT_MARKET = 'TAKE_PROFIT_MARKET',
  TRAILING_STOP_MARKET = 'TRAILING_STOP_MARKET'
}

export enum BinancePositionSide {
  BOTH = 'BOTH',
  LONG = 'LONG',
  SHORT = 'SHORT'
}

export enum BinanceTimeInForce {
  GOOD_TILL_CANCEL = 'GTC', //- Good Till Cancel
  IMMEDIATE_OR_CANCEL = 'IOC', //- Immediate or Cancel
  FILL_OR_KILL = 'FOK', // - Fill or Kill
  GOOD_TILL_CROSSING = 'GTX'  //- Good Till Crossing (Post Only)
}

export enum BinanceOrderStatus {
  NEW = 'NEW',
  PARTIALLY_FILLED = 'PARTIALLY_FILLED',
  FILLED = 'FILLED',
  CANCELED = 'CANCELED',
  DELIVERED = 'DELIVERED',
  REJECTED = 'REJECTED',
  EXPIRED = 'EXPIRED'
}

export enum BinanceWorkingType {
  MARK_PRICE = 'MARK_PRICE',
  CONTRACT_PRICE = 'CONTRACT_PRICE'
}

export enum BinanceBlockchains {
  BEP2 = 'bep2',
  BSC = 'bsc'
}
