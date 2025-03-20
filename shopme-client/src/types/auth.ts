export interface LoginRequest {
  email: string
  password: string
}

export interface GoogleLoginRequest {
  token: string
}

export interface LoginResponse {
  token: string
  user: CustomerInfo
}

export interface CustomerInfo {
  id: number
  email: string
  firstName: string
  lastName: string
  avatar?: string
}

export interface AuthState {
  isAuthenticated: boolean
  user: CustomerInfo | null
  loading: boolean
  error: string | null
}
