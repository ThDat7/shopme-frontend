export interface VietQRBank {
  id: number
  name: string
  code: string
  bin: string
  shortName: string
  logo: string
  transferSupported: number
  lookupSupported: number
}

export interface VietQRBankResponse {
  data: VietQRBank[]
  code: string
  desc: string
}

export const PaymentMethod = {
  COD: 'COD',
  PAY_OS: 'PAY_OS',
} as const

export type PaymentMethod = (typeof PaymentMethod)[keyof typeof PaymentMethod]

export interface PayOSCheckoutResponse {
  bin: string
  accountNumber: string
  accountName: string
  amount: number
  description: string
  orderCode: number
  currency: string
  paymentLinkId: string
  status: string
  expiredAt: number
  checkoutUrl: string
  qrCode: string
}
