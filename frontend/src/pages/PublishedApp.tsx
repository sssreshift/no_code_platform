import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Button,
} from '@mui/material'
import {
  ArrowBack as ArrowBackIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { appsApi } from '@/services/api'
import type { App, AppWithContent } from '@/types'
import AppRenderer from '@/components/AppRenderer'

export const PublishedApp: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const [appData, setAppData] = useState<App | null>(null)
  const [appContent, setAppContent] = useState<AppWithContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [contentLoading, setContentLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (slug) {
      fetchPublishedApp(slug)
    }
  }, [slug])

  const fetchPublishedApp = async (appSlug: string) => {
    try {
      setLoading(true)
      setContentLoading(true)
      setError(null)
      
      // Fetch basic app data
      const data = await appsApi.getAppBySlug(appSlug)
      setAppData(data)
      
      // Fetch app content (pages, components, layouts)
      const content = await appsApi.getPublishedAppContent(appSlug)
      console.log('Published app content:', content)
      console.log('Pages:', content?.pages)
      console.log('Components:', content?.components)
      console.log('Layouts:', content?.layouts)
      console.log('Pages length:', content?.pages?.length)
      console.log('Components length:', content?.components?.length)
      console.log('Layouts length:', content?.layouts?.length)
      
      // Check if we have any content at all
      if (!content?.pages?.length && !content?.components?.length) {
        console.warn('No pages or components found for this app')
      }
      
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
      setContentLoading(false)
    }
  }

  const handleGoBack = () => {
    navigate('/dashboard')
  }

  const handleRefresh = () => {
    if (slug) {
      fetchPublishedApp(slug)
    }
  }

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center',
        minHeight: '100vh',
        gap: 2
      }}>
        <CircularProgress size={60} />
        <Typography variant="h6" color="text.secondary">
          Loading your published app...
        </Typography>
      </Box>
    )
  }

  if (error) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center',
        minHeight: '100vh',
        gap: 3,
        p: 3
      }}>
        <Alert severity="error" sx={{ maxWidth: 500 }}>
          {error}
        </Alert>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={handleGoBack}
          >
            Back to Dashboard
          </Button>
          <Button
            variant="contained"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
          >
            Try Again
          </Button>
        </Box>
      </Box>
    )
  }

  if (!appData) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center',
        minHeight: '100vh',
        gap: 3,
        p: 3
      }}>
        <Alert severity="warning" sx={{ maxWidth: 500 }}>
          App data not available
        </Alert>
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={handleGoBack}
        >
          Back to Dashboard
        </Button>
      </Box>
    )
  }

  // For published apps, render in standalone mode without builder UI
  return (
    <Box sx={{ 
      minHeight: '100vh',
      backgroundColor: '#ffffff',
      position: 'relative'
    }}>
      {/* Minimal header for published apps - only show if user is authenticated */}
      {localStorage.getItem('token') && (
        <Box sx={{ 
          position: 'fixed',
          top: 16,
          right: 16,
          zIndex: 1000,
          display: 'flex',
          gap: 1
        }}>
          <Button
            variant="contained"
            size="small"
            startIcon={<ArrowBackIcon />}
            onClick={handleGoBack}
            sx={{
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.9)',
              }
            }}
          >
            Back to Dashboard
          </Button>
          <Button
            variant="contained"
            size="small"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            sx={{
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.9)',
              }
            }}
          >
            Refresh
          </Button>
        </Box>
      )}

      {/* Render the actual app content in full-screen mode */}
      {!contentLoading && (!appContent?.pages?.length && !appContent?.components?.length) ? (
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          p: 4,
          textAlign: 'center'
        }}>
          <Typography variant="h4" gutterBottom color="text.secondary">
            No Content Available
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            This app doesn't have any pages or components configured yet.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            The app owner needs to add some content before it can be published.
          </Typography>
        </Box>
      ) : (
        <AppRenderer
          pages={appContent?.pages || []}
          components={appContent?.components || []}
          layouts={appContent?.layouts || []}
          loading={contentLoading}
          error={error || undefined}
          isPublished={true}
        />
      )}
    </Box>
  )
}
