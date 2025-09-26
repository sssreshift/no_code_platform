import { Routes, Route, Navigate } from 'react-router-dom'
import { Box } from '@mui/material'
import { useEffect } from 'react'

import { Layout } from '@/components/Layout'
import { Dashboard } from '@/pages/Dashboard'
import { AppBuilder } from '@/pages/AppBuilder'
import { AppPreview } from '@/pages/AppPreview'
import { PublishedApp } from '@/pages/PublishedApp'
import { DataSources } from '@/pages/DataSources'
import { Settings } from '@/pages/Settings'
import { Login } from '@/pages/Login'
import { Register } from '@/pages/Register'
import PluginMarketplace from '@/pages/PluginMarketplace'
import ThemeMarketplace from '@/pages/ThemeMarketplace'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { useAuth } from '@/hooks/useAuth'

function App() {
  const { isAuthenticated, initializeAuth } = useAuth()

  // Initialize auth state on app start
  useEffect(() => {
    initializeAuth()
  }, [initializeAuth])

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/apps/slug/:slug" element={<PublishedApp />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    )
  }

  return (
    <ThemeProvider>
      <Routes>
        {/* Published apps should render outside the main layout for standalone experience */}
        <Route path="/apps/slug/:slug" element={<PublishedApp />} />
        
        {/* All other authenticated routes use the main layout */}
        <Route path="*" element={
          <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            <Layout>
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/apps/:appId/builder" element={<AppBuilder />} />
                <Route path="/apps/:appId/preview" element={<AppPreview />} />
                <Route path="/data-sources" element={<DataSources />} />
                <Route path="/marketplace" element={<PluginMarketplace />} />
                <Route path="/themes" element={<ThemeMarketplace />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/login" element={<Navigate to="/dashboard" replace />} />
                <Route path="/register" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </Layout>
          </Box>
        } />
      </Routes>
    </ThemeProvider>
  )
}

export default App
