import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Alert,
  CircularProgress,
  Chip,
  Rating,
  Divider,
  Stack
} from '@mui/material'
import { PluginPublic, PluginInstallation } from '@/types/plugin'
import { App } from '@/types'

interface PluginInstallModalProps {
  open: boolean
  onClose: () => void
  plugin: PluginPublic | null
  onInstall: (pluginId: number, appId: number, config?: Record<string, any>) => Promise<void>
}

const PluginInstallModal: React.FC<PluginInstallModalProps> = ({
  open,
  onClose,
  plugin,
  onInstall
}) => {
  const [selectedApp, setSelectedApp] = useState<number | ''>('')
  const [config, setConfig] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [userApps, setUserApps] = useState<App[]>([])

  useEffect(() => {
    if (open && plugin) {
      loadUserApps()
      initializeConfig()
    }
  }, [open, plugin])

  const loadUserApps = async () => {
    try {
      const response = await fetch('/api/v1/apps?skip=0&limit=100')
      const data = await response.json()
      setUserApps(data)
    } catch (err) {
      console.error('Failed to load user apps:', err)
    }
  }

  const initializeConfig = () => {
    if (plugin?.default_config) {
      setConfig(plugin.default_config)
    } else {
      setConfig({})
    }
  }

  const handleInstall = async () => {
    if (!plugin || !selectedApp) return

    try {
      setLoading(true)
      setError(null)
      
      await onInstall(plugin.id, selectedApp as number, config)
      
      // Reset form
      setSelectedApp('')
      setConfig({})
      onClose()
    } catch (err: any) {
      setError(err.message || 'Failed to install plugin')
    } finally {
      setLoading(false)
    }
  }

  const handleConfigChange = (key: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const renderConfigField = (key: string, fieldSchema: any) => {
    const value = config[key] ?? fieldSchema.default

    switch (fieldSchema.type) {
      case 'string':
        if (fieldSchema.enum) {
          return (
            <FormControl fullWidth key={key}>
              <InputLabel>{fieldSchema.title}</InputLabel>
              <Select
                value={value}
                onChange={(e) => handleConfigChange(key, e.target.value)}
                label={fieldSchema.title}
              >
                {fieldSchema.enum.map((option: any) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )
        }
        return (
          <TextField
            key={key}
            fullWidth
            label={fieldSchema.title}
            value={value}
            onChange={(e) => handleConfigChange(key, e.target.value)}
            multiline={fieldSchema.format === 'textarea'}
            rows={fieldSchema.format === 'textarea' ? 3 : 1}
            helperText={fieldSchema.description}
          />
        )
      
      case 'number':
        return (
          <TextField
            key={key}
            fullWidth
            type="number"
            label={fieldSchema.title}
            value={value}
            onChange={(e) => handleConfigChange(key, parseFloat(e.target.value))}
            helperText={fieldSchema.description}
          />
        )
      
      case 'boolean':
        return (
          <FormControl fullWidth key={key}>
            <InputLabel>{fieldSchema.title}</InputLabel>
            <Select
              value={value ? 'true' : 'false'}
              onChange={(e) => handleConfigChange(key, e.target.value === 'true')}
              label={fieldSchema.title}
            >
              <MenuItem value="true">Yes</MenuItem>
              <MenuItem value="false">No</MenuItem>
            </Select>
          </FormControl>
        )
      
      default:
        return (
          <TextField
            key={key}
            fullWidth
            label={fieldSchema.title}
            value={value}
            onChange={(e) => handleConfigChange(key, e.target.value)}
            helperText={fieldSchema.description}
          />
        )
    }
  }

  if (!plugin) return null

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h5" component="div">
          Install Plugin
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          {plugin.name}
        </Typography>
      </DialogTitle>
      
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Plugin Info */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Plugin Details
                </Typography>
                
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Version
                    </Typography>
                    <Typography variant="body1">
                      {plugin.version}
                    </Typography>
                  </Box>
                  
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Type
                    </Typography>
                    <Chip label={plugin.plugin_type} size="small" />
                  </Box>
                  
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Category
                    </Typography>
                    <Typography variant="body1">
                      {plugin.category?.name || 'Uncategorized'}
                    </Typography>
                  </Box>
                  
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Rating
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Rating value={plugin.rating} readOnly size="small" />
                      <Typography variant="body2">
                        ({plugin.review_count} reviews)
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Downloads
                    </Typography>
                    <Typography variant="body1">
                      {plugin.download_count}
                    </Typography>
                  </Box>
                  
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Price
                    </Typography>
                    <Typography variant="body1">
                      {plugin.is_free ? 'Free' : `$${plugin.price}`}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Installation Form */}
          <Grid item xs={12} md={8}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Installation Settings
              </Typography>
              
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Select App</InputLabel>
                <Select
                  value={selectedApp}
                  onChange={(e) => setSelectedApp(e.target.value as number)}
                  label="Select App"
                >
                  {userApps.map((app) => (
                    <MenuItem key={app.id} value={app.id}>
                      {app.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {/* Plugin Configuration */}
            {plugin.config_schema && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Configuration
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Configure the plugin settings for your app
                </Typography>
                
                <Grid container spacing={2}>
                  {Object.entries(plugin.config_schema.properties || {}).map(([key, fieldSchema]) => (
                    <Grid item xs={12} sm={6} key={key}>
                      {renderConfigField(key, fieldSchema)}
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
          </Grid>
        </Grid>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleInstall}
          variant="contained"
          disabled={!selectedApp || loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? 'Installing...' : 'Install Plugin'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default PluginInstallModal
