import React, { useEffect, useState } from 'react'
import {
  Form,
  Input,
  Switch,
  Select,
  Button,
  Upload,
  message,
  Row,
  Col,
} from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import {
  RoleResponse,
  UserCreateRequest,
  UserDetailResponse,
} from '../../types/userTypes'
import { userService } from '../../services/userService'
import type { UploadFile } from 'antd/es/upload/interface'

interface UserFormProps {
  initialValues?: UserDetailResponse
  onSubmit: (values: UserCreateRequest) => Promise<void>
  submitButtonText: string
}

const UserForm: React.FC<UserFormProps> = ({
  initialValues,
  onSubmit,
  submitButtonText,
}) => {
  const [form] = Form.useForm()
  const [roles, setRoles] = useState<RoleResponse[]>([])
  const [loading, setLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState<string>()
  const [fileList, setFileList] = useState<UploadFile[]>([])

  useEffect(() => {
    fetchRoles()
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        roleIds: Array.from(initialValues.roleIds),
      })
      if (initialValues.photos) {
        setImageUrl(initialValues.photos)
      }
    }
  }, [initialValues, form])

  const fetchRoles = async () => {
    try {
      const response = await userService.getRoles()
      setRoles(response)
    } catch (error) {
      console.error('Error fetching roles:', error)
      message.error('Failed to fetch roles')
    }
  }

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true)
      const formData: UserCreateRequest = {
        ...values,
        roleIds: new Set(values.roleIds),
        image: fileList[0]?.originFileObj,
      }
      await onSubmit(formData)
      message.success('User saved successfully')
      if (!initialValues) {
        form.resetFields()
        setFileList([])
        setImageUrl(undefined)
      }
    } catch (error) {
      console.error('Error saving user:', error)
      message.error('Failed to save user')
    } finally {
      setLoading(false)
    }
  }

  const uploadProps = {
    accept: 'image/*',
    showUploadList: true,
    listType: 'picture-card' as const,
    maxCount: 1,
    beforeUpload: (file: File) => {
      const isImage = file.type.startsWith('image/')
      if (!isImage) {
        message.error('You can only upload image files!')
        return false
      }
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        message.error('Image must be smaller than 2MB!')
        return false
      }
      return false // Prevent automatic upload
    },
    onChange: ({ fileList }: { fileList: UploadFile[] }) => {
      setFileList(fileList)
      if (fileList[0]?.originFileObj) {
        const reader = new FileReader()
        reader.onload = () => {
          setImageUrl(reader.result as string)
        }
        reader.readAsDataURL(fileList[0].originFileObj)
      } else if (fileList.length === 0) {
        setImageUrl(initialValues?.photos)
      }
    },
    onRemove: () => {
      setImageUrl(initialValues?.photos)
      setFileList([])
      return true
    },
    fileList,
  }

  return (
    <Form
      form={form}
      layout='vertical'
      onFinish={handleSubmit}
      initialValues={{ enabled: true }}
      style={{ maxWidth: '800px', width: '100%', margin: '0 auto' }}
    >
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label='Email'
            name='email'
            rules={[
              { required: true, message: 'Please input email!' },
              { type: 'email', message: 'Please enter a valid email!' },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label='Password'
            name='password'
            rules={[
              {
                required: !initialValues,
                message: 'Please input password!',
              },
            ]}
            extra={
              initialValues ? 'Leave blank to keep current password' : undefined
            }
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label='First Name'
            name='firstName'
            rules={[{ required: true, message: 'Please input first name!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label='Last Name'
            name='lastName'
            rules={[{ required: true, message: 'Please input last name!' }]}
          >
            <Input />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            label='Roles'
            name='roleIds'
            rules={[
              { required: true, message: 'Please select at least one role!' },
            ]}
          >
            <Select
              mode='multiple'
              placeholder='Select roles'
              options={roles.map((role) => ({
                label: role.name,
                value: role.id,
              }))}
            />
          </Form.Item>

          <Form.Item name='enabled' label='Enabled' valuePropName='checked'>
            <Switch />
          </Form.Item>

          <Form.Item
            label='Photo'
            extra='Supported formats: JPG, PNG. Max size: 2MB'
          >
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
            >
              {imageUrl && !fileList.length && (
                <div style={{ marginBottom: '8px' }}>
                  <p>Current photo:</p>
                  <img
                    src={imageUrl}
                    alt='Current user'
                    style={{
                      maxWidth: '100px',
                      borderRadius: '4px',
                      border: '1px solid #d9d9d9',
                    }}
                  />
                </div>
              )}
              <Upload {...uploadProps}>
                <div>
                  <UploadOutlined />
                  <div style={{ marginTop: 8 }}>
                    {initialValues ? 'Change Photo' : 'Upload Photo'}
                  </div>
                </div>
              </Upload>
            </div>
          </Form.Item>
        </Col>
      </Row>

      <Form.Item>
        <Button type='primary' htmlType='submit' loading={loading}>
          {submitButtonText}
        </Button>
      </Form.Item>
    </Form>
  )
}

export default UserForm
