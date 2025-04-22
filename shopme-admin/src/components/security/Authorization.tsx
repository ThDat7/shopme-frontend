import React from 'react'
import { Navigate } from 'react-router-dom'
import { useSecurity } from '../../contexts/SecurityContext'
import { UserRole } from '../../types/authTypes'
import {
  ResourcePermission,
  UserPermissions,
} from '../../contexts/SecurityContext'

type AuthorizationProps = {
  forbiddenFallback?: React.ReactNode
  children: React.ReactNode
} & (
  | {
      allowedRoles: UserRole[]
      policyCheck?: never
      permissions?: never
    }
  | {
      allowedRoles?: never
      policyCheck: boolean
      permissions?: never
    }
  | {
      allowedRoles?: never
      policyCheck?: never
      permissions: {
        resource: keyof UserPermissions
        action: keyof ResourcePermission
      }
    }
)

export const Authorization: React.FC<AuthorizationProps> = ({
  allowedRoles,
  policyCheck,
  permissions,
  forbiddenFallback = <Navigate to='/unauthorized' replace />,
  children,
}) => {
  const { hasRole, hasPermission } = useSecurity()

  let canAccess = false

  // Kiểm tra dựa trên role
  if (allowedRoles && allowedRoles.length > 0) {
    canAccess = allowedRoles.some((role) => hasRole(role))
  }

  // Kiểm tra dựa trên policy function
  if (typeof policyCheck !== 'undefined') {
    canAccess = policyCheck
  }

  // Kiểm tra dựa trên permissions
  if (permissions) {
    canAccess = hasPermission(permissions.resource, permissions.action)
  }

  return <>{canAccess ? children : forbiddenFallback}</>
}

export default Authorization
