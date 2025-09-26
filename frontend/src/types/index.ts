// User types
export interface User {
  id: number
  email: string
  username: string
  first_name: string
  last_name: string
  role: 'admin' | 'developer' | 'viewer'
  is_active: boolean
  created_at: string
  updated_at?: string
}

export interface LoginData {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  username: string
  first_name: string
  last_name: string
  password: string
}

// App types
export interface App {
  id: number
  name: string
  description?: string
  slug: string
  config?: AppConfig
  is_published: boolean
  created_at: string
  updated_at?: string
  owner_id: number
}

export interface AppWithContent {
  id: number
  name: string
  description?: string
  slug: string
  config?: AppConfig
  created_at: string
  updated_at?: string
  pages: PagePublic[]
  components: ComponentPublic[]
  layouts: LayoutPublic[]
}

export interface PagePublic {
  id: number
  name: string
  page_definition: string
}

export interface ComponentPublic {
  id: number
  name: string
  component_type: string
  props?: Record<string, any>
  styles?: Record<string, any>
  data_binding?: Record<string, any>
  events?: Record<string, any>
}

export interface LayoutPublic {
  id: number
  name: string
  layout_config: Record<string, any>
  breakpoints?: Record<string, any>
}

export interface AppConfig {
  theme: 'light' | 'dark'
  layout: 'grid' | 'free'
  responsive: boolean
  pages: AppPage[]
}

export interface AppPage {
  id: string
  name: string
  path: string
  components: ComponentInstance[]
}

// Component types
export interface Component {
  id: number
  name: string
  component_type: ComponentType
  props?: Record<string, any>
  styles?: Record<string, any>
  data_binding?: Record<string, any>
  events?: Record<string, any>
  app_id: number
  created_at: string
  updated_at?: string
}

export interface ComponentInstance {
  id: string
  componentId: number
  x: number
  y: number
  w: number
  h: number
  props: Record<string, any>
  styles: Record<string, any>
}

export type ComponentType = 
  | 'button'
  | 'text'
  | 'input'
  | 'table'
  | 'chart'
  | 'form'
  | 'image'
  | 'container'
  | 'tab'
  | 'modal'
  | 'list'
  | 'select'
  | 'checkbox'
  | 'radio'
  | 'textarea'

// Data source types
export interface DataSource {
  id: number
  name: string
  description?: string
  type: DataSourceType
  connection_config: Record<string, any>
  test_query?: string
  is_active: boolean
  created_at: string
  updated_at?: string
  owner_id: number
}

export type DataSourceType = 
  | 'mysql'
  | 'postgresql'
  | 'mongodb'
  | 'rest_api'
  | 'graphql'
  | 'redis'

export interface DataSourceTestResult {
  success: boolean
  message: string
  data?: any[]
  error?: string
}

export interface QueryRequest {
  query: string
  parameters?: Record<string, any>
  limit?: number
}

export interface QueryResult {
  success: boolean
  data?: any[]
  columns?: string[]
  row_count: number
  error?: string
  execution_time_ms?: number
}

// Layout types
export interface Layout {
  id: number
  name: string
  layout_config: LayoutConfig
  breakpoints?: Record<string, any>
  app_id: number
  created_at: string
  updated_at?: string
}

export interface LayoutConfig {
  lg: LayoutItem[]
  md?: LayoutItem[]
  sm?: LayoutItem[]
  xs?: LayoutItem[]
  xxs?: LayoutItem[]
}

export interface LayoutItem {
  i: string
  x: number
  y: number
  w: number
  h: number
  minW?: number
  maxW?: number
  minH?: number
  maxH?: number
  static?: boolean
}

// API response types
export interface ApiResponse<T> {
  data: T
  message?: string
}

export interface ApiError {
  detail: string
  status_code: number
}

// Store types
export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => void
  initializeAuth: () => void
}

export interface AppBuilderState {
  currentApp: App | null
  selectedComponent: ComponentInstance | null
  components: ComponentInstance[]
  layout: LayoutItem[]
  setCurrentApp: (app: App | null) => void
  setSelectedComponent: (component: ComponentInstance | null) => void
  addComponent: (component: ComponentInstance) => void
  updateComponent: (id: string, updates: Partial<ComponentInstance>) => void
  removeComponent: (id: string) => void
  updateLayout: (layout: LayoutItem[]) => void
}
