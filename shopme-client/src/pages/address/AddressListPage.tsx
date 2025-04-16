import React, { useEffect, useState } from 'react'
import { Typography, Button, message, Empty, Spin } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import AddressCard from '../../components/address/AddressCard'
import { Address } from '../../types/address'
import addressService from '../../services/addressService'
import { ROUTES } from '../../config/appConfig'
import { useRoutes } from '../../hooks/useRoutes'

const { Title } = Typography

const AddressListPage: React.FC = () => {
  const navigate = useNavigate()
  const { createRoute } = useRoutes()
  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchAddresses()
  }, [])

  const fetchAddresses = async () => {
    try {
      setLoading(true)
      const data = await addressService.getAddresses()
      setAddresses(data)
    } catch (error) {
      message.error('Không thể tải danh sách địa chỉ')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (id: number) => {
    navigate(createRoute(ROUTES.ADDRESS_EDIT, { id: id.toString() }))
  }

  const handleDelete = async (id: number) => {
    try {
      await addressService.deleteAddress(id)
      message.success('Đã xóa địa chỉ thành công')
      fetchAddresses()
    } catch (error) {
      message.error('Không thể xóa địa chỉ')
    }
  }

  const handleSetDefault = async (id: number) => {
    try {
      await addressService.setDefaultAddress(id)
      message.success('Đã cập nhật địa chỉ mặc định thành công')
      fetchAddresses()
    } catch (error) {
      message.error('Không thể cập nhật địa chỉ mặc định')
    }
  }

  const handleAddAddress = () => {
    navigate(ROUTES.ADDRESS_NEW)
  }

  if (loading) {
    return (
      <div className='flex justify-center items-center py-12'>
        <Spin size='large' />
      </div>
    )
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='flex justify-between items-center mb-6'>
        <Title level={2}>Địa chỉ của tôi</Title>
        <Button
          type='primary'
          icon={<PlusOutlined />}
          onClick={handleAddAddress}
        >
          Thêm địa chỉ mới
        </Button>
      </div>

      {addresses.length === 0 ? (
        <Empty
          description="Bạn chưa thêm địa chỉ nào"
          className='py-12'
        >
          <Button type='primary' onClick={handleAddAddress}>
            Thêm địa chỉ đầu tiên
          </Button>
        </Empty>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {addresses.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onSetDefault={handleSetDefault}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default AddressListPage
