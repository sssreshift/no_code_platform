import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tabs,
  Tab,
  Stack,
  IconButton,
  Tooltip,
  Badge,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Palette as PaletteIcon,
  Search as SearchIcon,
  Star as StarIcon,
  Download as DownloadIcon,
  Preview as PreviewIcon,
  ShoppingCart as ShoppingCartIcon,
  Check as CheckIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';
import { useTheme } from '@/contexts/ThemeContext';
import { 
  allThemes, 
  themeCategories, 
  themeLibraries, 
  getThemeById,
  Theme as CustomTheme 
} from '@/themes';
import ThemeSwitcher from '@/components/ThemeSwitcher';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`theme-tabpanel-${index}`}
      aria-labelledby={`theme-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const ThemeMarketplace: React.FC = () => {
  const { currentTheme, setCurrentTheme } = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLibrary, setSelectedLibrary] = useState('all');
  const [showThemeSwitcher, setShowThemeSwitcher] = useState(false);
  const [previewTheme, setPreviewTheme] = useState<string | null>(null);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleThemeApply = (themeId: string) => {
    setCurrentTheme(themeId);
  };

  const handlePreview = (themeId: string) => {
    setPreviewTheme(themeId);
    // Apply temporary preview
    const theme = getThemeById(themeId);
    if (theme) {
      // Store current theme
      const originalTheme = currentTheme;
      setCurrentTheme(themeId);
      
      // Restore after 3 seconds
      setTimeout(() => {
        setCurrentTheme(originalTheme.id);
        setPreviewTheme(null);
      }, 3000);
    }
  };

  const filteredThemes = allThemes.filter(theme => {
    const matchesCategory = selectedCategory === 'all' || theme.category === selectedCategory;
    const matchesLibrary = selectedLibrary === 'all' || theme.library === selectedLibrary;
    const matchesSearch = searchQuery === '' || 
      theme.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      theme.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      theme.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesLibrary && matchesSearch;
  });

  const freeThemes = filteredThemes.filter(theme => !theme.isPremium);
  const premiumThemes = filteredThemes.filter(theme => theme.isPremium);
  const featuredThemes = filteredThemes.filter(theme => theme.tags.includes('featured'));

  const ThemeCard: React.FC<{ theme: CustomTheme; showPrice?: boolean }> = ({ theme, showPrice = true }) => (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        position: 'relative',
        border: currentTheme.id === theme.id ? 2 : 1,
        borderColor: currentTheme.id === theme.id ? 'primary.main' : 'divider',
        '&:hover': {
          boxShadow: 6,
          transform: 'translateY(-2px)',
          transition: 'all 0.2s ease-in-out',
        }
      }}
    >
      <CardMedia
        component="div"
        sx={{
          height: 200,
          background: `linear-gradient(135deg, ${theme.colors.primary}20, ${theme.colors.secondary}20)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: 3,
            background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.accent})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '2rem',
            fontWeight: 'bold',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          }}
        >
          {theme.name.charAt(0)}
        </Box>
        
        {currentTheme.id === theme.id && (
          <Chip
            icon={<CheckIcon />}
            label="Active"
            color="primary"
            size="small"
            sx={{ position: 'absolute', top: 12, right: 12 }}
          />
        )}
        
        {theme.isPremium && showPrice && (
          <Chip
            label={`$${theme.price}`}
            color="secondary"
            size="small"
            sx={{ position: 'absolute', top: 12, left: 12 }}
          />
        )}
        
        {previewTheme === theme.id && (
          <Chip
            label="Previewing..."
            color="info"
            size="small"
            sx={{ position: 'absolute', bottom: 12, left: 12 }}
          />
        )}
      </CardMedia>
      
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
            {theme.name}
          </Typography>
          <Chip 
            label={theme.library} 
            size="small" 
            variant="outlined"
            sx={{ ml: 1 }}
          />
        </Box>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
          {theme.description}
        </Typography>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
          {theme.tags.slice(0, 3).map((tag) => (
            <Chip key={tag} label={tag} size="small" variant="outlined" />
          ))}
          {theme.tags.length > 3 && (
            <Chip label={`+${theme.tags.length - 3}`} size="small" variant="outlined" />
          )}
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<PreviewIcon />}
            onClick={() => handlePreview(theme.id)}
            disabled={previewTheme === theme.id}
          >
            Preview
          </Button>
          <Button
            variant={currentTheme.id === theme.id ? "contained" : "outlined"}
            size="small"
            startIcon={currentTheme.id === theme.id ? <CheckIcon /> : <DownloadIcon />}
            onClick={() => handleThemeApply(theme.id)}
          >
            {currentTheme.id === theme.id ? 'Active' : 'Apply'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <PaletteIcon sx={{ mr: 1, fontSize: '2rem' }} />
        <Typography variant="h4" component="h1">
          Theme Marketplace
        </Typography>
        <Button
          variant="outlined"
          startIcon={<PaletteIcon />}
          onClick={() => setShowThemeSwitcher(true)}
          sx={{ ml: 'auto' }}
        >
          Quick Theme Switcher
        </Button>
      </Box>

      {/* Stats */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Total Themes
              </Typography>
              <Typography variant="h4">
                {allThemes.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Free Themes
              </Typography>
              <Typography variant="h4" color="success.main">
                {freeThemes.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Premium Themes
              </Typography>
              <Typography variant="h4" color="secondary.main">
                {premiumThemes.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Current Theme
              </Typography>
              <Typography variant="h6" color="primary.main">
                {currentTheme.name}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stack direction="row" spacing={2} alignItems="center">
            <FilterIcon />
            <TextField
              size="small"
              placeholder="Search themes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ minWidth: 200 }}
            />
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Category</InputLabel>
              <Select
                value={selectedCategory}
                label="Category"
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <MenuItem value="all">All Categories</MenuItem>
                {themeCategories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name} ({category.count})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Library</InputLabel>
              <Select
                value={selectedLibrary}
                label="Library"
                onChange={(e) => setSelectedLibrary(e.target.value)}
              >
                <MenuItem value="all">All Libraries</MenuItem>
                {themeLibraries.map((library) => (
                  <MenuItem key={library.id} value={library.id}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                      <span>{library.name}</span>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <span>({library.count})</span>
                        {library.isFree ? (
                          <Chip label="Free" size="small" color="success" />
                        ) : (
                          <Chip label="Premium" size="small" color="secondary" />
                        )}
                      </Box>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </CardContent>
      </Card>

      {/* Preview Alert */}
      {previewTheme && (
        <Alert severity="info" sx={{ mb: 3 }}>
          Previewing theme: {getThemeById(previewTheme)?.name}. This will automatically revert in 3 seconds.
        </Alert>
      )}

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="theme tabs">
          <Tab label={`All Themes (${filteredThemes.length})`} />
          <Tab label={`Free (${freeThemes.length})`} />
          <Tab label={`Premium (${premiumThemes.length})`} />
          <Tab label={`Featured (${featuredThemes.length})`} />
        </Tabs>
      </Box>

      {/* Theme Grid */}
      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          {filteredThemes.map((theme) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={theme.id}>
              <ThemeCard theme={theme} />
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Grid container spacing={3}>
          {freeThemes.map((theme) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={theme.id}>
              <ThemeCard theme={theme} showPrice={false} />
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <Grid container spacing={3}>
          {premiumThemes.map((theme) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={theme.id}>
              <ThemeCard theme={theme} />
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={3}>
        <Grid container spacing={3}>
          {featuredThemes.map((theme) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={theme.id}>
              <ThemeCard theme={theme} />
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      {/* Theme Switcher Dialog */}
      <ThemeSwitcher
        open={showThemeSwitcher}
        onClose={() => setShowThemeSwitcher(false)}
        currentTheme={currentTheme.id}
        onThemeChange={handleThemeApply}
      />
    </Box>
  );
};

export default ThemeMarketplace;
