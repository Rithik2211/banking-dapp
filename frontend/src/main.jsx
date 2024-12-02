import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { MetaMaskProvider } from "@metamask/sdk-react";

const GOOGLE_CLIENT_ID = import.meta.env.REACT_APP_GOOGLE_CLIENT_ID;
const GOOLGLE_ID = import.meta.env.GOOGLE_TOKEN_ID;
createRoot(document.getElementById('root')).render( 
  <MetaMaskProvider
    sdkOptions={{
      dappMetadata: {
        name: "DeFi Banking Dapp",
        url: window.location.href,
      },
      infuraAPIKey: import.meta.env.INFURA_API_KEY,
    }}
  >
    <GoogleOAuthProvider clientId = {GOOGLE_CLIENT_ID}>
      <App /> 
    </GoogleOAuthProvider>
  </MetaMaskProvider>
)
