import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

/**
 * Custom hook để xử lý các route trong ứng dụng
 * Cung cấp các phương thức tiện ích để làm việc với route, đặc biệt là các route có tham số
 */
export const useRoutes = () => {
  const navigate = useNavigate()

  const routes = useMemo(() => {
    return {
      /**
       * Tạo route từ route template và các tham số
       * @param route Route template (vd: '/san-pham/:id')
       * @param params Các tham số để thay thế (vd: { id: '1' })
       * @returns Route đã được thay thế tham số (vd: '/san-pham/1')
       */
      createRoute: (route: string, params?: Record<string, string | number>) => {
        if (!params) return route

        let result = route
        Object.keys(params).forEach(key => {
          result = result.replace(`:${key}`, String(params[key]))
        })
        return result
      },

      /**
       * Chuyển hướng đến route với các tham số
       * @param route Route template (vd: '/san-pham/:id')
       * @param params Các tham số để thay thế (vd: { id: '1' })
       * @param queryParams Các tham số query (vd: { categoryIds: '1,2,3', sort: 'asc' })
       * @param options Options khác cho navigate
       */
      navigateTo: (
        route: string, 
        params?: Record<string, string | number>,
        queryParams?: Record<string, string | string[] | number | number[] | boolean>,
        options?: { state?: any; replace?: boolean }
      ) => {
        const path = routes.createRoute(route, params);
        
        // Xử lý query params
        if (queryParams && Object.keys(queryParams).length > 0) {
          const searchParams = new URLSearchParams();
          
          for (const [key, value] of Object.entries(queryParams)) {
            // Bỏ qua các giá trị undefined hoặc null
            if (value === undefined || value === null) continue;
            
            if (Array.isArray(value)) {
              if (value.length > 0) {
                searchParams.set(key, value.join(','));
              }
            } else if (typeof value === 'boolean') {
              searchParams.set(key, value.toString());
            } else {
              searchParams.set(key, String(value));
            }
          }
          
          const queryString = searchParams.toString();
          navigate(queryString ? `${path}?${queryString}` : path, options);
        } else {
          navigate(path, options);
        }
      },

    }
  }, [navigate])

  return routes
}

// Export hàm tiện ích không cần hook để sử dụng trong các file không phải component
export const createRoute = (route: string, params?: Record<string, string | number>) => {
  if (!params) return route

  let result = route
  Object.keys(params).forEach(key => {
    result = result.replace(`:${key}`, String(params[key]))
  })
  return result
}
