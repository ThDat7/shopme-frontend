import React from 'react'
import { Badge } from 'antd'
import { ShoppingCartOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import { ROUTES } from '../../config/appConfig'

interface CartIconProps {
  count: number
}

const CartIcon: React.FC<CartIconProps> = ({ count }) => {
  return (
    <Link to={ROUTES.CART} className='inline-flex items-center'>
      <Badge count={count} showZero>
        <ShoppingCartOutlined className='text-2xl' />
      </Badge>
    </Link>
  )
}

export default CartIcon
