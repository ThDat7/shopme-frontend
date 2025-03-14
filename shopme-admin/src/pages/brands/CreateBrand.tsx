import React, { useState } from 'react'
import { Card } from 'antd'
import { useNavigate } from 'react-router-dom'
import BrandForm from '../../components/brand/BrandForm'
import { BrandCreateRequest } from '../../types/brandTypes'
import { brandService } from '../../services/brandService'

const CreateBrand: React.FC = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (values: BrandCreateRequest) => {
    try {
      setLoading(true)
      await brandService.createBrand(values)
      navigate('/brands')
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
