import React from 'react'
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Fab,
  Chip,
  IconButton,
} from '@mui/material'
import {
  Add as AddIcon,
  Launch as LaunchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

import { appsApi } from '@/services/api'
import { CreateAppDialog } from '@/components/CreateAppDialog'
import type { App } from '@/types'

export const Dashboard: React.FC = () => {
  const navigate = useNavigate()
  const [createDialogOpen, setCreateDialogOpen] = useState(false)

  const { data: apps = [], isLoading, refetch } = useQuery({
    queryKey: ['apps'],
    queryFn: () => appsApi.getApps(),
  })

  const handleCreateApp = () => {
    setCreateDialogOpen(true)
  }

  const handleEditApp = (appId: number) => {
    navigate(`/apps/${appId}/builder`)
  }

  const handlePreviewApp = (appId: number) => {
    navigate(`/apps/${appId}/preview`)
  }

  const handlePublishApp = async (appId: number) => {
    try {
      await appsApi.publishApp(appId)
      refetch()
    } catch (error) {
      console.error('Failed to publish app:', error)
    }
  }

  const handleDeleteApp = async (appId: number) => {
    if (window.confirm('Are you sure you want to delete this app?')) {
      try {
        await appsApi.deleteApp(appId)
        refetch()
      } catch (error) {
        console.error('Failed to delete app:', error)
      }
    }
  }

  if (isLoading) {
    return (
      <Box sx={{ 
        width: '100%', 
        maxWidth: '100%',
        mx: 'auto',
        px: { xs: 2, sm: 3, md: 4 },
        py: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 400
      }}>
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2
        }}>
          <Box sx={{
            width: 40,
            height: 40,
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #667eea',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            '@keyframes spin': {
              '0%': { transform: 'rotate(0deg)' },
              '100%': { transform: 'rotate(360deg)' }
            }
          }} />
          <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 500 }}>
            Loading your applications...
          </Typography>
        </Box>
      </Box>
    )
  }

  return (
    <Box sx={{ 
      width: '100%', 
      maxWidth: '100%',
      mx: 'auto',
      ml: 0,
      mr: 0,
      px: { xs: 3, sm: 4, md: 5, lg: 6 },
      py: { xs: 3, sm: 4, md: 5 },
      minHeight: 'calc(100vh - 64px)',
      overflow: 'auto',
      backgroundColor: '#fafafa',
      position: 'relative',
      left: 0,
      right: 0
    }}>
      {/* Header Section */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        mb: { xs: 3, sm: 4 },
        flexWrap: 'wrap',
        gap: { xs: 2, sm: 4 },
        flexDirection: { xs: 'column', sm: 'row' },
        textAlign: 'center',
        maxWidth: { xs: '100%', sm: '800px', md: '900px', lg: '1000px' },
        mx: 'auto'
      }}>
        <Box sx={{ flex: 1, minWidth: 0, textAlign: 'center' }}>
          <Typography variant="h4" component="h1" fontWeight={700} sx={{ 
            color: 'text.primary',
            mb: 1,
            fontSize: { xs: '1.75rem', sm: '2rem', md: '2.125rem' },
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            My Applications
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ 
            mb: 0,
            fontSize: { xs: '0.9rem', sm: '1rem' }
          }}>
            Build, manage, and deploy your no-code applications
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateApp}
          size="large"
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
            '&:hover': {
              background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
              boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)',
              transform: 'translateY(-2px)'
            },
            transition: 'all 0.3s ease',
            px: { xs: 2, sm: 3 },
            py: { xs: 1, sm: 1.5 },
            borderRadius: 2,
            fontSize: { xs: '0.9rem', sm: '1rem' },
            width: { xs: '100%', sm: 'auto' },
            alignSelf: 'center'
          }}
        >
          Create New App
        </Button>
      </Box>

      {apps.length === 0 ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 400,
            textAlign: 'center',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            borderRadius: 3,
            border: '2px dashed',
            borderColor: 'primary.light',
            p: 4,
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <Box sx={{
            position: 'absolute',
            top: -50,
            right: -50,
            width: 100,
            height: 100,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
            zIndex: 0
          }} />
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Typography variant="h5" color="text.primary" gutterBottom sx={{ fontWeight: 600 }}>
              🚀 Ready to Build Something Amazing?
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 400 }}>
              Create your first no-code application and start building powerful web apps without writing a single line of code.
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreateApp}
              size="large"
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                  boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)',
                  transform: 'translateY(-2px)'
                },
                transition: 'all 0.3s ease',
                px: 4,
                py: 1.5,
                borderRadius: 2
              }}
            >
              Create Your First App
            </Button>
          </Box>
        </Box>
      ) : (
        <Grid container spacing={{ xs: 3, sm: 4, md: 4, lg: 4 }} sx={{ width: '100%' }}>
          {apps.map((app: App) => (
            <Grid item xs={12} sm={6} md={6} lg={12} xl={12} key={app.id} sx={{ display: 'flex' }}>
              <Card
                sx={{
                  height: { xs: 400, sm: 440, md: 480, lg: 580, xl: 600 },
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 4,
                  border: '1px solid',
                  borderColor: 'grey.200',
                  background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  '&:hover': {
                    transform: 'translateY(-6px)',
                    boxShadow: '0 16px 32px rgba(0,0,0,0.12)',
                    borderColor: 'primary.light',
                    '& .app-card-overlay': {
                      opacity: 1
                    }
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 4,
                    background: app.is_published 
                      ? 'linear-gradient(135deg, #4caf50 0%, #8bc34a 100%)'
                      : 'linear-gradient(135deg, #ff9800 0%, #ffc107 100%)',
                    zIndex: 1
                  }
                }}
              >
                <CardContent sx={{ 
                  flexGrow: 1, 
                  p: { xs: 4, sm: 4.5, md: 5, lg: 8, xl: 10 }, 
                  pt: { xs: 5, sm: 5.5, md: 6, lg: 9, xl: 11 },
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  height: '100%',
                  width: '100%',
                  boxSizing: 'border-box'
                }}>
                  {/* Top Section: Title and Status */}
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'flex-start', 
                    mb: 3,
                    gap: 1.5,
                    width: '100%'
                  }}>
                    <Typography variant="h6" component="h2" fontWeight={700} sx={{ 
                      color: 'text.primary',
                      fontSize: { xs: '1.1rem', sm: '1.2rem', md: '1.3rem', lg: '1.5rem', xl: '1.6rem' },
                      lineHeight: 1.3,
                      flex: 1,
                      minWidth: 0,
                      wordBreak: 'break-word',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {app.name}
                    </Typography>
                    <Chip
                      label={app.is_published ? 'Published' : 'Draft'}
                      size="small"
                      sx={{
                        backgroundColor: app.is_published ? '#e8f5e8' : '#fff3e0',
                        color: app.is_published ? '#2e7d32' : '#f57c00',
                        fontWeight: 600,
                        border: 'none',
                        flexShrink: 0,
                        minWidth: 'fit-content',
                        '& .MuiChip-label': {
                          px: 1.5,
                          fontSize: '0.75rem',
                          whiteSpace: 'nowrap'
                        }
                      }}
                    />
                  </Box>

                  {/* Middle Section: Description */}
                  <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        display: '-webkit-box',
                        WebkitLineClamp: { xs: 3, sm: 4, md: 4, lg: 6, xl: 7 },
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        lineHeight: 1.6,
                        fontSize: { xs: '0.9rem', sm: '0.95rem', md: '1rem', lg: '1.1rem', xl: '1.15rem' },
                        width: '100%',
                        wordBreak: 'break-word',
                        textAlign: 'left'
                      }}
                    >
                      {app.description || 'No description provided. Click edit to add a description for your app.'}
                    </Typography>
                  </Box>

                  {/* Bottom Section: URL and Date */}
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    gap: 2,
                    mt: 3
                  }}>
                    <Box sx={{ 
                      display: 'flex', 
                      gap: 1, 
                      alignItems: 'center',
                      width: '100%'
                    }}>
                      <Chip 
                        label={`/${app.slug}`} 
                        size="small" 
                        variant="outlined"
                        sx={{
                          backgroundColor: 'grey.50',
                          borderColor: 'grey.300',
                          color: 'text.secondary',
                          fontSize: '0.75rem',
                          height: 24,
                          '& .MuiChip-label': {
                            px: 1.5
                          }
                        }}
                      />
                    </Box>
                    
                    <Typography variant="caption" color="text.secondary" sx={{ 
                      fontSize: '0.8rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                      width: '100%',
                      fontWeight: 500
                    }}>
                      📅 Updated {new Date(app.updated_at || app.created_at).toLocaleDateString()}
                    </Typography>
                  </Box>
                </CardContent>

                <CardActions sx={{ 
                  justifyContent: 'space-between', 
                  px: { xs: 4, sm: 4.5, md: 5, lg: 8, xl: 10 }, 
                  py: { xs: 3, sm: 3.5, md: 4, lg: 7, xl: 8 },
                  borderTop: '1px solid',
                  borderColor: 'grey.100',
                  backgroundColor: 'grey.50',
                  flexWrap: 'nowrap',
                  gap: 1.5,
                  height: { xs: 80, sm: 85, md: 90, lg: 120, xl: 130 },
                  width: '100%',
                  boxSizing: 'border-box',
                  alignItems: 'center'
                }}>
                  <Box sx={{ 
                    display: 'flex', 
                    gap: { xs: 1, sm: 1.25, md: 1.5, lg: 4, xl: 5 },
                    flexWrap: 'nowrap',
                    alignItems: 'center',
                    minWidth: 0,
                    flex: 1
                  }}>
                    <IconButton
                      size="small"
                      onClick={() => handleEditApp(app.id)}
                      title="Edit App"
                      sx={{
                        backgroundColor: 'primary.main',
                        color: 'white',
                        '&:hover': {
                          backgroundColor: 'primary.dark',
                          transform: 'scale(1.05)'
                        },
                        transition: 'all 0.2s ease',
                        width: { xs: 36, sm: 40, md: 44, lg: 56, xl: 60 },
                        height: { xs: 36, sm: 40, md: 44, lg: 56, xl: 60 },
                        boxShadow: '0 2px 6px rgba(0,0,0,0.12)'
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handlePreviewApp(app.id)}
                      title="Preview App"
                      sx={{
                        backgroundColor: 'info.main',
                        color: 'white',
                        '&:hover': {
                          backgroundColor: 'info.dark',
                          transform: 'scale(1.05)'
                        },
                        transition: 'all 0.2s ease',
                        width: { xs: 36, sm: 40, md: 44, lg: 56, xl: 60 },
                        height: { xs: 36, sm: 40, md: 44, lg: 56, xl: 60 },
                        boxShadow: '0 2px 6px rgba(0,0,0,0.12)'
                      }}
                    >
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                    {app.is_published && (
                      <IconButton
                        size="small"
                        onClick={() => window.open(`http://localhost:3000/apps/slug/${app.slug}`, '_blank')}
                        title="Open Published App"
                        sx={{
                          backgroundColor: 'success.main',
                          color: 'white',
                          '&:hover': {
                            backgroundColor: 'success.dark',
                            transform: 'scale(1.05)'
                          },
                          transition: 'all 0.2s ease',
                          width: { xs: 30, sm: 34, md: 38, lg: 50, xl: 54 },
                          height: { xs: 30, sm: 34, md: 38, lg: 50, xl: 54 },
                          boxShadow: '0 2px 6px rgba(0,0,0,0.12)'
                        }}
                      >
                        <LaunchIcon fontSize="small" />
                      </IconButton>
                    )}
                  </Box>

                  <Box sx={{ 
                    display: 'flex', 
                    gap: { xs: 1, sm: 1.25, md: 1.5, lg: 4, xl: 5 }, 
                    alignItems: 'center',
                    flexWrap: 'nowrap',
                    minWidth: 0
                  }}>
                    {!app.is_published && (
                      <Button
                        size="small"
                        onClick={() => handlePublishApp(app.id)}
                        variant="contained"
                        sx={{
                          backgroundColor: 'success.main',
                          color: 'white',
                          fontSize: { xs: '0.7rem', sm: '0.75rem' },
                          px: { xs: 1.5, sm: 2 },
                          py: { xs: 0.5, sm: 0.5 },
                          minWidth: 'auto',
                          height: { xs: 36, sm: 40, md: 44, lg: 56, xl: 60 },
                          fontWeight: 600,
                          borderRadius: 2,
                          boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
                          '&:hover': {
                            backgroundColor: 'success.dark',
                            boxShadow: '0 3px 8px rgba(0,0,0,0.15)'
                          }
                        }}
                      >
                        Publish
                      </Button>
                    )}
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteApp(app.id)}
                      title="Delete App"
                      sx={{
                        backgroundColor: 'error.main',
                        color: 'white',
                        '&:hover': {
                          backgroundColor: 'error.dark',
                          transform: 'scale(1.05)'
                        },
                        transition: 'all 0.2s ease',
                        width: { xs: 36, sm: 40, md: 44, lg: 56, xl: 60 },
                        height: { xs: 36, sm: 40, md: 44, lg: 56, xl: 60 },
                        boxShadow: '0 2px 6px rgba(0,0,0,0.12)'
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <CreateAppDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onSuccess={() => {
          refetch()
          setCreateDialogOpen(false)
        }}
      />

      <Fab
        color="primary"
        aria-label="add"
        onClick={handleCreateApp}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
          '&:hover': {
            background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
            boxShadow: '0 12px 35px rgba(102, 126, 234, 0.6)',
            transform: 'scale(1.1)'
          },
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          width: 56,
          height: 56
        }}
      >
        <AddIcon sx={{ fontSize: 28 }} />
      </Fab>
    </Box>
  )
}
