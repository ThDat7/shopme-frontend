import React from 'react'
import { Card, Typography, message } from 'antd'
import ShippingRateForm from '../../components/shipping/ShippingRateForm'
import { ShippingRateCreateRequest } from '../../types/shipping'
import shippingService from '../../services/shippingService'
import { ROUTES } from '../../config/appConfig'
import { useRoutes } from '../../hooks/useRoutes'

const { Title } = Typography

const CreateShippingRatePage: React.FC = () => {
  const { navigateTo } = useRoutes()

  const handleSubmit = async (values: ShippingRateCreateRequest) => {
    try {
      await shippingService.createShippingRate(values)
      message.success('Shipping rate created successfully')
      navigateTo(ROUTES.SHIPPING_RATES)
    } catch (error) {
      message.error('Failed to create shipping rate')
    }
  }

  const handleCancel = () => {
    navigateTo(ROUTES.SHIPPING_RATES)
  }

  return (
    <div className='p-6'>
      <Card>
        <Title level={2}>Create Shipping Rate</Title>
        <ShippingRateForm onSubmit={handleSubmit} onCancel={handleCancel} />
      </Card>
    </div>
  )
}

export default CreateShippingRatePage
