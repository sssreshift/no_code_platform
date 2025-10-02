import axios from 'axios'
import type {
  User,
  LoginData,
  RegisterData,
  App,
  AppWithContent,
  Component,
  DataSource,
  DataSourceTestResult,
  QueryRequest,
  QueryResult,
  ApiResponse,
  ApiError,
} from '@/types'

// Create axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  console.log('API Request - Token:', token ? 'Present' : 'Missing', 'URL:', config.url)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log('API Response Error:', error.response?.status, error.response?.data, 'URL:', error.config?.url)
    if (error.response?.status === 401) {
      console.log('401 Unauthorized - Clearing auth data and redirecting to login')
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      // Only redirect if not already on login page
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authApi = {
  login: async (data: LoginData): Promise<{ access_token: string; token_type: string }> => {
    const response = await api.post('/auth/login-json', data)
    return response.data
  },

  register: async (data: RegisterData): Promise<User> => {
    const response = await api.post('/auth/register', data)
    return response.data
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get('/auth/me')
    return response.data
  },

  refreshToken: async (): Promise<{ access_token: string; token_type: string }> => {
    const response = await api.post('/auth/refresh')
    return response.data
  },
}

// Users API
export const usersApi = {
  getUsers: async (skip = 0, limit = 100): Promise<User[]> => {
    const response = await api.get('/users', { params: { skip, limit } })
    return response.data
  },

  getUser: async (userId: number): Promise<User> => {
    const response = await api.get(`/users/${userId}`)
    return response.data
  },

  updateUser: async (userId: number, data: Partial<User>): Promise<User> => {
    const response = await api.put(`/users/${userId}`, data)
    return response.data
  },

  deleteUser: async (userId: number): Promise<void> => {
    await api.delete(`/users/${userId}`)
  },
}

// Apps API
export const appsApi = {
  getApps: async (skip = 0, limit = 100): Promise<App[]> => {
    const response = await api.get('/apps', { params: { skip, limit } })
    return response.data
  },

  getApp: async (appId: number): Promise<App> => {
    const response = await api.get(`/apps/${appId}`)
    return response.data
  },

  getAppBySlug: async (slug: string): Promise<App> => {
    const response = await api.get(`/apps/slug/${slug}`)
    return response.data
  },

  getPublishedAppContent: async (slug: string): Promise<AppWithContent> => {
    const response = await api.get(`/apps/slug/${slug}/content`)
    return response.data
  },

  getStandaloneApp: async (slug: string): Promise<AppWithContent> => {
    const response = await api.get(`/apps/standalone/${slug}`)
    return response.data
  },

  createApp: async (data: Omit<App, 'id' | 'created_at' | 'updated_at' | 'owner_id'>): Promise<App> => {
    const response = await api.post('/apps', data)
    return response.data
  },

  updateApp: async (appId: number, data: Partial<App>): Promise<App> => {
    const response = await api.put(`/apps/${appId}`, data)
    return response.data
  },

  deleteApp: async (appId: number): Promise<void> => {
    await api.delete(`/apps/${appId}`)
  },

  publishApp: async (appId: number): Promise<App> => {
    const response = await api.post(`/apps/${appId}/publish`)
    return response.data.app
  },

  unpublishApp: async (appId: number): Promise<App> => {
    const response = await api.post(`/apps/${appId}/unpublish`)
    return response.data.app
  },
}

// Components API
export const componentsApi = {
  getAppComponents: async (appId: number): Promise<Component[]> => {
    const response = await api.get(`/components/app/${appId}`)
    return response.data
  },

  getComponent: async (componentId: number): Promise<Component> => {
    const response = await api.get(`/components/${componentId}`)
    return response.data
  },

  createComponent: async (data: Omit<Component, 'id' | 'created_at' | 'updated_at'>): Promise<Component> => {
    const response = await api.post('/components', data)
    return response.data
  },

  updateComponent: async (componentId: number, data: Partial<Component>): Promise<Component> => {
    const response = await api.put(`/components/${componentId}`, data)
    return response.data
  },

  deleteComponent: async (componentId: number): Promise<void> => {
    await api.delete(`/components/${componentId}`)
  },
}

// Data Sources API
export const dataSourcesApi = {
  getDataSources: async (skip = 0, limit = 100): Promise<DataSource[]> => {
    const response = await api.get('/data-sources', { params: { skip, limit } })
    return response.data
  },

  getDataSource: async (dataSourceId: number): Promise<DataSource> => {
    const response = await api.get(`/data-sources/${dataSourceId}`)
    return response.data
  },

  createDataSource: async (data: Omit<DataSource, 'id' | 'created_at' | 'updated_at' | 'owner_id'>): Promise<DataSource> => {
    const response = await api.post('/data-sources', data)
    return response.data
  },

  updateDataSource: async (dataSourceId: number, data: Partial<DataSource>): Promise<DataSource> => {
    const response = await api.put(`/data-sources/${dataSourceId}`, data)
    return response.data
  },

  deleteDataSource: async (dataSourceId: number): Promise<void> => {
    await api.delete(`/data-sources/${dataSourceId}`)
  },

  testDataSource: async (dataSourceId: number): Promise<DataSourceTestResult> => {
    const response = await api.post(`/data-sources/${dataSourceId}/test`)
    return response.data
  },

  executeQuery: async (dataSourceId: number, queryRequest: QueryRequest): Promise<QueryResult> => {
    const response = await api.post(`/data-sources/${dataSourceId}/query`, queryRequest)
    return response.data
  },

  getSchema: async (dataSourceId: number): Promise<any> => {
    const response = await api.get(`/data-sources/${dataSourceId}/schema`)
    return response.data
  },
}
