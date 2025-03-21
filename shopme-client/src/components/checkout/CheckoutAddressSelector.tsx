import React, { useEffect, useState } from 'react'
import { Button, Empty, Radio, Space, Spin, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { Address } from '../../types/address'
import addressService from '../../services/addressService'
import { ROUTES } from '../../config/appConfig'
import AddressCard from '../address/AddressCard'

interface CheckoutAddressSelectorProps {
  selectedAddressId: number | null
  onSelect: (addressId: number) => void
}

const CheckoutAddressSelector: React.FC<CheckoutAddressSelectorProps> = ({
  selectedAddressId,
  onSelect,
}) => {
  const navigate = useNavigate()
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

      // If there's a default address and no address is selected, select it
      if (!selectedAddressId) {
        const defaultAddress = data.find((addr) => addr.defaultForShipping)
        if (defaultAddress) {
          onSelect(defaultAddress.id)
        }
      }
    } catch (error) {
      message.error('Failed to fetch addresses')
    } finally {
      setLoading(false)
    }
  }

  const handleAddAddress = () => {
    // Save current checkout state if needed
    navigate(ROUTES.ADDRESS_NEW)
  }

  if (loading) {
    return (
      <div className='flex justify-center items-center py-8'>
        <Spin size='large' />
      </div>
    )
  }

  if (addresses.length === 0) {
    return (
      <Empty description="You haven't added any addresses yet" className='py-8'>
        <Button
          type='primary'
          icon={<PlusOutlined />}
          onClick={handleAddAddress}
        >
          Add Your First Address
        </Button>
      </Empty>
    )
  }

  return (
    <div>
      <Radio.Group
        value={selectedAddressId}
        onChange={(e) => onSelect(e.target.value)}
        className='w-full'
      >
        <Space direction='vertical' className='w-full'>
          {addresses.map((address) => (
            <Radio key={address.id} value={address.id} className='w-full'>
              <div className='ml-2 w-full'>
                <AddressCard
                  address={address}
                  onEdit={() =>
                    navigate(
                      ROUTES.ADDRESS_EDIT.replace(':id', address.id.toString())
                    )
                  }
                  onDelete={() => {}} // Disable delete in checkout
                  onSetDefault={() => {}} // Disable set default in checkout
                />
              </div>
            </Radio>
          ))}
        </Space>
      </Radio.Group>

      <div className='mt-4'>
        <Button
          type='dashed'
          icon={<PlusOutlined />}
          onClick={handleAddAddress}
          block
        >
          Add New Address
        </Button>
      </div>
    </div>
  )
}

export default CheckoutAddressSelector
