import axios from 'axios'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import autoTable from 'jspdf-autotable'
import {
  ApiResponse,
  UserListResponse,
  UserParams,
  RoleResponse,
  UserCreateRequest,
  UserUpdateRequest,
  UserDetailResponse,
  User,
} from '../types/userTypes'

const API_BASE_HOST = 'http://localhost:8080'
const API_BASE_URL = `${API_BASE_HOST}/api/v1/users`

export const userService = {
  listByPage: async (
    params: UserParams
  ): Promise<ApiResponse<UserListResponse>> => {
    const response = await axios.get(API_BASE_URL, { params })
    return response.data
  },

  getRoles: async (): Promise<ApiResponse<RoleResponse[]>> => {
    const response = await axios.get(`${API_BASE_URL}/roles`)
    return response.data
  },

  createUser: async (data: UserCreateRequest): Promise<ApiResponse<void>> => {
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

    const response = await axios.post(API_BASE_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  getUser: async (id: number): Promise<ApiResponse<UserDetailResponse>> => {
    const response = await axios.get(`${API_BASE_URL}/${id}`)
    return response.data
  },

  updateUser: async (
    id: number,
    data: UserUpdateRequest
  ): Promise<ApiResponse<void>> => {
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

    const response = await axios.put(`${API_BASE_URL}/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  deleteUser: async (id: number): Promise<ApiResponse<void>> => {
    const response = await axios.delete(`${API_BASE_URL}/${id}`)
    return response.data
  },

  updateUserStatus: async (
    id: number,
    status: boolean
  ): Promise<ApiResponse<void>> => {
    const response = await axios.put(`${API_BASE_URL}/${id}/enable/${status}`)
    return response.data
  },

  getAllUsers: async (): Promise<User[]> => {
    const response = await axios.get(`${API_BASE_URL}/all`)
    return response.data.result
  },

  exportUsers: async (format: 'csv' | 'pdf' | 'excel'): Promise<void> => {
    try {
      const users = await userService.getAllUsers()

      const exportData = users.map((user) => ({
        Email: user.email,
        'First Name': user.firstName,
        'Last Name': user.lastName,
        Roles: user.roles.join(', '),
        Enabled: user.enabled ? 'Yes' : 'No',
      }))

      switch (format) {
        case 'csv':
          exportToCSV(exportData, 'users.csv')
          break
        case 'excel':
          exportToExcel(exportData, 'users.xlsx')
          break
        case 'pdf':
          exportToPDF(exportData, 'users.pdf')
          break
      }
    } catch (error) {
      console.error('Error exporting users:', error)
      throw error
    }
  },
}

function exportToCSV(data: any[], filename: string) {
  const worksheet = XLSX.utils.json_to_sheet(data)
  const csvContent = XLSX.utils.sheet_to_csv(worksheet)
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  saveAs(blob, filename)
}

function exportToExcel(data: any[], filename: string) {
  const worksheet = XLSX.utils.json_to_sheet(data)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Users')
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
  const blob = new Blob([excelBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })
  saveAs(blob, filename)
}

function exportToPDF(data: any[], filename: string) {
  import('jspdf').then(({ default: jsPDF }) => {
    import('jspdf-autotable').then(() => {
      const doc = new jsPDF()

      autoTable(doc, {
        head: [Object.keys(data[0])],
        body: data.map((item) => Object.values(item)),
        styles: { fontSize: 8 },
        headStyles: { fillColor: [66, 139, 202] },
      })

      doc.save(filename)
    })
  })
}
