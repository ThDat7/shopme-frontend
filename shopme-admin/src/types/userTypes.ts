import { PaginationParams } from './commonTypes'

export interface User {
  id: number
  email: string
  firstName: string
  lastName: string
  photos: string
  enabled: boolean
}

export interface UserListResponse extends User {
  roles: string[]
}

export interface UserDetailResponse extends User {
  roleIds: Set<number>
}

export interface UserExportResponse extends User {
  roles: string[]
}

export interface ApiResponse<T> {
  code?: number
  message?: string
  result: T
}

export interface UserParams extends PaginationParams {
  keyword?: string
}

export interface RoleResponse {
  id: number
  name: string
  description: string
}

export interface UserCreateRequest {
  email: string
  password: string
  firstName: string
  lastName: string
  roleIds: Set<number>
  enabled: boolean
  image?: File
}

export interface UserUpdateRequest {
  id: number
  email: string
  password?: string
  firstName: string
  lastName: string
  enabled: boolean
  roleIds: Set<number>
  image?: File
}
