import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import store from './redux/store'
import './index.css'
import AdminApp from './AdminApp.jsx'

createRoot(document.getElementById('admin-root')).render(
  <StrictMode>
    <Provider store={store}>
      <AdminApp />
    </Provider>
  </StrictMode>,
)
