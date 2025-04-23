import React from 'react'
import { Route, Routes } from 'react-router-dom'
import SettingsPage from '../pages/settings'
import Authorization from '../components/security/Authorization'

const SettingRoutes: React.FC = () => {
  return (
    <Routes>
      <Route
        path='/'
        element={
          <Authorization permissions={{ resource: 'settings', action: 'read' }}>
            <SettingsPage />
          </Authorization>
        }
      />
    </Routes>
  )
}

export default SettingRoutes
