# Reshift NoCode Platform - API Documentation

## Overview

The Reshift NoCode Platform provides a comprehensive REST API for building, managing, and deploying no-code applications. The API follows RESTful principles and uses JSON for data exchange.

**Base URL**: `http://localhost:8000/api/v1`  
**API Version**: v1  
**Authentication**: JWT Bearer Token  
**Content-Type**: `application/json`

## Authentication

### Authentication Flow

1. **Register** a new user account
2. **Login** to receive an access token
3. **Include** the token in subsequent requests as `Authorization: Bearer <token>`
4. **Refresh** the token when it expires

### Authentication Endpoints

#### Register User
```http
POST /api/v1/auth/register
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "username": "johndoe",
  "first_name": "John",
  "last_name": "Doe",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "id": 1,
  "email": "user@example.com",
  "username": "johndoe",
  "first_name": "John",
  "last_name": "Doe",
  "role": "developer",
  "is_active": true,
  "created_at": "2024-01-01T00:00:00Z"
}
```

#### Login (JSON)
```http
POST /api/v1/auth/login-json
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

#### Login (OAuth2 Form)
```http
POST /api/v1/auth/login
Content-Type: application/x-www-form-urlencoded

username=user@example.com&password=securepassword123
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

#### Get Current User
```http
GET /api/v1/auth/me
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": 1,
  "email": "user@example.com",
  "username": "johndoe",
  "first_name": "John",
  "last_name": "Doe",
  "role": "developer",
  "is_active": true,
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

#### Refresh Token
```http
POST /api/v1/auth/refresh
Authorization: Bearer <token>
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

## Applications

### Application Management

Applications are the main entities in the platform. Each application contains components, pages, and configurations.

#### List Applications
```http
GET /api/v1/apps?skip=0&limit=100
Authorization: Bearer <token>
```

**Query Parameters:**
- `skip` (optional): Number of records to skip (default: 0)
- `limit` (optional): Maximum number of records to return (default: 100)

**Response:**
```json
[
  {
    "id": 1,
    "name": "My Dashboard App",
    "description": "A sample dashboard application",
    "slug": "my-dashboard-app",
    "config": {
      "theme": "light",
      "layout": "grid",
      "responsive": true
    },
    "is_published": false,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z",
    "owner_id": 1
  }
]
```

#### Create Application
```http
POST /api/v1/apps
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "My New App",
  "description": "Description of my new app",
  "slug": "my-new-app",
  "config": {
    "theme": "light",
    "layout": "grid",
    "responsive": true
  }
}
```

**Response:**
```json
{
  "id": 2,
  "name": "My New App",
  "description": "Description of my new app",
  "slug": "my-new-app",
  "config": {
    "theme": "light",
    "layout": "grid",
    "responsive": true
  },
  "is_published": false,
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z",
  "owner_id": 1
}
```

#### Get Application
```http
GET /api/v1/apps/{app_id}
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": 1,
  "name": "My Dashboard App",
  "description": "A sample dashboard application",
  "slug": "my-dashboard-app",
  "config": {
    "theme": "light",
    "layout": "grid",
    "responsive": true
  },
  "is_published": false,
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z",
  "owner_id": 1,
  "components": [
    {
      "id": 1,
      "name": "Header Text",
      "component_type": "text",
      "props": {
        "text": "Welcome to My App",
        "variant": "h1"
      },
      "styles": {
        "color": "#333333",
        "fontSize": "24px"
      },
      "app_id": 1,
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### Update Application
```http
PUT /api/v1/apps/{app_id}
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Updated App Name",
  "description": "Updated description",
  "config": {
    "theme": "dark",
    "layout": "free",
    "responsive": true
  }
}
```

**Response:**
```json
{
  "id": 1,
  "name": "Updated App Name",
  "description": "Updated description",
  "slug": "my-dashboard-app",
  "config": {
    "theme": "dark",
    "layout": "free",
    "responsive": true
  },
  "is_published": false,
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T12:00:00Z",
  "owner_id": 1
}
```

#### Delete Application
```http
DELETE /api/v1/apps/{app_id}
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "App deleted successfully"
}
```

#### Publish Application
```http
POST /api/v1/apps/{app_id}/publish
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "App published successfully",
  "app": {
    "id": 1,
    "name": "My Dashboard App",
    "description": "A sample dashboard application",
    "slug": "my-dashboard-app",
    "is_published": true,
    "updated_at": "2024-01-01T12:00:00Z"
  }
}
```

#### Unpublish Application
```http
POST /api/v1/apps/{app_id}/unpublish
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "App unpublished successfully",
  "app": {
    "id": 1,
    "name": "My Dashboard App",
    "description": "A sample dashboard application",
    "slug": "my-dashboard-app",
    "is_published": false,
    "updated_at": "2024-01-01T12:00:00Z"
  }
}
```

### Public Application Access

#### Get Published App (Public)
```http
GET /api/v1/apps/slug/{slug}
```

**Response:**
```json
{
  "id": 1,
  "name": "My Dashboard App",
  "description": "A sample dashboard application",
  "slug": "my-dashboard-app",
  "config": {
    "theme": "light",
    "layout": "grid",
    "responsive": true
  },
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

#### Get Published App Content (Public)
```http
GET /api/v1/apps/slug/{slug}/content
```

**Response:**
```json
{
  "id": 1,
  "name": "My Dashboard App",
  "description": "A sample dashboard application",
  "slug": "my-dashboard-app",
  "config": {
    "theme": "light",
    "layout": "grid",
    "responsive": true
  },
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z",
  "pages": [
    {
      "id": 1,
      "name": "Home Page",
      "page_definition": "{\"widgets\":[...],\"layout\":{...}}"
    }
  ],
  "components": [
    {
      "id": 1,
      "name": "Header Text",
      "component_type": "text",
      "props": {
        "text": "Welcome to My App",
        "variant": "h1"
      },
      "styles": {
        "color": "#333333",
        "fontSize": "24px"
      }
    }
  ],
  "layouts": []
}
```

#### Get Standalone App (No Authentication)
```http
GET /api/v1/apps/standalone/{slug}
```

**Response:** Same as `/content` endpoint but accessible without authentication.

## Components

### Component Management

Components are the building blocks of applications. They can be buttons, text, inputs, tables, charts, and more.

#### List App Components
```http
GET /api/v1/components/app/{app_id}
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "Header Text",
    "component_type": "text",
    "props": {
      "text": "Welcome to My App",
      "variant": "h1"
    },
    "styles": {
      "color": "#333333",
      "fontSize": "24px",
      "textAlign": "center"
    },
    "data_binding": null,
    "events": [],
    "app_id": 1,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": 2,
    "name": "Submit Button",
    "component_type": "button",
    "props": {
      "text": "Submit",
      "variant": "contained",
      "color": "primary"
    },
    "styles": {
      "margin": "16px",
      "padding": "12px 24px"
    },
    "data_binding": null,
    "events": [
      {
        "id": "event_1",
        "trigger": "onClick",
        "actions": [
          {
            "id": "action_1",
            "type": "showNotification",
            "notificationMessage": "Form submitted!",
            "notificationType": "success"
          }
        ]
      }
    ],
    "app_id": 1,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
]
```

#### Create Component
```http
POST /api/v1/components
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "New Button",
  "component_type": "button",
  "props": {
    "text": "Click Me",
    "variant": "outlined",
    "color": "secondary"
  },
  "styles": {
    "margin": "8px",
    "padding": "8px 16px",
    "borderRadius": "4px"
  },
  "data_binding": null,
  "events": [],
  "app_id": 1
}
```

**Response:**
```json
{
  "id": 3,
  "name": "New Button",
  "component_type": "button",
  "props": {
    "text": "Click Me",
    "variant": "outlined",
    "color": "secondary"
  },
  "styles": {
    "margin": "8px",
    "padding": "8px 16px",
    "borderRadius": "4px"
  },
  "data_binding": null,
  "events": [],
  "app_id": 1,
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

#### Get Component
```http
GET /api/v1/components/{component_id}
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": 1,
  "name": "Header Text",
  "component_type": "text",
  "props": {
    "text": "Welcome to My App",
    "variant": "h1"
  },
  "styles": {
    "color": "#333333",
    "fontSize": "24px",
    "textAlign": "center"
  },
  "data_binding": null,
  "events": [],
  "app_id": 1,
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

#### Update Component
```http
PUT /api/v1/components/{component_id}
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Updated Header Text",
  "props": {
    "text": "Welcome to My Updated App",
    "variant": "h2"
  },
  "styles": {
    "color": "#666666",
    "fontSize": "20px",
    "textAlign": "left"
  }
}
```

**Response:**
```json
{
  "id": 1,
  "name": "Updated Header Text",
  "component_type": "text",
  "props": {
    "text": "Welcome to My Updated App",
    "variant": "h2"
  },
  "styles": {
    "color": "#666666",
    "fontSize": "20px",
    "textAlign": "left"
  },
  "data_binding": null,
  "events": [],
  "app_id": 1,
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T12:00:00Z"
}
```

#### Delete Component
```http
DELETE /api/v1/components/{component_id}
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "Component deleted successfully"
}
```

### Component Types

The platform supports the following component types:

#### Text Component
```json
{
  "component_type": "text",
  "props": {
    "text": "Sample text content",
    "variant": "body1",
    "color": "primary",
    "align": "left"
  }
}
```

#### Button Component
```json
{
  "component_type": "button",
  "props": {
    "text": "Click Me",
    "variant": "contained",
    "color": "primary",
    "size": "medium",
    "disabled": false
  }
}
```

#### Input Component
```json
{
  "component_type": "input",
  "props": {
    "label": "Email Address",
    "type": "email",
    "placeholder": "Enter your email",
    "required": true,
    "disabled": false,
    "multiline": false,
    "rows": 1
  }
}
```

#### Table Component
```json
{
  "component_type": "table",
  "props": {
    "columns": ["Name", "Email", "Role"],
    "data": [
      {"Name": "John Doe", "Email": "john@example.com", "Role": "Admin"},
      {"Name": "Jane Smith", "Email": "jane@example.com", "Role": "User"}
    ],
    "showHeaders": true,
    "striped": true
  }
}
```

#### Chart Component
```json
{
  "component_type": "chart",
  "props": {
    "type": "bar",
    "title": "Sales Chart",
    "data": [
      {"label": "Jan", "value": 100},
      {"label": "Feb", "value": 150},
      {"label": "Mar", "value": 200}
    ],
    "xAxis": "label",
    "yAxis": "value",
    "colors": ["#3b82f6", "#ef4444", "#10b981"]
  },
  "data_binding": {
    "source": "database",
    "dataSourceId": "1",
    "query": "SELECT month, sales FROM sales_data ORDER BY month",
    "xField": "month",
    "yField": "sales",
    "refreshInterval": 300
  }
}
```

#### Image Component
```json
{
  "component_type": "image",
  "props": {
    "src": "https://example.com/image.jpg",
    "alt": "Sample image",
    "width": "100%",
    "height": "auto"
  }
}
```

#### Container Component
```json
{
  "component_type": "container",
  "props": {
    "maxWidth": "lg",
    "padding": "16px",
    "backgroundColor": "#f5f5f5"
  }
}
```

### Event System

Components can have events that trigger actions:

#### Event Structure
```json
{
  "events": [
    {
      "id": "event_1",
      "trigger": "onClick",
      "actions": [
        {
          "id": "action_1",
          "type": "showNotification",
          "notificationMessage": "Button clicked!",
          "notificationType": "success"
        },
        {
          "id": "action_2",
          "type": "apiCall",
          "apiEndpoint": "https://api.example.com/submit",
          "apiMethod": "POST",
          "apiData": {"formData": "value"}
        }
      ]
    }
  ]
}
```

#### Supported Event Triggers
- `onClick` - When component is clicked
- `onChange` - When input value changes
- `onSubmit` - When form is submitted

#### Supported Action Types
- `showComponent` - Show a hidden component
- `hideComponent` - Hide a visible component
- `updateComponent` - Update component properties
- `apiCall` - Make an API request
- `runQuery` - Execute a database query
- `navigateTo` - Navigate to a different page
- `showNotification` - Display a notification
- `setVariable` - Set a global variable
- `triggerEvent` - Trigger another component's event

## Data Sources

### Data Source Management

Data sources allow applications to connect to external databases, APIs, and services.

#### List Data Sources
```http
GET /api/v1/data-sources?skip=0&limit=100
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "Production Database",
    "description": "Main production database",
    "type": "mysql",
    "is_active": true,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z",
    "owner_id": 1
  }
]
```

#### Create Data Source
```http
POST /api/v1/data-sources
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "My Database",
  "description": "Local development database",
  "type": "postgresql",
  "connection_config": {
    "host": "localhost",
    "port": 5432,
    "database": "mydb",
    "username": "user",
    "password": "password"
  },
  "test_query": "SELECT 1"
}
```

**Response:**
```json
{
  "id": 2,
  "name": "My Database",
  "description": "Local development database",
  "type": "postgresql",
  "is_active": true,
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z",
  "owner_id": 1
}
```

#### Get Data Source
```http
GET /api/v1/data-sources/{data_source_id}
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": 1,
  "name": "Production Database",
  "description": "Main production database",
  "type": "mysql",
  "connection_config": {
    "host": "db.example.com",
    "port": 3306,
    "database": "production",
    "username": "user",
    "password": "encrypted_password"
  },
  "test_query": "SELECT 1",
  "is_active": true,
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z",
  "owner_id": 1
}
```

#### Update Data Source
```http
PUT /api/v1/data-sources/{data_source_id}
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Updated Database Name",
  "description": "Updated description",
  "connection_config": {
    "host": "new-host.example.com",
    "port": 3306,
    "database": "production",
    "username": "user",
    "password": "new_password"
  }
}
```

**Response:**
```json
{
  "id": 1,
  "name": "Updated Database Name",
  "description": "Updated description",
  "type": "mysql",
  "is_active": true,
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T12:00:00Z",
  "owner_id": 1
}
```

#### Delete Data Source
```http
DELETE /api/v1/data-sources/{data_source_id}
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "Data source deleted successfully"
}
```

#### Test Data Source Connection
```http
POST /api/v1/data-sources/{data_source_id}/test
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Connection successful",
  "data": [
    {"result": 1}
  ]
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Connection failed",
  "error": "Connection timeout"
}
```

#### Execute Query
```http
POST /api/v1/data-sources/{data_source_id}/query
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "query": "SELECT id, name, email FROM users WHERE active = :active LIMIT :limit",
  "parameters": {
    "active": true,
    "limit": 10
  },
  "limit": 100
}
```

**Response:**
```json
{
  "success": true,
  "data": [
    {"id": 1, "name": "John Doe", "email": "john@example.com"},
    {"id": 2, "name": "Jane Smith", "email": "jane@example.com"}
  ],
  "columns": ["id", "name", "email"],
  "row_count": 2,
  "execution_time_ms": 15
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "SQL syntax error near 'SELCT'",
  "row_count": 0
}
```

#### Get Data Source Schema
```http
GET /api/v1/data-sources/{data_source_id}/schema
Authorization: Bearer <token>
```

**Response:**
```json
{
  "tables": [
    {
      "name": "users",
      "columns": [
        {"name": "id", "type": "INT", "nullable": false, "primary_key": true},
        {"name": "name", "type": "VARCHAR(255)", "nullable": false, "primary_key": false},
        {"name": "email", "type": "VARCHAR(255)", "nullable": false, "primary_key": false},
        {"name": "created_at", "type": "TIMESTAMP", "nullable": false, "primary_key": false}
      ]
    },
    {
      "name": "orders",
      "columns": [
        {"name": "id", "type": "INT", "nullable": false, "primary_key": true},
        {"name": "user_id", "type": "INT", "nullable": false, "primary_key": false},
        {"name": "total", "type": "DECIMAL(10,2)", "nullable": false, "primary_key": false},
        {"name": "status", "type": "VARCHAR(50)", "nullable": false, "primary_key": false}
      ]
    }
  ]
}
```

### Data Source Types

#### MySQL
```json
{
  "type": "mysql",
  "connection_config": {
    "host": "localhost",
    "port": 3306,
    "database": "mydb",
    "username": "user",
    "password": "password",
    "charset": "utf8mb4"
  }
}
```

#### PostgreSQL
```json
{
  "type": "postgresql",
  "connection_config": {
    "host": "localhost",
    "port": 5432,
    "database": "mydb",
    "username": "user",
    "password": "password",
    "sslmode": "prefer"
  }
}
```

#### MongoDB
```json
{
  "type": "mongodb",
  "connection_config": {
    "host": "localhost",
    "port": 27017,
    "database": "mydb",
    "username": "user",
    "password": "password",
    "auth_source": "admin"
  }
}
```

#### REST API
```json
{
  "type": "rest_api",
  "connection_config": {
    "base_url": "https://api.example.com",
    "headers": {
      "Authorization": "Bearer token",
      "Content-Type": "application/json"
    },
    "timeout": 30
  }
}
```

#### GraphQL
```json
{
  "type": "graphql",
  "connection_config": {
    "endpoint": "https://api.example.com/graphql",
    "headers": {
      "Authorization": "Bearer token"
    },
    "timeout": 30
  }
}
```

#### Redis
```json
{
  "type": "redis",
  "connection_config": {
    "host": "localhost",
    "port": 6379,
    "password": "password",
    "db": 0
  }
}
```

## Pages

### Page Management

Pages contain the layout and structure of applications using an industry-standard page definition format.

#### List Pages
```http
GET /api/v1/pages?app_id={app_id}
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "Home Page",
    "page_definition": "{\"widgets\":[...],\"layout\":{...}}",
    "app_id": 1,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
]
```

#### Create Page
```http
POST /api/v1/pages
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "New Page",
  "app_id": 1,
  "page_definition": {
    "pageId": "page_1",
    "name": "New Page",
    "widgets": [
      {
        "id": "widget_1",
        "type": "text",
        "name": "Header",
        "props": {
          "text": "Welcome to New Page",
          "variant": "h1"
        },
        "styles": {
          "color": "#333333",
          "textAlign": "center"
        },
        "layout": {
          "x": 0,
          "y": 0,
          "w": 12,
          "h": 2
        }
      }
    ],
    "layout": {
      "widget_1": {
        "x": 0,
        "y": 0,
        "w": 12,
        "h": 2
      }
    },
    "globalSettings": {
      "theme": "light",
      "gridSize": 50,
      "breakpoints": {
        "mobile": 768,
        "tablet": 1024,
        "desktop": 1200
      }
    }
  }
}
```

**Response:**
```json
{
  "id": 2,
  "name": "New Page",
  "page_definition": "{\"pageId\":\"page_1\",\"name\":\"New Page\",\"widgets\":[...]}",
  "app_id": 1,
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

#### Get Page
```http
GET /api/v1/pages/{page_id}
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": 1,
  "name": "Home Page",
  "page_definition": {
    "pageId": "page_1",
    "name": "Home Page",
    "widgets": [
      {
        "id": "widget_1",
        "type": "text",
        "name": "Header",
        "props": {
          "text": "Welcome to My App",
          "variant": "h1"
        },
        "styles": {
          "color": "#333333",
          "textAlign": "center"
        },
        "layout": {
          "x": 0,
          "y": 0,
          "w": 12,
          "h": 2
        }
      }
    ],
    "layout": {
      "widget_1": {
        "x": 0,
        "y": 0,
        "w": 12,
        "h": 2
      }
    },
    "globalSettings": {
      "theme": "light",
      "gridSize": 50,
      "breakpoints": {
        "mobile": 768,
        "tablet": 1024,
        "desktop": 1200
      }
    }
  },
  "app_id": 1,
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

#### Update Page
```http
PUT /api/v1/pages/{page_id}
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Updated Page Name",
  "page_definition": {
    "pageId": "page_1",
    "name": "Updated Page Name",
    "widgets": [
      {
        "id": "widget_1",
        "type": "text",
        "name": "Updated Header",
        "props": {
          "text": "Welcome to Updated Page",
          "variant": "h2"
        },
        "styles": {
          "color": "#666666",
          "textAlign": "left"
        },
        "layout": {
          "x": 0,
          "y": 0,
          "w": 12,
          "h": 2
        }
      }
    ],
    "layout": {
      "widget_1": {
        "x": 0,
        "y": 0,
        "w": 12,
        "h": 2
      }
    },
    "globalSettings": {
      "theme": "dark",
      "gridSize": 50,
      "breakpoints": {
        "mobile": 768,
        "tablet": 1024,
        "desktop": 1200
      }
    }
  }
}
```

**Response:**
```json
{
  "id": 1,
  "name": "Updated Page Name",
  "page_definition": "{\"pageId\":\"page_1\",\"name\":\"Updated Page Name\",\"widgets\":[...]}",
  "app_id": 1,
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T12:00:00Z"
}
```

#### Delete Page
```http
DELETE /api/v1/pages/{page_id}
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "Page deleted successfully"
}
```

### Page Definition Format

The page definition follows an industry-standard format similar to Appsmith and Bubble:

```json
{
  "pageId": "unique_page_id",
  "name": "Page Name",
  "widgets": [
    {
      "id": "unique_widget_id",
      "type": "component_type",
      "name": "Widget Name",
      "props": {
        "property1": "value1",
        "property2": "value2"
      },
      "styles": {
        "color": "#333333",
        "fontSize": "16px"
      },
      "dataBinding": {
        "source": "database",
        "query": "SELECT * FROM table",
        "dataSourceId": "1"
      },
      "events": [
        {
          "id": "event_id",
          "trigger": "onClick",
          "actions": [
            {
              "id": "action_id",
              "type": "showNotification",
              "notificationMessage": "Hello!"
            }
          ]
        }
      ],
      "isVisible": true,
      "layout": {
        "x": 0,
        "y": 0,
        "w": 6,
        "h": 4,
        "minW": 2,
        "minH": 2,
        "maxW": 12,
        "maxH": 8
      }
    }
  ],
  "layout": {
    "widget_id": {
      "x": 0,
      "y": 0,
      "w": 6,
      "h": 4
    }
  },
  "dataSources": [
    {
      "id": "ds_1",
      "name": "My Database",
      "type": "mysql",
      "connectionConfig": {
        "host": "localhost",
        "database": "mydb"
      }
    }
  ],
  "globalSettings": {
    "theme": "light",
    "gridSize": 50,
    "breakpoints": {
      "mobile": 768,
      "tablet": 1024,
      "desktop": 1200
    }
  }
}
```

## Users

### User Management

User management endpoints for administrative purposes.

#### List Users
```http
GET /api/v1/users?skip=0&limit=100
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "id": 1,
    "email": "admin@example.com",
    "username": "admin",
    "first_name": "Admin",
    "last_name": "User",
    "role": "admin",
    "is_active": true,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
]
```

#### Get User
```http
GET /api/v1/users/{user_id}
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": 1,
  "email": "admin@example.com",
  "username": "admin",
  "first_name": "Admin",
  "last_name": "User",
  "role": "admin",
  "is_active": true,
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

#### Update User
```http
PUT /api/v1/users/{user_id}
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "first_name": "Updated First Name",
  "last_name": "Updated Last Name",
  "role": "developer"
}
```

**Response:**
```json
{
  "id": 1,
  "email": "admin@example.com",
  "username": "admin",
  "first_name": "Updated First Name",
  "last_name": "Updated Last Name",
  "role": "developer",
  "is_active": true,
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T12:00:00Z"
}
```

#### Delete User
```http
DELETE /api/v1/users/{user_id}
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "User deleted successfully"
}
```

## Error Handling

### Error Response Format

All API errors follow a consistent format:

```json
{
  "detail": "Error message description",
  "status_code": 400
}
```

### HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `500` - Internal Server Error

### Common Error Scenarios

#### Authentication Errors
```json
{
  "detail": "Incorrect email or password",
  "status_code": 401
}
```

#### Validation Errors
```json
{
  "detail": [
    {
      "loc": ["body", "email"],
      "msg": "field required",
      "type": "value_error.missing"
    }
  ],
  "status_code": 422
}
```

#### Permission Errors
```json
{
  "detail": "Not enough permissions to access this resource",
  "status_code": 403
}
```

#### Not Found Errors
```json
{
  "detail": "App not found",
  "status_code": 404
}
```

## Rate Limiting

The API implements rate limiting to prevent abuse:

- **Authentication endpoints**: 5 requests per minute
- **General API endpoints**: 100 requests per minute
- **Data source queries**: 50 requests per minute

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

## Webhooks (Future Feature)

Webhooks will be available for real-time notifications:

- Application published/unpublished
- Component updates
- Data source connection status changes
- User registration/login events

## SDKs and Libraries

### JavaScript/TypeScript
```bash
npm install @reshift/nocode-sdk
```

```javascript
import { ReshiftClient } from '@reshift/nocode-sdk'

const client = new ReshiftClient({
  baseUrl: 'http://localhost:8000/api/v1',
  token: 'your-jwt-token'
})

// Create an app
const app = await client.apps.create({
  name: 'My App',
  slug: 'my-app',
  description: 'A sample app'
})

// Add a component
const component = await client.components.create({
  name: 'Header',
  component_type: 'text',
  props: { text: 'Welcome!' },
  app_id: app.id
})
```

### Python
```bash
pip install reshift-nocode-sdk
```

```python
from reshift import ReshiftClient

client = ReshiftClient(
    base_url='http://localhost:8000/api/v1',
    token='your-jwt-token'
)

# Create an app
app = client.apps.create({
    'name': 'My App',
    'slug': 'my-app',
    'description': 'A sample app'
})

# Add a component
component = client.components.create({
    'name': 'Header',
    'component_type': 'text',
    'props': {'text': 'Welcome!'},
    'app_id': app['id']
})
```

## Interactive API Documentation

The API includes auto-generated interactive documentation available at:
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

These provide:
- Interactive API testing
- Request/response examples
- Schema definitions
- Authentication testing

## Support and Resources

- **API Status**: Check `/health` endpoint
- **Documentation**: This document and interactive docs
- **Support**: support@reshift.com
- **Community**: GitHub Discussions
- **Updates**: Follow our changelog for API updates

This comprehensive API documentation provides everything needed to integrate with the Reshift NoCode Platform and build powerful applications programmatically.

