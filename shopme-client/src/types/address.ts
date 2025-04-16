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
  addressLine: string
  wardId: number
  districtId: number
  provinceId: number
  defaultForShipping: boolean
}

export interface AddressRequest {
  firstName: string
  lastName: string
  phoneNumber: string
  addressLine: string
  wardId: number
  defaultForShipping: boolean
}

export interface Province {
  id: number
  name: string
  code: string
}

export interface District {
  id: number
  name: string
  code: string
  provinceId: number
}

export interface Ward {
  id: number
  name: string
  code: string
  districtId: number
}
