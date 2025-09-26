import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { StandaloneApp } from './pages/StandaloneApp'

// Create a minimal theme for standalone apps
const standaloneTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
})

// Create a separate query client for standalone apps
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

function StandaloneAppRouter() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={standaloneTheme}>
        <CssBaseline />
        <BrowserRouter>
          <Routes>
            <Route path="/:slug" element={<StandaloneApp />} />
            <Route path="*" element={<StandaloneApp />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

// Create root and render
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
)

root.render(<StandaloneAppRouter />)
