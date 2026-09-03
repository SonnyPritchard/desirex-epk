import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import DrumsApp from './drums/DrumsApp.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DrumsApp />
  </StrictMode>,
)
