export interface Address {
  id: number
  recipientName: string
  phoneNumber: string
  address: string
  defaultForShipping: boolean
}

export interface AddressDetail {
  id: number
  firstName: string
  lastName: string
  phoneNumber: string
  addressLine1: string
  addressLine2: string
  city: string
  state: string
  postalCode: string
  countryName: string
  defaultForShipping: boolean
}

export interface AddressRequest {
  firstName: string
  lastName: string
  phoneNumber: string
  addressLine1: string
  addressLine2: string
  city: string
  state: string
  postalCode: string
  countryId: number
  defaultForShipping: boolean
}
