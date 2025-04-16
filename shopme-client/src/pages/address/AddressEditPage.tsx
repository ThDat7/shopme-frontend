import React, { useEffect, useState } from 'react'
import { Card, Typography, message, Spin } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'
import AddressForm from '../../components/address/AddressForm'
import { AddressDetail, AddressRequest } from '../../types/address'
import addressService from '../../services/addressService'
import { ROUTES } from '../../config/appConfig'
import { useRoutes } from '../../hooks/useRoutes'

const { Title } = Typography

const AddressEditPage: React.FC = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { createRoute } = useRoutes()
  const [address, setAddress] = useState<AddressDetail | undefined>()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (id) {
      fetchAddress(parseInt(id))
    }
  }, [id])

  const fetchAddress = async (addressId: number) => {
    try {
      setLoading(true)
      const data = await addressService.getAddressDetail(addressId)
      setAddress(data)
    } catch (error) {
      message.error('Failed to fetch address details')
      navigate(createRoute(ROUTES.ADDRESSES))
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (values: AddressRequest) => {
    if (!id) return

    try {
      setLoading(true)
      await addressService.updateAddress(parseInt(id), values)
      message.success('Address updated successfully')
      navigate(createRoute(ROUTES.ADDRESSES))
    } catch (error) {
      message.error('Failed to update address')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    navigate(createRoute(ROUTES.ADDRESSES))
  }

  if (loading && !address) {
    return (
      <div className='flex justify-center items-center py-12'>
        <Spin size='large' />
      </div>
    )
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <Card>
        <Title level={2}>Edit Address</Title>
        {address && (
          <AddressForm
            initialValues={address}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        )}
      </Card>
    </div>
  )
}

export default AddressEditPage
