import React, { useState } from 'react'
import { Button, InputNumber, message } from 'antd'
import { ShoppingCartOutlined } from '@ant-design/icons'
import cartService from '../../services/cartService'

interface AddToCartButtonProps {
  productId: number
  onSuccess?: () => void
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  productId,
  onSuccess,
}) => {
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(false)

  const handleAddToCart = async () => {
    try {
      setLoading(true)
      await cartService.addToCart({ productId, quantity })
      message.success('Product added to cart successfully')
      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      if (error instanceof Error) {
        message.error(error.message)
      } else {
        message.error('Failed to add product to cart')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex items-center gap-4'>
      <InputNumber
        min={1}
        value={quantity}
        onChange={(value) => setQuantity(value || 1)}
        className='w-20'
      />
      <Button
        type='primary'
        icon={<ShoppingCartOutlined />}
        onClick={handleAddToCart}
        loading={loading}
      >
        Thêm vào giỏ hàng
      </Button>
    </div>
  )
}

export default AddToCartButton
