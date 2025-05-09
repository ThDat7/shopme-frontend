import React, { useState } from 'react'
import { Card } from 'antd'
import BrandForm from '../../components/brand/BrandForm'
import { BrandCreateRequest } from '../../types/brandTypes'
import { brandService } from '../../services/brandService'
import { useRoutes } from '../../hooks/useRoutes'
import { ROUTES } from '../../config/appConfig'

const CreateBrand: React.FC = () => {
  const { navigateTo } = useRoutes()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (values: BrandCreateRequest) => {
    try {
      setLoading(true)
      await brandService.createBrand(values)
      navigateTo(ROUTES.BRANDS)
    } catch (error) {
      console.error('Error creating brand:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '24px' }}>
      <Card title='Create New Brand'>
        <BrandForm
          onSubmit={handleSubmit}
          submitButtonText='Create Brand'
          loading={loading}
        />
      </Card>
    </div>
  )
}

export default CreateBrand
