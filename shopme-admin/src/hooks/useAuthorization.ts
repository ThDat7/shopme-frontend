import { useMemo } from 'react'
import { useSecurity } from '../contexts/SecurityContext'
import { UserRole } from '../types/authTypes'
import {
  ResourcePermission,
  UserPermissions,
} from '../contexts/SecurityContext'

/**
 * Hook cung cấp các phương thức kiểm tra quyền và vai trò.
 *
 * @returns Các phương thức kiểm tra quyền truy cập
 */
export const useAuthorization = () => {
  const { hasRole, hasPermission, userRoles, getUserPermissions } =
    useSecurity()

  // Memoized để tránh tạo lại các hàm trong mỗi render
  const utils = useMemo(
    () => ({
      /**
       * Kiểm tra xem người dùng có quyền truy cập dựa trên vai trò không
       */
      checkAccess: ({
        allowedRoles,
      }: {
        allowedRoles: UserRole[]
      }): boolean => {
        if (allowedRoles && allowedRoles.length > 0) {
          return allowedRoles.some((role) => hasRole(role))
        }
        return true
      },

      /**
       * Kiểm tra xem người dùng có quyền truy cập vào một tài nguyên/hành động không
       */
      checkPermission: (
        resource: keyof UserPermissions,
        action: keyof ResourcePermission
      ): boolean => {
        return hasPermission(resource, action)
      },

      /**
       * Kiểm tra xem người dùng có mọi quyền trong danh sách không
       */
      checkAllPermissions: (
        permissions: Array<{
          resource: keyof UserPermissions
          action: keyof ResourcePermission
        }>
      ): boolean => {
        return permissions.every((permission) =>
          hasPermission(permission.resource, permission.action)
        )
      },

      /**
       * Kiểm tra xem người dùng có bất kỳ quyền nào trong danh sách không
       */
      checkAnyPermission: (
        permissions: Array<{
          resource: keyof UserPermissions
          action: keyof ResourcePermission
        }>
      ): boolean => {
        return permissions.some((permission) =>
          hasPermission(permission.resource, permission.action)
        )
      },

      /**
       * Lấy vai trò của người dùng
       */
      roles: userRoles,

      /**
       * Lấy tất cả quyền của người dùng
       */
      permissions: getUserPermissions(),
    }),
    [hasRole, hasPermission, userRoles, getUserPermissions]
  )

  return utils
}

export default useAuthorization
