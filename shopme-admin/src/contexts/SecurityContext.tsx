import React, { createContext, useContext, ReactNode } from 'react'
import { useAuth } from './AuthContext'
import { UserRole } from '../types/authTypes'

// Define permissions by resource
export type ResourcePermission = {
  read: boolean
  create: boolean
  update: boolean
  delete: boolean
}

export type UserPermissions = {
  users: ResourcePermission
  products: ResourcePermission
  categories: ResourcePermission
  brands: ResourcePermission
  orders: ResourcePermission
  settings: ResourcePermission
  locations: ResourcePermission
  shipping: ResourcePermission
}

// Define role-based permissions
const ROLE_PERMISSIONS: Record<UserRole, UserPermissions> = {
  ADMIN: {
    users: { read: true, create: true, update: true, delete: true },
    products: { read: true, create: true, update: true, delete: true },
    categories: { read: true, create: true, update: true, delete: true },
    brands: { read: true, create: true, update: true, delete: true },
    orders: { read: true, create: true, update: true, delete: true },
    settings: { read: true, create: true, update: true, delete: true },
    locations: { read: true, create: true, update: true, delete: true },
    shipping: { read: true, create: true, update: true, delete: true },
  },
  EDITOR: {
    users: { read: false, create: false, update: false, delete: false },
    products: { read: true, create: true, update: true, delete: false },
    categories: { read: true, create: true, update: true, delete: false },
    brands: { read: true, create: true, update: true, delete: false },
    orders: { read: true, create: false, update: false, delete: false },
    settings: { read: true, create: false, update: false, delete: false },
    locations: { read: false, create: false, update: false, delete: false },
    shipping: { read: false, create: false, update: false, delete: false },
  },
  SALES: {
    users: { read: false, create: false, update: false, delete: false },
    products: { read: true, create: false, update: false, delete: false },
    categories: { read: true, create: false, update: false, delete: false },
    brands: { read: true, create: false, update: false, delete: false },
    orders: { read: true, create: true, update: true, delete: false },
    settings: { read: true, create: false, update: false, delete: false },
    locations: { read: true, create: false, update: false, delete: false },
    shipping: { read: true, create: false, update: false, delete: false },
  },
  SHIPPER: {
    users: { read: false, create: false, update: false, delete: false },
    products: { read: true, create: false, update: false, delete: false },
    categories: { read: false, create: false, update: false, delete: false },
    brands: { read: false, create: false, update: false, delete: false },
    orders: { read: true, create: false, update: true, delete: false },
    settings: { read: false, create: false, update: false, delete: false },
    locations: { read: true, create: false, update: false, delete: false },
    shipping: { read: true, create: false, update: false, delete: false },
  },
}

// Security context interface
interface SecurityContextType {
  hasPermission: (
    resource: keyof UserPermissions,
    action: keyof ResourcePermission
  ) => boolean
  userRoles: UserRole[]
  hasRole: (role: UserRole) => boolean
  getUserPermissions: () => UserPermissions | null
}

const SecurityContext = createContext<SecurityContextType | undefined>(
  undefined
)

export const useSecurity = () => {
  const context = useContext(SecurityContext)
  if (!context) {
    throw new Error('useSecurity must be used within a SecurityProvider')
  }
  return context
}

export const SecurityProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { userInfo, isAuthenticated } = useAuth()

  // Convert string roles to UserRole type
  const userRoles = (userInfo?.roles || []) as UserRole[]

  const hasRole = (role: UserRole): boolean => {
    return userRoles.includes(role)
  }

  const getUserPermissions = (): UserPermissions | null => {
    if (!isAuthenticated || !userInfo) {
      return null
    }

    // If user has multiple roles, merge permissions (highest access wins)
    if (userRoles.length === 0) {
      return null
    }

    // Start with no permissions
    const mergedPermissions: UserPermissions = {
      users: { read: false, create: false, update: false, delete: false },
      products: { read: false, create: false, update: false, delete: false },
      categories: { read: false, create: false, update: false, delete: false },
      brands: { read: false, create: false, update: false, delete: false },
      orders: { read: false, create: false, update: false, delete: false },
      settings: { read: false, create: false, update: false, delete: false },
      locations: { read: false, create: false, update: false, delete: false },
      shipping: { read: false, create: false, update: false, delete: false },
    }

    // Merge permissions from all roles (OR operation)
    userRoles.forEach((role) => {
      const rolePermissions = ROLE_PERMISSIONS[role]
      if (rolePermissions) {
        Object.keys(rolePermissions).forEach((resource) => {
          const resourceKey = resource as keyof UserPermissions
          Object.keys(rolePermissions[resourceKey]).forEach((action) => {
            const actionKey = action as keyof ResourcePermission
            if (rolePermissions[resourceKey][actionKey]) {
              mergedPermissions[resourceKey][actionKey] = true
            }
          })
        })
      }
    })

    return mergedPermissions
  }

  const hasPermission = (
    resource: keyof UserPermissions,
    action: keyof ResourcePermission
  ): boolean => {
    const permissions = getUserPermissions()
    if (!permissions) {
      return false
    }
    return permissions[resource][action]
  }

  const value = {
    hasPermission,
    userRoles,
    hasRole,
    getUserPermissions,
  }

  return (
    <SecurityContext.Provider value={value}>
      {children}
    </SecurityContext.Provider>
  )
}

export default SecurityContext
