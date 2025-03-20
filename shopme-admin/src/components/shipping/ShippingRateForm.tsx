import React, { useEffect, useState } from 'react'
import { Form, Input, InputNumber, Select, Switch, Button, Space } from 'antd'
import { ShippingRate } from '../../types/shipping'
import { FormSelectOption } from '../../types/commonTypes'
import locationService from '../../services/locationService'

interface Props {
  initialValues?: ShippingRate
  onSubmit: (values: any) => void
  onCancel: () => void
}

const ShippingRateForm: React.FC<Props> = ({
  initialValues,
  onSubmit,
  onCancel,
}) => {
  const [form] = Form.useForm()
  const [countries, setCountries] = useState<FormSelectOption[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchCountries()
  }, [])

  const fetchCountries = async () => {
    try {
      setLoading(true)
      const data = await locationService.listCountriesForSelect()
      setCountries(data)
    } catch (error) {
      console.error('Failed to fetch countries:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFinish = (values: any) => {
    onSubmit(values)
  }

  return (
    <Form
      form={form}
      layout='vertical'
      initialValues={{
        codSupported: false,
        ...initialValues,
      }}
      onFinish={handleFinish}
    >
      <Form.Item
        name='countryId'
        label='Country'
        rules={[{ required: true, message: 'Please select a country' }]}
      >
        <Select
          loading={loading}
          placeholder='Select a country'
          showSearch
          optionFilterProp='children'
        >
          {countries.map((country) => (
            <Select.Option key={country.key} value={parseInt(country.key)}>
              {country.value}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name='state'
        label='State'
        rules={[{ required: true, message: 'Please enter a state' }]}
      >
        <Input placeholder='Enter state name' />
      </Form.Item>

      <Form.Item
        name='rate'
        label='Rate ($)'
        rules={[{ required: true, message: 'Please enter shipping rate' }]}
      >
        <InputNumber
          min={0}
          step={0.01}
          precision={2}
          style={{ width: '100%' }}
          placeholder='Enter shipping rate'
        />
      </Form.Item>

      <Form.Item
        name='days'
        label='Days to Deliver'
        rules={[{ required: true, message: 'Please enter delivery days' }]}
      >
        <InputNumber
          min={1}
          style={{ width: '100%' }}
          placeholder='Enter delivery days'
        />
      </Form.Item>

      <Form.Item
        name='codSupported'
        label='COD Support'
        valuePropName='checked'
      >
        <Switch />
      </Form.Item>

      <Form.Item>
        <Space>
          <Button type='primary' htmlType='submit'>
            {initialValues ? 'Update' : 'Create'}
          </Button>
          <Button onClick={onCancel}>Cancel</Button>
        </Space>
      </Form.Item>
    </Form>
  )
}

export default ShippingRateForm
