import React, { useEffect, useState } from 'react'
import { Form, Input, Select, Checkbox, Button, Row, Col } from 'antd'
import { AddressDetail, AddressRequest } from '../../types/address'
import addressService from '../../services/addressService'
import { FormSelectResponse } from '../../types/commonTypes'

interface AddressFormProps {
  initialValues?: AddressDetail
  onSubmit: (values: AddressRequest) => void
  onCancel: () => void
}

const AddressForm: React.FC<AddressFormProps> = ({
  initialValues,
  onSubmit,
  onCancel,
}) => {
  const [form] = Form.useForm()
  const [countries, setCountries] = useState<FormSelectResponse[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchCountries()
  }, [])

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        // Find country ID by name
        countryId:
          countries.find((c) => c.value === initialValues.countryName)?.key ||
          null,
      })
    }
  }, [initialValues, form, countries])

  const fetchCountries = async () => {
    try {
      setLoading(true)
      const data = await addressService.getCountriesFormSelect()
      setCountries(data)
    } catch (error) {
      console.error('Failed to fetch countries:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFinish = (values: AddressRequest) => {
    onSubmit(values)
  }

  return (
    <Form
      form={form}
      layout='vertical'
      onFinish={handleFinish}
      initialValues={{
        defaultForShipping: false,
        addressLine2: '',
        ...initialValues,
      }}
    >
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name='firstName'
            label='First Name'
            rules={[
              { required: true, message: 'Please enter your first name' },
            ]}
          >
            <Input placeholder='First Name' />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name='lastName'
            label='Last Name'
            rules={[{ required: true, message: 'Please enter your last name' }]}
          >
            <Input placeholder='Last Name' />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        name='phoneNumber'
        label='Phone Number'
        rules={[{ required: true, message: 'Please enter your phone number' }]}
      >
        <Input placeholder='Phone Number' />
      </Form.Item>

      <Form.Item
        name='addressLine1'
        label='Address Line 1'
        rules={[{ required: true, message: 'Please enter your address' }]}
      >
        <Input placeholder='Address Line 1' />
      </Form.Item>

      <Form.Item name='addressLine2' label='Address Line 2'>
        <Input placeholder='Address Line 2 (Optional)' />
      </Form.Item>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name='city'
            label='City'
            rules={[{ required: true, message: 'Please enter your city' }]}
          >
            <Input placeholder='City' />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name='state'
            label='State/Province'
            rules={[
              { required: true, message: 'Please enter your state/province' },
            ]}
          >
            <Input placeholder='State/Province' />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name='postalCode'
            label='Postal Code'
            rules={[
              { required: true, message: 'Please enter your postal code' },
            ]}
          >
            <Input placeholder='Postal Code' />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name='countryId'
            label='Country'
            rules={[{ required: true, message: 'Please select your country' }]}
          >
            <Select
              placeholder='Select Country'
              loading={loading}
              options={countries.map((country) => ({
                value: parseInt(country.key),
                label: country.value,
              }))}
            />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item name='defaultForShipping' valuePropName='checked'>
        <Checkbox>Set as default shipping address</Checkbox>
      </Form.Item>

      <Form.Item>
        <div className='flex justify-end gap-2'>
          <Button onClick={onCancel}>Cancel</Button>
          <Button type='primary' htmlType='submit' loading={loading}>
            {initialValues ? 'Update Address' : 'Add Address'}
          </Button>
        </div>
      </Form.Item>
    </Form>
  )
}

export default AddressForm
