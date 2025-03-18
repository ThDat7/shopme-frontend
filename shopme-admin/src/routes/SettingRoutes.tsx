import React from 'react'
import { Routes, Route } from 'react-router-dom'
import SettingsPage from '../pages/settings'

const SettingRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path='/' element={<SettingsPage />} />
    </Routes>
  )
}

export default SettingRoutes
