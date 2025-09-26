import React, { useState } from 'react'
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Button,
  Switch,
  FormControlLabel,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  Tabs,
  Tab,
  Paper,
} from '@mui/material'
import {
  Business as WorkspaceIcon,
  Folder as ProjectIcon,
  Storage as DataIcon,
  CloudUpload as DeploymentIcon,
  Security as AuthIcon,
  Notifications as NotificationIcon,
  Code as DeveloperIcon,
  Save as SaveIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}

export const Settings: React.FC = () => {
  const [tabValue, setTabValue] = useState(0)
  const [settings, setSettings] = useState({
    workspace: {
      name: 'My Workspace',
      description: 'Main workspace for development',
      timezone: 'UTC',
      language: 'en',
      theme: 'light',
      autoSave: true,
      maxProjects: 10,
    },
    project: {
      defaultTemplate: 'blank',
      autoBackup: true,
      versionControl: true,
      collaboration: true,
      maxFileSize: '100MB',
    },
    data: {
      dataRetention: '1year',
      encryption: true,
      backupFrequency: 'daily',
      maxConnections: 50,
      cacheTimeout: '30min',
    },
    deployment: {
      defaultEnvironment: 'staging',
      autoDeploy: false,
      rollbackEnabled: true,
      healthChecks: true,
      monitoring: true,
    },
    authentication: {
      twoFactor: false,
      sessionTimeout: '8hours',
      passwordPolicy: 'strong',
      ssoEnabled: false,
      apiKeys: true,
    },
    notifications: {
      email: true,
      push: true,
      slack: false,
      webhook: false,
      frequency: 'immediate',
    },
    developer: {
      debugMode: false,
      apiAccess: true,
      webhooks: true,
      customCode: true,
      betaFeatures: false,
    }
  })

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  const handleSettingChange = (category: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value
      }
    }))
  }

  const handleSaveSettings = () => {
    // Here you would typically save to backend
    console.log('Saving settings:', settings)
    // Show success message
  }

  const handleResetSettings = () => {
    if (window.confirm('Are you sure you want to reset all settings to default?')) {
      // Reset to default values
      window.location.reload()
    }
  }

  const workspaceSettings = (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader title="Workspace Information" />
          <CardContent>
            <TextField
              fullWidth
              label="Workspace Name"
              value={settings.workspace.name}
              onChange={(e) => handleSettingChange('workspace', 'name', e.target.value)}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Description"
              value={settings.workspace.description}
              onChange={(e) => handleSettingChange('workspace', 'description', e.target.value)}
              margin="normal"
              multiline
              rows={2}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Timezone</InputLabel>
              <Select
                value={settings.workspace.timezone}
                onChange={(e) => handleSettingChange('workspace', 'timezone', e.target.value)}
                label="Timezone"
              >
                <MenuItem value="UTC">UTC</MenuItem>
                <MenuItem value="EST">Eastern Time</MenuItem>
                <MenuItem value="PST">Pacific Time</MenuItem>
                <MenuItem value="GMT">GMT</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Language</InputLabel>
              <Select
                value={settings.workspace.language}
                onChange={(e) => handleSettingChange('workspace', 'language', e.target.value)}
                label="Language"
              >
                <MenuItem value="en">English</MenuItem>
                <MenuItem value="es">Spanish</MenuItem>
                <MenuItem value="fr">French</MenuItem>
                <MenuItem value="de">German</MenuItem>
              </Select>
            </FormControl>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader title="Workspace Preferences" />
          <CardContent>
            <FormControl fullWidth margin="normal">
              <InputLabel>Theme</InputLabel>
              <Select
                value={settings.workspace.theme}
                onChange={(e) => handleSettingChange('workspace', 'theme', e.target.value)}
                label="Theme"
              >
                <MenuItem value="light">Light</MenuItem>
                <MenuItem value="dark">Dark</MenuItem>
                <MenuItem value="auto">Auto</MenuItem>
              </Select>
            </FormControl>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.workspace.autoSave}
                  onChange={(e) => handleSettingChange('workspace', 'autoSave', e.target.checked)}
                />
              }
              label="Auto-save changes"
              sx={{ mt: 2, mb: 1 }}
            />
            <TextField
              fullWidth
              label="Maximum Projects"
              type="number"
              value={settings.workspace.maxProjects}
              onChange={(e) => handleSettingChange('workspace', 'maxProjects', parseInt(e.target.value))}
              margin="normal"
            />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )

  const projectSettings = (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader title="Project Defaults" />
          <CardContent>
            <FormControl fullWidth margin="normal">
              <InputLabel>Default Template</InputLabel>
              <Select
                value={settings.project.defaultTemplate}
                onChange={(e) => handleSettingChange('project', 'defaultTemplate', e.target.value)}
                label="Default Template"
              >
                <MenuItem value="blank">Blank Project</MenuItem>
                <MenuItem value="dashboard">Dashboard Template</MenuItem>
                <MenuItem value="ecommerce">E-commerce Template</MenuItem>
                <MenuItem value="blog">Blog Template</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Maximum File Size"
              value={settings.project.maxFileSize}
              onChange={(e) => handleSettingChange('project', 'maxFileSize', e.target.value)}
              margin="normal"
            />
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader title="Project Features" />
          <CardContent>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.project.autoBackup}
                  onChange={(e) => handleSettingChange('project', 'autoBackup', e.target.checked)}
                />
              }
              label="Automatic Backup"
              sx={{ mb: 1 }}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.project.versionControl}
                  onChange={(e) => handleSettingChange('project', 'versionControl', e.target.checked)}
                />
              }
              label="Version Control"
              sx={{ mb: 1 }}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.project.collaboration}
                  onChange={(e) => handleSettingChange('project', 'collaboration', e.target.checked)}
                />
              }
              label="Team Collaboration"
              sx={{ mb: 1 }}
            />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )

  const dataSettings = (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader title="Data Management" />
          <CardContent>
            <FormControl fullWidth margin="normal">
              <InputLabel>Data Retention</InputLabel>
              <Select
                value={settings.data.dataRetention}
                onChange={(e) => handleSettingChange('data', 'dataRetention', e.target.value)}
                label="Data Retention"
              >
                <MenuItem value="30days">30 Days</MenuItem>
                <MenuItem value="6months">6 Months</MenuItem>
                <MenuItem value="1year">1 Year</MenuItem>
                <MenuItem value="unlimited">Unlimited</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Backup Frequency</InputLabel>
              <Select
                value={settings.data.backupFrequency}
                onChange={(e) => handleSettingChange('data', 'backupFrequency', e.target.value)}
                label="Backup Frequency"
              >
                <MenuItem value="hourly">Hourly</MenuItem>
                <MenuItem value="daily">Daily</MenuItem>
                <MenuItem value="weekly">Weekly</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Maximum Connections"
              type="number"
              value={settings.data.maxConnections}
              onChange={(e) => handleSettingChange('data', 'maxConnections', parseInt(e.target.value))}
              margin="normal"
            />
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader title="Data Security" />
          <CardContent>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.data.encryption}
                  onChange={(e) => handleSettingChange('data', 'encryption', e.target.checked)}
                />
              }
              label="Data Encryption"
              sx={{ mb: 1 }}
            />
            <TextField
              fullWidth
              label="Cache Timeout"
              value={settings.data.cacheTimeout}
              onChange={(e) => handleSettingChange('data', 'cacheTimeout', e.target.value)}
              margin="normal"
            />
            <Alert severity="info" sx={{ mt: 2 }}>
              Data encryption ensures all stored data is protected with industry-standard encryption.
            </Alert>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )

  const deploymentSettings = (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader title="Deployment Configuration" />
          <CardContent>
            <FormControl fullWidth margin="normal">
              <InputLabel>Default Environment</InputLabel>
              <Select
                value={settings.deployment.defaultEnvironment}
                onChange={(e) => handleSettingChange('deployment', 'defaultEnvironment', e.target.value)}
                label="Default Environment"
              >
                <MenuItem value="development">Development</MenuItem>
                <MenuItem value="staging">Staging</MenuItem>
                <MenuItem value="production">Production</MenuItem>
              </Select>
            </FormControl>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.deployment.autoDeploy}
                  onChange={(e) => handleSettingChange('deployment', 'autoDeploy', e.target.checked)}
                />
              }
              label="Automatic Deployment"
              sx={{ mb: 1 }}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.deployment.rollbackEnabled}
                  onChange={(e) => handleSettingChange('deployment', 'rollbackEnabled', e.target.checked)}
                />
              }
              label="Enable Rollback"
              sx={{ mb: 1 }}
            />
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader title="Monitoring & Health" />
          <CardContent>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.deployment.healthChecks}
                  onChange={(e) => handleSettingChange('deployment', 'healthChecks', e.target.checked)}
                />
              }
              label="Health Checks"
              sx={{ mb: 1 }}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.deployment.monitoring}
                  onChange={(e) => handleSettingChange('deployment', 'monitoring', e.target.checked)}
                />
              }
              label="Performance Monitoring"
              sx={{ mb: 1 }}
            />
            <Alert severity="success" sx={{ mt: 2 }}>
              Health checks and monitoring help ensure your applications run smoothly.
            </Alert>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )

  const authenticationSettings = (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader title="Security Settings" />
          <CardContent>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.authentication.twoFactor}
                  onChange={(e) => handleSettingChange('authentication', 'twoFactor', e.target.checked)}
                />
              }
              label="Two-Factor Authentication"
              sx={{ mb: 1 }}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Session Timeout</InputLabel>
              <Select
                value={settings.authentication.sessionTimeout}
                onChange={(e) => handleSettingChange('authentication', 'sessionTimeout', e.target.value)}
                label="Session Timeout"
              >
                <MenuItem value="1hour">1 Hour</MenuItem>
                <MenuItem value="4hours">4 Hours</MenuItem>
                <MenuItem value="8hours">8 Hours</MenuItem>
                <MenuItem value="24hours">24 Hours</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Password Policy</InputLabel>
              <Select
                value={settings.authentication.passwordPolicy}
                onChange={(e) => handleSettingChange('authentication', 'passwordPolicy', e.target.value)}
                label="Password Policy"
              >
                <MenuItem value="basic">Basic</MenuItem>
                <MenuItem value="strong">Strong</MenuItem>
                <MenuItem value="enterprise">Enterprise</MenuItem>
              </Select>
            </FormControl>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader title="Access Control" />
          <CardContent>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.authentication.ssoEnabled}
                  onChange={(e) => handleSettingChange('authentication', 'ssoEnabled', e.target.checked)}
                />
              }
              label="Single Sign-On (SSO)"
              sx={{ mb: 1 }}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.authentication.apiKeys}
                  onChange={(e) => handleSettingChange('authentication', 'apiKeys', e.target.checked)}
                />
              }
              label="API Key Access"
              sx={{ mb: 1 }}
            />
            <Alert severity="warning" sx={{ mt: 2 }}>
              Enable SSO for enterprise-grade security and centralized user management.
            </Alert>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )

  const notificationSettings = (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader title="Notification Channels" />
          <CardContent>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.notifications.email}
                  onChange={(e) => handleSettingChange('notifications', 'email', e.target.checked)}
                />
              }
              label="Email Notifications"
              sx={{ mb: 1 }}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.notifications.push}
                  onChange={(e) => handleSettingChange('notifications', 'push', e.target.checked)}
                />
              }
              label="Push Notifications"
              sx={{ mb: 1 }}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.notifications.slack}
                  onChange={(e) => handleSettingChange('notifications', 'slack', e.target.checked)}
                />
              }
              label="Slack Integration"
              sx={{ mb: 1 }}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.notifications.webhook}
                  onChange={(e) => handleSettingChange('notifications', 'webhook', e.target.checked)}
                />
              }
              label="Webhook Notifications"
              sx={{ mb: 1 }}
            />
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader title="Notification Preferences" />
          <CardContent>
            <FormControl fullWidth margin="normal">
              <InputLabel>Notification Frequency</InputLabel>
              <Select
                value={settings.notifications.frequency}
                onChange={(e) => handleSettingChange('notifications', 'frequency', e.target.value)}
                label="Notification Frequency"
              >
                <MenuItem value="immediate">Immediate</MenuItem>
                <MenuItem value="hourly">Hourly Digest</MenuItem>
                <MenuItem value="daily">Daily Digest</MenuItem>
                <MenuItem value="weekly">Weekly Digest</MenuItem>
              </Select>
            </FormControl>
            <Alert severity="info" sx={{ mt: 2 }}>
              Configure how often you want to receive notifications about your applications.
            </Alert>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )

  const developerSettings = (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader title="Development Tools" />
          <CardContent>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.developer.debugMode}
                  onChange={(e) => handleSettingChange('developer', 'debugMode', e.target.checked)}
                />
              }
              label="Debug Mode"
              sx={{ mb: 1 }}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.developer.apiAccess}
                  onChange={(e) => handleSettingChange('developer', 'apiAccess', e.target.checked)}
                />
              }
              label="API Access"
              sx={{ mb: 1 }}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.developer.webhooks}
                  onChange={(e) => handleSettingChange('developer', 'webhooks', e.target.checked)}
                />
              }
              label="Webhook Support"
              sx={{ mb: 1 }}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.developer.customCode}
                  onChange={(e) => handleSettingChange('developer', 'customCode', e.target.checked)}
                />
              }
              label="Custom Code Execution"
              sx={{ mb: 1 }}
            />
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader title="Advanced Features" />
          <CardContent>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.developer.betaFeatures}
                  onChange={(e) => handleSettingChange('developer', 'betaFeatures', e.target.checked)}
                />
              }
              label="Beta Features"
              sx={{ mb: 1 }}
            />
            <Alert severity="warning" sx={{ mt: 2 }}>
              Beta features may be unstable and are not recommended for production use.
            </Alert>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )

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
            Settings
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ 
            mb: 0,
            fontSize: { xs: '0.9rem', sm: '1rem' }
          }}>
            Configure your workspace, projects, and platform preferences
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleResetSettings}
            size="large"
          >
            Reset
          </Button>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSaveSettings}
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
            }}
          >
            Save Changes
          </Button>
        </Box>
      </Box>

      {/* Settings Tabs */}
      <Paper sx={{ maxWidth: '1200px', mx: 'auto' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
            <Tab 
              icon={<WorkspaceIcon />} 
              label="Workspace" 
              iconPosition="start"
              sx={{ minHeight: 64 }}
            />
            <Tab 
              icon={<ProjectIcon />} 
              label="Project" 
              iconPosition="start"
              sx={{ minHeight: 64 }}
            />
            <Tab 
              icon={<DataIcon />} 
              label="Data" 
              iconPosition="start"
              sx={{ minHeight: 64 }}
            />
            <Tab 
              icon={<DeploymentIcon />} 
              label="Deployment" 
              iconPosition="start"
              sx={{ minHeight: 64 }}
            />
            <Tab 
              icon={<AuthIcon />} 
              label="Authentication" 
              iconPosition="start"
              sx={{ minHeight: 64 }}
            />
            <Tab 
              icon={<NotificationIcon />} 
              label="Notifications" 
              iconPosition="start"
              sx={{ minHeight: 64 }}
            />
            <Tab 
              icon={<DeveloperIcon />} 
              label="Developer" 
              iconPosition="start"
              sx={{ minHeight: 64 }}
            />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          {workspaceSettings}
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          {projectSettings}
        </TabPanel>
        <TabPanel value={tabValue} index={2}>
          {dataSettings}
        </TabPanel>
        <TabPanel value={tabValue} index={3}>
          {deploymentSettings}
        </TabPanel>
        <TabPanel value={tabValue} index={4}>
          {authenticationSettings}
        </TabPanel>
        <TabPanel value={tabValue} index={5}>
          {notificationSettings}
        </TabPanel>
        <TabPanel value={tabValue} index={6}>
          {developerSettings}
        </TabPanel>
      </Paper>
    </Box>
  )
}
