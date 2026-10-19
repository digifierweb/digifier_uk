import React from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import App from './App.jsx'
import './styles.css'

const root = document.getElementById('root')
const app = (
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
)

// Only hydrate when the server sent the prerendered page for this exact route;
// if a host falls back to another page's HTML, render fresh instead of mismatching.
const path = location.pathname.replace(/\/+$/, '') || '/'
if (root.hasChildNodes() && root.dataset.path === path) hydrateRoot(root, app)
else {
  root.textContent = ''
  createRoot(root).render(app)
}
