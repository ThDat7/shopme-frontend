import React, { useEffect, useState } from 'react'
import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Select,
  message,
  Input as AntInput,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import {
  StateListResponse,
  StateDetailResponse,
  StateListParams,
  FormSelectResponse,
  StateCreateRequest,
  StateUpdateRequest,
} from '../../types/location'
import locationService from '../../services/locationService'

const { Search } = AntInput

interface Props {
  countryId?: number
  onSelect?: (state: StateListResponse) => void
}

export const StateList: React.FC<Props> = ({ countryId, onSelect }) => {
  const [states, setStates] = useState<StateListResponse[]>([])
  const [countries, setCountries] = useState<FormSelectResponse[]>([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [form] = Form.useForm()
  const [editingId, setEditingId] = useState<number | null>(null)
  const [params, setParams] = useState<StateListParams>({
    page: 0,
    size: 10,
    sortField: 'name',
    sortDirection: 'asc',
    keyword: '',
    countryId: countryId,
  })
  const [total, setTotal] = useState(0)

  const fetchStates = async () => {
    setLoading(true)
    try {
      const data = await locationService.listStates(params)
      setStates(data.content)
      setTotal(data.totalPages)
    } catch (error) {
      console.error('Error fetching states:', error)
      message.error('Failed to fetch states')
    } finally {
      setLoading(false)
    }
  }

  const fetchCountries = async () => {
    try {
      const data = await locationService.listCountriesForSelect()
      setCountries(data)
    } catch (error) {
      console.error('Error fetching countries:', error)
      message.error('Failed to fetch countries')
    }
  }

  useEffect(() => {
    fetchCountries()
  }, [])

  useEffect(() => {
    setParams((prev) => ({ ...prev, countryId }))
  }, [countryId])

  useEffect(() => {
    fetchStates()
  }, [params])

  const handleTableChange = (pagination: any, _: any, sorter: any) => {
    const direction = sorter.order === 'ascend' ? 'asc' : 'desc'
    const newParams: StateListParams = {
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
    if (countryId) {
      form.setFieldValue('countryId', countryId)
    }
    setModalVisible(true)
  }

  const handleEdit = async (record: StateListResponse) => {
    setEditingId(record.id)
    try {
      const state = await locationService.getState(record.id)
      form.setFieldsValue(state)
      setModalVisible(true)
    } catch (error) {
      console.error('Error fetching state details:', error)
      message.error('Failed to fetch state details')
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await locationService.deleteState(id)
      message.success('State deleted successfully')
      fetchStates()
    } catch (error) {
      console.error('Error deleting state:', error)
      message.error('Failed to delete state')
    }
  }

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields()
      if (editingId) {
        const updateRequest: StateUpdateRequest = {
          name: values.name,
          countryId: values.countryId,
        }
        await locationService.updateState(editingId, updateRequest)
        message.success('State updated successfully')
      } else {
        const createRequest: StateCreateRequest = {
          name: values.name,
          countryId: values.countryId,
        }
        await locationService.createState(createRequest)
        message.success('State created successfully')
      }
      setModalVisible(false)
      fetchStates()
    } catch (error) {
      console.error('Error saving state:', error)
      message.error('Failed to save state')
    }
  }

  const columns: ColumnsType<StateListResponse> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: true,
    },
    {
      title: 'Country',
      dataIndex: 'country',
      key: 'country',
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
              Select
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
          Add State
        </Button>
        <Search
          placeholder='Search states...'
          onSearch={handleSearch}
          style={{ width: 300 }}
          allowClear
        />
      </div>

      <Table
        columns={columns}
        dataSource={states}
        rowKey='id'
        loading={loading}
        onChange={handleTableChange}
        pagination={{
          total: total * 10,
          pageSize: params.size || 10,
          current: (params.page || 0) + 1,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} items`,
        }}
      />

      <Modal
        title={editingId ? 'Edit State' : 'Add State'}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
      >
        <Form form={form} layout='vertical'>
          <Form.Item
            name='name'
            label='Name'
            rules={[{ required: true, message: 'Please input state name!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name='countryId'
            label='Country'
            rules={[{ required: true, message: 'Please select a country!' }]}
          >
            <Select
              showSearch
              placeholder='Select a country'
              optionFilterProp='children'
              disabled={!!countryId}
            >
              {countries.map((country) => (
                <Select.Option key={country.value} value={country.key}>
                  {country.value}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
