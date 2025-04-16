import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { CartItem, CartItemRequest } from '../types/cart'
import cartService from '../services/cartService'
import productService from '../services/productService'
import { message } from 'antd'
import { useAuth } from './AuthContext'

interface CartContextType {
  cartItems: CartItem[]
  selectedItems: number[]
  loading: boolean
  addToCart: (request: CartItemRequest) => Promise<void>
  updateQuantity: (productId: number, quantity: number) => Promise<void>
  removeFromCart: (productId: number) => Promise<void>
  selectItem: (productId: number, selected: boolean) => void
  selectAllItems: (selected: boolean) => void
  isItemSelected: (productId: number) => boolean
  getSelectedItems: () => CartItem[]
  getTotalItems: () => number
  getTotalAmount: () => number
  getSelectedTotalItems: () => number
  getSelectedTotalAmount: () => number
  getCartTotalAmount: () => number
  clearCart: () => Promise<void>
  refreshCart: () => Promise<void>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

interface CartProviderProps {
  children: ReactNode
}

// Hàm để lưu giỏ hàng vào localStorage
const saveLocalCart = (items: CartItem[]) => {
  localStorage.setItem('localCart', JSON.stringify(items))
}

// Hàm để lấy giỏ hàng từ localStorage
const getLocalCart = (): CartItem[] => {
  const localCart = localStorage.getItem('localCart')
  return localCart ? JSON.parse(localCart) : []
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [selectedItems, setSelectedItems] = useState<number[]>([])
  const [loading, setLoading] = useState(false)
  const { isAuthenticated } = useAuth()

  // Tải giỏ hàng khi component được mount hoặc khi trạng thái đăng nhập thay đổi
  useEffect(() => {
    refreshCart()
  }, [isAuthenticated])

  // Cập nhật selected items khi cartItems thay đổi
  useEffect(() => {
    // Mặc định chọn tất cả các sản phẩm trong giỏ hàng
    setSelectedItems(cartItems.map(item => item.productId))
  }, [cartItems.length])

  const refreshCart = async () => {
    try {
      setLoading(true)
      
      if (isAuthenticated) {
        // Nếu đã đăng nhập, lấy giỏ hàng từ server
        try {
          // Đồng bộ giỏ hàng local vào server nếu có
          const localItems = getLocalCart()
          if (localItems.length > 0) {
            // Sử dụng API endpoint sync để đồng bộ toàn bộ giỏ hàng local vào server một lần
            const localCartRequests = localItems.map(item => ({
              productId: item.productId,
              quantity: item.quantity
            }))
            
            // Gọi API sync cart để đồng bộ giỏ hàng
            const syncedItems = await cartService.syncCart(localCartRequests)
            setCartItems(syncedItems)
            
            // Xóa giỏ hàng local sau khi đã đồng bộ
            localStorage.removeItem('localCart')
          } else {
            // Nếu không có giỏ hàng local, chỉ lấy giỏ hàng từ server
            const items = await cartService.getCartItems()
            setCartItems(items)
          }
        } catch (error) {
          console.error('Không thể tải thông tin giỏ hàng từ server:', error)
          message.error('Không thể tải thông tin giỏ hàng')
        }
      } else {
        // Nếu chưa đăng nhập, lấy giỏ hàng từ localStorage
        const localItems = getLocalCart()
        setCartItems(localItems)
      }
    } catch (error) {
      console.error('Lỗi khi tải giỏ hàng:', error)
    } finally {
      setLoading(false)
    }
  }

  const addToCart = async (request: CartItemRequest) => {
    try {
      setLoading(true)
      
      if (isAuthenticated) {
        // Nếu đã đăng nhập, thêm vào giỏ hàng trên server
        await cartService.addToCart(request)
        await refreshCart()
      } else {
        // Nếu chưa đăng nhập, thêm vào giỏ hàng local
        const localItems = getLocalCart()
        const existingItemIndex = localItems.findIndex(item => item.productId === request.productId)
        
        if (existingItemIndex >= 0) {
          // Cập nhật số lượng nếu sản phẩm đã có trong giỏ
          localItems[existingItemIndex].quantity += request.quantity
        } else {
          // Thêm sản phẩm mới vào giỏ hàng
          // Lưu ý: Cần lấy thông tin sản phẩm từ API hoặc từ trang hiện tại
          // Đây là một giải pháp tạm thời, cần cải thiện để lấy đầy đủ thông tin sản phẩm
          const productInfo = await productService.getProductById(request.productId)
          // Tính giá sau khi giảm giá
          const discountPrice = productInfo.price * (1 - productInfo.discountPercent / 100)
          
          localItems.push({
            productId: request.productId,
            name: productInfo.name,
            mainImage: productInfo.mainImage,
            quantity: request.quantity,
            price: productInfo.price,
            discountPercent: productInfo.discountPercent,
            discountPrice: discountPrice
          })
        }
        
        // Lưu giỏ hàng vào localStorage
        saveLocalCart(localItems)
        setCartItems(localItems)
      }
      
      message.success('Đã thêm sản phẩm vào giỏ hàng')
    } catch (error) {
      console.error('Không thể thêm sản phẩm vào giỏ hàng:', error)
      message.error('Không thể thêm sản phẩm vào giỏ hàng')
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = async (productId: number, quantity: number) => {
    try {
      setLoading(true)
      
      if (isAuthenticated) {
        // Nếu đã đăng nhập, cập nhật số lượng trên server
        await cartService.updateQuantity({ productId, quantity })
        await refreshCart()
      } else {
        // Nếu chưa đăng nhập, cập nhật số lượng trong localStorage
        const localItems = getLocalCart()
        const updatedItems = localItems.map(item => 
          item.productId === productId ? { ...item, quantity } : item
        )
        saveLocalCart(updatedItems)
        setCartItems(updatedItems)
      }
    } catch (error) {
      console.error('Không thể cập nhật số lượng:', error)
      message.error('Không thể cập nhật số lượng')
    } finally {
      setLoading(false)
    }
  }

  const removeFromCart = async (productId: number) => {
    try {
      setLoading(true)
      
      if (isAuthenticated) {
        // Nếu đã đăng nhập, xóa sản phẩm trên server
        await cartService.removeFromCart(productId)
        // Cập nhật danh sách sản phẩm đã chọn
        setSelectedItems(prev => prev.filter(id => id !== productId))
        await refreshCart()
      } else {
        // Nếu chưa đăng nhập, xóa sản phẩm trong localStorage
        const localItems = getLocalCart()
        const updatedItems = localItems.filter(item => item.productId !== productId)
        saveLocalCart(updatedItems)
        setCartItems(updatedItems)
        // Cập nhật danh sách sản phẩm đã chọn
        setSelectedItems(prev => prev.filter(id => id !== productId))
      }
      
      message.success('Đã xóa sản phẩm khỏi giỏ hàng')
    } catch (error) {
      console.error('Không thể xóa sản phẩm:', error)
      message.error('Không thể xóa sản phẩm')
    } finally {
      setLoading(false)
    }
  }

  const selectItem = (productId: number, selected: boolean) => {
    setSelectedItems(prev => {
      if (selected) {
        return [...prev, productId]
      }
      return prev.filter(id => id !== productId)
    })
  }

  const selectAllItems = (selected: boolean) => {
    if (selected) {
      setSelectedItems(cartItems.map(item => item.productId))
    } else {
      setSelectedItems([])
    }
  }

  const isItemSelected = (productId: number) => {
    return selectedItems.includes(productId)
  }

  const getSelectedItems = () => {
    return cartItems.filter(item => selectedItems.includes(item.productId))
  }

  const getTotalItems = () => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0)
  }

  const getTotalAmount = () => {
    return cartItems.reduce((sum, item) => sum + item.discountPrice * item.quantity, 0)
  }

  const getSelectedTotalItems = () => {
    return getSelectedItems().reduce((sum, item) => sum + item.quantity, 0)
  }

  const getSelectedTotalAmount = () => {
    return getSelectedItems().reduce((sum, item) => sum + item.discountPrice * item.quantity, 0)
  }

  const getCartTotalAmount = () => {
    return cartItems.reduce((sum, item) => sum + item.discountPrice * item.quantity, 0)
  }

  const clearCart = async () => {
    try {
      setLoading(true)
      
      if (isAuthenticated) {
        // Nếu đã đăng nhập, xóa giỏ hàng trên server
        // Xóa từng sản phẩm trong giỏ hàng
        const deletePromises = cartItems.map(item => cartService.removeFromCart(item.productId))
        await Promise.all(deletePromises)
      } else {
        // Nếu chưa đăng nhập, xóa giỏ hàng trong localStorage
        localStorage.removeItem('localCart')
      }
      
      setCartItems([])
      setSelectedItems([])
      message.success('Đã xóa tất cả sản phẩm khỏi giỏ hàng')
    } catch (error) {
      console.error('Không thể xóa giỏ hàng:', error)
      message.error('Không thể xóa giỏ hàng')
    } finally {
      setLoading(false)
    }
  }

  const value: CartContextType = {
    cartItems,
    selectedItems,
    loading,
    addToCart,
    updateQuantity,
    removeFromCart,
    selectItem,
    selectAllItems,
    isItemSelected,
    getSelectedItems,
    getTotalItems,
    getTotalAmount,
    getSelectedTotalItems,
    getSelectedTotalAmount,
    getCartTotalAmount,
    clearCart,
    refreshCart
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
