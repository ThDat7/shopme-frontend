import React, { useEffect, useState } from 'react'
import { Form, Input, Select, Checkbox, Button, Row, Col } from 'antd'
import { AddressDetail, AddressRequest } from '../../types/address'
import LocationService from '../../services/location.service'
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
  const [loading, setLoading] = useState(false)
  const [provinces, setProvinces] = useState<FormSelectResponse[]>([])
  const [districts, setDistricts] = useState<FormSelectResponse[]>([])
  const [wards, setWards] = useState<FormSelectResponse[]>([])

  useEffect(() => {
    fetchProvinces()
  }, [])

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
      })
      
      if (initialValues.provinceId) {
        fetchDistricts(initialValues.provinceId)
      }
      
      if (initialValues.districtId) {
        fetchWards(initialValues.districtId)
      }
    }
  }, [initialValues, form])

  const fetchProvinces = async () => {
    try {
      setLoading(true)
      const data = await LocationService.getAllProvinces()
      setProvinces(data)
    } catch (error) {
      console.error('Failed to fetch provinces:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchDistricts = async (provinceId: number) => {
    try {
      setLoading(true)
      const data = await LocationService.getDistrictsByProvinceId(provinceId)
      setDistricts(data)
    } catch (error) {
      console.error('Failed to fetch districts:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchWards = async (districtId: number) => {
    try {
      setLoading(true)
      const data = await LocationService.getWardsByDistrictId(districtId)
      setWards(data)
    } catch (error) {
      console.error('Failed to fetch wards:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleProvinceChange = (value: number) => {
    form.setFieldsValue({ districtId: undefined, wardId: undefined })
    setDistricts([])
    setWards([])
    fetchDistricts(value)
  }

  const handleDistrictChange = (value: number) => {
    form.setFieldsValue({ wardId: undefined })
    setWards([])
    fetchWards(value)
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
        ...initialValues,
      }}
    >
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name='firstName'
            label='Tên'
            rules={[
              { required: true, message: 'Vui lòng nhập tên của bạn' },
            ]}
          >
            <Input placeholder='Tên' />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name='lastName'
            label='Họ'
            rules={[{ required: true, message: 'Vui lòng nhập họ của bạn' }]}
          >
            <Input placeholder='Họ' />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        name='phoneNumber'
        label='Số điện thoại'
        rules={[
          { required: true, message: 'Vui lòng nhập số điện thoại của bạn' },
          { 
            pattern: /^\d{10}$/, 
            message: 'Số điện thoại phải có 10 chữ số' 
          }
        ]}
      >
        <Input placeholder='Số điện thoại' />
      </Form.Item>

      <Form.Item
        name='addressLine'
        label='Địa chỉ'
        rules={[{ required: true, message: 'Vui lòng nhập địa chỉ của bạn' }]}
      >
        <Input placeholder='Địa chỉ' />
      </Form.Item>

      <Row gutter={16}>
        <Col span={8}>
          <Form.Item
            name='provinceId'
            label='Tỉnh/Thành phố'
            rules={[{ required: true, message: 'Vui lòng chọn tỉnh/thành phố' }]}
          >
            <Select
              showSearch
              placeholder='Chọn Tỉnh/Thành phố'
              loading={loading}
              filterOption={(input, option) =>
                (option?.label?.toString().toLowerCase() || '').includes(input.toLowerCase())
              }
              options={provinces.map((province) => ({
                value: parseInt(province.key),
                label: province.value,
              }))}
              onChange={handleProvinceChange}
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name='districtId'
            label='Quận/Huyện'
            rules={[{ required: true, message: 'Vui lòng chọn quận/huyện' }]}
          >
            <Select
              showSearch
              placeholder='Chọn Quận/Huyện'
              loading={loading}
              filterOption={(input, option) =>
                (option?.label?.toString().toLowerCase() || '').includes(input.toLowerCase())
              }
              disabled={!form.getFieldValue('provinceId')}
              options={districts.map((district) => ({
                value: parseInt(district.key),
                label: district.value,
              }))}
              onChange={handleDistrictChange}
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name='wardId'
            label='Phường/Xã'
            rules={[{ required: true, message: 'Vui lòng chọn phường/xã' }]}
          >
            <Select
              showSearch
              placeholder='Chọn Phường/Xã'
              loading={loading}
              filterOption={(input, option) =>
                (option?.label?.toString().toLowerCase() || '').includes(input.toLowerCase())
              }
              disabled={!form.getFieldValue('districtId')}
              options={wards.map((ward) => ({
                value: parseInt(ward.key),
                label: ward.value,
              }))}
            />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item name='defaultForShipping' valuePropName='checked'>
        <Checkbox>Đặt làm địa chỉ giao hàng mặc định</Checkbox>
      </Form.Item>

      <Form.Item>
        <div className='flex justify-end gap-2'>
          <Button onClick={onCancel}>Hủy</Button>
          <Button type='primary' htmlType='submit' loading={loading}>
            {initialValues ? 'Cập nhật địa chỉ' : 'Thêm địa chỉ'}
          </Button>
        </div>
      </Form.Item>
    </Form>
  )
}

export default AddressForm
