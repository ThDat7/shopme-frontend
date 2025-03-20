import React from 'react'
import { Routes, Route } from 'react-router-dom'
import ShippingRatesPage from '../pages/shipping/index'
import CreateShippingRatePage from '../pages/shipping/CreateShippingRatePage'
import EditShippingRatePage from '../pages/shipping/EditShippingRatePage'

const ShippingRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path='/' element={<ShippingRatesPage />} />
      <Route path='/new' element={<CreateShippingRatePage />} />
      <Route path='/edit/:id' element={<EditShippingRatePage />} />
    </Routes>
  )
}

export default ShippingRoutes
