import { CustomerLoginResponse } from './auth'

export enum CustomerStatus {
  VERIFIED = 'VERIFIED',
  NEED_INFO = 'NEED_INFO',
  UNVERIFIED = 'UNVERIFIED',
}

export enum CustomerAuthenticationType {
  DATABASE = 'DATABASE',
  GOOGLE = 'GOOGLE',
}

export interface Customer {
  id: number
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  status: CustomerStatus
  authenticationType: CustomerAuthenticationType
}

export interface CustomerRegister {
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  password: string
}

export interface CustomerRegisterResponse extends CustomerLoginResponse {}

export interface VerifyEmailRequest {
  email: string
  verificationCode: string
}

export interface VerifyEmailResponse {
  verified: boolean
}

export interface ResendVerificationRequest {
  email: string
}

export interface ForgotPasswordRequest {
  email: string
}

export interface VerifyResetCodeRequest {
  email: string
  resetCode: string
}

export interface ResetPasswordRequest {
  email: string
  resetCode: string
  newPassword: string
}
