import { useEffect, useState } from 'react'
import { Tabs, Card, Spin, Typography, message } from 'antd'
import { GeneralSettingsForm } from '../../components/settings/GeneralSettingsForm'
import { CurrencySettingsForm } from '../../components/settings/CurrencySettingsForm'
import { OtherSettingsForm } from '../../components/settings/OtherSettingsForm'
import settingService from '../../services/settingService'
import {
  CurrencySettings,
  GeneralSettingRequest,
  OtherSetting,
  SettingCategory,
  SettingResponse,
} from '../../types/settings'

const { Title, Text } = Typography

export default function SettingsPage() {
  const [settings, setSettings] = useState<
    Record<SettingCategory, SettingResponse[]>
  >({
    [SettingCategory.GENERAL]: [],
    [SettingCategory.CURRENCY]: [],
    [SettingCategory.OTHER]: [],
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const categories = await settingService.getSettingCategories()
        const settingsData: Record<SettingCategory, SettingResponse[]> = {
          [SettingCategory.GENERAL]: [],
          [SettingCategory.CURRENCY]: [],
          [SettingCategory.OTHER]: [],
        }

        for (const category of categories) {
          const categorySettings = await settingService.getSettingsByCategory(
            category
          )
          settingsData[category] = categorySettings
        }

        setSettings(settingsData)
      } catch (error) {
        console.error('Error loading settings:', error)
        message.error('Failed to load settings')
      } finally {
        setIsLoading(false)
      }
    }

    loadSettings()
  }, [])

  const handleGeneralSubmit = async (data: GeneralSettingRequest) => {
    try {
      const updatedSettings = await settingService.updateGeneralSettings(data)
      setSettings((prev) => ({
        ...prev,
        [SettingCategory.GENERAL]: updatedSettings,
      }))
      message.success('General settings updated successfully')
    } catch (error) {
      console.error('Error updating general settings:', error)
      message.error('Failed to update general settings')
    }
  }

  const handleCurrencySubmit = async (data: CurrencySettings) => {
    try {
      const updatedSettings = await settingService.updateCurrencySettings(data)
      setSettings((prev) => ({
        ...prev,
        [SettingCategory.CURRENCY]: updatedSettings,
      }))
      message.success('Currency settings updated successfully')
    } catch (error) {
      console.error('Error updating currency settings:', error)
      message.error('Failed to update currency settings')
    }
  }

  const handleOtherSubmit = async (data: OtherSetting[]) => {
    try {
      const updatedSettings = await settingService.updateOtherSettings(data)
      setSettings((prev) => ({
        ...prev,
        [SettingCategory.OTHER]: updatedSettings,
      }))
      message.success('Other settings updated successfully')
    } catch (error) {
      console.error('Error updating other settings:', error)
      message.error('Failed to update other settings')
    }
  }

  if (isLoading) {
    return (
      <div
        style={{
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Spin size='large' />
      </div>
    )
  }

  const items = [
    {
      key: '1',
      label: 'General',
      children: (
        <GeneralSettingsForm
          initialData={{
            siteName:
              settings[SettingCategory.GENERAL].find(
                (s) => s.key === 'SITE_NAME'
              )?.value || '',
            copyright:
              settings[SettingCategory.GENERAL].find(
                (s) => s.key === 'COPYRIGHT'
              )?.value || '',
            siteLogo:
              settings[SettingCategory.GENERAL].find(
                (s) => s.key === 'SITE_LOGO'
              )?.value || '',
          }}
          onSubmit={handleGeneralSubmit}
        />
      ),
    },
    {
      key: '2',
      label: 'Currency',
      children: (
        <CurrencySettingsForm
          initialData={{
            currencyId: parseInt(
              settings[SettingCategory.CURRENCY].find(
                (s) => s.key === 'CURRENCY_ID'
              )?.value || '1'
            ),
            currencySymbolPosition:
              (settings[SettingCategory.CURRENCY].find(
                (s) => s.key === 'CURRENCY_SYMBOL_POSITION'
              )?.value as CurrencySettings['currencySymbolPosition']) ||
              'BEFORE',
            decimalDigits: parseInt(
              settings[SettingCategory.CURRENCY].find(
                (s) => s.key === 'DECIMAL_DIGITS'
              )?.value || '2'
            ),
            decimalPointType:
              (settings[SettingCategory.CURRENCY].find(
                (s) => s.key === 'DECIMAL_POINT_TYPE'
              )?.value as CurrencySettings['decimalPointType']) || 'POINT',
            thousandsPointType:
              (settings[SettingCategory.CURRENCY].find(
                (s) => s.key === 'THOUSANDS_POINT_TYPE'
              )?.value as CurrencySettings['thousandsPointType']) || 'COMMA',
          }}
          onSubmit={handleCurrencySubmit}
        />
      ),
    },
    {
      key: '3',
      label: 'Other',
      children: (
        <OtherSettingsForm
          initialData={settings[SettingCategory.OTHER].map((s) => ({
            key: s.key,
            value: s.value,
          }))}
          onSubmit={handleOtherSubmit}
        />
      ),
    },
  ]

  return (
    <div style={{ padding: '24px' }}>
      <Card bordered={false}>
        <Title level={2}>Settings</Title>
        <Text
          type='secondary'
          style={{ marginBottom: '24px', display: 'block' }}
        >
          Manage your application settings and preferences
        </Text>
        <Tabs
          defaultActiveKey='1'
          items={items}
          type='card'
          style={{ marginTop: '16px' }}
        />
      </Card>
    </div>
  )
}
