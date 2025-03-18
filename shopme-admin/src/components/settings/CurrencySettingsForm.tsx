import React, { useEffect, useState } from 'react'
import {
  Form,
  Input,
  Select,
  Button,
  Space,
  Typography,
  InputNumber,
} from 'antd'
import type { SelectProps } from 'antd'
import {
  CurrencySettings,
  CurrencySymbolPosition,
  DecimalPointType,
  ThousandsPointType,
  CurrencySelectResponse,
} from '../../types/settings'
import settingService from '../../services/settingService'

const { Title, Text } = Typography

interface Props {
  initialData?: CurrencySettings
  onSubmit: (data: CurrencySettings) => void
}

export const CurrencySettingsForm: React.FC<Props> = ({
  initialData,
  onSubmit,
}) => {
  const [form] = Form.useForm()
  const [currencies, setCurrencies] = useState<CurrencySelectResponse[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchCurrencies = async () => {
      setLoading(true)
      try {
        const data = await settingService.listCurrencies()
        setCurrencies(data)
      } catch (error) {
        console.error('Error fetching currencies:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCurrencies()
  }, [])

  const handleSubmit = (values: any) => {
    onSubmit(values)
  }

  const handleReset = () => {
    form.setFieldsValue({
      currencyId: initialData?.currencyId || 1,
      currencySymbolPosition:
        initialData?.currencySymbolPosition || CurrencySymbolPosition.BEFORE,
      decimalDigits: initialData?.decimalDigits || 2,
      decimalPointType: initialData?.decimalPointType || DecimalPointType.POINT,
      thousandsPointType:
        initialData?.thousandsPointType || ThousandsPointType.COMMA,
    })
  }

  const filterOption: SelectProps['filterOption'] = (input, option) => {
    return option?.label
      ? option.label.toString().toLowerCase().includes(input.toLowerCase())
      : false
  }

  return (
    <Form
      form={form}
      layout='vertical'
      initialValues={{
        currencyId: initialData?.currencyId || 1,
        currencySymbolPosition:
          initialData?.currencySymbolPosition || CurrencySymbolPosition.BEFORE,
        decimalDigits: initialData?.decimalDigits || 2,
        decimalPointType:
          initialData?.decimalPointType || DecimalPointType.POINT,
        thousandsPointType:
          initialData?.thousandsPointType || ThousandsPointType.COMMA,
      }}
      onFinish={handleSubmit}
      style={{ maxWidth: 600 }}
    >
      <Title level={5}>Currency Settings</Title>
      <Text type='secondary' style={{ marginBottom: '24px', display: 'block' }}>
        Configure how currency values are displayed across your website.
      </Text>

      <Form.Item
        label='Currency'
        name='currencyId'
        rules={[{ required: true, message: 'Please select a currency!' }]}
        extra='Select the currency for your website.'
      >
        <Select
          loading={loading}
          placeholder='Select a currency'
          optionFilterProp='label'
          showSearch
          filterOption={filterOption}
          options={currencies.map((currency) => ({
            value: currency.id,
            label: `${currency.name} (${currency.code}) - ${currency.symbol}`,
          }))}
        />
      </Form.Item>

      <Form.Item
        label='Symbol Position'
        name='currencySymbolPosition'
        rules={[{ required: true, message: 'Please select symbol position!' }]}
        extra='Choose where to display the currency symbol.'
      >
        <Select>
          <Select.Option value={CurrencySymbolPosition.BEFORE}>
            Before Amount ($100)
          </Select.Option>
          <Select.Option value={CurrencySymbolPosition.AFTER}>
            After Amount (100$)
          </Select.Option>
        </Select>
      </Form.Item>

      <Form.Item
        label='Decimal Digits'
        name='decimalDigits'
        rules={[{ required: true, message: 'Please input decimal digits!' }]}
        extra='Number of digits after decimal point.'
      >
        <Select>
          <Select.Option value={0}>0 (100)</Select.Option>
          <Select.Option value={1}>1 (100.0)</Select.Option>
          <Select.Option value={2}>2 (100.00)</Select.Option>
          <Select.Option value={3}>3 (100.000)</Select.Option>
          <Select.Option value={4}>4 (100.0000)</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item
        label='Decimal Point Type'
        name='decimalPointType'
        rules={[
          { required: true, message: 'Please select decimal point type!' },
        ]}
        extra='Symbol used as decimal separator.'
      >
        <Select>
          <Select.Option value={DecimalPointType.POINT}>
            Point (100.00)
          </Select.Option>
          <Select.Option value={DecimalPointType.COMMA}>
            Comma (100,00)
          </Select.Option>
        </Select>
      </Form.Item>

      <Form.Item
        label='Thousands Point Type'
        name='thousandsPointType'
        rules={[
          { required: true, message: 'Please select thousands point type!' },
        ]}
        extra='Symbol used as thousands separator.'
      >
        <Select>
          <Select.Option value={ThousandsPointType.COMMA}>
            Comma (1,000.00)
          </Select.Option>
          <Select.Option value={ThousandsPointType.POINT}>
            Point (1.000,00)
          </Select.Option>
        </Select>
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
