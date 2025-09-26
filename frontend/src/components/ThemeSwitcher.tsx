import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Chip,
  IconButton,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  Stack,
  Badge,
  Tooltip,
} from '@mui/material';
import {
  Palette as PaletteIcon,
  Search as SearchIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Close as CloseIcon,
  Preview as PreviewIcon,
  Download as DownloadIcon,
  Check as CheckIcon,
} from '@mui/icons-material';
import { Theme as CustomTheme, allThemes, themeCategories, themeLibraries, getThemeById } from '@/themes';

interface ThemeSwitcherProps {
  open: boolean;
  onClose: () => void;
  currentTheme?: string;
  onThemeChange: (themeId: string) => void;
}

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

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({
  open,
  onClose,
  currentTheme = 'reshift-default',
  onThemeChange,
}) => {
  const [tabValue, setTabValue] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLibrary, setSelectedLibrary] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewTheme, setPreviewTheme] = useState<string | null>(null);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleThemeSelect = (themeId: string) => {
    onThemeChange(themeId);
    onClose();
  };

  const handlePreview = (themeId: string) => {
    setPreviewTheme(themeId);
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

  const ThemeCard: React.FC<{ theme: CustomTheme; showPrice?: boolean }> = ({ theme, showPrice = true }) => (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        cursor: 'pointer',
        border: currentTheme === theme.id ? 2 : 1,
        borderColor: currentTheme === theme.id ? 'primary.main' : 'divider',
        '&:hover': {
          boxShadow: 4,
        }
      }}
      onClick={() => handleThemeSelect(theme.id)}
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
            width: 60,
            height: 60,
            borderRadius: 2,
            background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.accent})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '1.5rem',
            fontWeight: 'bold',
          }}
        >
          {theme.name.charAt(0)}
        </Box>
        {currentTheme === theme.id && (
          <Chip
            icon={<CheckIcon />}
            label="Active"
            color="primary"
            size="small"
            sx={{ position: 'absolute', top: 8, right: 8 }}
          />
        )}
        {theme.isPremium && showPrice && (
          <Chip
            label={`$${theme.price}`}
            color="secondary"
            size="small"
            sx={{ position: 'absolute', top: 8, left: 8 }}
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
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<PreviewIcon />}
            onClick={(e) => {
              e.stopPropagation();
              handlePreview(theme.id);
            }}
          >
            Preview
          </Button>
          <Button
            variant={currentTheme === theme.id ? "contained" : "outlined"}
            size="small"
            startIcon={currentTheme === theme.id ? <CheckIcon /> : <DownloadIcon />}
            onClick={(e) => {
              e.stopPropagation();
              handleThemeSelect(theme.id);
            }}
          >
            {currentTheme === theme.id ? 'Active' : 'Apply'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="lg" 
      fullWidth
      PaperProps={{
        sx: { height: '90vh' }
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <PaletteIcon sx={{ mr: 1 }} />
          <Typography variant="h6">Choose Theme</Typography>
        </Box>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="theme tabs">
            <Tab label={`All Themes (${filteredThemes.length})`} />
            <Tab label={`Free (${freeThemes.length})`} />
            <Tab label={`Premium (${premiumThemes.length})`} />
          </Tabs>
        </Box>

        <Box sx={{ p: 3 }}>
          {/* Filters */}
          <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
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

          {/* Theme Grid */}
          <TabPanel value={tabValue} index={0}>
            <Grid container spacing={3}>
              {filteredThemes.map((theme) => (
                <Grid item xs={12} sm={6} md={4} key={theme.id}>
                  <ThemeCard theme={theme} />
                </Grid>
              ))}
            </Grid>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Grid container spacing={3}>
              {freeThemes.map((theme) => (
                <Grid item xs={12} sm={6} md={4} key={theme.id}>
                  <ThemeCard theme={theme} showPrice={false} />
                </Grid>
              ))}
            </Grid>
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <Grid container spacing={3}>
              {premiumThemes.map((theme) => (
                <Grid item xs={12} sm={6} md={4} key={theme.id}>
                  <ThemeCard theme={theme} />
                </Grid>
              ))}
            </Grid>
          </TabPanel>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ThemeSwitcher;
