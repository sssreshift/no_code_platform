import React, { useState } from 'react'
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Fab,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material'
import {
  Add as AddIcon,
  Storage as DatabaseIcon,
  Api as ApiIcon,
  TableChart as SpreadsheetIcon,
  CloudUpload as CloudIcon,
  Link as ConnectorIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  CheckCircle as ConnectedIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
} from '@mui/icons-material'

interface DataSource {
  id: number
  name: string
  type: 'database' | 'api' | 'spreadsheet' | 'cloud' | 'connector'
  status: 'connected' | 'error' | 'warning' | 'disconnected'
  description: string
  lastSync?: string
  connectionString?: string
}

const dataSourceTypes = [
  { value: 'database', label: 'Database', icon: <DatabaseIcon />, color: '#1976d2' },
  { value: 'api', label: 'API', icon: <ApiIcon />, color: '#388e3c' },
  { value: 'spreadsheet', label: 'Spreadsheet', icon: <SpreadsheetIcon />, color: '#f57c00' },
  { value: 'cloud', label: 'Cloud Storage', icon: <CloudIcon />, color: '#7b1fa2' },
  { value: 'connector', label: 'Third-party', icon: <ConnectorIcon />, color: '#d32f2f' },
]

const sampleDataSources: DataSource[] = [
  {
    id: 1,
    name: 'PostgreSQL Production',
    type: 'database',
    status: 'connected',
    description: 'Main production database',
    lastSync: '2 minutes ago',
    connectionString: 'postgresql://user:pass@localhost:5432/prod'
  },
  {
    id: 2,
    name: 'REST API - Users',
    type: 'api',
    status: 'connected',
    description: 'User management API endpoint',
    lastSync: '5 minutes ago'
  },
  {
    id: 3,
    name: 'Google Sheets - Sales',
    type: 'spreadsheet',
    status: 'warning',
    description: 'Sales data from Google Sheets',
    lastSync: '1 hour ago'
  },
  {
    id: 4,
    name: 'AWS S3 Bucket',
    type: 'cloud',
    status: 'error',
    description: 'File storage bucket',
    lastSync: '2 hours ago'
  },
  {
    id: 5,
    name: 'Salesforce CRM',
    type: 'connector',
    status: 'connected',
    description: 'Customer relationship management',
    lastSync: '10 minutes ago'
  }
]

export const DataSources: React.FC = () => {
  const [dataSources, setDataSources] = useState<DataSource[]>(sampleDataSources)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingDataSource, setEditingDataSource] = useState<DataSource | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    type: 'database' as DataSource['type'],
    description: '',
    connectionString: ''
  })

  const handleCreateDataSource = () => {
    setEditingDataSource(null)
    setFormData({ name: '', type: 'database', description: '', connectionString: '' })
    setDialogOpen(true)
  }

  const handleEditDataSource = (dataSource: DataSource) => {
    setEditingDataSource(dataSource)
    setFormData({
      name: dataSource.name,
      type: dataSource.type,
      description: dataSource.description,
      connectionString: dataSource.connectionString || ''
    })
    setDialogOpen(true)
  }

  const handleSaveDataSource = () => {
    if (editingDataSource) {
      // Update existing
      setDataSources(prev => prev.map(ds => 
        ds.id === editingDataSource.id 
          ? { ...ds, ...formData }
          : ds
      ))
    } else {
      // Create new
      const newDataSource: DataSource = {
        id: Date.now(),
        ...formData,
        status: 'disconnected'
      }
      setDataSources(prev => [...prev, newDataSource])
    }
    setDialogOpen(false)
  }

  const handleDeleteDataSource = (id: number) => {
    if (window.confirm('Are you sure you want to delete this data source?')) {
      setDataSources(prev => prev.filter(ds => ds.id !== id))
    }
  }

  const getStatusIcon = (status: DataSource['status']) => {
    switch (status) {
      case 'connected': return <ConnectedIcon color="success" />
      case 'error': return <ErrorIcon color="error" />
      case 'warning': return <WarningIcon color="warning" />
      default: return <ErrorIcon color="disabled" />
    }
  }

  const getStatusColor = (status: DataSource['status']) => {
    switch (status) {
      case 'connected': return 'success'
      case 'error': return 'error'
      case 'warning': return 'warning'
      default: return 'default'
    }
  }

  const getTypeInfo = (type: DataSource['type']) => {
    return dataSourceTypes.find(t => t.value === type) || dataSourceTypes[0]
  }

  return (
    <Box sx={{ 
      width: '100%', 
      maxWidth: '100%',
      mx: 'auto',
      px: { xs: 3, sm: 4, md: 5, lg: 6 },
      py: { xs: 3, sm: 4, md: 5 },
      minHeight: 'calc(100vh - 64px)',
      backgroundColor: '#fafafa'
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
            Data Sources
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ 
            mb: 0,
            fontSize: { xs: '0.9rem', sm: '1rem' }
          }}>
            Connect databases, APIs, spreadsheets, and cloud storage to power your applications
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateDataSource}
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
          Add Data Source
        </Button>
      </Box>

      {/* Data Source Types Overview */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" fontWeight={600} sx={{ mb: 2, textAlign: 'center' }}>
          Supported Data Source Types
        </Typography>
        <Grid container spacing={2} sx={{ maxWidth: '800px', mx: 'auto' }}>
          {dataSourceTypes.map((type) => (
            <Grid item xs={12} sm={6} md={4} key={type.value}>
              <Card sx={{ 
                textAlign: 'center', 
                p: 2,
                border: '1px solid',
                borderColor: 'grey.200',
                '&:hover': {
                  borderColor: type.color,
                  transform: 'translateY(-2px)',
                  boxShadow: `0 4px 12px ${type.color}20`
                },
                transition: 'all 0.3s ease'
              }}>
                <Box sx={{ color: type.color, mb: 1 }}>
                  {type.icon}
                </Box>
                <Typography variant="subtitle1" fontWeight={600}>
                  {type.label}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Data Sources List */}
      {dataSources.length === 0 ? (
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
          <Typography variant="h5" color="text.primary" gutterBottom sx={{ fontWeight: 600 }}>
            🔗 No Data Sources Connected
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 400 }}>
            Connect your first data source to start building powerful applications with real data.
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateDataSource}
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
            Connect Your First Data Source
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {dataSources.map((dataSource) => {
            const typeInfo = getTypeInfo(dataSource.type)
            return (
              <Grid item xs={12} sm={6} md={4} key={dataSource.id}>
                <Card sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 3,
                  border: '1px solid',
                  borderColor: 'grey.200',
                  background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 24px rgba(0,0,0,0.12)',
                    borderColor: typeInfo.color,
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 4,
                    background: typeInfo.color,
                    zIndex: 1
                  }
                }}>
                  <CardContent sx={{ 
                    flexGrow: 1, 
                    p: 3, 
                    pt: 4,
                    display: 'flex',
                    flexDirection: 'column'
                  }}>
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'flex-start', 
                      mb: 2
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ color: typeInfo.color }}>
                          {typeInfo.icon}
                        </Box>
                        <Typography variant="h6" fontWeight={600} sx={{ fontSize: '1.1rem' }}>
                          {dataSource.name}
                        </Typography>
                      </Box>
                      {getStatusIcon(dataSource.status)}
                    </Box>

                    <Typography variant="body2" color="text.secondary" sx={{ 
                      mb: 2,
                      flexGrow: 1,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {dataSource.description}
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                      <Chip 
                        label={typeInfo.label} 
                        size="small" 
                        sx={{ 
                          backgroundColor: `${typeInfo.color}20`,
                          color: typeInfo.color,
                          fontWeight: 600
                        }}
                      />
                      <Chip 
                        label={dataSource.status} 
                        size="small" 
                        color={getStatusColor(dataSource.status) as any}
                        variant="outlined"
                      />
                    </Box>

                    {dataSource.lastSync && (
                      <Typography variant="caption" color="text.secondary">
                        Last sync: {dataSource.lastSync}
                      </Typography>
                    )}
                  </CardContent>

                  <CardActions sx={{ 
                    justifyContent: 'space-between', 
                    px: 3, 
                    py: 2,
                    borderTop: '1px solid',
                    borderColor: 'grey.100',
                    backgroundColor: 'grey.50'
                  }}>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton
                        size="small"
                        onClick={() => handleEditDataSource(dataSource)}
                        title="Edit Data Source"
                        sx={{
                          backgroundColor: 'primary.main',
                          color: 'white',
                          '&:hover': { backgroundColor: 'primary.dark' }
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        title="View Details"
                        sx={{
                          backgroundColor: 'info.main',
                          color: 'white',
                          '&:hover': { backgroundColor: 'info.dark' }
                        }}
                      >
                        <ViewIcon fontSize="small" />
                      </IconButton>
                    </Box>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteDataSource(dataSource.id)}
                      title="Delete Data Source"
                      sx={{
                        backgroundColor: 'error.main',
                        color: 'white',
                        '&:hover': { backgroundColor: 'error.dark' }
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            )
          })}
        </Grid>
      )}

      {/* Add Data Source Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingDataSource ? 'Edit Data Source' : 'Add New Data Source'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
            <TextField
              label="Data Source Name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              fullWidth
              required
            />
            
            <FormControl fullWidth required>
              <InputLabel>Data Source Type</InputLabel>
              <Select
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as DataSource['type'] }))}
                label="Data Source Type"
              >
                {dataSourceTypes.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ color: type.color }}>{type.icon}</Box>
                      {type.label}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              fullWidth
              multiline
              rows={2}
            />

            {(formData.type === 'database' || formData.type === 'api') && (
              <TextField
                label="Connection String / URL"
                value={formData.connectionString}
                onChange={(e) => setFormData(prev => ({ ...prev, connectionString: e.target.value }))}
                fullWidth
                placeholder={formData.type === 'database' ? 'postgresql://user:pass@host:port/db' : 'https://api.example.com'}
              />
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleSaveDataSource} 
            variant="contained"
            disabled={!formData.name || !formData.type}
          >
            {editingDataSource ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      <Fab
        color="primary"
        aria-label="add data source"
        onClick={handleCreateDataSource}
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
