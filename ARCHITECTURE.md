# Reshift NoCode Platform - Architecture Documentation

## Overview

The Reshift NoCode Platform is a comprehensive application builder that enables users to create web applications through a visual drag-and-drop interface without writing code. The platform follows a modern microservices architecture with a FastAPI backend and React TypeScript frontend.

## System Architecture

### High-Level Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (React/TS)    │◄──►│   (FastAPI)     │◄──►│   (MySQL)       │
│   Port: 3000    │    │   Port: 8000    │    │   Port: 3306    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Standalone    │    │   Data Sources  │    │   File Storage  │
│   Apps Server   │    │   (Multi-DB)    │    │   (Optional)    │
│   Port: 3001    │    │   (Redis, etc)  │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Backend Architecture

### Technology Stack
- **Framework**: FastAPI (Python 3.8+)
- **Database**: MySQL with SQLAlchemy ORM
- **Authentication**: JWT tokens with bcrypt password hashing
- **API Documentation**: Auto-generated OpenAPI/Swagger docs
- **Data Sources**: Support for MySQL, PostgreSQL, MongoDB, REST APIs, GraphQL, Redis

### Project Structure
```
backend/
├── app/
│   ├── api/v1/           # API route definitions
│   │   ├── auth.py       # Authentication endpoints
│   │   ├── apps.py       # Application management
│   │   ├── components.py # Component CRUD operations
│   │   ├── data_sources.py # Data source management
│   │   ├── pages.py      # Page management
│   │   └── users.py      # User management
│   ├── core/             # Core configurations
│   │   ├── config.py     # Environment settings
│   │   └── database.py   # Database connection
│   ├── models/           # SQLAlchemy models
│   │   ├── user.py       # User model
│   │   ├── app.py        # Application model
│   │   ├── component.py  # Component model
│   │   ├── data_source.py # Data source model
│   │   ├── page.py       # Page model
│   │   └── layout.py     # Layout model
│   ├── schemas/          # Pydantic schemas
│   │   ├── user.py       # User validation schemas
│   │   ├── app.py        # App validation schemas
│   │   ├── component.py  # Component validation schemas
│   │   ├── data_source.py # Data source validation schemas
│   │   ├── page.py       # Page validation schemas
│   │   └── token.py      # Token schemas
│   └── services/         # Business logic layer
│       ├── auth.py       # Authentication service
│       ├── user.py       # User service
│       ├── app.py        # Application service
│       ├── component.py  # Component service
│       ├── data_source.py # Data source service
│       └── page.py       # Page service
├── main.py               # Application entry point
└── requirements.txt      # Python dependencies
```

### Key Backend Features

#### 1. Authentication & Authorization
- JWT-based authentication with configurable expiration
- Role-based access control (Admin, Developer, Viewer)
- Password hashing with bcrypt
- CORS protection and trusted host middleware

#### 2. Application Management
- CRUD operations for applications
- Publishing/unpublishing functionality
- Slug-based public access for published apps
- Standalone app serving (no authentication required)

#### 3. Component System
- 15+ built-in component types (Button, Text, Input, Table, Chart, etc.)
- JSON-based component configuration
- Event system with multiple action types
- Data binding capabilities for dynamic content

#### 4. Data Source Integration
- Support for multiple database types
- REST API and GraphQL integration
- Query execution with parameter binding
- Connection testing and schema introspection
- Encrypted connection configuration storage

#### 5. Page Management
- Industry-standard page definition format
- Widget-based architecture (similar to Appsmith/Bubble)
- Grid layout system with responsive breakpoints
- Component positioning and sizing

## Frontend Architecture

### Technology Stack
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and building
- **UI Library**: Material-UI (MUI) for consistent design
- **State Management**: Zustand for lightweight state management
- **Data Fetching**: React Query for server state management
- **Routing**: React Router for client-side navigation
- **Forms**: React Hook Form for form handling

### Project Structure
```
frontend/
├── src/
│   ├── components/       # Reusable React components
│   │   ├── Layout/       # Layout components
│   │   ├── AppRenderer.tsx # App rendering engine
│   │   └── CreateAppDialog.tsx # App creation dialog
│   ├── pages/            # Page components
│   │   ├── Dashboard.tsx # Main dashboard
│   │   ├── AppBuilder.tsx # Visual app builder
│   │   ├── AppPreview.tsx # App preview
│   │   ├── PublishedApp.tsx # Published app viewer
│   │   ├── DataSources.tsx # Data source management
│   │   ├── Login.tsx     # Authentication
│   │   └── Register.tsx  # User registration
│   ├── services/         # API service functions
│   │   └── api.ts        # Axios-based API client
│   ├── store/            # Zustand state stores
│   │   ├── authStore.ts  # Authentication state
│   │   └── appBuilderStore.ts # App builder state
│   ├── types/            # TypeScript type definitions
│   │   └── index.ts      # All type definitions
│   ├── hooks/            # Custom React hooks
│   │   └── useAuth.ts    # Authentication hook
│   ├── App.tsx           # Main app component
│   ├── main.tsx          # Application entry point
│   └── theme.ts          # Material-UI theme configuration
├── standalone.html       # Standalone app template
├── standalone-server.js  # Express server for standalone apps
└── package.json          # Node.js dependencies
```

### Key Frontend Features

#### 1. Visual App Builder
- Drag-and-drop component palette
- Real-time preview mode
- Component property editing
- Event system configuration
- Data binding setup
- Responsive layout management

#### 2. Component Library
- 15+ pre-built components
- Categorized component palette (Basic, Form, Layout, Data, etc.)
- Customizable properties and styling
- Event handling system
- Data binding capabilities

#### 3. Data Integration
- Visual data source management
- SQL query builder
- API endpoint configuration
- Real-time data binding
- Chart component with SQL integration

#### 4. Publishing System
- App publishing with public URLs
- Standalone app serving
- Clean, branded-free published apps
- Direct URL access for published apps

## Database Schema

### Core Tables

#### Users Table
```sql
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'developer', 'viewer') DEFAULT 'developer',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### Apps Table
```sql
CREATE TABLE apps (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    slug VARCHAR(255) UNIQUE NOT NULL,
    config JSON,
    is_published BOOLEAN DEFAULT FALSE,
    owner_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
);
```

#### Components Table
```sql
CREATE TABLE components (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    component_type ENUM('button', 'text', 'input', 'table', 'chart', 'form', 'image', 'container', 'tab', 'modal', 'list', 'select', 'checkbox', 'radio', 'textarea') NOT NULL,
    props JSON,
    styles JSON,
    data_binding JSON,
    events JSON,
    app_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (app_id) REFERENCES apps(id) ON DELETE CASCADE
);
```

#### Data Sources Table
```sql
CREATE TABLE data_sources (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type ENUM('mysql', 'postgresql', 'mongodb', 'rest_api', 'graphql', 'redis') NOT NULL,
    connection_config JSON NOT NULL,
    test_query TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    owner_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
);
```

#### Pages Table
```sql
CREATE TABLE pages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    page_definition JSON NOT NULL,
    app_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (app_id) REFERENCES apps(id) ON DELETE CASCADE
);
```

## API Architecture

### RESTful API Design
The API follows RESTful principles with clear resource-based URLs:

- **Authentication**: `/api/v1/auth/*`
- **Applications**: `/api/v1/apps/*`
- **Components**: `/api/v1/components/*`
- **Data Sources**: `/api/v1/data-sources/*`
- **Pages**: `/api/v1/pages/*`
- **Users**: `/api/v1/users/*`

### Key API Features

#### 1. Authentication Endpoints
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login (JSON)
- `POST /api/v1/auth/login` - User login (OAuth2 form)
- `GET /api/v1/auth/me` - Get current user
- `POST /api/v1/auth/refresh` - Refresh access token

#### 2. Application Endpoints
- `GET /api/v1/apps` - List user's apps
- `POST /api/v1/apps` - Create new app
- `GET /api/v1/apps/{id}` - Get app details
- `PUT /api/v1/apps/{id}` - Update app
- `DELETE /api/v1/apps/{id}` - Delete app
- `POST /api/v1/apps/{id}/publish` - Publish app
- `POST /api/v1/apps/{id}/unpublish` - Unpublish app
- `GET /api/v1/apps/slug/{slug}` - Get published app (public)
- `GET /api/v1/apps/standalone/{slug}` - Get standalone app (no auth)

#### 3. Component Endpoints
- `GET /api/v1/components/app/{app_id}` - Get app components
- `POST /api/v1/components` - Create component
- `GET /api/v1/components/{id}` - Get component
- `PUT /api/v1/components/{id}` - Update component
- `DELETE /api/v1/components/{id}` - Delete component

#### 4. Data Source Endpoints
- `GET /api/v1/data-sources` - List data sources
- `POST /api/v1/data-sources` - Create data source
- `GET /api/v1/data-sources/{id}` - Get data source
- `PUT /api/v1/data-sources/{id}` - Update data source
- `DELETE /api/v1/data-sources/{id}` - Delete data source
- `POST /api/v1/data-sources/{id}/test` - Test connection
- `POST /api/v1/data-sources/{id}/query` - Execute query
- `GET /api/v1/data-sources/{id}/schema` - Get schema info

## Security Architecture

### Authentication & Authorization
- **JWT Tokens**: Stateless authentication with configurable expiration
- **Password Security**: bcrypt hashing with salt rounds
- **Role-Based Access**: Three-tier permission system
- **CORS Protection**: Configurable allowed origins
- **Trusted Hosts**: Production host validation

### Data Security
- **Connection Encryption**: Database connection strings encrypted
- **Input Validation**: Pydantic schemas for all API inputs
- **SQL Injection Prevention**: SQLAlchemy ORM with parameterized queries
- **XSS Protection**: React's built-in XSS protection
- **CSRF Protection**: SameSite cookie attributes

### API Security
- **Rate Limiting**: Configurable request limits
- **Request Validation**: Comprehensive input validation
- **Error Handling**: Secure error messages without sensitive data
- **Audit Logging**: Request/response logging for security monitoring

## Deployment Architecture

### Development Environment
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   npm run dev   │    │   python main.py│    │   MySQL Local   │
│   Port: 3000    │    │   Port: 8000    │    │   Port: 3306    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Production Environment
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Nginx         │    │   Gunicorn      │    │   MySQL RDS     │
│   Load Balancer │    │   FastAPI       │    │   Production    │
│   SSL/TLS       │    │   Multiple      │    │   Database      │
│   Static Files  │    │   Workers       │    │   Backup        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Standalone Apps Deployment
```
┌─────────────────┐    ┌─────────────────┐
│   Express       │    │   Static Files  │
│   Server        │    │   Built Apps    │
│   Port: 3001    │    │   CDN/Storage   │
│   Published     │    │   Distribution  │
│   Apps Only     │    │                 │
└─────────────────┘    └─────────────────┘
```

## Scalability Considerations

### Horizontal Scaling
- **Stateless Backend**: FastAPI workers can be scaled horizontally
- **Database Connection Pooling**: SQLAlchemy connection pooling
- **Load Balancing**: Nginx for request distribution
- **CDN Integration**: Static assets served via CDN

### Performance Optimization
- **Database Indexing**: Optimized indexes on frequently queried columns
- **Query Optimization**: Efficient SQL queries with proper joins
- **Caching Strategy**: Redis for session and data caching
- **Frontend Optimization**: Code splitting and lazy loading

### Monitoring & Observability
- **Health Checks**: `/health` endpoint for service monitoring
- **Logging**: Structured logging with request tracing
- **Metrics**: Performance metrics collection
- **Error Tracking**: Comprehensive error monitoring

## Integration Points

### External Data Sources
- **Database Connectors**: MySQL, PostgreSQL, MongoDB
- **API Integrations**: REST APIs, GraphQL endpoints
- **Cloud Services**: AWS S3, Google Sheets, Salesforce
- **Real-time Data**: WebSocket connections, Server-Sent Events

### Third-Party Services
- **Authentication**: OAuth2 providers (Google, GitHub, etc.)
- **File Storage**: AWS S3, Google Cloud Storage
- **Email Services**: SendGrid, AWS SES
- **Analytics**: Google Analytics, Mixpanel

## Development Workflow

### Local Development Setup
1. **Backend Setup**:
   ```bash
   cd backend
   pip install -r requirements.txt
   python main.py
   ```

2. **Frontend Setup**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Database Setup**:
   - Configure MySQL connection in `backend/app/core/config.py`
   - Database tables created automatically on startup

### Testing Strategy
- **Unit Tests**: Backend service layer testing
- **Integration Tests**: API endpoint testing
- **Frontend Tests**: Component and page testing
- **E2E Tests**: Full application workflow testing

### CI/CD Pipeline
- **Code Quality**: ESLint, Prettier, TypeScript checks
- **Testing**: Automated test execution
- **Building**: Production build generation
- **Deployment**: Automated deployment to staging/production

## Future Architecture Considerations

### Microservices Migration
- **Service Decomposition**: Split into domain-specific services
- **API Gateway**: Centralized request routing and authentication
- **Service Mesh**: Inter-service communication management
- **Event-Driven Architecture**: Asynchronous service communication

### Advanced Features
- **Real-time Collaboration**: WebSocket-based multi-user editing
- **Version Control**: Git-like versioning for applications
- **Plugin System**: Extensible component and data source plugins
- **Multi-tenancy**: Isolated environments for different organizations

### Performance Enhancements
- **Edge Computing**: CDN-based application serving
- **Progressive Web Apps**: Offline capability and native app features
- **Serverless Functions**: Event-driven backend processing
- **GraphQL API**: More efficient data fetching

This architecture provides a solid foundation for a scalable, maintainable no-code platform that can grow with user needs and technological advances.
