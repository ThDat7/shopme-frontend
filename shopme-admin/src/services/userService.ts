import { BaseService } from './baseService'
import {
  UserListResponse,
  UserParams,
  RoleResponse,
  UserCreateRequest,
  UserUpdateRequest,
  UserDetailResponse,
  UserExportResponse,
} from '../types/userTypes'
import { API_ENDPOINTS } from '../config/appConfig'
import { ExportUtils } from '../utils/exportUtils'

class UserService extends BaseService {
  async listByPage(params: UserParams) {
    try {
      const response = await this.getPaginated<UserListResponse>(
        API_ENDPOINTS.USERS,
        params
      )
      return response.result
    } catch (error) {
      return this.handleError(error)
    }
  }

  async getRoles() {
    try {
      const response = await this.get<RoleResponse[]>(
        `${API_ENDPOINTS.USERS}/roles`
      )
      return response.result
    } catch (error) {
      return this.handleError(error)
    }
  }

  async createUser(data: UserCreateRequest) {
    try {
      const formData = new FormData()
      formData.append('email', data.email)
      formData.append('password', data.password)
      formData.append('firstName', data.firstName)
      formData.append('lastName', data.lastName)
      formData.append('enabled', String(data.enabled))
      data.roleIds.forEach((roleId) => {
        formData.append('roleIds', roleId.toString())
      })
      if (data.image) {
        formData.append('image', data.image)
      }

      const response = await this.post<void>(API_ENDPOINTS.USERS, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      return response.result
    } catch (error) {
      return this.handleError(error)
    }
  }

  async getUser(id: number) {
    try {
      const response = await this.get<UserDetailResponse>(
        `${API_ENDPOINTS.USERS}/${id}`
      )
      return response.result
    } catch (error) {
      return this.handleError(error)
    }
  }

  async updateUser(id: number, data: UserUpdateRequest) {
    try {
      const formData = new FormData()
      formData.append('email', data.email)
      formData.append('firstName', data.firstName)
      formData.append('lastName', data.lastName)
      formData.append('enabled', String(data.enabled))
      if (data.password) {
        formData.append('password', data.password)
      }
      data.roleIds.forEach((roleId) => {
        formData.append('roleIds', roleId.toString())
      })
      if (data.image) {
        formData.append('image', data.image)
      }

      const response = await this.put<void>(
        `${API_ENDPOINTS.USERS}/${id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )
      return response.result
    } catch (error) {
      return this.handleError(error)
    }
  }

  async deleteUser(id: number) {
    try {
      const response = await this.delete(`${API_ENDPOINTS.USERS}/${id}`)
      return response.result
    } catch (error) {
      return this.handleError(error)
    }
  }

  async updateUserStatus(id: number, status: boolean) {
    try {
      const response = await this.put(
        `${API_ENDPOINTS.USERS}/${id}/enable/${status}`
      )
      return response.result
    } catch (error) {
      return this.handleError(error)
    }
  }

  async listAllForExport() {
    try {
      const response = await this.get<UserExportResponse[]>(
        `${API_ENDPOINTS.USERS}/all`
      )
      return response.result
    } catch (error) {
      return this.handleError(error)
    }
  }

  exportToCSV(data: UserExportResponse[], filename: string): void {
    ExportUtils.exportToCSV(data, filename, [
      { key: 'id', label: 'ID' },
      { key: 'email', label: 'Email' },
      { key: 'firstName', label: 'First Name' },
      { key: 'lastName', label: 'Last Name' },
      { key: 'roles', label: 'Roles' },
      { key: 'enabled', label: 'Enabled' },
    ])
  }

  exportToExcel(data: UserExportResponse[], filename: string): void {
    ExportUtils.exportToExcel(data, filename, [
      { key: 'id', label: 'ID' },
      { key: 'email', label: 'Email' },
      { key: 'firstName', label: 'First Name' },
      { key: 'lastName', label: 'Last Name' },
      { key: 'roles', label: 'Roles' },
      { key: 'enabled', label: 'Enabled' },
    ])
  }

  exportToPDF(data: UserExportResponse[], filename: string): void {
    ExportUtils.exportToPDF(data, filename, [
      { key: 'id', label: 'ID' },
      { key: 'email', label: 'Email' },
      { key: 'firstName', label: 'First Name' },
      { key: 'lastName', label: 'Last Name' },
      { key: 'roles', label: 'Roles' },
      { key: 'enabled', label: 'Enabled' },
    ])
  }
}

export const userService = new UserService()
