import '@fontsource-variable/bricolage-grotesque'
import '@fontsource-variable/jetbrains-mono'
import '@noirlang/components/styles.css'
import './site.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { NoirProvider } from '@noirlang/components'
import { App } from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <NoirProvider storageKey="nc-theme">
      <App />
    </NoirProvider>
  </StrictMode>,
)
