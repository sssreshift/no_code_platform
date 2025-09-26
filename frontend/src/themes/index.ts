/**
 * Theme System for Reshift No-Code Platform
 * Supports multiple theme libraries and custom themes
 */

export interface Theme {
  id: string;
  name: string;
  description: string;
  category: 'light' | 'dark' | 'corporate' | 'creative' | 'minimal';
  library: 'daisyui' | 'material' | 'tailwind' | 'custom';
  preview: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    neutral: string;
    base: string;
    info: string;
    success: string;
    warning: string;
    error: string;
  };
  fonts: {
    heading: string;
    body: string;
    mono: string;
  };
  isPremium: boolean;
  price?: number;
  tags: string[];
}

// DaisyUI Themes (Free)
export const daisyuiThemes: Theme[] = [
  {
    id: 'daisyui-light',
    name: 'Light',
    description: 'Clean and minimal light theme with subtle shadows',
    category: 'light',
    library: 'daisyui',
    preview: '/themes/daisyui-light.png',
    colors: {
      primary: '#3b82f6',
      secondary: '#64748b',
      accent: '#f59e0b',
      neutral: '#374151',
      base: '#ffffff',
      info: '#06b6d4',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
    },
    fonts: {
      heading: 'Inter',
      body: 'Inter',
      mono: 'JetBrains Mono',
    },
    isPremium: false,
    tags: ['minimal', 'clean', 'professional'],
  },
  {
    id: 'daisyui-dark',
    name: 'Dark',
    description: 'Modern dark theme with vibrant accents',
    category: 'dark',
    library: 'daisyui',
    preview: '/themes/daisyui-dark.png',
    colors: {
      primary: '#3b82f6',
      secondary: '#64748b',
      accent: '#f59e0b',
      neutral: '#1f2937',
      base: '#111827',
      info: '#06b6d4',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
    },
    fonts: {
      heading: 'Inter',
      body: 'Inter',
      mono: 'JetBrains Mono',
    },
    isPremium: false,
    tags: ['dark', 'modern', 'eye-friendly'],
  },
  {
    id: 'daisyui-corporate',
    name: 'Corporate',
    description: 'Professional theme for business applications',
    category: 'corporate',
    library: 'daisyui',
    preview: '/themes/daisyui-corporate.png',
    colors: {
      primary: '#1e40af',
      secondary: '#475569',
      accent: '#dc2626',
      neutral: '#334155',
      base: '#f8fafc',
      info: '#0284c7',
      success: '#059669',
      warning: '#d97706',
      error: '#dc2626',
    },
    fonts: {
      heading: 'Roboto',
      body: 'Roboto',
      mono: 'Source Code Pro',
    },
    isPremium: false,
    tags: ['corporate', 'professional', 'business'],
  },
  {
    id: 'daisyui-luxury',
    name: 'Luxury',
    description: 'Elegant theme with premium feel',
    category: 'creative',
    library: 'daisyui',
    preview: '/themes/daisyui-luxury.png',
    colors: {
      primary: '#7c3aed',
      secondary: '#6b7280',
      accent: '#f59e0b',
      neutral: '#374151',
      base: '#fafafa',
      info: '#8b5cf6',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
    },
    fonts: {
      heading: 'Playfair Display',
      body: 'Inter',
      mono: 'JetBrains Mono',
    },
    isPremium: false,
    tags: ['luxury', 'elegant', 'premium'],
  },
];

// Material-UI Themes
export const materialThemes: Theme[] = [
  {
    id: 'material-default',
    name: 'Material Default',
    description: 'Google Material Design 3 theme',
    category: 'light',
    library: 'material',
    preview: '/themes/material-default.png',
    colors: {
      primary: '#6750a4',
      secondary: '#625b71',
      accent: '#7d5260',
      neutral: '#49454f',
      base: '#fffbfe',
      info: '#1976d2',
      success: '#2e7d32',
      warning: '#ed6c02',
      error: '#d32f2f',
    },
    fonts: {
      heading: 'Roboto',
      body: 'Roboto',
      mono: 'Roboto Mono',
    },
    isPremium: false,
    tags: ['material', 'google', 'accessible'],
  },
  {
    id: 'material-dark',
    name: 'Material Dark',
    description: 'Dark variant of Material Design',
    category: 'dark',
    library: 'material',
    preview: '/themes/material-dark.png',
    colors: {
      primary: '#d0bcff',
      secondary: '#ccc2dc',
      accent: '#efb8c8',
      neutral: '#e6e1e5',
      base: '#1c1b1f',
      info: '#90caf9',
      success: '#81c784',
      warning: '#ffb74d',
      error: '#f44336',
    },
    fonts: {
      heading: 'Roboto',
      body: 'Roboto',
      mono: 'Roboto Mono',
    },
    isPremium: false,
    tags: ['material', 'dark', 'accessible'],
  },
];

// Tailwind UI Premium Themes
export const tailwindThemes: Theme[] = [
  {
    id: 'tailwind-marketing',
    name: 'Marketing Pro',
    description: 'High-converting marketing theme with modern design',
    category: 'creative',
    library: 'tailwind',
    preview: '/themes/tailwind-marketing.png',
    colors: {
      primary: '#2563eb',
      secondary: '#64748b',
      accent: '#f59e0b',
      neutral: '#1e293b',
      base: '#ffffff',
      info: '#0ea5e9',
      success: '#22c55e',
      warning: '#f59e0b',
      error: '#ef4444',
    },
    fonts: {
      heading: 'Inter',
      body: 'Inter',
      mono: 'JetBrains Mono',
    },
    isPremium: true,
    price: 149,
    tags: ['marketing', 'conversion', 'premium'],
  },
  {
    id: 'tailwind-dashboard',
    name: 'Dashboard Pro',
    description: 'Professional dashboard theme for admin panels',
    category: 'corporate',
    library: 'tailwind',
    preview: '/themes/tailwind-dashboard.png',
    colors: {
      primary: '#1e40af',
      secondary: '#64748b',
      accent: '#dc2626',
      neutral: '#374151',
      base: '#f8fafc',
      info: '#0284c7',
      success: '#059669',
      warning: '#d97706',
      error: '#dc2626',
    },
    fonts: {
      heading: 'Inter',
      body: 'Inter',
      mono: 'Source Code Pro',
    },
    isPremium: true,
    price: 199,
    tags: ['dashboard', 'admin', 'premium'],
  },
];

// Custom Themes
export const customThemes: Theme[] = [
  {
    id: 'reshift-default',
    name: 'Reshift Default',
    description: 'Default theme for Reshift platform',
    category: 'light',
    library: 'custom',
    preview: '/themes/reshift-default.png',
    colors: {
      primary: '#6366f1',
      secondary: '#64748b',
      accent: '#f59e0b',
      neutral: '#374151',
      base: '#ffffff',
      info: '#06b6d4',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
    },
    fonts: {
      heading: 'Inter',
      body: 'Inter',
      mono: 'JetBrains Mono',
    },
    isPremium: false,
    tags: ['default', 'reshift', 'branded'],
  },
  {
    id: 'no-code-minimal',
    name: 'No-Code Minimal',
    description: 'Minimalist theme perfect for no-code platforms',
    category: 'minimal',
    library: 'custom',
    preview: '/themes/no-code-minimal.png',
    colors: {
      primary: '#000000',
      secondary: '#6b7280',
      accent: '#000000',
      neutral: '#374151',
      base: '#ffffff',
      info: '#6b7280',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
    },
    fonts: {
      heading: 'Inter',
      body: 'Inter',
      mono: 'JetBrains Mono',
    },
    isPremium: false,
    tags: ['minimal', 'no-code', 'clean'],
  },
];

// All themes combined
export const allThemes: Theme[] = [
  ...daisyuiThemes,
  ...materialThemes,
  ...tailwindThemes,
  ...customThemes,
];

// Theme categories
export const themeCategories = [
  { id: 'light', name: 'Light Themes', count: allThemes.filter(t => t.category === 'light').length },
  { id: 'dark', name: 'Dark Themes', count: allThemes.filter(t => t.category === 'dark').length },
  { id: 'corporate', name: 'Corporate', count: allThemes.filter(t => t.category === 'corporate').length },
  { id: 'creative', name: 'Creative', count: allThemes.filter(t => t.category === 'creative').length },
  { id: 'minimal', name: 'Minimal', count: allThemes.filter(t => t.category === 'minimal').length },
];

// Theme libraries
export const themeLibraries = [
  { id: 'daisyui', name: 'DaisyUI', count: daisyuiThemes.length, isFree: true },
  { id: 'material', name: 'Material-UI', count: materialThemes.length, isFree: true },
  { id: 'tailwind', name: 'Tailwind UI', count: tailwindThemes.length, isFree: false },
  { id: 'custom', name: 'Custom', count: customThemes.length, isFree: true },
];

// Helper functions
export const getThemeById = (id: string): Theme | undefined => {
  return allThemes.find(theme => theme.id === id);
};

export const getThemesByCategory = (category: string): Theme[] => {
  return allThemes.filter(theme => theme.category === category);
};

export const getThemesByLibrary = (library: string): Theme[] => {
  return allThemes.filter(theme => theme.library === library);
};

export const getFreeThemes = (): Theme[] => {
  return allThemes.filter(theme => !theme.isPremium);
};

export const getPremiumThemes = (): Theme[] => {
  return allThemes.filter(theme => theme.isPremium);
};

export const searchThemes = (query: string): Theme[] => {
  const lowercaseQuery = query.toLowerCase();
  return allThemes.filter(theme => 
    theme.name.toLowerCase().includes(lowercaseQuery) ||
    theme.description.toLowerCase().includes(lowercaseQuery) ||
    theme.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
};
