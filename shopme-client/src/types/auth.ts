import { Customer } from './customer'

export interface GoogleLoginRequest {
  token: string
}

export interface GoogleLoginResponse extends CustomerLoginResponse {}

export interface CustomerLoginRequest {
  email: string
  password: string
}

export interface CustomerLoginResponse {
  customer: Customer
  token: string
}
