export enum UserRole {
  ADMIN = 'ADMIN',
  EDITOR = 'EDITOR',
  SALES = 'SALES',
  SHIPPER = 'SHIPPER',
}

export interface AuthenticationRequest {
  email: string
  password: string
}

export interface User {
  id: number
  email: string
  firstName: string
  lastName: string
  roles: UserRole[]
  avatar: string
}

export interface TokenResponse {
  token: string
  user: User
}

export interface AuthenticationResponse extends TokenResponse {}

export interface IntrospectRequest {
  token: string
}

export interface IntrospectResponse {
  valid: boolean
}

export interface RefreshTokenRequest {
  token: string
}

export interface RefreshTokenResponse extends TokenResponse {
  success: boolean
}

export interface UserProfile {
  id: number
  email: string
  firstName: string
  lastName: string
  photos: string
  roles: UserRole[]
}
