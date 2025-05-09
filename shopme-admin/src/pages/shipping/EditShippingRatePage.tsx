import React, { useEffect, useState } from 'react'
import { Card, Typography, message, Spin } from 'antd'
import { useParams } from 'react-router-dom'
import ShippingRateForm from '../../components/shipping/ShippingRateForm'
import { ShippingRate, ShippingRateUpdateRequest } from '../../types/shipping'
import shippingService from '../../services/shippingService'
import { ROUTES } from '../../config/appConfig'
import { useRoutes } from '../../hooks/useRoutes'

const { Title } = Typography

const EditShippingRatePage: React.FC = () => {
  const { navigateTo } = useRoutes()
  const { id } = useParams<{ id: string }>()
  const [loading, setLoading] = useState(false)
  const [shippingRate, setShippingRate] = useState<ShippingRate>()

  useEffect(() => {
    fetchShippingRate()
  }, [id])

  const fetchShippingRate = async () => {
    if (!id) return
    try {
      setLoading(true)
      const data = await shippingService.getShippingRate(parseInt(id))
      setShippingRate(data)
    } catch (error) {
      message.error('Failed to fetch shipping rate')
      navigateTo(ROUTES.SHIPPING_RATES)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (values: ShippingRateUpdateRequest) => {
    if (!id) return
    try {
      await shippingService.updateShippingRate(parseInt(id), values)
      message.success('Shipping rate updated successfully')
      navigateTo(ROUTES.SHIPPING_RATES)
    } catch (error) {
      message.error('Failed to update shipping rate')
    }
  }

  const handleCancel = () => {
    navigateTo(ROUTES.SHIPPING_RATES)
  }

  if (loading) {
    return (
      <div className='p-6 flex justify-center'>
        <Spin size='large' />
      </div>
    )
  }

  return (
    <div className='p-6'>
      <Card>
        <Title level={2}>Edit Shipping Rate</Title>
        <ShippingRateForm
          initialValues={shippingRate}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </Card>
    </div>
  )
}

export default EditShippingRatePage
