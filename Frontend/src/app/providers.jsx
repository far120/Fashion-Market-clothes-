//call for all components that wraped context providers
import { ThemeProvider } from '../context/ThemeContext';
import { ToastProvider } from '../context/ToastContext';
import AuthProvider from '../context/AuthContext';
export default function Providers({ children }) {
  return (
    <>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>{children}</AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </>
  )
}