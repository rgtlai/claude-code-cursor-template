# React + FastAPI + WebSocket Application Scaffolding Guide

## Project Overview
This scaffolding guide provides the complete structure and setup instructions for a full-stack application with:
- **Frontend**: React with TypeScript and modern tooling
- **Backend**: FastAPI with WebSocket support
- **Real-time Communication**: WebSocket connections for live updates
- **Development Tools**: Hot reload, linting, and testing setup

## Prerequisites
- **Python**: 3.12 or higher
- **Node.js**: 20 LTS or higher (latest stable recommended)
- **uv**: Latest version for Python package management

## Project Structure

```
project-root/
├── frontend/                   # React TypeScript application
│   ├── public/
│   │   ├── index.html
│   │   └── favicon.ico
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── pages/             # Page components
│   │   ├── hooks/             # Custom React hooks
│   │   ├── services/          # API and WebSocket services
│   │   ├── types/             # TypeScript type definitions
│   │   ├── utils/             # Utility functions
│   │   ├── config/            # Configuration files
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── tailwind.config.js
├── backend/                    # FastAPI Python application
│   ├── app/
│   │   ├── api/               # API route handlers
│   │   │   ├── __init__.py
│   │   │   └── routes/
│   │   │       ├── __init__.py
│   │   │       ├── websocket.py
│   │   │       └── api.py
│   │   ├── core/              # Core configuration
│   │   │   ├── __init__.py
│   │   │   ├── config.py
│   │   │   └── dependencies.py
│   │   ├── models/            # Data models
│   │   │   ├── __init__.py
│   │   │   └── schemas.py
│   │   ├── services/          # Business logic
│   │   │   ├── __init__.py
│   │   │   └── websocket_manager.py
│   │   ├── __init__.py
│   │   └── main.py
│   └── pyproject.toml
├── .env
├── .env.example
├── .gitignore
├── README.md
└── docker-compose.yml         # Optional: containerization
```

## Backend Dependencies (FastAPI)

### Project Configuration (`pyproject.toml`)
```toml
[project]
name = "fastapi-websocket-app"
version = "0.1.0"
description = "FastAPI application with WebSocket support"
requires-python = ">=3.12"
dependencies = [
    "fastapi",
    "uvicorn[standard]",
    "websockets",
    "python-dotenv",
    "pydantic",
    "python-multipart",
    "httpx",
    "aiofiles",
]

[project.optional-dependencies]
dev = [
    "pytest",
    "pytest-asyncio",
    "black",
    "isort",
    "flake8",
    "ruff",
]

[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"

[tool.ruff]
line-length = 88
target-version = "py312"

[tool.black]
line-length = 88
target-version = ['py312']

[tool.isort]
profile = "black"
```

## Frontend Dependencies (React + TypeScript)

### Core Dependencies (`package.json`)
```json
{
  "dependencies": {
    "react": "^18",
    "react-dom": "^18",
    "typescript": "^5"
  },
  "devDependencies": {
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "@vitejs/plugin-react": "^4",
    "vite": "^5",
    "tailwindcss": "^3",
    "autoprefixer": "^10",
    "postcss": "^8",
    "eslint": "^8",
    "@typescript-eslint/eslint-plugin": "^6",
    "@typescript-eslint/parser": "^6"
  }
}
```

## Key Files and Configuration

### Backend Configuration

#### `backend/app/main.py`
- FastAPI application initialization
- CORS middleware setup
- WebSocket endpoint registration
- API route inclusion
- Static file serving for React build
- Root route handling for SPA routing

#### `backend/app/core/config.py`
- Environment variables from root `.env` file
- Application settings
- Database configuration (if needed)

#### `backend/app/services/websocket_manager.py`
- WebSocket connection management
- Message broadcasting
- Connection lifecycle handling

### Frontend Configuration

#### `frontend/vite.config.ts`
- Vite build configuration
- Proxy setup for API calls
- Plugin configuration

#### `frontend/src/config/env.ts`
- Environment configuration management
- API and WebSocket URL configuration
- Development vs production settings

#### `frontend/src/services/websocket.ts`
- WebSocket client connection
- Message handling
- Reconnection logic
- Environment-based URL configuration

#### `frontend/src/hooks/useWebSocket.ts`
- Custom React hook for WebSocket
- State management for connection status
- Message sending/receiving

## Environment Variables

### Root Environment Variables (`.env.example`)
```env
# ======================
# SERVER CONFIGURATION
# ======================
HOST=0.0.0.0
PORT=8000
DEBUG=true

# ======================
# API CONFIGURATION
# ======================
API_V1_STR=/api/v1
PROJECT_NAME=FastAPI WebSocket App

# ======================
# CORS CONFIGURATION
# ======================
BACKEND_CORS_ORIGINS=["http://localhost:5173"]

# ======================
# WEBSOCKET CONFIGURATION
# ======================
WS_HOST=localhost
WS_PORT=8000

# ======================
# STATIC FILES
# ======================
STATIC_FILES_PATH=./frontend/dist
STATIC_FILES_ENABLED=true

# ======================
# SECURITY
# ======================
SECRET_KEY=your-secret-key-here-generate-a-secure-one
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# ======================
# FRONTEND CONFIGURATION
# ======================
# API Configuration
VITE_API_BASE_URL=http://localhost:8000
VITE_WS_BASE_URL=ws://localhost:8000

# Development Configuration
VITE_APP_TITLE=React FastAPI WebSocket App
VITE_APP_VERSION=1.0.0

# Production Configuration (commented for development)
# VITE_API_BASE_URL=https://your-domain.com
# VITE_WS_BASE_URL=wss://your-domain.com
```

## Static File Serving Configuration

### Backend Static File Setup
The FastAPI backend will serve the React build files from the root path (`/`) to enable proper SPA routing. This configuration includes:

- Serving static assets (JS, CSS, images) from `/assets/*`
- Serving `index.html` for all non-API routes to support React Router
- API routes prefixed with `/api/*` to avoid conflicts
- WebSocket connections on `/ws/*`

### Build Integration
The frontend build process creates a `dist/` folder that the backend serves directly. This enables:
- Single deployment artifact
- Simplified CORS configuration
- Reduced latency for static files
- Proper handling of client-side routing

## Development Setup Instructions

### Backend Setup
1. Ensure Python 3.12+ is installed: `python --version`
2. Install uv: `curl -LsSf https://astral.sh/uv/install.sh | sh` (Unix) or `powershell -c "irm https://astral.sh/uv/install.ps1 | iex"` (Windows)
3. Create and activate virtual environment: `uv venv && source .venv/bin/activate` (Unix) or `uv venv && .venv\Scripts\activate` (Windows)
4. Install dependencies: `uv pip install -e .`
5. Install development dependencies: `uv pip install -e ".[dev]"`
6. Copy environment template: `cp .env.example .env` (from project root)
7. Configure environment variables in `.env`
8. Run development server: `uvicorn app.main:app --reload --port 8000`

### Frontend Setup
1. Ensure Node.js 20 LTS+ is installed: `node --version`
2. Install Node.js dependencies: `npm install`
3. Environment variables are loaded from root `.env` file (Vite will automatically pick up VITE_ prefixed variables)
4. Run development server: `npm run dev`
5. Build for production: `npm run build`

## WebSocket Implementation Details

### Connection Management
- Maintain active connections in memory
- Handle connection cleanup on disconnect
- Implement heartbeat/ping-pong for connection health

### Message Types
- Define message schemas for different event types
- Implement message routing based on type
- Handle message validation and error cases

### State Synchronization
- Real-time data updates across clients
- Conflict resolution for concurrent updates
- Optimistic UI updates with rollback capability

## Security Considerations

### CORS Configuration
- Configure allowed origins for development and production
- Set appropriate headers for WebSocket connections

### Authentication
- Implement token-based authentication
- Secure WebSocket connections with authentication
- Handle unauthorized access gracefully

### Input Validation
- Validate all incoming data on backend
- Sanitize user inputs
- Implement rate limiting for WebSocket messages

## Testing Strategy

### Backend Testing
- Unit tests for API endpoints
- WebSocket connection testing
- Integration tests for complete flows

### Frontend Testing
- Component unit tests
- WebSocket hook testing
- End-to-end testing with real WebSocket connections

## Deployment Considerations

### Environment Variables
- Database connection strings
- API keys and secrets
- WebSocket connection URLs
- CORS origins for production
- Static file serving paths
- Production API/WebSocket endpoints

### Production Optimizations
- Enable compression for WebSocket messages
- Implement connection pooling
- Set up monitoring and logging
- Configure reverse proxy for WebSocket upgrades
- Optimize static file serving with proper caching headers
- Build frontend with production optimizations
- Configure CDN for static assets (optional)

## Common Patterns and Best Practices

### Error Handling
- Graceful WebSocket disconnection handling
- Retry logic for failed connections
- User-friendly error messages

### Performance
- Message batching for high-frequency updates
- Efficient data serialization
- Memory management for long-running connections

### Code Organization
- Separation of concerns between API and WebSocket handlers
- Reusable components for common WebSocket patterns
- Type-safe message interfaces