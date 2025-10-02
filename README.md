# Reshift NoCode Platform

A powerful no-code application builder platform built with FastAPI backend and React TypeScript frontend. Similar to Appsmith, this platform allows users to create applications using drag-and-drop components, connect to various data sources, and deploy apps with custom configurations.

## Features

### ✅ Completed Features

**Backend (FastAPI)**
- 🔐 JWT Authentication & User Management
- 🏗️ Complete REST API with full CRUD operations
- 📊 Multiple Data Source Support (MySQL, PostgreSQL, MongoDB, REST API, GraphQL, Redis)
- 🔧 Component Management System
- 📱 App Configuration & Layout Management
- 🛡️ Role-based Access Control (Admin, Developer, Viewer)
- 📚 Comprehensive API Documentation (FastAPI auto-generated)

**Frontend (React + TypeScript)**
- 🎨 Modern UI with Material-UI components
- 🔐 Complete Authentication System (Login/Register)
- 📊 Dashboard with App Management
- 🏗️ Professional Project Structure
- ⚡ Fast Development with Vite
- 🎯 Type Safety with TypeScript
- 🔄 State Management with Zustand
- 🌐 API Integration with React Query

### 🚧 In Progress / Planned Features

- 🎯 **Visual App Builder** - Drag & drop component interface
- 👁️ **App Preview System** - Live preview of built applications  
- 📊 **Data Integration UI** - Visual data source management
- 🧱 **Component Library** - Reusable UI component palette
- 📱 **Responsive Layout System** - Multi-device support

## Technology Stack

### Backend
- **FastAPI** - Modern, fast web framework for building APIs
- **SQLAlchemy** - Python SQL toolkit and ORM
- **Pydantic** - Data validation using Python type annotations
- **JWT** - JSON Web Tokens for authentication
- **MySQL/PostgreSQL** - Primary databases
- **Redis** - Caching and session storage
- **Python-Jose** - JWT token handling
- **Passlib** - Password hashing utilities

### Frontend  
- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe JavaScript
- **Vite** - Next generation frontend tooling
- **Material-UI (MUI)** - React component library
- **React Router** - Client-side routing
- **Zustand** - Lightweight state management
- **React Query** - Server state management
- **React Hook Form** - Performant forms with validation
- **Axios** - HTTP client

## Project Structure

```
reshift-nocode-platform/
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── api/            # API route definitions
│   │   ├── core/           # Core configurations
│   │   ├── models/         # SQLAlchemy models
│   │   ├── schemas/        # Pydantic schemas
│   │   └── services/       # Business logic layer
│   ├── main.py            # FastAPI application entry point
│   └── requirements.txt   # Python dependencies
└── frontend/              # React TypeScript frontend
    ├── src/
    │   ├── components/    # Reusable React components
    │   ├── pages/         # Page components
    │   ├── services/      # API service functions
    │   ├── store/         # Zustand state stores
    │   ├── types/         # TypeScript type definitions
    │   └── hooks/         # Custom React hooks
    ├── package.json       # Node.js dependencies
    └── vite.config.ts     # Vite configuration
```

## Getting Started

### Prerequisites
- Python 3.8+
- Node.js 16+
- MySQL/PostgreSQL database (optional, can use SQLite for development)

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure environment variables:**
   Create a `.env` file in the backend directory:
   ```env
   DATABASE_URL=mysql+pymysql://user:password@host:port/database
   SECRET_KEY=your-secret-key-here
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   ```

4. **Run the FastAPI server:**
   ```bash
   python main.py
   ```
   
   The API will be available at: `http://localhost:8000`
   API Documentation: `http://localhost:8000/docs`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install Node.js dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   
   The application will be available at: `http://localhost:3000`

## API Documentation

The API is fully documented and available at `http://localhost:8000/docs` when the backend is running.

### Key API Endpoints

- **Authentication:**
  - `POST /api/v1/auth/register` - User registration
  - `POST /api/v1/auth/login` - User login
  - `GET /api/v1/auth/me` - Get current user

- **Applications:**
  - `GET /api/v1/apps` - List user's apps
  - `POST /api/v1/apps` - Create new app
  - `GET /api/v1/apps/{id}` - Get app details
  - `PUT /api/v1/apps/{id}` - Update app
  - `DELETE /api/v1/apps/{id}` - Delete app

- **Components:**
  - `GET /api/v1/components/app/{app_id}` - Get app components
  - `POST /api/v1/components` - Create component
  - `PUT /api/v1/components/{id}` - Update component

- **Data Sources:**
  - `GET /api/v1/data-sources` - List data sources
  - `POST /api/v1/data-sources` - Create data source
  - `POST /api/v1/data-sources/{id}/test` - Test connection
  - `POST /api/v1/data-sources/{id}/query` - Execute query

## Database Models

### User Model
- User authentication and profile management
- Role-based permissions (Admin, Developer, Viewer)
- App ownership tracking

### App Model  
- Application metadata and configuration
- JSON-based app configuration storage
- Publishing status management

### Component Model
- UI component definitions
- Properties, styles, and event configurations
- Data binding capabilities

### DataSource Model
- Multiple database type support
- Encrypted connection configurations
- Query execution and testing

### Layout Model
- Responsive grid layout configurations
- Component positioning and sizing
- Multi-breakpoint support

## Development Guidelines

### Code Style
- **Backend:** Follow PEP 8 Python style guide
- **Frontend:** ESLint + Prettier configuration
- **TypeScript:** Strict mode enabled for type safety

### Security Features
- JWT token-based authentication
- Password hashing with bcrypt
- CORS protection configured
- SQL injection prevention with ORM
- Input validation with Pydantic

### Testing
```bash
# Backend tests (when implemented)
cd backend && pytest

# Frontend tests (when implemented)  
cd frontend && npm test
```

## Deployment

### Production Backend
```bash
# Install dependencies
pip install -r requirements.txt

# Run with Gunicorn
gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app
```

### Production Frontend
```bash
# Build for production
npm run build

# Serve static files
npm run preview
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Roadmap

- [ ] **Q1 2024:** Complete visual app builder interface
- [ ] **Q2 2024:** Advanced component library and data binding
- [ ] **Q3 2024:** Multi-tenant support and team collaboration
- [ ] **Q4 2024:** Advanced analytics and app marketplace

## Support

For support, email support@reshift.com or join our Slack channel.

---

**Built with ❤️ by the Reshift Team**











