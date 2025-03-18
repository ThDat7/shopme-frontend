import React, { useState } from 'react'
import { Form, Input, Upload, Button, Space, Typography, Image } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import {
  GeneralSettingRequest,
  GeneralSettingResponse,
} from '../../types/settings'

const { Title, Text } = Typography

interface Props {
  initialData?: GeneralSettingResponse
  onSubmit: (data: GeneralSettingRequest) => void
}

export const GeneralSettingsForm: React.FC<Props> = ({
  initialData,
  onSubmit,
}) => {
  const [form] = Form.useForm()
  const [logo, setLogo] = useState<string | null>(null)
  const [logoPreview, setLogoPreview] = useState<string>(
    initialData?.siteLogo || ''
  )

  const handleSubmit = (values: any) => {
    const formData = {
      siteName: values.siteName || '',
      copyright: values.copyright || '',
      siteLogo: logo || undefined,
    } as GeneralSettingRequest
    onSubmit(formData)
  }

  const handleReset = () => {
    form.setFieldsValue({
      siteName: initialData?.siteName || '',
      copyright: initialData?.copyright || '',
    })
    setLogoPreview('')
  }

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e
    }
    if (e?.fileList?.[0]) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setLogoPreview(reader.result as string)
      }
      reader.readAsDataURL(e.fileList[0].originFileObj)
    } else {
      setLogoPreview('')
    }
    return e?.fileList
  }

  const handleLogoChange = ({ fileList }: any) => {
    setLogo(fileList[0].originFileObj)

    if (fileList[0].originFileObj) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setLogoPreview(reader.result as string)
      }
      reader.readAsDataURL(fileList[0].originFileObj)
    }
  }

  return (
    <Form
      form={form}
      layout='vertical'
      initialValues={{
        siteName: initialData?.siteName || '',
        copyright: initialData?.copyright || '',
      }}
      onFinish={handleSubmit}
      style={{ maxWidth: 600 }}
    >
      <Title level={5}>General Information</Title>
      <Text type='secondary' style={{ marginBottom: '24px', display: 'block' }}>
        Basic information about your website.
      </Text>

      <Form.Item
        label='Site Name'
        name='siteName'
        rules={[{ required: true, message: 'Please input the site name!' }]}
        extra='The name of your website that will be displayed to users.'
      >
        <Input placeholder='Enter site name' />
      </Form.Item>

      <Form.Item
        label='Site Logo'
        name='siteLogo'
        valuePropName='fileList'
        getValueFromEvent={normFile}
        extra='Recommended size: 200x200 pixels. Maximum file size: 2MB.'
      >
        {logoPreview && (
          <Image
            src={logoPreview}
            style={{ marginBottom: 16, maxWidth: '100%', borderRadius: 8 }}
          />
        )}
        <Upload
          accept='image/*'
          maxCount={1}
          listType='picture'
          beforeUpload={() => false}
          showUploadList={false}
          onChange={handleLogoChange}
          style={{ width: '100%' }}
        >
          <Button
            icon={<UploadOutlined />}
            style={{ width: '100%', height: 40 }}
          >
            Select Logo
          </Button>
        </Upload>
      </Form.Item>

      <Form.Item
        label='Copyright Text'
        name='copyright'
        rules={[
          { required: true, message: 'Please input the copyright text!' },
        ]}
        extra='Copyright text that will appear in the footer of your website.'
      >
        <Input placeholder='Enter copyright text' />
      </Form.Item>

      <Form.Item>
        <Space>
          <Button type='primary' htmlType='submit'>
            Save Changes
          </Button>
          <Button onClick={handleReset}>Reset</Button>
        </Space>
      </Form.Item>
    </Form>
  )
}
