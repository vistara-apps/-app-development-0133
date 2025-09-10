import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App-fixed.jsx'
import './index.css'
import { ToastProvider } from './components/ToastProvider'
import { useThemeStore } from './stores/themeStore'

// Initialize theme before rendering
const { initTheme } = useThemeStore.getState()
initTheme()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ToastProvider>
        <App />
      </ToastProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
