import React from 'react'
import { Route, Routes } from 'react-router-dom'
import OrdersPage from '../pages/orders/OrdersPage'
import OrderDetailPage from '../pages/orders/OrderDetailPage'
import OrderListPage from '../pages/orders/OrderListPage'
import Authorization from '../components/security/Authorization'

const OrderRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Main orders page - cần quyền read */}
      <Route
        path='/'
        element={
          <Authorization permissions={{ resource: 'orders', action: 'read' }}>
            <OrdersPage />
          </Authorization>
        }
      />

      {/* List orders - cần quyền read */}
      <Route
        path='/list'
        element={
          <Authorization permissions={{ resource: 'orders', action: 'read' }}>
            <OrderListPage />
          </Authorization>
        }
      />

      {/* View order detail - cần quyền read */}
      <Route
        path='/:id'
        element={
          <Authorization permissions={{ resource: 'orders', action: 'read' }}>
            <OrderDetailPage />
          </Authorization>
        }
      />
    </Routes>
  )
}

export default OrderRoutes
