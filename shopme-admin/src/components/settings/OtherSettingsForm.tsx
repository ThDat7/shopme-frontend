import React from 'react'
import { Form, Input, Button, Space, Typography } from 'antd'
import { OtherSetting } from '../../types/settings'

const { Title, Text } = Typography

interface Props {
  initialData?: OtherSetting[]
  onSubmit: (data: OtherSetting[]) => void
}

export const OtherSettingsForm: React.FC<Props> = ({
  initialData,
  onSubmit,
}) => {
  const [form] = Form.useForm()
  // const [settings, setSettings] = useState<OtherSetting[]>(initialData || [])

  const handleSubmit = (values: { settings: OtherSetting[] }) => {
    onSubmit(values.settings)
  }

  return (
    <Form
      form={form}
      layout='vertical'
      initialValues={{ settings: initialData }}
      onFinish={handleSubmit}
      style={{ maxWidth: 600 }}
    >
      <Title level={5}>Other Settings</Title>
      <Text type='secondary' style={{ marginBottom: '24px', display: 'block' }}>
        Add or remove custom key-value settings for your website.
      </Text>

      <Form.List name='settings'>
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Space
                key={key}
                style={{ display: 'flex', marginBottom: 8 }}
                align='baseline'
              >
                <Form.Item
                  {...restField}
                  name={[name, 'key']}
                  rules={[{ required: true, message: 'Key is required' }]}
                >
                  <Input placeholder='Key' />
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, 'value']}
                  rules={[{ required: true, message: 'Value is required' }]}
                >
                  <Input placeholder='Value' />
                </Form.Item>
                <Button type='dashed' onClick={() => remove(name)}>
                  Remove
                </Button>
              </Space>
            ))}
            <Form.Item>
              <Button type='dashed' onClick={() => add()} block>
                Add Setting
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>

      <Form.Item>
        <Space>
          <Button type='primary' htmlType='submit'>
            Save Changes
          </Button>
        </Space>
      </Form.Item>
    </Form>
  )
}
