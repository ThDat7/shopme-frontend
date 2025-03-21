import React, { useEffect, useState } from 'react'
import {
  Table,
  Button,
  InputNumber,
  Empty,
  Card,
  Typography,
  message,
  Tag,
} from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { CartItem } from '../../types/cart'
import cartService from '../../services/cartService'
import { useNavigate } from 'react-router-dom'
const { Title, Text } = Typography

const CartPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const fetchCartItems = async () => {
    try {
      setLoading(true)
      const items = await cartService.getCartItems()
      setCartItems(items)
    } catch (error) {
      message.error('Failed to fetch cart items')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCartItems()
  }, [])

  const handleQuantityChange = async (productId: number, quantity: number) => {
    try {
      await cartService.updateQuantity({ productId, quantity })
      fetchCartItems()
    } catch (error) {
      message.error('Failed to update quantity')
    }
  }

  const handleRemoveItem = async (productId: number) => {
    try {
      await cartService.removeFromCart(productId)
      fetchCartItems()
      message.success('Item removed from cart')
    } catch (error) {
      message.error('Failed to remove item')
    }
  }

  const calculateDiscountedPrice = (price: number, discount: number) => {
    return price * (1 - discount / 100)
  }

  const calculateDiscountAmount = (price: number, discount: number) => {
    return price * (discount / 100)
  }

  const columns: ColumnsType<CartItem> = [
    {
      title: 'Product',
      dataIndex: 'name',
      render: (name: string, record: CartItem) => (
        <div className='flex items-center gap-4'>
          <img
            src={record.mainImage}
            alt={name}
            className='w-16 h-16 object-cover rounded'
          />
          <Text>{name}</Text>
        </div>
      ),
    },
    {
      title: 'Price',
      dataIndex: 'price',
      render: (price: number) => <Text>${price.toFixed(2)}</Text>,
    },
    {
      title: 'Discount',
      render: (_, record: CartItem) => {
        if (record.discount > 0) {
          const discountAmount = calculateDiscountAmount(
            record.price,
            record.discount
          )
          return (
            <div>
              <Text type='danger'>-${discountAmount.toFixed(2)}</Text>
              <Tag color='red' className='ml-2'>
                {record.discount}%
              </Tag>
            </div>
          )
        }
        return <Text>-</Text>
      },
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      render: (quantity: number, record: CartItem) => (
        <InputNumber
          min={1}
          value={quantity}
          onChange={(value) =>
            handleQuantityChange(record.productId, value || 1)
          }
        />
      ),
    },
    {
      title: 'Subtotal',
      render: (_, record: CartItem) => {
        const discountedPrice = calculateDiscountedPrice(
          record.price,
          record.discount
        )
        const subtotal = discountedPrice * record.quantity
        return <Text strong>${subtotal.toFixed(2)}</Text>
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record: CartItem) => (
        <Button
          type='text'
          danger
          icon={<DeleteOutlined />}
          onClick={() => handleRemoveItem(record.productId)}
        />
      ),
    },
  ]

  const { totalItems, totalAmount } = cartService.getCartSummary(cartItems)

  return (
    <div className='container mx-auto px-4 py-8'>
      <Title level={2}>Shopping Cart</Title>

      {cartItems.length === 0 ? (
        <Empty description='Your cart is empty' className='my-8'>
          <Button type='primary' href='/'>
            Continue Shopping
          </Button>
        </Empty>
      ) : (
        <>
          <Table
            columns={columns}
            dataSource={cartItems}
            rowKey='productId'
            loading={loading}
            pagination={false}
          />

          <Card className='mt-8'>
            <div className='flex justify-between items-center'>
              <div>
                <Text>Total Items: {totalItems}</Text>
                <Title level={3} className='mt-2'>
                  Total Amount: ${totalAmount.toFixed(2)}
                </Title>
              </div>
              <Button
                type='primary'
                size='large'
                onClick={() => navigate('/checkout')}
              >
                Proceed to Checkout
              </Button>
            </div>
          </Card>
        </>
      )}
    </div>
  )
}

export default CartPage
