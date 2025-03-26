import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AdminContextProvider } from './Admin/useAdmin.jsx'

console.log("asdasd")

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AdminContextProvider>
      <App />
    </AdminContextProvider>
  </StrictMode>,
)
