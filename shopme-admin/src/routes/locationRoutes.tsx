import React from 'react'
import { Route, Routes } from 'react-router-dom'
import LocationsPage from '../pages/locations'
import Authorization from '../components/security/Authorization'

const LocationRoutes: React.FC = () => {
  return (
    <Routes>
      <Route
        path='/'
        element={
          <Authorization
            permissions={{ resource: 'locations', action: 'read' }}
          >
            <LocationsPage />
          </Authorization>
        }
      />
    </Routes>
  )
}

export default LocationRoutes
