import React from 'react'

export enum PluginType {
  COMPONENT = "component",
  INTEGRATION = "integration", 
  TEMPLATE = "template",
  THEME = "theme"
}

export interface PluginCategory {
  id: number
  name: string
  description?: string
  icon?: string
  created_at: string
  updated_at?: string
}

export interface Plugin {
  id: number
  name: string
  slug: string
  description?: string
  long_description?: string
  version: string
  plugin_type: PluginType
  category_id: number
  config_schema?: Record<string, any>
  default_config?: Record<string, any>
  main_file?: string
  assets?: Record<string, any>
  dependencies?: string[]
  is_free: boolean
  price?: number
  currency: string
  author_id: number
  is_active: boolean
  is_featured: boolean
  is_verified: boolean
  download_count: number
  rating: number
  review_count: number
  created_at: string
  updated_at?: string
}

export interface PluginPublic extends Plugin {
  category?: PluginCategory
  author_name?: string
}

export interface PluginInstallation {
  id: number
  plugin_id: number
  app_id: number
  user_id: number
  config?: Record<string, any>
  is_active: boolean
  installed_at: string
  updated_at?: string
}

export interface PluginReview {
  id: number
  plugin_id: number
  user_id: number
  rating: number
  title?: string
  comment?: string
  is_verified: boolean
  created_at: string
  updated_at?: string
}

export interface PluginReviewPublic extends PluginReview {
  user_name?: string
}

export interface PluginSearchFilters {
  category_id?: number
  plugin_type?: PluginType
  is_free?: boolean
  is_featured?: boolean
  min_rating?: number
  search_query?: string
  sort_by?: string
  sort_order?: string
}

export interface PluginStats {
  total_plugins: number
  total_categories: number
  total_installations: number
  featured_plugins: number
  free_plugins: number
  paid_plugins: number
}

// Plugin Component Interface for Runtime
export interface PluginComponent {
  id: string
  name: string
  type: string
  props: Record<string, any>
  styles: Record<string, any>
  events: Record<string, any>
  render: (props: any) => React.ReactElement
}

// Plugin Configuration Schema
export interface PluginConfigSchema {
  type: 'object'
  properties: Record<string, {
    type: string
    title: string
    description?: string
    default?: any
    enum?: any[]
    [key: string]: any
  }>
  required?: string[]
}

// Plugin Asset Types
export interface PluginAssets {
  css?: string[]
  js?: string[]
  images?: string[]
  fonts?: string[]
  icons?: string[]
}
