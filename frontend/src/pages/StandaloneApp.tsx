import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import {
  Box,
  CircularProgress,
  Alert,
} from '@mui/material'
import { appsApi } from '@/services/api'
import type { AppWithContent } from '@/types'
import AppRenderer from '@/components/AppRenderer'

export const StandaloneApp: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const [appContent, setAppContent] = useState<AppWithContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (slug) {
      fetchPublishedApp(slug)
    }
  }, [slug])

  const fetchPublishedApp = async (appSlug: string) => {
    try {
      setLoading(true)
      setError(null)
      
      // Fetch app content (pages, components, layouts) for standalone rendering
      const content = await appsApi.getStandaloneApp(appSlug)
      setAppContent(content)
    } catch (err: any) {
      console.error('Error fetching published app:', err)
      if (err.response?.status === 404) {
        setError('App not found or not published')
      } else {
        setError(err.message || 'Failed to load app')
      }
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          backgroundColor: '#f5f5f5'
        }}
      >
        <CircularProgress size={60} />
      </Box>
    )
  }

  if (error) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          backgroundColor: '#f5f5f5',
          padding: 3
        }}
      >
        <Alert severity="error" sx={{ maxWidth: 500 }}>
          {error}
        </Alert>
      </Box>
    )
  }

  if (!appContent) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          backgroundColor: '#f5f5f5'
        }}
      >
        <Alert severity="warning">
          No app content available
        </Alert>
      </Box>
    )
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: (appContent.config?.theme as any)?.backgroundColor || '#ffffff',
        fontFamily: (appContent.config?.theme as any)?.fontFamily || 'inherit'
      }}
    >
      <AppRenderer
        pages={appContent.pages || []}
        components={appContent.components || []}
        layouts={appContent.layouts || []}
        loading={false}
        error={undefined}
        standalone={true}
      />
    </Box>
  )
}
