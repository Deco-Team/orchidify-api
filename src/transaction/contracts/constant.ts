export enum PaymentMethod {
  PAY_OS = 'PAY_OS',
  MOMO = 'MOMO',
  ZALO_PAY = 'ZALO_PAY',
  STRIPE = 'STRIPE'
}

export enum TransactionType {
  PAYMENT = 'PAYMENT',
  PAYOUT = 'PAYOUT',
}

export enum MomoResultCode {
  SUCCESS = 0,
  AUTHORIZED = 9000,
  FAILED = 'FAILED'
}

export enum PayOSResultCode {
  SUCCESS = '00',
  FAILED = '01',
  INVALID_PARAM = '02'
}

export enum PayOSStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  PAID = 'PAID',
  CANCELLED = 'CANCELLED'
}

export enum StripeStatus {
  SUCCEEDED = 'succeeded',
  REQUIRES_PAYMENT_METHOD = 'requires_payment_method',
}


export const TRANSACTION_LIST_PROJECTION = [
  '_id',
  'type',
  'paymentMethod',
  'amount',
  'debitAccount',
  'creditAccount',
  'description',
  'status',
  'createdAt',
  'updatedAt'
] as const

export const TRANSACTION_DETAIL_PROJECTION = [
  '_id',
  'type',
  'paymentMethod',
  'amount',
  'debitAccount',
  'creditAccount',
  'description',
  'status',
  'payment',
  'payout',
  'createdAt',
  'updatedAt'
] as const