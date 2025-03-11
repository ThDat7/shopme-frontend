export interface User {
  id: number
  email: string
  firstName: string
  lastName: string
  photos: string
  roles: string[]
  enabled: boolean
}

export interface UserListResponse {
  content: User[]
  totalPages: number
}

export interface UserDetailRequest {
  id: number
}

export interface UserDetailResponse extends User {
  roleIds: Set<number>
}

export interface ApiResponse<T> {
  code?: number
  message?: string
  result: T
}

export interface UserParams {
  page?: string
  size?: string
  sortField?: string
  sortDirection?: string
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

export interface UserUpdateRequest extends Omit<UserCreateRequest, 'password'> {
  id: number
  password?: string
}
