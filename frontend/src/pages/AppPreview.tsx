import React from 'react'
import { Box, Typography } from '@mui/material'
import { useParams } from 'react-router-dom'

export const AppPreview: React.FC = () => {
  const { appId } = useParams<{ appId: string }>()

  return (
    <Box sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Typography variant="h4" color="text.secondary">
        App Preview for App ID: {appId} - Coming Soon!
      </Typography>
    </Box>
  )
}
