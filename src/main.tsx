import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter, type LinkProps } from '@tanstack/react-router'
import './lib/api';

import {} from './index.css';

// Import the generated route tree
import { routeTree } from './routeTree.gen'

// Create a new router instance
const router = createRouter({ routeTree })

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }

  interface StaticDataRouteOption {
    navbarLabel ?: string,
    navbar ?: {
      getLabel : () => string;
      getLink ?: () => LinkProps;
    }

    breadcrumb ?: {
      getTitle  : () => string;
      getLink  ?: () => LinkProps;  
    }
  }
}

// Render the app
const rootElement = document.getElementById('root')!
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>,
  )
}