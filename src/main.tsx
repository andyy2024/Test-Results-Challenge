import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './app/store'
import './styles/index.css'
import ReleasesPage from './ReleasesPage.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <ReleasesPage />
    </Provider>
  </StrictMode>,
)