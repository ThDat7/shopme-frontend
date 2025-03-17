import { ThemeConfig } from 'antd'

const theme: ThemeConfig = {
  token: {
    colorPrimary: '#1677ff',
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#ff4d4f',
    colorInfo: '#1677ff',
    borderRadius: 6,
  },
  components: {
    Button: {
      primaryColor: '#1677ff',
      algorithm: true,
    },
    Card: {
      algorithm: true,
    },
    Tag: {
      algorithm: true,
    },
  },
}

export default theme
