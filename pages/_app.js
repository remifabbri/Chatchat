import '../styles/global.scss'
import { AppProps } from 'next/app';
import { AuthProvider } from '../hooks/useAuth';
import { StoreProvider } from '../hooks/useStore';

export default function App({ Component, pageProps }) {
  return(
      <AuthProvider>
        <StoreProvider>
          <Component {...pageProps} />
        </StoreProvider>
      </AuthProvider>
    ) 
  }
    
