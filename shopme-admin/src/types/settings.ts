export enum SettingCategory {
  GENERAL = 'GENERAL',
  CURRENCY = 'CURRENCY',
  OTHER = 'OTHER',
}

export enum CurrencySymbolPosition {
  BEFORE = 'BEFORE',
  AFTER = 'AFTER',
}

export enum DecimalPointType {
  POINT = 'POINT',
  COMMA = 'COMMA',
}

export enum ThousandsPointType {
  POINT = 'POINT',
  COMMA = 'COMMA',
}

export interface GeneralSetting {
  siteName: string
  copyright: string
}

export interface GeneralSettingResponse extends GeneralSetting {
  siteLogo: string
}

export interface GeneralSettingRequest extends GeneralSetting {
  siteLogo?: File
}

export interface CurrencySettings {
  currencyId: number
  currencySymbolPosition: CurrencySymbolPosition
  decimalDigits: number
  decimalPointType: DecimalPointType
  thousandsPointType: ThousandsPointType
}

export interface OtherSetting {
  key: string
  value: string
}

export interface SettingResponse {
  key: string
  value: string
  category: SettingCategory
}

export interface CurrencySelectResponse {
  id: number
  name: string
  symbol: string
  code: string
}
