import React, { useState } from 'react'
import { Card, Typography, message } from 'antd'
import { useNavigate } from 'react-router-dom'
import AddressForm from '../../components/address/AddressForm'
import { AddressRequest } from '../../types/address'
import addressService from '../../services/addressService'
import { ROUTES } from '../../config/appConfig'

const { Title } = Typography

const AddressNewPage: React.FC = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (values: AddressRequest) => {
    try {
      setLoading(true)
      await addressService.createAddress(values)
      message.success('Address added successfully')
      navigate(ROUTES.ADDRESSES)
    } catch (error) {
      message.error('Failed to add address')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    navigate(ROUTES.ADDRESSES)
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <Card>
        <Title level={2}>Add New Address</Title>
        <AddressForm onSubmit={handleSubmit} onCancel={handleCancel} />
      </Card>
    </div>
  )
}

export default AddressNewPage
