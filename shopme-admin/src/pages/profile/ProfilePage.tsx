import React, { useEffect, useState } from 'react'
import {
  Card,
  Form,
  Input,
  Button,
  Upload,
  message,
  Avatar,
  Row,
  Col,
  Spin,
  Tag,
} from 'antd'
import { UserOutlined, UploadOutlined } from '@ant-design/icons'
import { authService } from '../../services/authService'
import { UserProfile } from '../../types/authTypes'
import type { UploadFile } from 'antd/es/upload/interface'

const ProfilePage: React.FC = () => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [fileList, setFileList] = useState<UploadFile[]>([])

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const response = await authService.getProfile()
      setProfile(response)
      form.setFieldsValue({
        firstName: response.firstName,
        lastName: response.lastName,
      })
    } catch (error) {
      console.error('Error fetching profile:', error)
      message.error('Failed to fetch profile')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (values: any) => {
    try {
      setSaving(true)
      const formData = new FormData()
      formData.append('firstName', values.firstName)
      formData.append('lastName', values.lastName)
      if (values.password) {
        formData.append('password', values.password)
      }
      if (fileList[0]?.originFileObj) {
        formData.append('image', fileList[0].originFileObj)
      }

      await authService.updateProfile(formData)
      message.success('Profile updated successfully')
      fetchProfile()
    } catch (error) {
      console.error('Error updating profile:', error)
      message.error('Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const uploadProps = {
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
      return false
    },
    onChange: ({ fileList }: { fileList: UploadFile[] }) => {
      setFileList(fileList)
    },
    fileList,
  }

  if (loading) {
    return (
      <div
        style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}
      >
        <Spin size='large' />
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '24px' }}>
      <Card title='My Profile'>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Avatar size={100} src={profile?.photos} icon={<UserOutlined />} />
        </div>

        <div style={{ marginBottom: 24, textAlign: 'center' }}>
          <div
            style={{
              fontSize: '16px',
              color: 'rgba(0, 0, 0, 0.85)',
              marginBottom: '8px',
            }}
          >
            {profile?.email}
          </div>
          <div>
            {profile?.roles.map((role) => (
              <Tag color='blue' key={role}>
                {role}
              </Tag>
            ))}
          </div>
        </div>

        <Form form={form} layout='vertical' onFinish={handleSubmit}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label='First Name'
                name='firstName'
                rules={[
                  { required: true, message: 'Please input your first name!' },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label='Last Name'
                name='lastName'
                rules={[
                  { required: true, message: 'Please input your last name!' },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label='New Password'
            name='password'
            extra='Leave blank to keep current password'
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label='Profile Photo'
            extra='Supported formats: JPG, PNG. Max size: 2MB'
          >
            <Upload {...uploadProps} listType='picture' maxCount={1}>
              <Button icon={<UploadOutlined />}>Change Photo</Button>
            </Upload>
          </Form.Item>

          <Form.Item>
            <Button type='primary' htmlType='submit' loading={saving}>
              Save Changes
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default ProfilePage
