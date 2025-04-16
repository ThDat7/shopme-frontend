import React from 'react'
import { Card, Typography, Tag, Button, Popconfirm, Space } from 'antd'
import {
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons'
import { Address } from '../../types/address'

const { Text, Title } = Typography

interface AddressCardProps {
  address: Address
  onEdit: (id: number) => void
  onDelete: (id: number) => void
  onSetDefault: (id: number) => void
}

const AddressCard: React.FC<AddressCardProps> = ({
  address,
  onEdit,
  onDelete,
  onSetDefault,
}) => {
  return (
    <Card
      hoverable
      className='mb-4'
      style={{
        borderColor: address.defaultForShipping ? '#1890ff' : undefined,
      }}
    >
      <div className='flex justify-between items-start'>
        <div>
          <div className='flex items-center mb-2'>
            <Title level={5} className='m-0 mr-2'>
              {address.recipientName}
            </Title>
            {address.defaultForShipping && (
              <Tag color='blue' icon={<CheckCircleOutlined />}>
                Mặc định
              </Tag>
            )}
          </div>
          <Text className='block mb-1'>{address.phoneNumber}</Text>
          <Text className='block' type='secondary'>
            {address.address}
          </Text>
        </div>
        <Space>
          <Button
            type='text'
            icon={<EditOutlined />}
            onClick={() => onEdit(address.id)}
          >
            Sửa
          </Button>
          <Popconfirm
            title='Bạn có chắc chắn muốn xóa địa chỉ này?'
            onConfirm={() => onDelete(address.id)}
            okText='Có'
            cancelText='Không'
          >
            <Button type='text' danger icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
          {!address.defaultForShipping && (
            <Button
              type='link'
              onClick={() => onSetDefault(address.id)}
              className='ml-2'
            >
              Đặt làm mặc định
            </Button>
          )}
        </Space>
      </div>
    </Card>
  )
}

export default AddressCard
