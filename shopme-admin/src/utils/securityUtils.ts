import { jwtDecode, JwtPayload } from 'jwt-decode'
import { UserRole } from '../types/authTypes'

// Cấu trúc thực tế của JWT payload
interface TokenPayload extends JwtPayload {
  sub: string // userId
  exp?: number
  // JWT không chứa thông tin chi tiết về user
}

/**
 * Decodes a JWT token and returns the payload
 * @param token JWT token
 * @returns Decoded token payload or null if invalid
 */
export const decodeToken = (token: string): TokenPayload | null => {
  try {
    return jwtDecode<TokenPayload>(token)
  } catch (error) {
    console.error('Error decoding token:', error)
    return null
  }
}

/**
 * Checks if a token is expired
 * @param token JWT token
 * @returns True if token is expired or invalid, false otherwise
 */
export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = decodeToken(token)
    if (!decoded) return true

    // Get current time in seconds
    const currentTime = Math.floor(Date.now() / 1000)

    // Check if token is expired (exp is in seconds)
    return decoded.exp ? decoded.exp < currentTime : true
  } catch (error) {
    console.error('Error checking token expiration:', error)
    return true
  }
}

/**
 * Extracts userId from JWT token
 * @param token JWT token
 * @returns userId or null if invalid
 */
export const getUserIdFromToken = (token: string): string | null => {
  try {
    const decoded = decodeToken(token)
    if (!decoded || !decoded.sub) return null

    return decoded.sub
  } catch (error) {
    console.error('Error extracting userId from token:', error)
    return null
  }
}

/**
 * Gets user info from localStorage
 * @returns User info object or null if not found
 */
export const getUserInfoFromStorage = () => {
  try {
    const userInfo = localStorage.getItem('user')
    if (!userInfo) return null

    return JSON.parse(userInfo)
  } catch (error) {
    console.error('Error getting user info from storage:', error)
    return null
  }
}

/**
 * Saves user info to localStorage
 * @param user User info object
 */
export const saveUserInfoToStorage = (user: any) => {
  try {
    localStorage.setItem('user', JSON.stringify(user))
  } catch (error) {
    console.error('Error saving user info to storage:', error)
  }
}

/**
 * Gets the token expiration time in milliseconds
 * @param token JWT token
 * @returns Expiration time in milliseconds or null if token is invalid
 */
export const getTokenExpirationTime = (token: string): number | null => {
  try {
    const decoded = decodeToken(token)
    if (!decoded || !decoded.exp) return null

    // Convert exp (in seconds) to milliseconds
    return decoded.exp * 1000
  } catch (error) {
    console.error('Error getting token expiration time:', error)
    return null
  }
}

/**
 * Calculates time remaining until token expiration
 * @param token JWT token
 * @returns Time remaining in milliseconds or 0 if expired/invalid
 */
export const getTokenTimeRemaining = (token: string): number => {
  const expirationTime = getTokenExpirationTime(token)
  if (!expirationTime) return 0

  const currentTime = Date.now()
  const timeRemaining = expirationTime - currentTime

  return timeRemaining > 0 ? timeRemaining : 0
}
