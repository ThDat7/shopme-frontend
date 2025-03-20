import React from 'react'
import {
  GoogleOAuthProvider,
  GoogleLogin,
  CredentialResponse,
} from '@react-oauth/google'
import { APP_CONFIG } from '../../config/appConfig'

interface GoogleLoginComponentProps {
  onLoginSuccess: (credential: string) => void
}

const GoogleLoginComponent: React.FC<GoogleLoginComponentProps> = ({
  onLoginSuccess,
}) => {
  const handleGoogleLogin = (response: CredentialResponse) => {
    if (response.credential) {
      onLoginSuccess(response.credential)
    }
  }

  return (
    <GoogleOAuthProvider clientId={APP_CONFIG.GOOGLE_CLIENT_ID}>
      <GoogleLogin
        onSuccess={handleGoogleLogin}
        onError={() => {
          console.error('Login Failed')
        }}
        useOneTap
        shape='rectangular'
        theme='filled_blue'
        text='continue_with'
        size='large'
      />
    </GoogleOAuthProvider>
  )
}

export default GoogleLoginComponent
