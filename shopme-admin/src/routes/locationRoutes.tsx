import React from 'react'
import { Routes, Route } from 'react-router-dom'
import LocationsPage from '../pages/locations'
import { ROUTES } from '../config/appConfig'

const LocationRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path='/' element={<LocationsPage />} />
    </Routes>
  )
}

export default LocationRoutes
