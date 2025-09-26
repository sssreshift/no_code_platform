import React, { useState, useEffect } from 'react'
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  Chip,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  Rating,
  Avatar,
  Stack,
  Divider,
  Alert,
  CircularProgress,
  IconButton,
  Badge
} from '@mui/material'
import {
  Search as SearchIcon,
  Star as StarIcon,
  Download as DownloadIcon,
  Category as CategoryIcon,
  FilterList as FilterIcon,
  Sort as SortIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon
} from '@mui/icons-material'
import { PluginPublic, PluginCategory, PluginType, PluginStats } from '@/types/plugin'

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
      id={`marketplace-tabpanel-${index}`}
      aria-labelledby={`marketplace-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}

const PluginMarketplace: React.FC = () => {
  const [plugins, setPlugins] = useState<PluginPublic[]>([])
  const [categories, setCategories] = useState<PluginCategory[]>([])
  const [stats, setStats] = useState<PluginStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Filters and search
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<number | ''>('')
  const [selectedType, setSelectedType] = useState<PluginType | ''>('')
  const [showFreeOnly, setShowFreeOnly] = useState(false)
  const [sortBy, setSortBy] = useState('download_count')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  
  // UI state
  const [tabValue, setTabValue] = useState(0)
  const [favorites, setFavorites] = useState<Set<number>>(new Set())

  useEffect(() => {
    loadMarketplaceData()
  }, [])

  useEffect(() => {
    loadPlugins()
  }, [searchQuery, selectedCategory, selectedType, showFreeOnly, sortBy, sortOrder])

  const loadMarketplaceData = async () => {
    try {
      setLoading(true)
      const [categoriesRes, statsRes] = await Promise.all([
        fetch('/api/v1/plugins/categories'),
        fetch('/api/v1/plugins/stats')
      ])
      
      const categoriesData = await categoriesRes.json()
      const statsData = await statsRes.json()
      
      setCategories(categoriesData)
      setStats(statsData)
    } catch (err) {
      setError('Failed to load marketplace data')
    } finally {
      setLoading(false)
    }
  }

  const loadPlugins = async () => {
    try {
      const params = new URLSearchParams({
        skip: '0',
        limit: '20'
      })
      
      if (searchQuery) params.append('search_query', searchQuery)
      if (selectedCategory) params.append('category_id', selectedCategory.toString())
      if (selectedType) params.append('plugin_type', selectedType)
      if (showFreeOnly) params.append('is_free', 'true')
      params.append('sort_by', sortBy)
      params.append('sort_order', sortOrder)

      const response = await fetch(`/api/v1/plugins/?${params}`)
      const data = await response.json()
      setPlugins(data)
    } catch (err) {
      setError('Failed to load plugins')
    }
  }

  const handleInstallPlugin = async (pluginId: number) => {
    try {
      // This would typically open a modal to select which app to install to
      console.log('Installing plugin:', pluginId)
      // Implementation would go here
    } catch (err) {
      console.error('Failed to install plugin:', err)
    }
  }

  const handleToggleFavorite = (pluginId: number) => {
    const newFavorites = new Set(favorites)
    if (newFavorites.has(pluginId)) {
      newFavorites.delete(pluginId)
    } else {
      newFavorites.add(pluginId)
    }
    setFavorites(newFavorites)
  }

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" gutterBottom>
          Plugin Marketplace
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Extend your apps with powerful plugins and integrations
        </Typography>
        
        {/* Stats */}
        {stats && (
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={6} sm={3}>
              <Box textAlign="center">
                <Typography variant="h4" color="primary">
                  {stats.total_plugins}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Plugins
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box textAlign="center">
                <Typography variant="h4" color="primary">
                  {stats.total_installations}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Installations
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box textAlign="center">
                <Typography variant="h4" color="primary">
                  {stats.free_plugins}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Free Plugins
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box textAlign="center">
                <Typography variant="h4" color="primary">
                  {stats.featured_plugins}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Featured
                </Typography>
              </Box>
            </Grid>
          </Grid>
        )}
      </Box>

      {/* Search and Filters */}
      <Box sx={{ mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Search plugins..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as number | '')}
                label="Category"
              >
                <MenuItem value="">All Categories</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as PluginType | '')}
                label="Type"
              >
                <MenuItem value="">All Types</MenuItem>
                <MenuItem value="component">Components</MenuItem>
                <MenuItem value="integration">Integrations</MenuItem>
                <MenuItem value="template">Templates</MenuItem>
                <MenuItem value="theme">Themes</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                label="Sort By"
              >
                <MenuItem value="download_count">Downloads</MenuItem>
                <MenuItem value="rating">Rating</MenuItem>
                <MenuItem value="created_at">Newest</MenuItem>
                <MenuItem value="name">Name</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              variant={showFreeOnly ? "contained" : "outlined"}
              onClick={() => setShowFreeOnly(!showFreeOnly)}
              fullWidth
            >
              Free Only
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="All Plugins" />
          <Tab label="Featured" />
          <Tab label="My Favorites" />
        </Tabs>
      </Box>

      {/* Plugin Grid */}
      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          {plugins.map((plugin) => (
            <Grid item xs={12} sm={6} md={4} key={plugin.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h6" component="h2" noWrap>
                      {plugin.name}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => handleToggleFavorite(plugin.id)}
                    >
                      {favorites.has(plugin.id) ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
                    </IconButton>
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: '3em' }}>
                    {plugin.description}
                  </Typography>
                  
                  <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                    <Chip
                      label={plugin.category?.name || 'Uncategorized'}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                    <Chip
                      label={plugin.plugin_type}
                      size="small"
                      color="secondary"
                      variant="outlined"
                    />
                    {plugin.is_free ? (
                      <Chip label="Free" size="small" color="success" />
                    ) : (
                      <Chip label={`$${plugin.price}`} size="small" color="warning" />
                    )}
                  </Stack>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Rating value={plugin.rating} readOnly size="small" />
                    <Typography variant="body2" color="text.secondary">
                      ({plugin.review_count})
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <DownloadIcon fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      {plugin.download_count} downloads
                    </Typography>
                  </Box>
                </CardContent>
                
                <CardActions>
                  <Button
                    size="small"
                    variant="contained"
                    onClick={() => handleInstallPlugin(plugin.id)}
                    fullWidth
                  >
                    Install
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Typography variant="h6" gutterBottom>
          Featured Plugins
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Hand-picked plugins recommended by our team
        </Typography>
        {/* Featured plugins would be loaded here */}
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <Typography variant="h6" gutterBottom>
          My Favorites
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Plugins you've marked as favorites
        </Typography>
        {/* Favorites would be loaded here */}
      </TabPanel>
    </Container>
  )
}

export default PluginMarketplace

