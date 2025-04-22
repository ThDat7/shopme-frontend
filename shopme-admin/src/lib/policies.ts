import { User, UserRole } from '../types/authTypes'
import { useSecurity } from '../contexts/SecurityContext'

export type PolicyKey =
  | 'comment:delete'

export type PolicyFunction<T = any> = ( resource: T) => boolean

export interface Comment {
  id: string
  author?: {
    id: number
  }
}

/**
 * Helper function để kiểm tra quyền từ ma trận quyền
 * Cần được sử dụng trong component với hook
 */
export const usePermissionCheck = () => {
  const { hasPermission } = useSecurity()
  return hasPermission
}

/**
 * Các hàm policy kiểm tra quyền truy cập cụ thể
 * Policies tập trung vào các trường hợp đặc biệt, dựa trên ma trận quyền
 * và các điều kiện bổ sung
 */
export const POLICIES: Record<PolicyKey, PolicyFunction> = {
  'comment:delete': (comment: Comment) => {
    // Người dùng chỉ có thể xóa comment của chính họ
    return true
  },
}

export default POLICIES
