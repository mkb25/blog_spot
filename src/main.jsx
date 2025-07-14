import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import BlogSpot from './Blog.jsx'
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BlogSpot/>
  </StrictMode>,
)
