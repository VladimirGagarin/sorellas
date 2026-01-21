import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider, HashRouter} from 'react-router-dom'
import './index.css'
import App from './App.jsx'

const router = H([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "*",
    element: <App />,
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
