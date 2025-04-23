import React from 'react'
import { Routes, Route } from 'react-router-dom'
import ShippingRatesPage from '../pages/shipping/index'
import CreateShippingRatePage from '../pages/shipping/CreateShippingRatePage'
import EditShippingRatePage from '../pages/shipping/EditShippingRatePage'
import Authorization from '../components/security/Authorization'

const ShippingRoutes: React.FC = () => {
  return (
    <Routes>
      <Route
        path='/'
        element={
          <Authorization permissions={{ resource: 'shipping', action: 'read' }}>
            <ShippingRatesPage />
          </Authorization>
        }
      />

      <Route
        path='/new'
        element={
          <Authorization
            permissions={{ resource: 'shipping', action: 'create' }}
          >
            <CreateShippingRatePage />
          </Authorization>
        }
      />

      <Route
        path='/edit/:id'
        element={
          <Authorization
            permissions={{ resource: 'shipping', action: 'update' }}
          >
            <EditShippingRatePage />
          </Authorization>
        }
      />
    </Routes>
  )
}

export default ShippingRoutes
