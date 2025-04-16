import React from 'react'
import { Badge } from 'antd'
import { ShoppingCartOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import { ROUTES } from '../../config/appConfig'
import { useRoutes } from '../../hooks/useRoutes'

interface CartIconProps {
  count: number
}

const CartIcon: React.FC<CartIconProps> = ({ count }) => {
  const { createRoute } = useRoutes()
  return (
    <Link to={createRoute(ROUTES.CART)} className='inline-flex items-center'>
      <Badge count={count} showZero>
        <ShoppingCartOutlined className='text-2xl' />
      </Badge>
    </Link>
  )
}

export default CartIcon
