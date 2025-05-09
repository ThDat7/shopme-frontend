import { useNavigate as useRouterNavigate } from 'react-router-dom'
import { ROUTES } from '../config/appConfig'

// Export utility function for use outside hooks context
export const createRoute = (
  route: string,
  params?: Record<string, string | number>
): string => {
  if (!params) return route

  let result = route
  Object.keys(params).forEach((key) => {
    result = result.replace(`:${key}`, String(params[key]))
  })

  return result
}

export const useRoutes = () => {
  const navigate = useRouterNavigate()

  /**
   * Apply parameters to a route path
   */
  const applyParamsToPath = (
    path: string,
    params?: Record<string, string | number>
  ): string => {
    if (!params) return path

    let result = path
    Object.keys(params).forEach((key) => {
      result = result.replace(`:${key}`, String(params[key]))
    })

    return result
  }
  
  /**
   * Create a route from route template and parameters
   * @param route Route template (e.g: '/categories/:id')
   * @param params Parameters to replace (e.g: { id: '1' })
   * @returns Route with replaced parameters (e.g: '/categories/1')
   */
  const createRoute = (
    route: string,
    params?: Record<string, string | number>
  ): string => {
    return applyParamsToPath(route, params)
  }

  /**
   * Build query string from parameters
   */
  const buildQueryString = (
    queryParams: Record<string, string | string[] | number | number[] | boolean>
  ): string => {
    const searchParams = new URLSearchParams()

    for (const [key, value] of Object.entries(queryParams)) {
      if (value === undefined || value === null) continue

      if (Array.isArray(value)) {
        if (value.length > 0) {
          searchParams.set(key, value.join(','))
        }
      } else if (typeof value === 'boolean') {
        searchParams.set(key, value.toString())
      } else {
        searchParams.set(key, String(value))
      }
    }

    return searchParams.toString()
  }

  /**
   * Navigate to a route path
   * Can accept either:
   * - ROUTES object values: navigateTo(ROUTES.USERS, { id: 123 })
   * - Direct strings: navigateTo('/users', { id: 123 })
   */
  // TODO: Refactor sang type-safe routes (enum/key-based)
  const navigateTo = (
    route: string,
    params?: Record<string, string | number>,
    queryParams?: Record<string, string | string[] | number | number[] | boolean>,
    options?: { state?: any; replace?: boolean }
  ): void => {
    const path = applyParamsToPath(route, params);

    // Xử lý query params
    if (queryParams && Object.keys(queryParams).length > 0) {
      const queryString = buildQueryString(queryParams);
      navigate(queryString ? `${path}?${queryString}` : path, options);
    } else {
      navigate(path, options);
    }
  };

  return {
    navigateTo,
    createRoute,
    buildQueryString,
    navigate, // Keep the original navigate for edge cases
  }
}
