import React, { useEffect, useState } from 'react'
import { Card, Spin, message } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'
import BrandForm from '../../components/brand/BrandForm'
import {
  BrandCreateRequest,
  BrandDetailResponse,
  BrandUpdateRequest,
} from '../../types/brandTypes'
import { brandService } from '../../services/brandService'

const EditBrand: React.FC = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [brand, setBrand] = useState<BrandDetailResponse>()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchBrand()
  }, [id])

  const fetchBrand = async () => {
    try {
      if (!id) return
      const data = await brandService.getBrand(parseInt(id))
      setBrand(data)
    } catch (error) {
      console.error('Error fetching brand:', error)
      message.error('Failed to fetch brand')
      navigate('/brands')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (values: BrandCreateRequest) => {
    if (!id) return
    try {
      setSubmitting(true)
      const updateData: BrandUpdateRequest = {
        name: values.name,
        logo: values.logo,
        categoryIds: values.categoryIds,
      }
      await brandService.updateBrand(parseInt(id), updateData)
      navigate('/brands')
    } catch (error) {
      console.error('Error updating brand:', error)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div
        style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}
      >
        <Spin size='large' />
      </div>
    )
  }

  return (
    <div style={{ padding: '24px' }}>
      <Card title='Edit Brand'>
        <BrandForm
          initialValues={brand}
          onSubmit={handleSubmit}
          submitButtonText='Update Brand'
          loading={submitting}
        />
      </Card>
    </div>
  )
}

export default EditBrand
