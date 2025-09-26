import React, { useState } from 'react'
import {
  Box,
  Typography,
  Button,
  Drawer,
  Grid,
  Card,
  CardContent,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  IconButton,
  Tabs,
  Tab,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material'
import {
  SmartButton,
  TextFields,
  Input,
  TableChart,
  Image,
  CheckBox,
  RadioButtonChecked,
  Dashboard,
  Save,
  Preview,
  Delete,
  Settings,
  Palette,
  Code,
  Add,
  Visibility
} from '@mui/icons-material'
import { useParams } from 'react-router-dom'

// Component Types
type ComponentType = 
  | 'button' | 'text' | 'input' | 'table' | 'image' | 'checkbox' | 'radio' | 'container'
  | 'textarea' | 'select' | 'form' | 'card' | 'list' | 'chart' | 'modal' | 'tab'
  | 'header' | 'footer' | 'sidebar' | 'navbar' | 'breadcrumb' | 'pagination'
  | 'alert' | 'badge' | 'progress' | 'spinner' | 'divider' | 'accordion'
  | 'tabs' | 'stepper' | 'timeline' | 'carousel' | 'grid' | 'flex'

// Industry-standard widget interface (like Appsmith/Bubble)
interface Widget {
  id: string
  type: ComponentType
  name: string
  props: Record<string, any>
  styles: Record<string, any>
  dataBinding?: DataBinding
  events: ComponentEvent[]
  isVisible: boolean
  // Grid layout properties
  layout: {
    x: number
    y: number
    w: number  // width in grid units
    h: number  // height in grid units
    minW?: number
    minH?: number
    maxW?: number
    maxH?: number
  }
}

// Data binding system (like Appsmith)
interface DataBinding {
  source: 'api' | 'database' | 'static' | 'computed'
  endpoint?: string  // API endpoint
  query?: string     // SQL query
  dataSourceId?: string
  xField?: string    // For charts
  yField?: string    // For charts
  staticData?: any[] // Static JSON data
  computedExpression?: string // JavaScript expression
  refreshInterval?: number // Auto-refresh in seconds
}

// Page structure (industry standard)
interface PageDefinition {
  pageId: string
  name: string
  widgets: Widget[]
  layout: Record<string, Widget['layout']>
  dataSources: DataSource[]
  globalSettings: {
    theme: string
    gridSize: number
    breakpoints: Record<string, number>
  }
}

// Data source definition
interface DataSource {
  id: string
  name: string
  type: 'mysql' | 'postgresql' | 'mongodb' | 'api' | 'rest' | 'graphql'
  connectionString?: string
  endpoint?: string
  headers?: Record<string, string>
  authentication?: {
    type: 'none' | 'bearer' | 'basic' | 'api_key'
    token?: string
    username?: string
    password?: string
    apiKey?: string
  }
}

// Legacy interface for backward compatibility
interface AppComponent extends Widget {
  position: { x: number; y: number }
  size: { width: number; height: number }
  data_binding?: Record<string, any>
  layout: {
    x: number
    y: number
    w: number
    h: number
    minW?: number
    minH?: number
    maxW?: number
    maxH?: number
  }
}

interface ComponentEvent {
  id: string
  trigger: 'onClick' | 'onChange' | 'onSubmit'
  actions: EventAction[]
}

interface EventAction {
  id: string
  type: 'showComponent' | 'hideComponent' | 'apiCall' | 'updateComponent' | 'runQuery' | 'navigateTo' | 'showNotification' | 'setVariable' | 'triggerEvent'
  targetComponentId?: string
  apiEndpoint?: string
  apiMethod?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  apiData?: Record<string, any>
  updateProps?: Record<string, any>
  queryId?: string
  queryParams?: Record<string, any>
  navigationPath?: string
  notificationMessage?: string
  notificationType?: 'success' | 'error' | 'warning' | 'info'
  variableName?: string
  variableValue?: any
  targetEventId?: string
}

// Component Palette
const componentPalette: Array<{
  type: ComponentType
  name: string
  icon: React.ReactNode
  defaultProps: Record<string, any>
  category: string
}> = [
  // Basic Components
  {
    type: 'button',
    name: 'Button',
    icon: <SmartButton />,
    defaultProps: { text: 'Click me', variant: 'contained', color: 'primary' },
    category: 'Basic'
  },
  {
    type: 'text',
    name: 'Text',
    icon: <TextFields />,
    defaultProps: { text: 'Sample text', variant: 'body1' },
    category: 'Basic'
  },
  {
    type: 'input',
    name: 'Input Field',
    icon: <Input />,
    defaultProps: { label: 'Enter text', placeholder: 'Type here...', type: 'text' },
    category: 'Form'
  },
  {
    type: 'textarea',
    name: 'Text Area',
    icon: <TextFields />,
    defaultProps: { label: 'Message', placeholder: 'Enter your message...', rows: 4 },
    category: 'Form'
  },
  {
    type: 'select',
    name: 'Select Dropdown',
    icon: <Input />,
    defaultProps: { label: 'Choose option', options: ['Option 1', 'Option 2', 'Option 3'] },
    category: 'Form'
  },
  {
    type: 'checkbox',
    name: 'Checkbox',
    icon: <CheckBox />,
    defaultProps: { label: 'Check me', checked: false },
    category: 'Form'
  },
  {
    type: 'radio',
    name: 'Radio Button',
    icon: <RadioButtonChecked />,
    defaultProps: { label: 'Select option', value: 'option1' },
    category: 'Form'
  },
  
  // Layout Components
  {
    type: 'container',
    name: 'Container',
    icon: <Dashboard />,
    defaultProps: { padding: '16px', backgroundColor: 'transparent' },
    category: 'Layout'
  },
  {
    type: 'card',
    name: 'Card',
    icon: <Dashboard />,
    defaultProps: { title: 'Card Title', content: 'Card content goes here', elevation: 1 },
    category: 'Layout'
  },
  {
    type: 'grid',
    name: 'Grid',
    icon: <Dashboard />,
    defaultProps: { columns: 2, spacing: 2, items: [] },
    category: 'Layout'
  },
  {
    type: 'flex',
    name: 'Flex Container',
    icon: <Dashboard />,
    defaultProps: { direction: 'row', justify: 'flex-start', align: 'stretch' },
    category: 'Layout'
  },
  
  // Navigation Components
  {
    type: 'navbar',
    name: 'Navigation Bar',
    icon: <Dashboard />,
    defaultProps: { 
      brand: 'My App', 
      links: ['Home', 'About', 'Contact'],
      width: '100%',
      height: '64px',
      minHeight: '56px',
      padding: 2,
      backgroundColor: 'primary.main',
      textColor: 'white',
      brandVariant: 'h6',
      brandSize: '1.25rem',
      brandWeight: 600,
      linkSize: 'small',
      linkFontSize: '0.875rem',
      linkWeight: 500,
      linkTransform: 'none',
      borderRadius: 0,
      elevation: 1,
      position: 'fixed',
      top: '0px',
      left: '0px',
      zIndex: 1000
    },
    category: 'Navigation'
  },
  {
    type: 'breadcrumb',
    name: 'Breadcrumb',
    icon: <Dashboard />,
    defaultProps: { items: ['Home', 'Category', 'Current Page'] },
    category: 'Navigation'
  },
  {
    type: 'pagination',
    name: 'Pagination',
    icon: <Dashboard />,
    defaultProps: { page: 1, totalPages: 10, showFirstLast: true },
    category: 'Navigation'
  },
  {
    type: 'tabs',
    name: 'Tabs',
    icon: <Dashboard />,
    defaultProps: { tabs: ['Tab 1', 'Tab 2', 'Tab 3'], activeTab: 0 },
    category: 'Navigation'
  },
  
  // Data Display
  {
    type: 'table',
    name: 'Table',
    icon: <TableChart />,
    defaultProps: { rows: 3, columns: 3, showHeaders: true },
    category: 'Data'
  },
  {
    type: 'list',
    name: 'List',
    icon: <Dashboard />,
    defaultProps: { items: ['Item 1', 'Item 2', 'Item 3'], ordered: false },
    category: 'Data'
  },
  {
    type: 'chart',
    name: 'Chart',
    icon: <TableChart />,
    defaultProps: { 
      type: 'bar', 
      data: [
        { label: 'Jan', value: 100 },
        { label: 'Feb', value: 150 },
        { label: 'Mar', value: 200 },
        { label: 'Apr', value: 120 }
      ], 
      title: 'Sales Chart',
      dataSource: '',
      query: '',
      xAxis: 'label',
      yAxis: 'value'
    },
    category: 'Data'
  },
  
  // Media
  {
    type: 'image',
    name: 'Image',
    icon: <Image />,
    defaultProps: { src: 'https://via.placeholder.com/150', alt: 'Placeholder image' },
    category: 'Media'
  },
  {
    type: 'carousel',
    name: 'Carousel',
    icon: <Image />,
    defaultProps: { images: [], autoPlay: true, interval: 3000 },
    category: 'Media'
  },
  
  // Feedback
  {
    type: 'alert',
    name: 'Alert',
    icon: <Dashboard />,
    defaultProps: { message: 'This is an alert', type: 'info', dismissible: true },
    category: 'Feedback'
  },
  {
    type: 'badge',
    name: 'Badge',
    icon: <Dashboard />,
    defaultProps: { text: 'New', color: 'primary', variant: 'standard' },
    category: 'Feedback'
  },
  {
    type: 'progress',
    name: 'Progress Bar',
    icon: <Dashboard />,
    defaultProps: { value: 50, max: 100, variant: 'determinate' },
    category: 'Feedback'
  },
  {
    type: 'spinner',
    name: 'Loading Spinner',
    icon: <Dashboard />,
    defaultProps: { size: 'medium', color: 'primary' },
    category: 'Feedback'
  },
  
  // Advanced Components
  {
    type: 'modal',
    name: 'Modal',
    icon: <Dashboard />,
    defaultProps: { title: 'Modal Title', content: 'Modal content', open: false },
    category: 'Advanced'
  },
  {
    type: 'accordion',
    name: 'Accordion',
    icon: <Dashboard />,
    defaultProps: { items: [{ title: 'Section 1', content: 'Content 1' }] },
    category: 'Advanced'
  },
  {
    type: 'stepper',
    name: 'Stepper',
    icon: <Dashboard />,
    defaultProps: { steps: ['Step 1', 'Step 2', 'Step 3'], activeStep: 0 },
    category: 'Advanced'
  },
  {
    type: 'timeline',
    name: 'Timeline',
    icon: <Dashboard />,
    defaultProps: { events: [{ title: 'Event 1', date: '2024-01-01' }] },
    category: 'Advanced'
  },
  
  // Form Components
  {
    type: 'form',
    name: 'Form',
    icon: <Dashboard />,
    defaultProps: { fields: [], submitText: 'Submit', resetText: 'Reset' },
    category: 'Form'
  },
  
  // Layout Sections
  {
    type: 'header',
    name: 'Header',
    icon: <Dashboard />,
    defaultProps: { title: 'Page Header', subtitle: 'Page subtitle' },
    category: 'Layout'
  },
  {
    type: 'footer',
    name: 'Footer',
    icon: <Dashboard />,
    defaultProps: { content: '© 2024 My App. All rights reserved.' },
    category: 'Layout'
  },
  {
    type: 'sidebar',
    name: 'Sidebar',
    icon: <Dashboard />,
    defaultProps: { items: ['Menu 1', 'Menu 2', 'Menu 3'], width: 250 },
    category: 'Layout'
  },
  {
    type: 'divider',
    name: 'Divider',
    icon: <Dashboard />,
    defaultProps: { orientation: 'horizontal', variant: 'fullWidth' },
    category: 'Layout'
  }
]

// Chart Component with SQL Data Integration
interface ChartComponentProps {
  type: 'bar' | 'line' | 'pie' | 'doughnut' | 'area'
  title: string
  data: any[]
  dataSource?: string
  query?: string
  xAxis?: string
  yAxis?: string
  colors?: string[]
}

const ChartComponent: React.FC<ChartComponentProps> = ({ 
  type, 
  title, 
  data, 
  dataSource, 
  query, 
  xAxis, 
  yAxis, 
  colors 
}) => {
  const [chartData, setChartData] = useState(data)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch data from SQL if dataSource and query are provided
  const fetchDataFromSQL = async () => {
    if (!dataSource || !query) return

    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`http://localhost:8000/api/v1/data-sources/${dataSource}/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          query: query,
          parameters: {},
          limit: 1000
        })
      })

      if (!response.ok) {
        throw new Error('Failed to fetch data')
      }

      const result = await response.json()
      
      // Transform SQL result to chart data format
      if (result.data && Array.isArray(result.data)) {
        const transformedData = result.data.map((row: any, index: number) => ({
          label: xAxis ? row[xAxis] : `Item ${index + 1}`,
          value: yAxis ? row[yAxis] : Object.values(row)[0],
          ...row
        }))
        setChartData(transformedData)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data')
      console.error('Chart data fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  // Fetch data when component mounts or when dataSource/query changes
  React.useEffect(() => {
    if (dataSource && query) {
      fetchDataFromSQL()
    }
  }, [dataSource, query, xAxis, yAxis])

  // Render different chart types
  const renderChart = () => {
    if (loading) {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          <Box sx={{
            width: 32,
            height: 32,
            border: '3px solid #f3f3f3',
            borderTop: '3px solid #3498db',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            '@keyframes spin': {
              '0%': { transform: 'rotate(0deg)' },
              '100%': { transform: 'rotate(360deg)' }
            }
          }} />
        </Box>
      )
    }

    if (error) {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'error.main' }}>
          <Typography variant="body2">Error: {error}</Typography>
        </Box>
      )
    }

    if (!chartData || chartData.length === 0) {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          <Typography variant="body2" color="text.secondary">
            No data available
          </Typography>
        </Box>
      )
    }

    // Simple chart rendering using CSS and basic shapes
    const maxValue = Math.max(...chartData.map(d => typeof d.value === 'number' ? d.value : 0))
    const defaultColors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4']
    const chartColors = colors && colors.length > 0 ? colors : defaultColors

    switch (type) {
      case 'bar':
        return (
          <Box sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>{title}</Typography>
            <Box sx={{ display: 'flex', alignItems: 'end', height: 'calc(100% - 60px)', gap: 1 }}>
              {chartData.map((item, index) => (
                <Box key={index} sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Box
                    sx={{
                      width: '100%',
                      height: `${((typeof item.value === 'number' ? item.value : 0) / maxValue) * 100}%`,
                      bgcolor: chartColors[index % chartColors.length],
                      borderRadius: '4px 4px 0 0',
                      minHeight: '4px',
                      transition: 'height 0.3s ease'
                    }}
                  />
                  <Typography variant="caption" sx={{ mt: 1, fontSize: '0.7rem', textAlign: 'center' }}>
                    {item.label}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        )

      case 'line':
        return (
          <Box sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>{title}</Typography>
            <Box sx={{ position: 'relative', height: 'calc(100% - 60px)' }}>
              <svg width="100%" height="100%" style={{ overflow: 'visible' }}>
                <polyline
                  fill="none"
                  stroke={chartColors[0]}
                  strokeWidth="2"
                  points={chartData.map((item, index) => {
                    const x = (index / (chartData.length - 1)) * 100
                    const y = 100 - ((typeof item.value === 'number' ? item.value : 0) / maxValue) * 100
                    return `${x},${y}`
                  }).join(' ')}
                />
                {chartData.map((item, index) => {
                  const x = (index / (chartData.length - 1)) * 100
                  const y = 100 - ((typeof item.value === 'number' ? item.value : 0) / maxValue) * 100
                  return (
                    <circle
                      key={index}
                      cx={x}
                      cy={y}
                      r="3"
                      fill={chartColors[0]}
                    />
                  )
                })}
              </svg>
            </Box>
          </Box>
        )

      case 'pie':
      case 'doughnut':
        const total = chartData.reduce((sum, item) => sum + (typeof item.value === 'number' ? item.value : 0), 0)
        let currentAngle = 0
        
        return (
          <Box sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>{title}</Typography>
            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Box sx={{ position: 'relative', width: 120, height: 120 }}>
                <svg width="120" height="120" style={{ transform: 'rotate(-90deg)' }}>
                  {chartData.map((item, index) => {
                    const percentage = (typeof item.value === 'number' ? item.value : 0) / total
                    const angle = percentage * 360
                    const radius = type === 'doughnut' ? 40 : 50
                    const innerRadius = type === 'doughnut' ? 20 : 0
                    
                    const x1 = 60 + radius * Math.cos((currentAngle * Math.PI) / 180)
                    const y1 = 60 + radius * Math.sin((currentAngle * Math.PI) / 180)
                    const x2 = 60 + radius * Math.cos(((currentAngle + angle) * Math.PI) / 180)
                    const y2 = 60 + radius * Math.sin(((currentAngle + angle) * Math.PI) / 180)
                    
                    const largeArcFlag = angle > 180 ? 1 : 0
                    
                    const pathData = [
                      `M 60 60`,
                      `L ${x1} ${y1}`,
                      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                      type === 'doughnut' ? `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${60 + innerRadius * Math.cos(((currentAngle + angle) * Math.PI) / 180)} ${60 + innerRadius * Math.sin(((currentAngle + angle) * Math.PI) / 180)}` : '',
                      type === 'doughnut' ? `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 1 ${60 + innerRadius * Math.cos((currentAngle * Math.PI) / 180)} ${60 + innerRadius * Math.sin((currentAngle * Math.PI) / 180)}` : '',
                      'Z'
                    ].join(' ')
                    
                    currentAngle += angle
                    
                    return (
                      <path
                        key={index}
                        d={pathData}
                        fill={chartColors[index % chartColors.length]}
                        stroke="white"
                        strokeWidth="1"
                      />
                    )
                  })}
                </svg>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
              {chartData.map((item, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Box sx={{ width: 12, height: 12, bgcolor: chartColors[index % chartColors.length], borderRadius: 1 }} />
                  <Typography variant="caption">{item.label}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
        )

      default:
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <Typography variant="body2" color="text.secondary">
              Chart type "{type}" not supported
            </Typography>
          </Box>
        )
    }
  }

  return (
    <Box sx={{ width: '100%', height: '100%', border: '1px solid #e2e8f0', borderRadius: 1, bgcolor: 'white' }}>
      {renderChart()}
    </Box>
  )
}

export const AppBuilder: React.FC = () => {
  const { appId } = useParams<{ appId: string }>()
  const [components, setComponents] = useState<AppComponent[]>([])
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState(0)
  const [previewMode, setPreviewMode] = useState(false)
  const [previewDialog, setPreviewDialog] = useState(false)
  const [executingEvents, setExecutingEvents] = useState<Set<string>>(new Set())
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [snapToGrid, setSnapToGrid] = useState<boolean>(true)
  const gridSize = 20
  const [isDragging, setIsDragging] = useState<boolean>(false)
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number } | null>(null)

  // Get unique categories
  const categories = ['All', ...Array.from(new Set(componentPalette.map(item => item.category)))]
  
  // Filter components by category
  const filteredComponents = selectedCategory === 'All' 
    ? componentPalette 
    : componentPalette.filter(item => item.category === selectedCategory)

  // Snap to grid helper function
  const snapToGridPosition = (x: number, y: number) => {
    if (!snapToGrid) return { x, y }
    return {
      x: Math.round(x / gridSize) * gridSize,
      y: Math.round(y / gridSize) * gridSize
    }
  }

  // Get next position for new components
  const getNextPosition = (componentType?: ComponentType) => {
    const occupiedPositions = components.map(c => ({ x: c.position.x, y: c.position.y }))
    let x = 50, y = 100
    
    // Special positioning for navbar - place at top
    if (componentType === 'navbar') {
      x = 0
      y = 0
      return snapToGridPosition(x, y)
    }
    
    // Simple positioning logic - stack components
    if (occupiedPositions.length > 0) {
      y = Math.max(...occupiedPositions.map(p => p.y)) + 80
    }
    
    return snapToGridPosition(x, y)
  }

  // Add component to canvas
  const addComponent = (type: ComponentType) => {
    const paletteItem = componentPalette.find(p => p.type === type)
    const position = getNextPosition(type)
    
    const newComponent: AppComponent = {
      id: `${type}_${Date.now()}`,
      type,
      name: `${paletteItem?.name || type} ${components.length + 1}`,
      props: { ...paletteItem?.defaultProps },
      styles: {
        backgroundColor: 'transparent',
        color: '#000000',
        fontSize: '14px',
        padding: '8px',
        margin: '4px',
        borderRadius: '4px',
        border: '1px solid #ddd'
      },
      position,
      size: { width: 200, height: 60 },
      events: [],
      isVisible: true,
      layout: {
        x: Math.floor(position.x / 50),
        y: Math.floor(position.y / 50),
        w: 4,
        h: 2,
        minW: 1,
        minH: 1
      }
    }
    
    setComponents([...components, newComponent])
    setSelectedComponentId(newComponent.id)
  }

  // Update component
  const updateComponent = (id: string, updates: Partial<AppComponent>) => {
    setComponents(prev => prev.map(comp => 
      comp.id === id ? { ...comp, ...updates } : comp
    ))
  }

  // Update component props
  const updateComponentProps = (id: string, props: Record<string, any>) => {
    updateComponent(id, { props: { ...components.find(c => c.id === id)?.props, ...props } })
  }

  // Update component styles
  const updateComponentStyles = (id: string, styles: Record<string, any>) => {
    updateComponent(id, { styles: { ...components.find(c => c.id === id)?.styles, ...styles } })
  }

  // Delete component
  const deleteComponent = (id: string) => {
    setComponents(prev => prev.filter(comp => comp.id !== id))
    if (selectedComponentId === id) {
      setSelectedComponentId(null)
    }
  }

  // Duplicate component
  const duplicateComponent = (id: string) => {
    const componentToDuplicate = components.find(comp => comp.id === id)
    if (!componentToDuplicate) return

    const duplicatedComponent: AppComponent = {
      ...componentToDuplicate,
      id: `${componentToDuplicate.type}_${Date.now()}`,
      name: `${componentToDuplicate.name} (Copy)`,
      position: {
        x: componentToDuplicate.position.x + 20,
        y: componentToDuplicate.position.y + 20
      }
    }
    
    setComponents(prev => [...prev, duplicatedComponent])
    setSelectedComponentId(duplicatedComponent.id)
  }

  // Move component
  const moveComponent = (id: string, newPosition: { x: number; y: number }) => {
    const snappedPosition = snapToGridPosition(newPosition.x, newPosition.y)
    updateComponent(id, { position: snappedPosition })
  }

  // Drag and drop handlers
  const handleMouseDown = (e: React.MouseEvent, componentId: string) => {
    if (previewMode) return
    
    e.preventDefault()
    e.stopPropagation()
    
    const component = components.find(c => c.id === componentId)
    if (!component) return
    
    setSelectedComponentId(componentId)
    setIsDragging(true)
    
    const canvasRect = (e.currentTarget.closest('.canvas-container') as HTMLElement)?.getBoundingClientRect()
    
    if (canvasRect) {
      setDragOffset({
        x: e.clientX - canvasRect.left - component.position.x,
        y: e.clientY - canvasRect.top - component.position.y
      })
    }
  }



  // Save app
  // Industry-standard page saving (like Appsmith/Bubble)
  const savePage = async () => {
    try {
      console.log('Saving page with widgets:', components)
      
      // Check authentication token
      const token = localStorage.getItem('token')
      console.log('Auth token:', token ? 'Present' : 'Missing')
      if (!token) {
        showNotification('Please log in to save the page', 'error')
        return
      }
      
      // Convert components to industry-standard page definition
      const pageDefinition: PageDefinition = {
        pageId: `page_${appId}`,
        name: `App ${appId} - Page`,
        widgets: components.map(component => ({
          id: component.id,
          type: component.type,
          name: component.name,
          props: component.props,
          styles: component.styles,
          dataBinding: component.data_binding ? {
            source: 'database',
            query: component.data_binding.query,
            dataSourceId: component.data_binding.dataSource,
            xField: component.data_binding.xAxis,
            yField: component.data_binding.yAxis
          } : undefined,
          events: component.events,
          isVisible: component.isVisible,
          layout: {
            x: Math.floor(component.position.x / 50), // Convert to grid units
            y: Math.floor(component.position.y / 50),
            w: Math.floor(component.size.width / 50),
            h: Math.floor(component.size.height / 50),
            minW: 1,
            minH: 1
          }
        })),
        layout: components.reduce((acc, component) => {
          acc[component.id] = {
            x: Math.floor(component.position.x / 50),
            y: Math.floor(component.position.y / 50),
            w: Math.floor(component.size.width / 50),
            h: Math.floor(component.size.height / 50),
            minW: 1,
            minH: 1
          }
          return acc
        }, {} as Record<string, Widget['layout']>),
        dataSources: [], // TODO: Load from backend
        globalSettings: {
          theme: 'light',
          gridSize: 50,
          breakpoints: {
            mobile: 768,
            tablet: 1024,
            desktop: 1200
          }
        }
      }
      
      console.log('Page definition:', pageDefinition)

      const requestBody = {
        name: `App ${appId} - Page`,
        app_id: parseInt(appId || '1'),
        page_definition: pageDefinition
      }
      
      console.log('Request body:', requestBody)

      // Validate that the request body can be serialized
      try {
        JSON.stringify(requestBody)
      } catch (error) {
        console.error('Serialization error:', error)
        showNotification('Failed to serialize page data', 'error')
        return
      }

      // Save entire page as single JSON document (industry standard)
      const response = await fetch(`http://localhost:8000/api/v1/pages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(requestBody)
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Page save error:', errorData)
        console.error('Response status:', response.status)
        console.error('Response headers:', response.headers)
        throw new Error(`Failed to save page: ${errorData.detail || 'Unknown error'}`)
      }
      
      showNotification('Page saved successfully!', 'success')
    } catch (error) {
      console.error('Error saving page:', error)
      showNotification('Failed to save page', 'error')
    }
  }

  // Legacy save function for backward compatibility
  const saveApp = savePage

  // Load page from industry-standard format
  const loadPage = async () => {
    try {
      const token = localStorage.getItem('token')
      console.log('Loading page - Auth token:', token ? 'Present' : 'Missing')
      
      if (!token) {
        console.log('No auth token, skipping page load')
        return
      }
      
      const response = await fetch(`http://localhost:8000/api/v1/pages?app_id=${appId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const pageData = await response.json()
        if (pageData.page_definition) {
          const pageDefinition: PageDefinition = pageData.page_definition
          
          // Convert widgets back to components
          const loadedComponents: AppComponent[] = pageDefinition.widgets.map(widget => ({
            id: widget.id,
            type: widget.type,
            name: widget.name,
            props: widget.props,
            styles: widget.styles,
            data_binding: widget.dataBinding ? {
              query: widget.dataBinding.query,
              dataSource: widget.dataBinding.dataSourceId,
              xAxis: widget.dataBinding.xField,
              yAxis: widget.dataBinding.yField
            } : undefined,
            position: {
              x: widget.layout.x * 50, // Convert from grid units
              y: widget.layout.y * 50
            },
            size: {
              width: widget.layout.w * 50,
              height: widget.layout.h * 50
            },
            events: widget.events,
            isVisible: widget.isVisible,
            layout: widget.layout
          }))
          
          setComponents(loadedComponents)
          showNotification('Page loaded successfully!', 'success')
        }
      } else {
        console.error('Page load error - Status:', response.status)
        const errorData = await response.json().catch(() => ({}))
        console.error('Page load error - Data:', errorData)
        
        if (response.status === 401) {
          showNotification('Authentication failed. Please log in again.', 'error')
        } else if (response.status === 404) {
          console.log('No existing page found, starting with empty canvas')
        } else {
          showNotification(`Failed to load page: ${errorData.detail || 'Unknown error'}`, 'error')
        }
      }
    } catch (error) {
      console.error('Error loading page:', error)
      showNotification('Failed to load page', 'error')
    }
  }

  // Load page on component mount
  React.useEffect(() => {
    loadPage()
  }, [appId])

  // Keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!selectedComponentId) return

      // Delete component with Delete key
      if (event.key === 'Delete' || event.key === 'Backspace') {
        if (event.ctrlKey || event.metaKey) {
          deleteComponent(selectedComponentId)
        }
      }

      // Duplicate component with Ctrl+D
      if ((event.ctrlKey || event.metaKey) && event.key === 'd') {
        event.preventDefault()
        duplicateComponent(selectedComponentId)
      }

      // Copy component with Ctrl+C
      if ((event.ctrlKey || event.metaKey) && event.key === 'c') {
        event.preventDefault()
        // TODO: Implement copy to clipboard
      }

      // Paste component with Ctrl+V
      if ((event.ctrlKey || event.metaKey) && event.key === 'v') {
        event.preventDefault()
        // TODO: Implement paste from clipboard
      }

      // Arrow keys for moving components
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
        event.preventDefault()
        const selectedComponent = components.find(c => c.id === selectedComponentId)
        if (!selectedComponent) return

        const step = event.shiftKey ? 10 : 1 // Shift for larger steps
        let newX = selectedComponent.position.x
        let newY = selectedComponent.position.y

        switch (event.key) {
          case 'ArrowUp':
            newY = Math.max(0, newY - step)
            break
          case 'ArrowDown':
            newY += step
            break
          case 'ArrowLeft':
            newX = Math.max(0, newX - step)
            break
          case 'ArrowRight':
            newX += step
            break
        }

        moveComponent(selectedComponentId, { x: newX, y: newY })
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedComponentId, components])

  // Global mouse events for drag and drop
  React.useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!isDragging || !selectedComponentId || !dragOffset) return
      
      const canvasElement = document.querySelector('.canvas-container') as HTMLElement
      if (!canvasElement) return
      
      const canvasRect = canvasElement.getBoundingClientRect()
      const newX = e.clientX - canvasRect.left - dragOffset.x
      const newY = e.clientY - canvasRect.top - dragOffset.y
      
      // Constrain to canvas bounds
      const constrainedX = Math.max(0, Math.min(newX, canvasRect.width - 200))
      const constrainedY = Math.max(0, newY)
      
      moveComponent(selectedComponentId, { x: constrainedX, y: constrainedY })
    }

    const handleGlobalMouseUp = () => {
      setIsDragging(false)
      setDragOffset(null)
    }

    if (isDragging) {
      document.addEventListener('mousemove', handleGlobalMouseMove)
      document.addEventListener('mouseup', handleGlobalMouseUp)
      document.body.style.cursor = 'grabbing'
      document.body.style.userSelect = 'none'
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove)
      document.removeEventListener('mouseup', handleGlobalMouseUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
  }, [isDragging, selectedComponentId, dragOffset])

  // Enhanced data binding system (like Appsmith)
  const resolveDataBinding = async (dataBinding: DataBinding) => {
    if (!dataBinding) return null

    try {
      switch (dataBinding.source) {
        case 'api':
          if (dataBinding.endpoint) {
            const response = await fetch(dataBinding.endpoint, {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              }
            })
            return await response.json()
          }
          break

        case 'database':
          if (dataBinding.dataSourceId && dataBinding.query) {
            const response = await fetch(`http://localhost:8000/api/v1/data-sources/${dataBinding.dataSourceId}/query`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              },
              body: JSON.stringify({
                query: dataBinding.query,
                parameters: {},
                limit: 1000
              })
            })
            const result = await response.json()
            return result.data
          }
          break

        case 'static':
          return dataBinding.staticData

        case 'computed':
          if (dataBinding.computedExpression) {
            // Execute JavaScript expression (in a sandboxed environment)
            // This is a simplified version - in production, use a proper expression evaluator
            try {
              // eslint-disable-next-line no-eval
              return eval(dataBinding.computedExpression)
            } catch (e) {
              console.error('Computed expression error:', e)
              return null
            }
          }
          break
      }
    } catch (error) {
      console.error('Data binding error:', error)
      return null
    }

    return null
  }

  // Auto-refresh data bindings
  React.useEffect(() => {
    const intervals: ReturnType<typeof setInterval>[] = []

    components.forEach(component => {
      if (component.data_binding && component.data_binding.refreshInterval) {
        const interval = setInterval(async () => {
          const data = await resolveDataBinding(component.data_binding as DataBinding)
          if (data) {
            // Update component with new data
            updateComponentProps(component.id, { data })
          }
        }, component.data_binding.refreshInterval * 1000)
        
        intervals.push(interval)
      }
    })

    return () => {
      intervals.forEach(interval => clearInterval(interval))
    }
  }, [components])

  // Execute component event
  const executeEvent = async (componentId: string, trigger: string) => {
    const component = components.find(c => c.id === componentId)
    if (!component) return

    const events = component.events.filter(e => e.trigger === trigger)
    
    // Add visual feedback for event execution
    setExecutingEvents(prev => new Set([...prev, componentId]))
    
    try {
    for (const event of events) {
      for (const action of event.actions) {
        await executeAction(action)
      }
      }
    } finally {
      // Remove visual feedback after execution
      window.setTimeout(() => {
        setExecutingEvents(prev => {
          const newSet = new Set(prev)
          newSet.delete(componentId)
          return newSet
        })
      }, 1000)
    }
  }

  // Execute individual action
  const executeAction = async (action: EventAction) => {
    console.log('Executing action:', action)
    
    switch (action.type) {
      case 'showComponent':
        if (action.targetComponentId) {
          setComponents(prev => prev.map(comp => 
            comp.id === action.targetComponentId ? { ...comp, isVisible: true } : comp
          ))
          console.log('Component shown:', action.targetComponentId)
        }
        break
        
      case 'hideComponent':
        if (action.targetComponentId) {
          setComponents(prev => prev.map(comp => 
            comp.id === action.targetComponentId ? { ...comp, isVisible: false } : comp
          ))
          console.log('Component hidden:', action.targetComponentId)
        }
        break
        
      case 'updateComponent':
        if (action.targetComponentId && action.updateProps) {
          setComponents(prev => prev.map(comp => 
            comp.id === action.targetComponentId 
              ? { ...comp, props: { ...comp.props, ...action.updateProps } } 
              : comp
          ))
          console.log('Component updated:', action.targetComponentId, action.updateProps)
        }
        break
        
      case 'apiCall':
        if (action.apiEndpoint && action.apiMethod) {
          try {
            const response = await fetch(action.apiEndpoint, {
              method: action.apiMethod,
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              },
              body: action.apiMethod !== 'GET' ? JSON.stringify(action.apiData || {}) : undefined
            })
            const data = await response.json()
            console.log('API Response:', data)
            // Show success notification
            showNotification('API call successful', 'success')
          } catch (error) {
            console.error('API Error:', error)
            showNotification('API call failed', 'error')
          }
        }
        break
        
      case 'runQuery':
        if (action.queryId) {
          try {
            // Execute data source query
            const response = await fetch(`http://localhost:8000/api/v1/data-sources/${action.queryId}/query`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              },
              body: JSON.stringify({
                query: action.queryParams?.query || 'SELECT * FROM users LIMIT 10',
                parameters: action.queryParams?.parameters || {},
                limit: action.queryParams?.limit || 100
              })
            })
            const data = await response.json()
            console.log('Query result:', data)
            showNotification('Query executed successfully', 'success')
          } catch (error) {
            console.error('Query Error:', error)
            showNotification('Query execution failed', 'error')
          }
        }
        break
        
      case 'navigateTo':
        if (action.navigationPath) {
          // Navigate to different page/route
          window.location.href = action.navigationPath
          console.log('Navigating to:', action.navigationPath)
        }
        break
        
      case 'showNotification':
        if (action.notificationMessage) {
          showNotification(
            action.notificationMessage, 
            action.notificationType || 'info'
          )
        }
        break
        
      case 'setVariable':
        if (action.variableName) {
          // Store variable in localStorage for now (could be enhanced with proper state management)
          localStorage.setItem(`app_variable_${action.variableName}`, JSON.stringify(action.variableValue))
          console.log('Variable set:', action.variableName, action.variableValue)
        }
        break
        
      case 'triggerEvent':
        if (action.targetEventId) {
          // Find and trigger another component's event
          const targetComponent = components.find(comp => 
            comp.events.some(event => event.id === action.targetEventId)
          )
          if (targetComponent) {
            const targetEvent = targetComponent.events.find(event => event.id === action.targetEventId)
            if (targetEvent) {
              await executeEvent(targetComponent.id, targetEvent.trigger)
            }
          }
        }
        break
    }
  }

  // Show notification helper
  const showNotification = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    // Simple alert for now - could be enhanced with a proper notification system
    alert(`${type.toUpperCase()}: ${message}`)
  }

  // Add event to component
  const addEventToComponent = (componentId: string, trigger: 'onClick' | 'onChange' | 'onSubmit') => {
    const newEvent: ComponentEvent = {
      id: `event_${Date.now()}`,
      trigger,
      actions: []
    }
    
    setComponents(prev => prev.map(comp => 
      comp.id === componentId 
        ? { ...comp, events: [...comp.events, newEvent] }
        : comp
    ))
  }

  // Add action to event
  const addActionToEvent = (componentId: string, eventId: string, actionType: EventAction['type']) => {
    const newAction: EventAction = {
      id: `action_${Date.now()}`,
      type: actionType
    }
    
    setComponents(prev => prev.map(comp => 
      comp.id === componentId 
        ? {
            ...comp,
            events: comp.events.map(event =>
              event.id === eventId
                ? { ...event, actions: [...event.actions, newAction] }
                : event
            )
          }
        : comp
    ))
  }

  // Update action
  const updateAction = (componentId: string, eventId: string, actionId: string, updates: Partial<EventAction>) => {
    setComponents(prev => prev.map(comp => 
      comp.id === componentId 
        ? {
            ...comp,
            events: comp.events.map(event =>
              event.id === eventId
                ? {
                    ...event,
                    actions: event.actions.map(action =>
                      action.id === actionId ? { ...action, ...updates } : action
                    )
                  }
                : event
            )
          }
        : comp
    ))
  }

  // Render component on canvas
  const renderCanvasComponent = (component: AppComponent) => {
    const isSelected = selectedComponentId === component.id
    const isExecuting = executingEvents.has(component.id)
    
    // Don't render hidden components in preview mode
    if (!component.isVisible && previewMode) {
      return null
    }
    
    let content = null
    switch (component.type) {
      case 'button':
        content = (
          <Button 
            variant={component.props.variant} 
            color={component.props.color}
            onClick={previewMode ? () => executeEvent(component.id, 'onClick') : undefined}
          >
            {component.props.text}
          </Button>
        )
        break
      case 'text':
        content = (
          <Typography variant={component.props.variant}>
            {component.props.text}
          </Typography>
        )
        break
      case 'input':
        content = (
          <TextField 
            label={component.props.label}
            placeholder={component.props.placeholder}
            type={component.props.type}
            size="small"
            fullWidth
            onChange={previewMode ? () => executeEvent(component.id, 'onChange') : undefined}
          />
        )
        break
      case 'checkbox':
        content = (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <input 
              type="checkbox" 
              checked={component.props.checked} 
              onChange={previewMode ? () => executeEvent(component.id, 'onChange') : undefined}
              readOnly={!previewMode}
            />
            <Typography variant="body2" sx={{ ml: 1 }}>
              {component.props.label}
            </Typography>
          </Box>
        )
        break
      case 'image':
        content = (
          <img 
            src={component.props.src} 
            alt={component.props.alt}
            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
          />
        )
        break
      case 'textarea':
        content = (
          <TextField 
            label={component.props.label}
            placeholder={component.props.placeholder}
            multiline
            rows={component.props.rows || 4}
            fullWidth
            onChange={previewMode ? () => executeEvent(component.id, 'onChange') : undefined}
          />
        )
        break
      case 'select':
        content = (
          <FormControl fullWidth>
            <InputLabel>{component.props.label}</InputLabel>
            <Select
              value={component.props.value || ''}
              onChange={previewMode ? () => executeEvent(component.id, 'onChange') : undefined}
              label={component.props.label}
            >
              {component.props.options?.map((option: string, index: number) => (
                <MenuItem key={index} value={option}>{option}</MenuItem>
              ))}
            </Select>
          </FormControl>
        )
        break
      case 'card':
        content = (
          <Card sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              {component.props.title}
            </Typography>
            <Typography variant="body2">
              {component.props.content}
            </Typography>
          </Card>
        )
        break
      case 'alert':
        content = (
          <Box sx={{ 
            p: 2, 
            bgcolor: component.props.type === 'error' ? 'error.light' : 
                    component.props.type === 'warning' ? 'warning.light' : 
                    component.props.type === 'success' ? 'success.light' : 'info.light',
            color: component.props.type === 'error' ? 'error.dark' : 
                   component.props.type === 'warning' ? 'warning.dark' : 
                   component.props.type === 'success' ? 'success.dark' : 'info.dark',
            borderRadius: 1,
            width: '100%'
          }}>
            {component.props.message}
          </Box>
        )
        break
      case 'progress':
        content = (
          <Box sx={{ width: '100%' }}>
            <Box sx={{ 
              width: '100%', 
              height: 8, 
              bgcolor: 'grey.200', 
              borderRadius: 1,
              overflow: 'hidden'
            }}>
              <Box sx={{ 
                width: `${component.props.value || 0}%`, 
                height: '100%', 
                bgcolor: 'primary.main',
                transition: 'width 0.3s ease'
              }} />
            </Box>
            <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
              {component.props.value || 0}%
            </Typography>
          </Box>
        )
        break
      case 'list':
        content = (
          <Box>
            {component.props.items?.map((item: string, index: number) => (
              <Box key={index} sx={{ 
                p: 1, 
                borderBottom: index < (component.props.items?.length || 0) - 1 ? '1px solid #e0e0e0' : 'none',
                display: 'flex',
                alignItems: 'center'
              }}>
                <Typography variant="body2">{item}</Typography>
              </Box>
            ))}
          </Box>
        )
        break
      case 'navbar':
        content = (
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2, 
            p: component.props.padding || 1, 
            bgcolor: component.props.backgroundColor || 'primary.main', 
            color: component.props.textColor || 'white',
            height: component.props.height || 'auto',
            minHeight: component.props.minHeight || '56px',
            width: component.props.width || '100%',
            borderRadius: component.props.borderRadius || 0,
            boxShadow: component.props.elevation ? `0 ${component.props.elevation}px ${component.props.elevation * 2}px rgba(0,0,0,0.1)` : 'none',
            position: component.props.position || 'relative',
            top: component.props.top || 'auto',
            left: component.props.left || 'auto',
            right: component.props.right || 'auto',
            zIndex: component.props.zIndex || 'auto'
          }}>
            <Typography 
              variant={component.props.brandVariant || 'h6'}
              sx={{ 
                fontSize: component.props.brandSize || '1.25rem',
                fontWeight: component.props.brandWeight || 600
              }}
            >
              {component.props.brand}
            </Typography>
            {component.props.links?.map((link: string, index: number) => (
              <Button 
                key={index} 
                color="inherit" 
                size={component.props.linkSize || 'small'}
                sx={{
                  fontSize: component.props.linkFontSize || '0.875rem',
                  fontWeight: component.props.linkWeight || 500,
                  textTransform: component.props.linkTransform || 'none'
                }}
              >
                {link}
              </Button>
            ))}
          </Box>
        )
        break
      case 'header':
        content = (
          <Box sx={{ textAlign: 'center', p: 2 }}>
            <Typography variant="h4" gutterBottom>
              {component.props.title}
            </Typography>
            {component.props.subtitle && (
              <Typography variant="subtitle1" color="text.secondary">
                {component.props.subtitle}
              </Typography>
            )}
          </Box>
        )
        break
      case 'footer':
        content = (
          <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'grey.100' }}>
            <Typography variant="body2" color="text.secondary">
              {component.props.content}
            </Typography>
          </Box>
        )
        break
      case 'divider':
        content = (
          <Divider orientation={component.props.orientation || 'horizontal'} />
        )
        break
      case 'badge':
        content = (
          <Box sx={{ 
            display: 'inline-block',
            px: 1.5,
            py: 0.5,
            bgcolor: component.props.color === 'secondary' ? 'secondary.main' : 'primary.main',
            color: 'white',
            borderRadius: 2,
            fontSize: '0.75rem',
            fontWeight: 500
          }}>
            {component.props.text}
          </Box>
        )
        break
      case 'spinner':
        content = (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            <Box sx={{
              width: component.props.size === 'small' ? 24 : component.props.size === 'large' ? 48 : 32,
              height: component.props.size === 'small' ? 24 : component.props.size === 'large' ? 48 : 32,
              border: '3px solid #f3f3f3',
              borderTop: '3px solid #3498db',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              '@keyframes spin': {
                '0%': { transform: 'rotate(0deg)' },
                '100%': { transform: 'rotate(360deg)' }
              }
            }} />
          </Box>
        )
        break
      case 'chart':
        content = (
          <Box sx={{ width: '100%', height: '200px', position: 'relative' }}>
            <ChartComponent 
              type={component.props.type || 'bar'} 
              title={component.props.title || 'Chart'}
              data={component.props.data || []}
              dataSource={component.props.dataSource}
              query={component.props.query}
              xAxis={component.props.xAxis}
              yAxis={component.props.yAxis}
              colors={component.props.colors}
            />
          </Box>
        )
        break
      default:
        content = (
          <Typography variant="body2" color="text.secondary">
            {component.name} ({component.type})
          </Typography>
        )
    }

    return (
      <Paper
        key={component.id}
        sx={{
          position: 'absolute',
          left: component.position.x,
          top: component.position.y,
          width: component.size.width,
          minHeight: component.size.height,
          p: 2,
          cursor: previewMode ? 'default' : (isDragging ? 'grabbing' : 'grab'),
          border: isSelected ? '2px solid #3b82f6' : '1px dashed #d1d5db',
          bgcolor: component.styles.backgroundColor || 'white',
          color: component.styles.color,
          fontSize: component.styles.fontSize,
          borderRadius: component.styles.borderRadius || 2,
          opacity: !component.isVisible && !previewMode ? 0.5 : 1,
          boxShadow: isExecuting 
            ? '0 0 20px rgba(59, 130, 246, 0.5)' 
            : isSelected 
              ? '0 4px 12px rgba(0, 0, 0, 0.1)' 
              : '0 1px 3px rgba(0, 0, 0, 0.1)',
          animation: isExecuting ? 'pulse 1s infinite' : 'none',
          transition: isDragging ? 'none' : 'all 0.2s ease-in-out',
          transform: isDragging ? 'rotate(2deg)' : 'none',
          zIndex: isSelected ? 1000 : 1,
          '@keyframes pulse': {
            '0%': { transform: 'scale(1)', boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)' },
            '50%': { transform: 'scale(1.02)', boxShadow: '0 0 25px rgba(59, 130, 246, 0.7)' },
            '100%': { transform: 'scale(1)', boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)' }
          },
          '&:hover': previewMode ? {} : { 
            borderColor: '#3b82f6',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            transform: isDragging ? 'rotate(2deg)' : 'translateY(-1px)'
          }
        }}
        onClick={() => !previewMode && setSelectedComponentId(component.id)}
        onMouseDown={(e) => !previewMode && handleMouseDown(e, component.id)}
      >
        {content}
        {!component.isVisible && !previewMode && (
          <Typography 
            variant="caption" 
            sx={{ 
              position: 'absolute', 
              bottom: -20, 
              left: 0, 
              bgcolor: 'warning.main', 
              color: 'white', 
              px: 1, 
              borderRadius: 1 
            }}
          >
            Hidden
          </Typography>
        )}
        {isSelected && !previewMode && (
          <>
            {/* Drag Handle */}
            <Box
              sx={{
                position: 'absolute',
                top: -8,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 24,
                height: 8,
                bgcolor: '#3b82f6',
                borderRadius: '4px 4px 0 0',
                cursor: 'grab',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                '&:hover': {
                  bgcolor: '#2563eb',
                  transform: 'translateX(-50%) scale(1.1)'
                },
                transition: 'all 0.2s ease-in-out',
                '&::before': {
                  content: '""',
                  width: 12,
                  height: 2,
                  bgcolor: 'white',
                  borderRadius: 1
                }
              }}
              onMouseDown={(e) => {
                e.stopPropagation()
                handleMouseDown(e, component.id)
              }}
            />

            {/* Delete Button */}
          <IconButton
            size="small"
            sx={{ 
              position: 'absolute', 
              top: -12, 
              right: -12, 
              bgcolor: '#ef4444', 
              color: 'white',
              width: 24,
              height: 24,
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
              '&:hover': {
                bgcolor: '#dc2626',
                transform: 'scale(1.1)'
              },
              transition: 'all 0.2s ease-in-out'
            }}
            onClick={(e) => {
              e.stopPropagation()
              deleteComponent(component.id)
            }}
          >
            <Delete sx={{ fontSize: 14 }} />
          </IconButton>

            {/* Duplicate Button */}
            <IconButton
              size="small"
              sx={{ 
                position: 'absolute', 
                top: -12, 
                right: 20, 
                bgcolor: '#3b82f6', 
                color: 'white',
                width: 24,
                height: 24,
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                '&:hover': {
                  bgcolor: '#2563eb',
                  transform: 'scale(1.1)'
                },
                transition: 'all 0.2s ease-in-out'
              }}
              onClick={(e) => {
                e.stopPropagation()
                duplicateComponent(component.id)
              }}
            >
              <Add sx={{ fontSize: 14 }} />
            </IconButton>

            {/* Resize Handle */}
            <Box
              sx={{
                position: 'absolute',
                bottom: -4,
                right: -4,
                width: 12,
                height: 12,
                bgcolor: '#3b82f6',
                border: '2px solid white',
                borderRadius: '50%',
                cursor: 'nw-resize',
                '&:hover': {
                  bgcolor: '#2563eb',
                  transform: 'scale(1.2)'
                },
                transition: 'all 0.2s ease-in-out'
              }}
              onMouseDown={(e) => {
                e.stopPropagation()
                // TODO: Implement resize functionality
              }}
            />
          </>
        )}
      </Paper>
    )
  }

  const selectedComponent = components.find(c => c.id === selectedComponentId)

  return (
    <Box sx={{ 
      display: 'flex', 
      height: 'calc(100vh - 64px)', 
      bgcolor: '#f8fafc', 
      position: 'relative', 
      zIndex: 0,
      '& .MuiDrawer-root': {
        zIndex: '1 !important'
      },
      '& .MuiDrawer-paper': {
        zIndex: '1 !important'
      },
      '& .MuiModal-root': {
        zIndex: '1300 !important'
      }
    }}>
      
      {/* Left Sidebar - Component Palette */}
      <Drawer
        variant="permanent"
        sx={{
          width: 300,
          flexShrink: 0,
          zIndex: 1,
          '& .MuiDrawer-paper': { 
            width: 300, 
            boxSizing: 'border-box',
            bgcolor: '#ffffff',
            borderRight: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            zIndex: 1,
            position: 'relative'
          },
        }}
      >
        <Box sx={{ 
          p: 3, 
          borderBottom: '1px solid #e2e8f0',
          bgcolor: '#f8fafc',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white'
        }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: 'white' }}>
            🛠️ App Builder
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
            App ID: {appId}
          </Typography>
        </Box>

        <Tabs 
          value={activeTab} 
          onChange={(_, newValue) => setActiveTab(newValue)}
          sx={{ 
            borderBottom: '1px solid #e2e8f0',
            zIndex: 1,
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 500,
              minHeight: 48
            }
          }}
        >
          <Tab label="Components" icon={<Palette />} />
          <Tab label="Layers" icon={<Code />} />
        </Tabs>

        {/* Components Tab */}
        {activeTab === 0 && (
          <Box sx={{ p: 3, height: 'calc(100vh - 280px)', overflow: 'auto' }}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, color: '#374151', mb: 2 }}>
              Drag & Drop Components
            </Typography>
            
            {/* Category Filter */}
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel size="small">Category</InputLabel>
              <Select
                size="small"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                label="Category"
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <Grid container spacing={1.5}>
              {filteredComponents.map((item) => (
                <Grid item xs={6} key={item.type}>
                  <Card
                    sx={{
                      cursor: 'pointer',
                      minHeight: 90,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid #e2e8f0',
                      borderRadius: 2,
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': { 
                        bgcolor: '#f1f5f9',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                        borderColor: '#3b82f6'
                      }
                    }}
                    onClick={() => addComponent(item.type)}
                  >
                    <CardContent sx={{ textAlign: 'center', p: '8px !important' }}>
                      <Box sx={{ color: '#3b82f6', mb: 0.5 }}>
                      {item.icon}
                      </Box>
                      <Typography variant="caption" display="block" sx={{ 
                        fontWeight: 500,
                        color: '#374151',
                        fontSize: '0.7rem',
                        lineHeight: 1.2
                      }}>
                        {item.name}
                      </Typography>
                      <Typography variant="caption" display="block" sx={{ 
                        color: '#6b7280',
                        fontSize: '0.6rem',
                        mt: 0.5
                      }}>
                        {item.category}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Layers Tab */}
        {activeTab === 1 && (
          <Box sx={{ p: 3, height: 'calc(100vh - 280px)', overflow: 'auto' }}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, color: '#374151', mb: 2 }}>
              Layers ({components.length})
            </Typography>
            {components.map((component) => (
              <Card
                key={component.id}
                sx={{
                  mb: 1.5,
                  cursor: 'pointer',
                  border: selectedComponentId === component.id ? '2px solid #3b82f6' : '1px solid #e2e8f0',
                  borderRadius: 2,
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateX(4px)',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                  }
                }}
                onClick={() => setSelectedComponentId(component.id)}
              >
                <CardContent sx={{ p: '12px !important' }}>
                  <Typography variant="body2" sx={{ fontWeight: 500, color: '#374151' }}>
                    {component.name}
                  </Typography>
                  <Typography variant="caption" sx={{ 
                    color: '#6b7280',
                    textTransform: 'uppercase',
                    fontSize: '0.7rem',
                    fontWeight: 600
                  }}>
                    {component.type}
                  </Typography>
                </CardContent>
              </Card>
            ))}
            {components.length === 0 && (
              <Box sx={{ textAlign: 'center', mt: 4, p: 2 }}>
                <Code sx={{ fontSize: 48, color: '#d1d5db', mb: 2 }} />
                <Typography variant="body2" sx={{ color: '#6b7280', lineHeight: 1.6 }}>
                No components yet.<br/>Add some from the Components tab!
              </Typography>
              </Box>
            )}
          </Box>
        )}
      </Drawer>

      {/* Main Canvas Area */}
      <Box
        sx={{
          flexGrow: 1,
          position: 'relative',
          bgcolor: previewMode ? 'white' : '#ffffff',
          backgroundImage: previewMode ? 'none' : 'radial-gradient(circle, #e2e8f0 1px, transparent 1px)',
          backgroundSize: previewMode ? 'none' : '20px 20px',
          overflow: 'hidden'
        }}
      >
        {/* Top Toolbar */}
        <Paper sx={{ 
          p: 2, 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2, 
          borderRadius: 0,
          borderBottom: '1px solid #e2e8f0',
          bgcolor: '#ffffff',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
        }}>
          <Button
            variant={previewMode ? "outlined" : "contained"}
            startIcon={<Settings />}
            onClick={() => setPreviewMode(false)}
            sx={{
              textTransform: 'none',
              fontWeight: 500,
              borderRadius: 2,
              px: 3
            }}
          >
            Design
          </Button>
          <Button
            variant={previewMode ? "contained" : "outlined"}
            startIcon={<Preview />}
            onClick={() => setPreviewMode(true)}
            sx={{
              textTransform: 'none',
              fontWeight: 500,
              borderRadius: 2,
              px: 3
            }}
          >
            Preview
          </Button>
          <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
          <Button
            variant="outlined"
            startIcon={<Save />}
            onClick={saveApp}
            sx={{
              textTransform: 'none',
              fontWeight: 500,
              borderRadius: 2,
              px: 3,
              borderColor: '#10b981',
              color: '#10b981',
              '&:hover': {
                borderColor: '#059669',
                bgcolor: '#f0fdf4'
              }
            }}
          >
            Save
          </Button>
          <Button
            variant="outlined"
            startIcon={<Visibility />}
            onClick={() => setPreviewDialog(true)}
            sx={{
              textTransform: 'none',
              fontWeight: 500,
              borderRadius: 2,
              px: 3
            }}
          >
            Full Preview
          </Button>
          <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
          <Button
            variant={snapToGrid ? "contained" : "outlined"}
            onClick={() => setSnapToGrid(!snapToGrid)}
            sx={{
              textTransform: 'none',
              fontWeight: 500,
              borderRadius: 2,
              px: 3
            }}
          >
            📐 Snap to Grid
          </Button>
        </Paper>

        {/* Canvas */}
        <Box
          className="canvas-container"
          sx={{
            position: 'relative',
            height: 'calc(100vh - 144px)',
            overflow: 'auto',
            p: 3,
            backgroundImage: snapToGrid && !previewMode 
              ? `linear-gradient(to right, #e2e8f0 1px, transparent 1px), linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)`
              : 'none',
            backgroundSize: snapToGrid && !previewMode 
              ? `${gridSize}px ${gridSize}px`
              : 'none',
            backgroundPosition: snapToGrid && !previewMode 
              ? '0 0'
              : 'none'
          }}
        >
          {components.length === 0 && !previewMode && (
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center',
                color: '#6b7280',
                maxWidth: 400
              }}
            >
              <Box sx={{ 
                width: 80, 
                height: 80, 
                borderRadius: '50%', 
                bgcolor: '#f3f4f6', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                mx: 'auto',
                mb: 3
              }}>
                <Add sx={{ fontSize: 40, color: '#9ca3af' }} />
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 600, color: '#374151', mb: 1 }}>
                Start building your app
              </Typography>
              <Typography variant="body1" sx={{ color: '#6b7280', lineHeight: 1.6 }}>
                Click components from the left sidebar to add them to your canvas and start creating your application
              </Typography>
            </Box>
          )}

          {/* Render all components */}
          {components.map(renderCanvasComponent)}
        </Box>
      </Box>

      {/* Right Sidebar - Properties Panel */}
      {selectedComponent && !previewMode && (
        <Drawer
          anchor="right"
          variant="permanent"
          sx={{
            width: 350,
            flexShrink: 0,
            zIndex: 1,
            '& .MuiDrawer-paper': { 
              width: 350, 
              boxSizing: 'border-box',
              bgcolor: '#ffffff',
              borderLeft: '1px solid #e2e8f0',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
              zIndex: 1,
              position: 'relative'
            },
          }}
        >
          <Box sx={{ 
            p: 3,
            borderBottom: '1px solid #e2e8f0',
            bgcolor: '#f8fafc'
          }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#374151' }}>
              Properties
            </Typography>
            <Typography variant="body2" sx={{ color: '#6b7280' }}>
              {selectedComponent.name} ({selectedComponent.type})
            </Typography>
          </Box>
            
          <Box sx={{ p: 3 }}>
            <Divider sx={{ my: 2 }} />

            {/* Component Name */}
            <TextField
              fullWidth
              label="Component Name"
              value={selectedComponent.name}
              onChange={(e) => updateComponent(selectedComponentId!, { name: e.target.value })}
              sx={{ mb: 2 }}
            />

            {/* Component-specific properties */}
            {selectedComponent.type === 'button' && (
              <>
                <TextField
                  fullWidth
                  label="Button Text"
                  value={selectedComponent.props.text || ''}
                  onChange={(e) => updateComponentProps(selectedComponentId!, { text: e.target.value })}
                  sx={{ mb: 2 }}
                />
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Variant</InputLabel>
                  <Select
                    value={selectedComponent.props.variant || 'contained'}
                    onChange={(e) => updateComponentProps(selectedComponentId!, { variant: e.target.value })}
                  >
                    <MenuItem value="contained">Contained</MenuItem>
                    <MenuItem value="outlined">Outlined</MenuItem>
                    <MenuItem value="text">Text</MenuItem>
                  </Select>
                </FormControl>
              </>
            )}

            {selectedComponent.type === 'text' && (
              <>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Text Content"
                  value={selectedComponent.props.text || ''}
                  onChange={(e) => updateComponentProps(selectedComponentId!, { text: e.target.value })}
                  sx={{ mb: 2 }}
                />
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Typography Variant</InputLabel>
                  <Select
                    value={selectedComponent.props.variant || 'body1'}
                    onChange={(e) => updateComponentProps(selectedComponentId!, { variant: e.target.value })}
                  >
                    <MenuItem value="h1">Heading 1</MenuItem>
                    <MenuItem value="h2">Heading 2</MenuItem>
                    <MenuItem value="h3">Heading 3</MenuItem>
                    <MenuItem value="h4">Heading 4</MenuItem>
                    <MenuItem value="h5">Heading 5</MenuItem>
                    <MenuItem value="h6">Heading 6</MenuItem>
                    <MenuItem value="body1">Body 1</MenuItem>
                    <MenuItem value="body2">Body 2</MenuItem>
                    <MenuItem value="caption">Caption</MenuItem>
                  </Select>
                </FormControl>
              </>
            )}

            {selectedComponent.type === 'input' && (
              <>
                <TextField
                  fullWidth
                  label="Label"
                  value={selectedComponent.props.label || ''}
                  onChange={(e) => updateComponentProps(selectedComponentId!, { label: e.target.value })}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Placeholder"
                  value={selectedComponent.props.placeholder || ''}
                  onChange={(e) => updateComponentProps(selectedComponentId!, { placeholder: e.target.value })}
                  sx={{ mb: 2 }}
                />
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Input Type</InputLabel>
                  <Select
                    value={selectedComponent.props.type || 'text'}
                    onChange={(e) => updateComponentProps(selectedComponentId!, { type: e.target.value })}
                  >
                    <MenuItem value="text">Text</MenuItem>
                    <MenuItem value="email">Email</MenuItem>
                    <MenuItem value="password">Password</MenuItem>
                    <MenuItem value="number">Number</MenuItem>
                    <MenuItem value="tel">Phone</MenuItem>
                  </Select>
                </FormControl>
              </>
            )}

            {selectedComponent.type === 'image' && (
              <>
                <TextField
                  fullWidth
                  label="Image URL"
                  value={selectedComponent.props.src || ''}
                  onChange={(e) => updateComponentProps(selectedComponentId!, { src: e.target.value })}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Alt Text"
                  value={selectedComponent.props.alt || ''}
                  onChange={(e) => updateComponentProps(selectedComponentId!, { alt: e.target.value })}
                  sx={{ mb: 2 }}
                />
              </>
            )}

            {selectedComponent.type === 'navbar' && (
              <>
                <Typography variant="subtitle1" gutterBottom sx={{ mt: 2, mb: 1 }}>
                  Navigation Bar Configuration
                </Typography>
                
                <TextField
                  fullWidth
                  label="Brand/Logo Text"
                  value={selectedComponent.props.brand || ''}
                  onChange={(e) => updateComponentProps(selectedComponentId!, { brand: e.target.value })}
                  sx={{ mb: 2 }}
                />

                <TextField
                  fullWidth
                  label="Navigation Links (comma-separated)"
                  value={selectedComponent.props.links?.join(', ') || ''}
                  onChange={(e) => updateComponentProps(selectedComponentId!, { 
                    links: e.target.value.split(',').map(link => link.trim()).filter(link => link)
                  })}
                  placeholder="Home, About, Contact, Services"
                  sx={{ mb: 2 }}
                />

                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle2" gutterBottom>
                  Sizing & Layout
                </Typography>

                <TextField
                  fullWidth
                  label="Width"
                  value={selectedComponent.props.width || ''}
                  onChange={(e) => updateComponentProps(selectedComponentId!, { width: e.target.value })}
                  placeholder="100%, 1200px, auto, etc."
                  sx={{ mb: 2 }}
                />

                <TextField
                  fullWidth
                  label="Height"
                  value={selectedComponent.props.height || ''}
                  onChange={(e) => updateComponentProps(selectedComponentId!, { height: e.target.value })}
                  placeholder="64px, 80px, 100px, etc."
                  sx={{ mb: 2 }}
                />

                <TextField
                  fullWidth
                  label="Minimum Height"
                  value={selectedComponent.props.minHeight || ''}
                  onChange={(e) => updateComponentProps(selectedComponentId!, { minHeight: e.target.value })}
                  placeholder="56px, 64px, etc."
                  sx={{ mb: 2 }}
                />

                <TextField
                  fullWidth
                  label="Padding"
                  type="number"
                  value={selectedComponent.props.padding || ''}
                  onChange={(e) => updateComponentProps(selectedComponentId!, { padding: parseInt(e.target.value) || 1 })}
                  placeholder="1, 2, 3, etc."
                  sx={{ mb: 2 }}
                />

                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle2" gutterBottom>
                  Positioning
                </Typography>

                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Position</InputLabel>
                  <Select
                    value={selectedComponent.props.position || 'relative'}
                    onChange={(e) => updateComponentProps(selectedComponentId!, { position: e.target.value })}
                  >
                    <MenuItem value="relative">Relative</MenuItem>
                    <MenuItem value="absolute">Absolute</MenuItem>
                    <MenuItem value="fixed">Fixed</MenuItem>
                    <MenuItem value="sticky">Sticky</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  fullWidth
                  label="Top Position"
                  value={selectedComponent.props.top || ''}
                  onChange={(e) => updateComponentProps(selectedComponentId!, { top: e.target.value })}
                  placeholder="0px, 10px, 20px, etc."
                  sx={{ mb: 2 }}
                />

                <TextField
                  fullWidth
                  label="Left Position"
                  value={selectedComponent.props.left || ''}
                  onChange={(e) => updateComponentProps(selectedComponentId!, { left: e.target.value })}
                  placeholder="0px, 10px, 20px, etc."
                  sx={{ mb: 2 }}
                />

                <TextField
                  fullWidth
                  label="Right Position"
                  value={selectedComponent.props.right || ''}
                  onChange={(e) => updateComponentProps(selectedComponentId!, { right: e.target.value })}
                  placeholder="0px, 10px, 20px, etc."
                  sx={{ mb: 2 }}
                />

                <TextField
                  fullWidth
                  label="Z-Index"
                  type="number"
                  value={selectedComponent.props.zIndex || ''}
                  onChange={(e) => updateComponentProps(selectedComponentId!, { zIndex: parseInt(e.target.value) || 1 })}
                  placeholder="1, 10, 100, etc."
                  sx={{ mb: 2 }}
                />

                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => {
                    updateComponentProps(selectedComponentId!, {
                      position: 'fixed',
                      top: '0px',
                      left: '0px',
                      width: '100%',
                      zIndex: 1000
                    })
                  }}
                  sx={{ mb: 2 }}
                >
                  📌 Pin to Top of Page
                </Button>

                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => {
                    updateComponentProps(selectedComponentId!, {
                      position: 'relative',
                      top: 'auto',
                      left: 'auto',
                      width: '100%',
                      zIndex: 'auto'
                    })
                  }}
                  sx={{ mb: 2 }}
                >
                  📍 Normal Position
                </Button>

                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle2" gutterBottom>
                  Colors & Styling
                </Typography>

                <TextField
                  fullWidth
                  label="Background Color"
                  value={selectedComponent.props.backgroundColor || ''}
                  onChange={(e) => updateComponentProps(selectedComponentId!, { backgroundColor: e.target.value })}
                  placeholder="primary.main, #1976d2, etc."
                  sx={{ mb: 2 }}
                />

                <TextField
                  fullWidth
                  label="Text Color"
                  value={selectedComponent.props.textColor || ''}
                  onChange={(e) => updateComponentProps(selectedComponentId!, { textColor: e.target.value })}
                  placeholder="white, #ffffff, etc."
                  sx={{ mb: 2 }}
                />

                <TextField
                  fullWidth
                  label="Border Radius"
                  type="number"
                  value={selectedComponent.props.borderRadius || ''}
                  onChange={(e) => updateComponentProps(selectedComponentId!, { borderRadius: parseInt(e.target.value) || 0 })}
                  placeholder="0, 4, 8, etc."
                  sx={{ mb: 2 }}
                />

                <TextField
                  fullWidth
                  label="Elevation/Shadow"
                  type="number"
                  value={selectedComponent.props.elevation || ''}
                  onChange={(e) => updateComponentProps(selectedComponentId!, { elevation: parseInt(e.target.value) || 0 })}
                  placeholder="0, 1, 2, 3, etc."
                  sx={{ mb: 2 }}
                />

                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle2" gutterBottom>
                  Brand/Logo Styling
                </Typography>

                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Brand Typography Variant</InputLabel>
                  <Select
                    value={selectedComponent.props.brandVariant || 'h6'}
                    onChange={(e) => updateComponentProps(selectedComponentId!, { brandVariant: e.target.value })}
                  >
                    <MenuItem value="h1">Heading 1</MenuItem>
                    <MenuItem value="h2">Heading 2</MenuItem>
                    <MenuItem value="h3">Heading 3</MenuItem>
                    <MenuItem value="h4">Heading 4</MenuItem>
                    <MenuItem value="h5">Heading 5</MenuItem>
                    <MenuItem value="h6">Heading 6</MenuItem>
                    <MenuItem value="subtitle1">Subtitle 1</MenuItem>
                    <MenuItem value="subtitle2">Subtitle 2</MenuItem>
                    <MenuItem value="body1">Body 1</MenuItem>
                    <MenuItem value="body2">Body 2</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  fullWidth
                  label="Brand Font Size"
                  value={selectedComponent.props.brandSize || ''}
                  onChange={(e) => updateComponentProps(selectedComponentId!, { brandSize: e.target.value })}
                  placeholder="1.25rem, 1.5rem, 2rem, etc."
                  sx={{ mb: 2 }}
                />

                <TextField
                  fullWidth
                  label="Brand Font Weight"
                  type="number"
                  value={selectedComponent.props.brandWeight || ''}
                  onChange={(e) => updateComponentProps(selectedComponentId!, { brandWeight: parseInt(e.target.value) || 600 })}
                  placeholder="400, 500, 600, 700, etc."
                  sx={{ mb: 2 }}
                />

                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle2" gutterBottom>
                  Navigation Links Styling
                </Typography>

                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Link Button Size</InputLabel>
                  <Select
                    value={selectedComponent.props.linkSize || 'small'}
                    onChange={(e) => updateComponentProps(selectedComponentId!, { linkSize: e.target.value })}
                  >
                    <MenuItem value="small">Small</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="large">Large</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  fullWidth
                  label="Link Font Size"
                  value={selectedComponent.props.linkFontSize || ''}
                  onChange={(e) => updateComponentProps(selectedComponentId!, { linkFontSize: e.target.value })}
                  placeholder="0.875rem, 1rem, 1.125rem, etc."
                  sx={{ mb: 2 }}
                />

                <TextField
                  fullWidth
                  label="Link Font Weight"
                  type="number"
                  value={selectedComponent.props.linkWeight || ''}
                  onChange={(e) => updateComponentProps(selectedComponentId!, { linkWeight: parseInt(e.target.value) || 500 })}
                  placeholder="400, 500, 600, 700, etc."
                  sx={{ mb: 2 }}
                />

                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Link Text Transform</InputLabel>
                  <Select
                    value={selectedComponent.props.linkTransform || 'none'}
                    onChange={(e) => updateComponentProps(selectedComponentId!, { linkTransform: e.target.value })}
                  >
                    <MenuItem value="none">None</MenuItem>
                    <MenuItem value="uppercase">Uppercase</MenuItem>
                    <MenuItem value="lowercase">Lowercase</MenuItem>
                    <MenuItem value="capitalize">Capitalize</MenuItem>
                  </Select>
                </FormControl>
              </>
            )}

            {selectedComponent.type === 'chart' && (
              <>
                <Typography variant="subtitle1" gutterBottom sx={{ mt: 2, mb: 1 }}>
                  Chart Configuration
                </Typography>
                
                <TextField
                  fullWidth
                  label="Chart Title"
                  value={selectedComponent.props.title || ''}
                  onChange={(e) => updateComponentProps(selectedComponentId!, { title: e.target.value })}
                  sx={{ mb: 2 }}
                />

                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Chart Type</InputLabel>
                  <Select
                    value={selectedComponent.props.type || 'bar'}
                    onChange={(e) => updateComponentProps(selectedComponentId!, { type: e.target.value })}
                  >
                    <MenuItem value="bar">Bar Chart</MenuItem>
                    <MenuItem value="line">Line Chart</MenuItem>
                    <MenuItem value="pie">Pie Chart</MenuItem>
                    <MenuItem value="doughnut">Doughnut Chart</MenuItem>
                  </Select>
                </FormControl>

                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle2" gutterBottom>
                  Data Binding Configuration (Industry Standard)
                </Typography>

                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Data Source Type</InputLabel>
                  <Select
                    value={selectedComponent.props.dataSourceType || 'database'}
                    onChange={(e) => updateComponentProps(selectedComponentId!, { dataSourceType: e.target.value })}
                  >
                    <MenuItem value="database">Database Query</MenuItem>
                    <MenuItem value="api">API Endpoint</MenuItem>
                    <MenuItem value="static">Static JSON</MenuItem>
                    <MenuItem value="computed">Computed Expression</MenuItem>
                  </Select>
                </FormControl>

                {selectedComponent.props.dataSourceType === 'database' && (
                  <>
                    <TextField
                      fullWidth
                      label="Data Source ID"
                      value={selectedComponent.props.dataSource || ''}
                      onChange={(e) => updateComponentProps(selectedComponentId!, { dataSource: e.target.value })}
                      placeholder="e.g., 1 (ID of your data source)"
                      sx={{ mb: 2 }}
                    />

                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      label="SQL Query"
                      value={selectedComponent.props.query || ''}
                      onChange={(e) => updateComponentProps(selectedComponentId!, { query: e.target.value })}
                      placeholder="SELECT column1, column2 FROM table_name WHERE condition"
                      sx={{ mb: 2 }}
                    />
                  </>
                )}

                {selectedComponent.props.dataSourceType === 'api' && (
                  <TextField
                    fullWidth
                    label="API Endpoint"
                    value={selectedComponent.props.apiEndpoint || ''}
                    onChange={(e) => updateComponentProps(selectedComponentId!, { apiEndpoint: e.target.value })}
                    placeholder="https://api.example.com/sales-data"
                    sx={{ mb: 2 }}
                  />
                )}

                {selectedComponent.props.dataSourceType === 'computed' && (
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="JavaScript Expression"
                    value={selectedComponent.props.computedExpression || ''}
                    onChange={(e) => updateComponentProps(selectedComponentId!, { computedExpression: e.target.value })}
                    placeholder="[{label: 'Jan', value: 100}, {label: 'Feb', value: 150}]"
                    sx={{ mb: 2 }}
                  />
                )}

                <TextField
                  fullWidth
                  label="X-Axis Field"
                  value={selectedComponent.props.xAxis || ''}
                  onChange={(e) => updateComponentProps(selectedComponentId!, { xAxis: e.target.value })}
                  placeholder="Column name for X-axis labels"
                  sx={{ mb: 2 }}
                />

                <TextField
                  fullWidth
                  label="Y-Axis Field"
                  value={selectedComponent.props.yAxis || ''}
                  onChange={(e) => updateComponentProps(selectedComponentId!, { yAxis: e.target.value })}
                  placeholder="Column name for Y-axis values"
                  sx={{ mb: 2 }}
                />

                <TextField
                  fullWidth
                  label="Auto-refresh Interval (seconds)"
                  type="number"
                  value={selectedComponent.props.refreshInterval || ''}
                  onChange={(e) => updateComponentProps(selectedComponentId!, { refreshInterval: parseInt(e.target.value) || 0 })}
                  placeholder="0 = no auto-refresh"
                  sx={{ mb: 2 }}
                />

                <Button
                  fullWidth
                  variant="outlined"
                  onClick={async () => {
                    // Test the SQL query
                    if (selectedComponent.props.dataSource && selectedComponent.props.query) {
                      try {
                        const response = await fetch(`http://localhost:8000/api/v1/data-sources/${selectedComponent.props.dataSource}/query`, {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                          },
                          body: JSON.stringify({
                            query: selectedComponent.props.query,
                            parameters: {},
                            limit: 10
                          })
                        })
                        
                        if (response.ok) {
                          const result = await response.json()
                          showNotification(`Query successful! Found ${result.data?.length || 0} rows.`, 'success')
                        } else {
                          showNotification('Query failed. Check your SQL syntax.', 'error')
                        }
                      } catch (error) {
                        showNotification('Error testing query.', 'error')
                      }
                    } else {
                      showNotification('Please enter both Data Source ID and SQL Query.', 'warning')
                    }
                  }}
                  sx={{ mb: 2 }}
                >
                  Test SQL Query
                </Button>

                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle2" gutterBottom>
                  Sample Data (for testing without SQL)
                </Typography>

                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Sample Data (JSON)"
                  value={JSON.stringify(selectedComponent.props.data || [], null, 2)}
                  onChange={(e) => {
                    try {
                      const parsed = JSON.parse(e.target.value)
                      updateComponentProps(selectedComponentId!, { data: parsed })
                    } catch (err) {
                      // Invalid JSON, but don't update
                    }
                  }}
                  placeholder='[{"label": "Jan", "value": 100}, {"label": "Feb", "value": 150}]'
                  sx={{ mb: 2 }}
                />
              </>
            )}

            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1" gutterBottom>Styling</Typography>

            <TextField
              fullWidth
              label="Background Color"
              value={selectedComponent.styles.backgroundColor || ''}
              onChange={(e) => updateComponentStyles(selectedComponentId!, { backgroundColor: e.target.value })}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Text Color"
              value={selectedComponent.styles.color || ''}
              onChange={(e) => updateComponentStyles(selectedComponentId!, { color: e.target.value })}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Font Size"
              value={selectedComponent.styles.fontSize || ''}
              onChange={(e) => updateComponentStyles(selectedComponentId!, { fontSize: e.target.value })}
              sx={{ mb: 2 }}
            />

            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1" gutterBottom>Events & Actions</Typography>

            <Button
              fullWidth
              variant="outlined"
              onClick={() => addEventToComponent(selectedComponentId!, 'onClick')}
              sx={{ mb: 1 }}
            >
              Add onClick Event
            </Button>

            {(selectedComponent.type === 'input' || selectedComponent.type === 'checkbox') && (
              <Button
                fullWidth
                variant="outlined"
                onClick={() => addEventToComponent(selectedComponentId!, 'onChange')}
                sx={{ mb: 1 }}
              >
                Add onChange Event
              </Button>
            )}

            {selectedComponent.events.map((event) => (
              <Card key={event.id} sx={{ mt: 2, p: 2, bgcolor: 'grey.50' }}>
                <Typography variant="subtitle2" gutterBottom>
                  Event: {event.trigger}
                </Typography>

                <Button
                  size="small"
                  onClick={() => addActionToEvent(selectedComponentId!, event.id, 'showComponent')}
                  sx={{ mr: 1, mb: 1 }}
                >
                  + Show Component
                </Button>
                <Button
                  size="small"
                  onClick={() => addActionToEvent(selectedComponentId!, event.id, 'hideComponent')}
                  sx={{ mr: 1, mb: 1 }}
                >
                  + Hide Component
                </Button>
                <Button
                  size="small"
                  onClick={() => addActionToEvent(selectedComponentId!, event.id, 'runQuery')}
                  sx={{ mr: 1, mb: 1 }}
                >
                  + Run Query
                </Button>
                <Button
                  size="small"
                  onClick={() => addActionToEvent(selectedComponentId!, event.id, 'apiCall')}
                  sx={{ mr: 1, mb: 1 }}
                >
                  + API Call
                </Button>
                <Button
                  size="small"
                  onClick={() => addActionToEvent(selectedComponentId!, event.id, 'showNotification')}
                  sx={{ mr: 1, mb: 1 }}
                >
                  + Show Notification
                </Button>
                <Button
                  size="small"
                  onClick={() => addActionToEvent(selectedComponentId!, event.id, 'navigateTo')}
                  sx={{ mr: 1, mb: 1 }}
                >
                  + Navigate To
                </Button>
                <Button
                  size="small"
                  onClick={() => addActionToEvent(selectedComponentId!, event.id, 'setVariable')}
                  sx={{ mr: 1, mb: 1 }}
                >
                  + Set Variable
                </Button>
                <Button
                  size="small"
                  onClick={() => addActionToEvent(selectedComponentId!, event.id, 'triggerEvent')}
                  sx={{ mr: 1, mb: 1 }}
                >
                  + Trigger Event
                </Button>

                {event.actions.map((action) => (
                  <Box key={action.id} sx={{ mt: 2, p: 1, border: '1px solid #ddd', borderRadius: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                      Action: {action.type}
                    </Typography>

                    {(action.type === 'showComponent' || action.type === 'hideComponent') && (
                      <FormControl fullWidth sx={{ mt: 1 }}>
                        <InputLabel size="small">Target Component</InputLabel>
                        <Select
                          size="small"
                          value={action.targetComponentId || ''}
                          onChange={(e) => updateAction(selectedComponentId!, event.id, action.id, { targetComponentId: e.target.value })}
                        >
                          {components.filter(c => c.id !== selectedComponentId).map((comp) => (
                            <MenuItem key={comp.id} value={comp.id}>
                              {comp.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}

                    {action.type === 'apiCall' && (
                      <>
                        <TextField
                          fullWidth
                          size="small"
                          label="API Endpoint"
                          value={action.apiEndpoint || ''}
                          onChange={(e) => updateAction(selectedComponentId!, event.id, action.id, { apiEndpoint: e.target.value })}
                          sx={{ mt: 1 }}
                        />
                        <FormControl fullWidth sx={{ mt: 1 }}>
                          <InputLabel size="small">Method</InputLabel>
                          <Select
                            size="small"
                            value={action.apiMethod || 'GET'}
                            onChange={(e) => updateAction(selectedComponentId!, event.id, action.id, { apiMethod: e.target.value as 'GET' | 'POST' | 'PUT' | 'DELETE' })}
                          >
                            <MenuItem value="GET">GET</MenuItem>
                            <MenuItem value="POST">POST</MenuItem>
                            <MenuItem value="PUT">PUT</MenuItem>
                            <MenuItem value="DELETE">DELETE</MenuItem>
                          </Select>
                        </FormControl>
                      </>
                    )}

                    {action.type === 'runQuery' && (
                      <>
                        <TextField
                          fullWidth
                          size="small"
                          label="Data Source ID"
                          value={action.queryId || ''}
                          onChange={(e) => updateAction(selectedComponentId!, event.id, action.id, { queryId: e.target.value })}
                          sx={{ mt: 1 }}
                        />
                        <TextField
                          fullWidth
                          size="small"
                          label="SQL Query"
                          multiline
                          rows={3}
                          value={action.queryParams?.query || ''}
                          onChange={(e) => updateAction(selectedComponentId!, event.id, action.id, { 
                            queryParams: { ...action.queryParams, query: e.target.value }
                          })}
                          sx={{ mt: 1 }}
                        />
                      </>
                    )}

                    {action.type === 'showNotification' && (
                      <>
                        <TextField
                          fullWidth
                          size="small"
                          label="Message"
                          value={action.notificationMessage || ''}
                          onChange={(e) => updateAction(selectedComponentId!, event.id, action.id, { notificationMessage: e.target.value })}
                          sx={{ mt: 1 }}
                        />
                        <FormControl fullWidth sx={{ mt: 1 }}>
                          <InputLabel size="small">Type</InputLabel>
                          <Select
                            size="small"
                            value={action.notificationType || 'info'}
                            onChange={(e) => updateAction(selectedComponentId!, event.id, action.id, { notificationType: e.target.value as 'success' | 'error' | 'warning' | 'info' })}
                          >
                            <MenuItem value="info">Info</MenuItem>
                            <MenuItem value="success">Success</MenuItem>
                            <MenuItem value="warning">Warning</MenuItem>
                            <MenuItem value="error">Error</MenuItem>
                          </Select>
                        </FormControl>
                      </>
                    )}

                    {action.type === 'navigateTo' && (
                      <TextField
                        fullWidth
                        size="small"
                        label="Navigation Path"
                        value={action.navigationPath || ''}
                        onChange={(e) => updateAction(selectedComponentId!, event.id, action.id, { navigationPath: e.target.value })}
                        sx={{ mt: 1 }}
                      />
                    )}

                    {action.type === 'setVariable' && (
                      <>
                        <TextField
                          fullWidth
                          size="small"
                          label="Variable Name"
                          value={action.variableName || ''}
                          onChange={(e) => updateAction(selectedComponentId!, event.id, action.id, { variableName: e.target.value })}
                          sx={{ mt: 1 }}
                        />
                        <TextField
                          fullWidth
                          size="small"
                          label="Variable Value"
                          value={action.variableValue || ''}
                          onChange={(e) => updateAction(selectedComponentId!, event.id, action.id, { variableValue: e.target.value })}
                          sx={{ mt: 1 }}
                        />
                      </>
                    )}

                    {action.type === 'triggerEvent' && (
                      <FormControl fullWidth sx={{ mt: 1 }}>
                        <InputLabel size="small">Target Event</InputLabel>
                        <Select
                          size="small"
                          value={action.targetEventId || ''}
                          onChange={(e) => updateAction(selectedComponentId!, event.id, action.id, { targetEventId: e.target.value })}
                        >
                          {components.flatMap(comp => 
                            comp.events.map(event => (
                              <MenuItem key={event.id} value={event.id}>
                                {comp.name} - {event.trigger}
                              </MenuItem>
                            ))
                          )}
                        </Select>
                      </FormControl>
                    )}
                  </Box>
                ))}
              </Card>
            ))}

            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1" gutterBottom>Visibility</Typography>
            
            <Button
              fullWidth
              variant={selectedComponent.isVisible ? "contained" : "outlined"}
              onClick={() => updateComponent(selectedComponentId!, { isVisible: !selectedComponent.isVisible })}
              sx={{ mb: 2 }}
            >
              {selectedComponent.isVisible ? 'Visible' : 'Hidden'}
            </Button>

            <Button
              fullWidth
              variant="outlined"
              color="error"
              startIcon={<Delete />}
              onClick={() => deleteComponent(selectedComponentId!)}
              sx={{ mt: 2 }}
            >
              Delete Component
            </Button>

            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1" gutterBottom>Keyboard Shortcuts</Typography>
            
            <Box sx={{ fontSize: '0.75rem', color: 'text.secondary', lineHeight: 1.6 }}>
              <Typography variant="caption" display="block">• <strong>Drag Handle:</strong> Click and drag the blue handle at the top to move components</Typography>
              <Typography variant="caption" display="block">• <strong>Delete/Backspace:</strong> Delete selected component</Typography>
              <Typography variant="caption" display="block">• <strong>Ctrl+D:</strong> Duplicate component</Typography>
              <Typography variant="caption" display="block">• <strong>Arrow Keys:</strong> Move component (Shift for larger steps)</Typography>
              <Typography variant="caption" display="block">• <strong>Snap to Grid:</strong> Toggle grid alignment in toolbar</Typography>
            </Box>
          </Box>
        </Drawer>
      )}

      {/* Preview Dialog */}
      <Dialog
        open={previewDialog}
        onClose={() => setPreviewDialog(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          App Preview
          <IconButton
            onClick={() => setPreviewDialog(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            ×
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ minHeight: 400, position: 'relative', bgcolor: 'white', border: '1px solid #ddd' }}>
            {components.map(component => renderCanvasComponent({ ...component }))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
