export interface AuthenticationRequest {
  email: string
  password: string
}

export interface AuthenticationResponse {
  token: string
  authenticated: boolean
  userInfo: {
    email: string
    firstName: string
    lastName: string
    roles: string[]
  }
}

export interface IntrospectRequest {
  token: string
}

export interface IntrospectResponse {
  valid: boolean
}

export interface UserProfile {
  id: number
  email: string
  firstName: string
  lastName: string
  photos: string
  roles: string[]
}
