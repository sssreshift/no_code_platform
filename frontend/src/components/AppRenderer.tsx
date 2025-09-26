import React, { useState } from 'react'
import {
  Box,
  Typography,
  Button,
  TextField,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Grid,
  Stack,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormLabel,
  Alert,
  CircularProgress
} from '@mui/material'
import { ComponentPublic, PagePublic, LayoutPublic } from '@/types'

interface AppRendererProps {
  pages: PagePublic[]
  components: ComponentPublic[]
  layouts: LayoutPublic[]
  loading?: boolean
  error?: string
  standalone?: boolean
  isPublished?: boolean
}

interface ComponentRendererProps {
  component: ComponentPublic
  isPublished?: boolean
}

const ComponentRenderer: React.FC<ComponentRendererProps> = ({ component, isPublished = false }) => {
  const { component_type, props = {}, styles = {} } = component

  const componentStyles = isPublished ? {
    ...styles,
    margin: '4px 0'
  } : {
    ...styles,
    margin: '8px 0',
    padding: '8px',
    border: '1px solid #e0e0e0',
    borderRadius: '4px'
  }

  switch (component_type) {
    case 'text':
      return (
        <Typography
          variant={props.variant || 'body1'}
          sx={componentStyles}
          color={props.color || 'text.primary'}
          align={props.align || 'left'}
        >
          {props.text || 'Sample Text'}
        </Typography>
      )

    case 'button':
      return (
        <Button
          variant={props.variant || 'contained'}
          color={props.color || 'primary'}
          size={props.size || 'medium'}
          sx={componentStyles}
          disabled={props.disabled || false}
          onClick={() => {
            if (props.onClick) {
              console.log('Button clicked:', props.onClick)
            }
          }}
        >
          {props.text || 'Button'}
        </Button>
      )

    case 'input':
      return (
        <TextField
          label={props.label || 'Input'}
          variant={props.variant || 'outlined'}
          type={props.type || 'text'}
          placeholder={props.placeholder || ''}
          value={props.value || ''}
          sx={componentStyles}
          fullWidth={props.fullWidth !== false}
          required={props.required || false}
          disabled={props.disabled || false}
          multiline={props.multiline || false}
          rows={props.rows || 1}
        />
      )

    case 'textarea':
      return (
        <TextField
          label={props.label || 'Textarea'}
          variant={props.variant || 'outlined'}
          placeholder={props.placeholder || ''}
          value={props.value || ''}
          sx={componentStyles}
          fullWidth={props.fullWidth !== false}
          required={props.required || false}
          disabled={props.disabled || false}
          multiline
          rows={props.rows || 4}
        />
      )

    case 'select':
      return (
        <FormControl fullWidth sx={componentStyles}>
          <InputLabel>{props.label || 'Select'}</InputLabel>
          <Select
            value={props.value || ''}
            label={props.label || 'Select'}
            disabled={props.disabled || false}
          >
            {(props.options || ['Option 1', 'Option 2', 'Option 3']).map((option: string, index: number) => (
              <MenuItem key={index} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )

    case 'checkbox':
      return (
        <FormControlLabel
          control={
            <Checkbox
              checked={props.checked || false}
              disabled={props.disabled || false}
            />
          }
          label={props.label || 'Checkbox'}
          sx={componentStyles}
        />
      )

    case 'radio':
      return (
        <FormControl sx={componentStyles}>
          <FormLabel>{props.label || 'Radio Group'}</FormLabel>
          <RadioGroup
            value={props.value || ''}
          >
            {(props.options || ['Option 1', 'Option 2', 'Option 3']).map((option: string, index: number) => (
              <FormControlLabel
                key={index}
                value={option}
                control={<Radio />}
                label={option}
              />
            ))}
          </RadioGroup>
        </FormControl>
      )

    case 'table':
      const tableData = props.data || [
        { id: 1, name: 'John Doe', email: 'john@example.com' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
      ]
      const columns = props.columns || ['ID', 'Name', 'Email']

      return (
        <TableContainer component={Paper} sx={componentStyles}>
          <Table>
            <TableHead>
              <TableRow>
                {columns.map((column: string, index: number) => (
                  <TableCell key={index}>{column}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {tableData.map((row: any, index: number) => (
                <TableRow key={index}>
                  {Object.values(row).map((cell: any, cellIndex: number) => (
                    <TableCell key={cellIndex}>{cell}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )

    case 'card':
      return (
        <Card sx={componentStyles}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {props.title || 'Card Title'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {props.content || 'Card content goes here...'}
            </Typography>
          </CardContent>
        </Card>
      )

    case 'container':
      return (
        <Box
          sx={{
            padding: props.padding || '16px',
            backgroundColor: props.backgroundColor || 'transparent',
            ...componentStyles
          }}
        >
          {props.title && (
            <Typography variant="h6" gutterBottom>
              {props.title}
            </Typography>
          )}
          {props.content && (
            <Typography variant="body2" color="text.secondary">
              {props.content}
            </Typography>
          )}
        </Box>
      )

    case 'image':
      return (
        <Box sx={componentStyles}>
          <img
            src={props.src || 'https://via.placeholder.com/300x200'}
            alt={props.alt || 'Image'}
            style={{
              width: '100%',
              height: 'auto',
              borderRadius: '4px'
            }}
          />
        </Box>
      )

    case 'divider':
      return <Divider sx={componentStyles} />

    case 'chip':
      return (
        <Chip
          label={props.label || 'Chip'}
          color={props.color || 'default'}
          variant={props.variant || 'filled'}
          sx={componentStyles}
        />
      )

    case 'alert':
      return (
        <Alert
          severity={props.severity || 'info'}
          sx={componentStyles}
        >
          {props.message || 'Alert message'}
        </Alert>
      )

    case 'breadcrumb':
      return (
        <Box sx={componentStyles}>
          <Stack direction="row" spacing={1} alignItems="center">
            {(props.items || ['Home', 'Category', 'Current Page']).map((item: string, index: number) => (
              <React.Fragment key={index}>
                <Typography variant="body2" color="text.secondary">
                  {item}
                </Typography>
                {index < (props.items || []).length - 1 && (
                  <Typography variant="body2" color="text.secondary">
                    /
                  </Typography>
                )}
              </React.Fragment>
            ))}
          </Stack>
        </Box>
      )

    case 'tabs':
      const [activeTab, setActiveTab] = useState(props.activeTab || 0)
      const tabs = props.tabs || ['Tab 1', 'Tab 2', 'Tab 3']
      
      return (
        <Box sx={componentStyles}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Stack direction="row" spacing={2}>
              {tabs.map((tab: string, index: number) => (
                <Button
                  key={index}
                  variant={activeTab === index ? 'contained' : 'text'}
                  onClick={() => setActiveTab(index)}
                  sx={{ minWidth: 'auto' }}
                >
                  {tab}
                </Button>
              ))}
            </Stack>
          </Box>
          <Box sx={{ p: 2 }}>
            <Typography variant="body1">
              Content for {tabs[activeTab]}
            </Typography>
          </Box>
        </Box>
      )

    case 'form':
      return (
        <Paper sx={{ p: 2, ...componentStyles }}>
          <Typography variant="h6" gutterBottom>
            {props.title || 'Form'}
          </Typography>
          <Stack spacing={2}>
            <TextField
              label="Name"
              variant="outlined"
              fullWidth
            />
            <TextField
              label="Email"
              type="email"
              variant="outlined"
              fullWidth
            />
            <Button variant="contained" color="primary">
              Submit
            </Button>
          </Stack>
        </Paper>
      )

    default:
      return (
        <Box sx={componentStyles}>
          <Typography variant="body2" color="text.secondary">
            Unknown component type: {component_type}
          </Typography>
        </Box>
      )
  }
}

const AppRenderer: React.FC<AppRendererProps> = ({
  pages,
  components,
  loading = false,
  error,
  isPublished = false
}) => {
  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
        <Typography variant="body1" sx={{ ml: 2 }}>
          Loading app content...
        </Typography>
      </Box>
    )
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
    )
  }

  if (!pages.length && !components.length) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="400px"
        p={4}
      >
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No Content Available
        </Typography>
        <Typography variant="body2" color="text.secondary" textAlign="center">
          This app doesn't have any pages or components configured yet.
        </Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ p: isPublished ? 0 : 2 }}>
      {/* Render Pages */}
      {pages.map((page) => {
        let pageDefinition
        try {
          pageDefinition = JSON.parse(page.page_definition)
        } catch (e) {
          console.error('Error parsing page definition:', e)
          pageDefinition = { components: [] }
        }

        return (
          <Box key={page.id} sx={{ mb: isPublished ? 0 : 4 }}>
            {!isPublished && (
              <Typography variant="h5" gutterBottom>
                {page.name}
              </Typography>
            )}
            
            {/* Render components for this page */}
            <Grid container spacing={isPublished ? 0 : 2}>
              {/* Handle embedded widgets structure */}
              {pageDefinition.widgets?.map((widget: any) => {
                // Convert widget to component format
                const component = {
                  id: widget.id,
                  name: widget.name,
                  component_type: widget.type,
                  props: widget.props || {},
                  styles: widget.styles || {},
                  events: widget.events || []
                }

                return (
                  <Grid item xs={12} key={widget.id}>
                    <ComponentRenderer component={component} isPublished={isPublished} />
                  </Grid>
                )
              })}
              
              {/* Fallback: Handle legacy components structure */}
              {!pageDefinition.widgets && pageDefinition.components?.map((componentId: string) => {
                const component = components.find(c => c.id.toString() === componentId)
                if (!component) return null

                return (
                  <Grid item xs={12} key={component.id}>
                    <ComponentRenderer component={component} isPublished={isPublished} />
                  </Grid>
                )
              })}
            </Grid>
          </Box>
        )
      })}

      {/* Render standalone components if no pages */}
      {!pages.length && components.length > 0 && (
        <Box>
          {!isPublished && (
            <Typography variant="h5" gutterBottom>
              App Components
            </Typography>
          )}
          <Grid container spacing={isPublished ? 0 : 2}>
            {components.map((component) => (
              <Grid item xs={12} key={component.id}>
                <ComponentRenderer component={component} isPublished={isPublished} />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Box>
  )
}

export default AppRenderer
