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
                Default
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
            Edit
          </Button>
          <Popconfirm
            title='Are you sure you want to delete this address?'
            onConfirm={() => onDelete(address.id)}
            okText='Yes'
            cancelText='No'
          >
            <Button type='text' danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
          {!address.defaultForShipping && (
            <Button
              type='link'
              onClick={() => onSetDefault(address.id)}
              className='ml-2'
            >
              Set as Default
            </Button>
          )}
        </Space>
      </div>
    </Card>
  )
}

export default AddressCard
