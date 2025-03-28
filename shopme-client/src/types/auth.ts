import { Customer } from './customer'

export interface GoogleLoginRequest {
  token: string
}

export interface GoogleLoginResponse extends CustomerLoginResponse {}


export interface CustomerLoginResponse {
  customer: Customer
  token: string
}
