import React, { useEffect, useState } from 'react'
import { Table, Button, Space, Modal, Form, Input, message } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import {
  CountryListResponse,
  CountryListParams,
  CountryCreateRequest,
  CountryUpdateRequest,
} from '../../types/location'
import locationService from '../../services/locationService'

interface Props {
  onSelect?: (country: CountryListResponse) => void
}

export const CountryList: React.FC<Props> = ({ onSelect }) => {
  const [countries, setCountries] = useState<CountryListResponse[]>([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [form] = Form.useForm()
  const [editingId, setEditingId] = useState<number | null>(null)
  const [params, setParams] = useState<CountryListParams>({
    page: 0,
    size: 10,
    sortField: 'name',
    sortDirection: 'asc',
    keyword: '',
  })
  const [total, setTotal] = useState(0)

  const fetchCountries = async () => {
    setLoading(true)
    try {
      const data = await locationService.listCountries(params)
      setCountries(data.content)
      setTotal(data.totalPages)
    } catch (error) {
      console.error('Error fetching countries:', error)
      message.error('Failed to fetch countries')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCountries()
  }, [params])

  const handleTableChange = (pagination: any, _: any, sorter: any) => {
    const direction = sorter.order === 'ascend' ? 'asc' : 'desc'
    const newParams: CountryListParams = {
      ...params,
      page: pagination.current - 1,
      size: pagination.pageSize,
      sortField: sorter.field || 'name',
      sortDirection: direction,
    }
    setParams(newParams)
  }

  const handleSearch = (value: string) => {
    setParams((prev) => ({ ...prev, keyword: value, page: 0 }))
  }

  const handleAdd = () => {
    setEditingId(null)
    form.resetFields()
    setModalVisible(true)
  }

  const handleEdit = async (record: CountryListResponse) => {
    setEditingId(record.id)
    try {
      const country = await locationService.getCountry(record.id)
      form.setFieldsValue(country)
      setModalVisible(true)
    } catch (error) {
      console.error('Error fetching country details:', error)
      message.error('Failed to fetch country details')
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await locationService.deleteCountry(id)
      message.success('Country deleted successfully')
      fetchCountries()
    } catch (error) {
      console.error('Error deleting country:', error)
      message.error('Failed to delete country')
    }
  }

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields()
      if (editingId) {
        const updateRequest: CountryUpdateRequest = {
          name: values.name,
          code: values.code,
        }
        await locationService.updateCountry(editingId, updateRequest)
        message.success('Country updated successfully')
      } else {
        const createRequest: CountryCreateRequest = {
          name: values.name,
          code: values.code,
        }
        await locationService.createCountry(createRequest)
        message.success('Country created successfully')
      }
      setModalVisible(false)
      fetchCountries()
    } catch (error) {
      console.error('Error saving country:', error)
      message.error('Failed to save country')
    }
  }

  const columns: ColumnsType<CountryListResponse> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: true,
    },
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
      sorter: true,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button type='link' onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Button type='link' danger onClick={() => handleDelete(record.id)}>
            Delete
          </Button>
          {onSelect && (
            <Button type='link' onClick={() => onSelect(record)}>
              Manage States
            </Button>
          )}
        </Space>
      ),
    },
  ]

  return (
    <div>
      <div
        style={{
          marginBottom: 16,
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Button type='primary' onClick={handleAdd}>
          Add Country
        </Button>
        <Input.Search
          placeholder='Search countries...'
          onSearch={handleSearch}
          style={{ width: 300 }}
          allowClear
        />
      </div>

      <Table
        columns={columns}
        dataSource={countries}
        rowKey='id'
        loading={loading}
        onChange={handleTableChange}
        pagination={{
          total: 10 * total,
          pageSize: params.size || 10,
          current: (params.page || 0) + 1,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} items`,
        }}
      />

      <Modal
        title={editingId ? 'Edit Country' : 'Add Country'}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
      >
        <Form form={form} layout='vertical'>
          <Form.Item
            name='name'
            label='Name'
            rules={[{ required: true, message: 'Please input country name!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name='code'
            label='Code'
            rules={[
              { required: true, message: 'Please input country code!' },
              { max: 2, message: 'Country code must be 2 characters!' },
              { min: 2, message: 'Country code must be 2 characters!' },
              {
                pattern: /^[A-Z]+$/,
                message: 'Country code must be uppercase letters!',
              },
            ]}
          >
            <Input
              placeholder='e.g. US, UK, VN'
              style={{ textTransform: 'uppercase' }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default CountryList
