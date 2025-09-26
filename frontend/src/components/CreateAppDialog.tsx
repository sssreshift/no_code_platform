import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Alert,
} from '@mui/material'
import { useForm } from 'react-hook-form'
import { useState } from 'react'

import { appsApi } from '@/services/api'

interface CreateAppDialogProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
}

interface FormData {
  name: string
  description: string
  slug: string
}

export const CreateAppDialog: React.FC<CreateAppDialogProps> = ({
  open,
  onClose,
  onSuccess,
}) => {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormData>()

  const name = watch('name')

  // Auto-generate slug from name
  React.useEffect(() => {
    if (name) {
      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
      setValue('slug', slug)
    }
  }, [name, setValue])

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)
    setError(null)

    try {
      await appsApi.createApp({
        name: data.name,
        description: data.description,
        slug: data.slug,
        config: {
          theme: 'light',
          layout: 'grid',
          responsive: true,
          pages: [
            {
              id: 'home',
              name: 'Home',
              path: '/',
              components: [],
            },
          ],
        },
        is_published: false,
      })

      reset()
      onSuccess()
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to create app')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    reset()
    setError(null)
    onClose()
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create New Application</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <TextField
              fullWidth
              label="App Name"
              {...register('name', {
                required: 'App name is required',
                minLength: {
                  value: 2,
                  message: 'App name must be at least 2 characters long',
                },
              })}
              error={!!errors.name}
              helperText={errors.name?.message}
            />

            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              {...register('description')}
              error={!!errors.description}
              helperText={errors.description?.message || 'Optional description for your app'}
            />

            <TextField
              fullWidth
              label="URL Slug"
              {...register('slug', {
                required: 'URL slug is required',
                pattern: {
                  value: /^[a-z0-9-]+$/,
                  message: 'Slug can only contain lowercase letters, numbers, and hyphens',
                },
                minLength: {
                  value: 2,
                  message: 'Slug must be at least 2 characters long',
                },
              })}
              error={!!errors.slug}
              helperText={
                errors.slug?.message ||
                'This will be used in the URL: /apps/slug/your-slug'
              }
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading}
          >
            {isLoading ? 'Creating...' : 'Create App'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
