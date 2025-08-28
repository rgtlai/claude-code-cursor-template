# React + FastAPI + LangGraph Conversational Agent Scaffolding Guide

## Project Overview
This scaffolding guide provides the complete structure and setup instructions for an AI-powered conversational agent with:
- **Frontend**: React with TypeScript and real-time streaming UI
- **Backend**: FastAPI with LangGraph conversational AI workflows
- **Real-time Communication**: WebSocket streaming for AI responses
- **AI Features**: Multiple LLM providers, custom tools, and memory persistence
- **Development Tools**: Comprehensive testing, linting, and hot reload setup

## Prerequisites
- **Python**: 3.9 or higher (3.12+ recommended)
- **Node.js**: 20 LTS or higher (latest stable recommended)
- **uv**: Latest version for Python package management
- **pnpm**: Latest version for JavaScript package management
- **API Keys**: At minimum OpenAI API key for the conversational agent

## Project Structure

```
project-root/
├── frontend/                   # React TypeScript application
│   ├── public/
│   │   └── vite.svg
│   ├── src/
│   │   ├── components/         # React UI components
│   │   │   ├── ChatInterface.tsx
│   │   │   ├── MessageInput.tsx
│   │   │   ├── MessageStream.tsx
│   │   │   ├── QuestionComponents.tsx
│   │   │   ├── TypingIndicator.tsx
│   │   │   └── __tests__/      # Component unit tests
│   │   ├── hooks/              # Custom React hooks
│   │   │   ├── useWebSocket.ts
│   │   │   └── __tests__/      # Hook unit tests
│   │   ├── services/           # API and WebSocket services
│   │   │   └── websocketService.ts
│   │   ├── types/              # TypeScript type definitions
│   │   │   └── index.ts
│   │   ├── test/               # Test utilities
│   │   │   ├── setup.ts
│   │   │   └── utils.tsx
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── package.json
│   ├── tsconfig.json
│   ├── tsconfig.app.json
│   ├── tsconfig.node.json
│   ├── vite.config.ts
│   ├── vitest.config.ts
│   └── tailwind.config.js
├── backend/                    # FastAPI Python application
│   ├── agents/                 # LangGraph agents and tools
│   │   ├── __init__.py
│   │   ├── agent_config.json   # LLM provider configuration
│   │   ├── config_loader.py    # Configuration management
│   │   ├── llm_config_cli.py   # CLI for LLM configuration
│   │   ├── llm_providers.py    # Multi-provider LLM support
│   │   ├── prompts.py          # System prompts and templates
│   │   ├── questionnaire_agent.py # Main conversational agent
│   │   ├── tools_node.py       # Custom LangChain tools
│   │   └── questionnaire_agent/
│   │       └── questions.json  # Question templates
│   ├── models/                 # Pydantic data models
│   │   ├── __init__.py
│   │   └── schemas.py
│   ├── services/               # Business logic services
│   │   ├── __init__.py
│   │   ├── memory_service.py   # mem0ai integration
│   │   └── websocket_manager.py # WebSocket connection management
│   ├── __init__.py
│   ├── config.py               # Environment configuration
│   └── main.py                 # FastAPI application
├── tests/                      # Comprehensive test suite
│   ├── __init__.py
│   ├── conftest.py             # Test configuration
│   ├── unit/                   # Unit tests (97%+ coverage)
│   │   ├── agents/             # Agent testing
│   │   ├── models/             # Model testing
│   │   ├── services/           # Service testing
│   │   ├── test_config.py
│   │   ├── test_main.py
│   │   └── test_websocket.py
│   └── integration/            # Integration tests
│       ├── conftest.py
│       ├── test_configurable_agent_integration.py
│       ├── test_end_to_end_integration.py
│       ├── test_websocket_question_integration.py
│       └── test_websocket_ui_integration.py
├── .env                        # Environment variables
├── .env.example                # Environment template
├── .gitignore                  # Git ignore patterns
├── README.md                   # Project documentation
├── package.json                # Root package.json with workspace scripts
├── pnpm-workspace.yaml         # pnpm workspace configuration
├── pyproject.toml              # Python project configuration
└── uv.lock                     # UV lock file
```

## Backend Dependencies (LangGraph + FastAPI)

### Project Configuration (`pyproject.toml`)
```toml
[project]
name = "conversational-agent"
version = "0.1.0"
description = "A conversational agent using LangGraph with websocket streaming"
requires-python = ">=3.9"
dependencies = [
    "langgraph>=0.2.0",
    "langchain>=0.2.0",
    "langchain-openai>=0.1.0",
    "langchain-aws>=0.2.29",
    "langchain-fireworks>=0.3.0",
    "langchain-cerebras>=0.5.0",
    "langchain-groq>=0.2.0",
    "websockets>=15.0",
    "fastapi>=0.104.0",
    "uvicorn[standard]>=0.35.0",
    "pydantic>=2.0.0",
    "python-multipart>=0.0.6",
    "jinja2>=3.1.0",
    "python-dotenv>=1.1.1",
    "mem0ai>=0.1.114",
    "jupyter>=1.0.0",
]

[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"

[tool.hatch.build.targets.wheel]
packages = ["backend"]

[tool.uv]
dev-dependencies = [
    "pytest>=7.0.0",
    "pytest-asyncio>=0.21.0",
    "pytest-mock>=3.11.0",
    "httpx>=0.24.0",
    "pytest-cov>=4.1.0",
    "black>=23.0.0",
    "isort>=5.0.0",
    "ipykernel>=6.0.0"
]

[tool.pytest.ini_options]
minversion = "7.0"
addopts = [
    "-ra",
    "--strict-markers",
    "--strict-config",
    "--cov=backend",
    "--cov-report=term-missing",
    "--cov-report=html",
    "--cov-fail-under=80"
]
testpaths = ["tests"]
python_files = ["test_*.py"]
python_classes = ["Test*"]
python_functions = ["test_*"]
markers = [
    "slow: marks tests as slow",
    "integration: marks tests as integration tests",
    "unit: marks tests as unit tests"
]
asyncio_mode = "auto"
```

## Frontend Dependencies (React + TypeScript + Vitest)

### Core Dependencies (`frontend/package.json`)
```json
{
  "name": "frontend",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "preview": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage"
  },
  "dependencies": {
    "react": "^19.1.1",
    "react-dom": "^19.1.1"
  },
  "devDependencies": {
    "@eslint/js": "^9.33.0",
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/react": "^16.1.0",
    "@testing-library/user-event": "^14.5.2",
    "@types/node": "^24.3.0",
    "@types/react": "^19.1.10",
    "@types/react-dom": "^19.1.7",
    "@vitejs/plugin-react": "^5.0.0",
    "@vitest/coverage-v8": "^2.1.8",
    "@vitest/ui": "^2.1.8",
    "autoprefixer": "^10.4.21",
    "eslint": "^9.33.0",
    "eslint-plugin-react-hooks": "^5.2.0",
    "eslint-plugin-react-refresh": "^0.4.20",
    "globals": "^16.3.0",
    "jsdom": "^26.0.0",
    "postcss": "^8.5.6",
    "tailwindcss": "^3.4.17",
    "typescript": "~5.8.3",
    "typescript-eslint": "^8.39.1",
    "vite": "^6.0.0",
    "vitest": "^2.1.8"
  },
  "engines": {
    "node": ">=20.11.1"
  }
}
```

## Key Files and Configuration

### Backend Configuration

#### `backend/main.py`
- FastAPI application initialization with lifespan management
- CORS middleware setup for development and production
- WebSocket endpoint at `/ws` for real-time streaming using `astream`
- API routes prefixed with `/api/` 
- Static file serving for React build (`frontend/dist/`)
- Catch-all route for SPA routing (MUST be last!)
- LangGraph agent integration with streaming support via `astream` method
- Multi-agent streaming support with metadata filtering for specific agent responses

#### `backend/config.py`
- Environment variables from root `.env` file
- Multiple LLM provider configurations (OpenAI, Fireworks, Cerebras, AWS Bedrock, Groq)
- Application settings (ports, CORS origins, debug mode)
- Memory service configuration (mem0ai settings)
- Agent configuration path management

#### `backend/agents/questionnaire_agent.py`
- LangGraph workflow definition with streaming support via `astream`
- Custom tool integration (calculator, questionnaire generator, fun facts)
- Memory service integration for conversation context
- Multiple LLM provider support with configurable switching
- Question generation and formatting with JSON embedding
- Streaming implementation using `astream` for real-time token delivery
- Metadata configuration for multi-agent scenarios to filter specific agent responses

#### `backend/agents/llm_providers.py`
- Unified interface for multiple LLM providers
- Dynamic provider switching based on configuration
- Streaming support for all providers
- Error handling and fallback mechanisms

#### `backend/services/memory_service.py`
- mem0ai integration for persistent conversation memory
- Fallback to simple storage if mem0ai setup fails
- Conversation history management and retrieval
- Session isolation and cleanup

#### `backend/services/websocket_manager.py`
- WebSocket connection lifecycle management
- Message broadcasting and streaming
- Connection cleanup on disconnect
- Session management with user ID separation

### Frontend Configuration

#### `frontend/vite.config.ts`
- Vite build configuration with React plugin
- Environment directory configuration (`envDir: '../'`)
- Development server configuration
- Build optimization settings

#### `frontend/src/hooks/useWebSocket.ts`
- Custom React hook for WebSocket management
- Connection state management with auto-reconnection
- Message streaming with token accumulation
- Session ID and user ID management
- Error handling and retry logic

#### `frontend/src/components/ChatInterface.tsx`
- Main chat interface component
- Message history rendering
- Real-time streaming display
- WebSocket connection status
- Session management UI

#### `frontend/src/components/MessageStream.tsx`
- Real-time message streaming component
- Token-by-token rendering as they arrive
- Typing indicators and connection status
- Question component embedding with `%{JSON}` pattern
- Markdown rendering and content formatting

#### `frontend/src/components/QuestionComponents.tsx`
- Interactive question rendering components
- Support for multiple question types:
  - Single select (radio buttons)
  - Multi select (checkboxes)
  - Text input
  - Likert scale
  - Numeric input
- Real-time answer capture and WebSocket transmission

#### `frontend/src/services/websocketService.ts`
- WebSocket connection management service
- Message sending and receiving
- Connection state tracking
- Environment-based URL configuration (auto-detects dev vs prod)

## Root Package Configuration

### Workspace Scripts (`package.json`)
```json
{
  "name": "conversational-agent",
  "version": "0.1.0",
  "description": "Full-stack conversational agent with streaming chat interface - single server deployment",
  "scripts": {
    "dev": "concurrently \"pnpm run dev:backend\" \"pnpm run dev:frontend\"",
    "dev:backend": "uv run uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000",
    "dev:frontend": "cd frontend && pnpm run dev -- --port 5173",
    "build": "cd frontend && pnpm run build",
    "install:all": "uv sync && cd frontend && pnpm install",
    "start": "pnpm run build && uv run uvicorn backend.main:app --host 0.0.0.0 --port 8000",
    "start:prod": "uv run uvicorn backend.main:app --host 0.0.0.0 --port 8000 --workers 4",
    "test": "uv run pytest",
    "test:frontend": "cd frontend && pnpm test --run",
    "lint": "uv run black . && uv run isort .",
    "clean": "rm -rf frontend/dist frontend/node_modules backend/__pycache__ backend/**/__pycache__",
    "preview": "pnpm run build && pnpm run start"
  },
  "devDependencies": {
    "concurrently": "^8.2.2"
  },
  "engines": {
    "node": ">=20.11.1"
  }
}
```

### pnpm Workspace Configuration (`pnpm-workspace.yaml`)
```yaml
packages:
  - 'frontend'
```

## Environment Variables

### Root Environment Variables (`.env.example`)
```env
# ======================
# LLM PROVIDER API KEYS
# ======================
# Required for conversational agent
OPENAI_API_KEY=sk-your-openai-key-here

# Optional additional providers
FIREWORKS_API_KEY=your-fireworks-key-here
CEREBRAS_API_KEY=your-cerebras-key-here
GROQ_API_KEY=your-groq-key-here

# AWS Bedrock (optional)
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_DEFAULT_REGION=us-east-1

# ======================
# MEMORY SERVICE
# ======================
MEM0_API_KEY=your-mem0-key-here
MEM0_CONFIG_PATH=./mem0_config.json

# ======================
# SERVER CONFIGURATION
# ======================
BACKEND_PORT=8000
FRONTEND_PORT=5173
DEBUG=true
LOG_LEVEL=INFO

# ======================
# CORS CONFIGURATION
# ======================
CORS_ORIGINS=http://localhost:5173,http://localhost:3000

# ======================
# WEBSOCKET CONFIGURATION
# ======================
WEBSOCKET_URL=ws://localhost:8000/ws

# ======================
# AGENT CONFIGURATION
# ======================
AGENT_CONFIG_PATH=./backend/agents/agent_config.json
```

## Agent Configuration

### LLM Provider Configuration (`backend/agents/agent_config.json`)
```json
{
  "questionnaire_agent": {
    "llm": {
      "provider": "openai",
      "config": {
        "model": "gpt-4o-mini",
        "temperature": 0.0,
        "streaming": true
      }
    },
    "description": "Conversational agent for conducting questionnaires with streaming support"
  }
}
```

## Static File Serving Configuration

### Backend Static File Setup
The FastAPI backend serves the React build files from the root path (`/`) to enable proper SPA routing:

- Serving static assets (JS, CSS, images) from `/assets/*`
- Serving `index.html` for all non-API routes to support React Router
- API routes prefixed with `/api/*` to avoid conflicts
- WebSocket connections on `/ws`
- Special routes like `/test`, `/docs`, `/redoc` are preserved

### Build Integration
The frontend build process creates a `dist/` folder that the backend serves directly:
- Single deployment artifact
- Simplified CORS configuration  
- Reduced latency for static files
- Proper handling of client-side routing

## Development Setup Instructions

### Backend Setup
1. Ensure Python 3.9+ is installed: `python --version`
2. Install uv: `curl -LsSf https://astral.sh/uv/install.sh | sh` (Unix) or `powershell -c "irm https://astral.sh/uv/install.ps1 | iex"` (Windows)
3. Copy environment template: `cp .env.example .env` (from project root)
4. Configure environment variables in `.env` (at minimum set `OPENAI_API_KEY`)
5. Install dependencies: `uv sync`
6. Install development dependencies: `uv sync --dev` (included in `uv sync`)
7. Run development server: `uv run uvicorn backend.main:app --reload --port 8000`

### Frontend Setup
1. Ensure Node.js 20 LTS+ is installed: `node --version`
2. Ensure pnpm is installed: `npm install -g pnpm`
3. Install Node.js dependencies: `cd frontend && pnpm install`
4. Environment variables are loaded from root `.env` file (Vite automatically picks up VITE_ prefixed variables)
5. Run development server: `pnpm run dev` (from frontend directory)
6. Build for production: `pnpm run build` (from frontend directory)

### Unified Development Setup
1. Install all dependencies: `pnpm -w run install:all`
2. Start both servers: `pnpm -w run dev` (development with hot reload)
3. Or start single server: `pnpm -w run start` (production-like build)

## LangGraph Implementation Details

### Agent Workflow
- **State Management**: Conversation state with message history
- **Tool Integration**: Calculator, questionnaire generator, random facts
- **Streaming Support**: Real-time token streaming via WebSocket using `astream`
- **Memory Integration**: Persistent conversation context
- **Question Generation**: Structured questions with JSON embedding pattern

### Streaming Implementation
- **`astream` Method**: Primary streaming interface for LangGraph agents
- **Real-time Token Delivery**: Tokens streamed as they are generated from the LLM
- **Multi-agent Support**: Use metadata filtering to isolate responses from specific agents
- **WebSocket Integration**: Seamless connection between LangGraph `astream` and WebSocket endpoints
- **Error Handling**: Proper streaming error propagation and recovery

### Custom Tools
- **Calculator Tool**: Mathematical computation support
- **Questionnaire Generator**: Dynamic question creation
- **Random Facts Tool**: Entertainment and engagement features
- **Custom Tool Node**: Extensible framework for additional tools

### Memory Management
- **mem0ai Integration**: Persistent long-term memory
- **Conversation History**: Session-based context management
- **Fallback Storage**: Simple storage when mem0ai unavailable
- **User Isolation**: Separate memory per user ID

## WebSocket Implementation Details

### Connection Management
- Maintain active connections with session ID mapping
- Handle connection cleanup on disconnect
- Implement automatic reconnection on the frontend
- Session isolation between different users

### Message Types
- **Message Type**: User input messages
- **Token Type**: Streaming response tokens
- **End Type**: Response completion signals
- **Connection Type**: Connection status updates
- **Error Type**: Error handling and display

### Streaming Protocol
- Real-time token streaming from LangGraph agent using `astream`
- Frontend accumulates tokens as they arrive
- Question embedding with `%{JSON}` pattern for interactive components
- Connection status tracking and display
- Metadata-based filtering for multi-agent scenarios
- Stream event handling for different agent responses

## Question Rendering System

### JSON Embedding Pattern
Questions are embedded in streaming responses using the pattern:
```
%{"type": "SINGLE_SELECT", "question": "...", "options": [...], "metadata": {...}}
```

### Question Types Supported
- **SINGLE_SELECT**: Radio button selection
- **MULTI_SELECT**: Checkbox multiple selection  
- **TEXT_INPUT**: Open text responses
- **LIKERT_SCALE**: Likert scale ratings
- **NUMERIC_INPUT**: Numeric value input

### Frontend Processing
- Parse `%` prefixed JSON from streaming messages
- Render appropriate interactive components
- Capture user responses and send via WebSocket
- Maintain question state and user answers

## Security Considerations

### CORS Configuration
- Configure allowed origins for development and production
- Separate settings for WebSocket and HTTP requests
- Environment-based origin management

### Input Validation
- Pydantic models for data validation
- WebSocket message schema validation
- Sanitization of user inputs before processing
- Rate limiting for WebSocket messages (recommended)

### API Key Management
- Environment-based configuration
- Support for multiple LLM providers
- Secure storage and access patterns
- Validation of API key presence

## Testing Strategy

### Backend Testing (97%+ Coverage)
- **Unit Tests**: 180+ comprehensive tests covering all components
- **Integration Tests**: End-to-end workflow testing
- **WebSocket Testing**: Real-time streaming simulation
- **Agent Testing**: LangGraph workflow validation
- **Memory Service Testing**: mem0ai integration testing
- **Tool Testing**: Custom tool functionality validation

### Frontend Testing
- **Component Tests**: React Testing Library + Vitest
- **Hook Tests**: Custom hook testing with mocking
- **WebSocket Tests**: Connection and message handling
- **Question Component Tests**: Interactive element testing
- **Integration Tests**: Complete UI workflow validation

### Test Commands
```bash
# Backend tests
pnpm -w run test              # Unit tests (97%+ coverage)
uv run pytest tests/integration/ -v  # Integration tests

# Frontend tests  
pnpm -w run test:frontend     # Component and hook tests
cd frontend && pnpm run test:ui      # Interactive test UI
cd frontend && pnpm run test:coverage # Coverage report
```

## Deployment Considerations

### Environment Variables
- LLM provider API keys (OpenAI, Fireworks, Cerebras, AWS, Groq)
- Memory service configuration (mem0ai)
- WebSocket connection URLs
- CORS origins for production
- Static file serving paths
- Production API/WebSocket endpoints

### Production Optimizations
- Enable compression for WebSocket messages
- Implement connection pooling for database connections
- Set up monitoring and logging (structured logging recommended)
- Configure reverse proxy for WebSocket upgrades (nginx/Apache)
- Optimize static file serving with proper caching headers
- Build frontend with production optimizations (`pnpm run build`)
- Use production ASGI server with multiple workers (`uvicorn --workers 4`)
- Configure CDN for static assets (optional)

### Single Server Deployment
The application is designed for single server deployment:
1. Build frontend: `pnpm -w run build`
2. FastAPI serves both API and static files
3. WebSocket connections handled by same server
4. Simplified infrastructure and networking

## Common Patterns and Best Practices

### Error Handling
- Graceful WebSocket disconnection handling
- Retry logic for failed connections with exponential backoff
- User-friendly error messages and recovery options
- Fallback storage when external services fail

### Performance
- Token-by-token streaming for responsive user experience
- Efficient memory management for long-running connections
- Connection pooling for external service calls
- Frontend component optimization with React.memo

### Code Organization
- Separation of concerns between API and WebSocket handlers
- Reusable components for common patterns
- Type-safe interfaces throughout the application
- Modular agent architecture with extensible tools

### Development Workflow
- pnpm workspace for unified dependency management
- Hot reload for both frontend and backend during development
- Comprehensive test coverage with automated CI/CD integration
- Environment-based configuration for seamless deployment transitions

## CLI Tools and Configuration

### LLM Configuration CLI
The project includes a CLI tool for managing LLM provider configurations:

```bash
# View current configuration
uv run python backend/agents/llm_config_cli.py --show

# Switch LLM provider
uv run python backend/agents/llm_config_cli.py --provider openai --model gpt-4o-mini

# Interactive configuration
uv run python backend/agents/llm_config_cli.py --interactive
```

### Supported Providers
- **OpenAI**: GPT-4, GPT-4o, GPT-3.5 models
- **Fireworks**: Llama, Mixtral, and other open-source models
- **Cerebras**: High-speed inference models
- **AWS Bedrock**: Claude, Llama, and other foundation models
- **Groq**: Ultra-fast inference with Llama models

## Implementation Examples

### Complete Backend Implementation

#### `backend/main.py` - Full FastAPI WebSocket Implementation
```python
import json
import logging
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from langchain_core.messages import AIMessage, HumanMessage

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """WebSocket endpoint with astream_events for real-time streaming"""
    await websocket.accept()
    session_id = None

    try:
        while True:
            data = await websocket.receive_text()
            message_data = json.loads(data)

            if message_data.get("type") == "message":
                user_input = message_data.get("content", "")
                user_id = message_data.get("user_id")
                session_id = message_data.get("session_id")

                # Build message history for context
                messages = [HumanMessage(content=user_input)]
                
                # Stream response using LangGraph's astream_events
                config = {"configurable": {"thread_id": user_id}}
                full_response = ""
                message_id = str(uuid.uuid4())

                async for event in conversation_agent.graph.astream_events(
                    {"messages": messages, "user_id": user_id},
                    config=config,
                    version="v1",
                ):
                    # Handle streaming tokens from LLM
                    if event["event"] == "on_chat_model_stream":
                        chunk = event["data"]["chunk"]
                        if hasattr(chunk, "content") and chunk.content:
                            full_response += chunk.content
                            await websocket.send_text(json.dumps({
                                "type": "token",
                                "content": chunk.content,
                                "message_id": message_id,
                                "session_id": session_id,
                            }))

                # Send completion signal
                await websocket.send_text(json.dumps({
                    "type": "end",
                    "message_id": message_id,
                    "final_content": full_response,
                    "session_id": session_id,
                }))

    except WebSocketDisconnect:
        logger.info(f"WebSocket disconnected for session: {session_id}")
```

#### `backend/agents/questionnaire_agent.py` - LangGraph State Definition
```python
from typing import Annotated, Any, Dict, List, TypedDict
from langgraph.graph import StateGraph, add_messages
from langgraph.checkpoint.memory import MemorySaver

class ConversationState(TypedDict):
    """LangGraph state schema for conversation flow"""
    messages: Annotated[List[Any], add_messages]
    user_id: str

class ConversationAgent:
    def __init__(self):
        self.tools = tools_node.get_tools()
        self.llm = get_llm_for_agent("questionnaire_agent", agent_configs, self.tools)
        self.memory = MemorySaver()
        self.graph = self._build_graph()

    def _build_graph(self) -> StateGraph:
        """Build LangGraph workflow with streaming support"""
        workflow = StateGraph(ConversationState)
        
        workflow.add_node("agent", self.post_model)
        workflow.add_node("tools", ToolNode(self.tools))
        
        workflow.set_entry_point("agent")
        workflow.add_conditional_edges(
            "agent",
            self._should_continue,
            {"tools": "tools", "end": END},
        )
        workflow.add_edge("tools", "agent")
        
        return workflow.compile(checkpointer=self.memory)

    def post_model(self, state: ConversationState) -> Dict[str, Any]:
        """Agent execution with memory integration"""
        messages = state["messages"]
        user_id = state["user_id"]
        
        # Add system prompt with memory context
        system_message = SystemMessage(content=self.system_prompt)
        full_messages = [system_message] + messages
        
        # Call LLM with streaming support
        ai_message = self.llm.invoke(full_messages)
        return {"messages": [ai_message]}
```

#### `backend/models/schemas.py` - WebSocket Message Types
```python
from pydantic import BaseModel
from datetime import datetime
from typing import Optional, Dict, Any

class StreamingToken(BaseModel):
    type: str = "token"
    content: str
    message_id: str
    session_id: Optional[str] = None

class StreamingEnd(BaseModel):
    type: str = "end"
    message_id: str
    session_id: Optional[str] = None
    final_content: str

class ConnectionStatus(BaseModel):
    type: str = "connection" 
    status: str
    session_id: str
    timestamp: datetime
```

### Complete Frontend Implementation

#### `frontend/src/hooks/useWebSocket.ts` - React WebSocket Hook
```typescript
export const useWebSocket = (websocketUrl: string, userId: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const initializeWebSocket = useCallback(async () => {
    wsServiceRef.current = new WebSocketService(websocketUrl, sessionId, userId);
    
    // Handle incoming messages
    wsServiceRef.current.onMessage((message: WebSocketMessage) => {
      switch (message.type) {
        case 'token':
          // Accumulate streaming tokens
          setMessages(prev => {
            const existingIndex = prev.findIndex(m => m.id === message.message_id);
            if (existingIndex >= 0) {
              const updated = [...prev];
              updated[existingIndex].content += message.content;
              return updated;
            } else {
              return [...prev, {
                id: message.message_id,
                content: message.content,
                role: 'assistant',
                timestamp: new Date(),
                isStreaming: true
              }];
            }
          });
          break;
          
        case 'end':
          // Mark streaming complete and parse questions
          setMessages(prev => prev.map(msg => {
            if (msg.id === message.message_id) {
              const finalContent = message.final_content;
              let questionData = undefined;
              
              // Parse embedded questions with %{JSON} pattern
              if (finalContent.includes('%{')) {
                try {
                  const jsonStart = finalContent.indexOf('%{');
                  const jsonPart = finalContent.substring(jsonStart + 1);
                  questionData = JSON.parse(jsonPart);
                } catch (e) {
                  console.log('Failed to parse question JSON:', e);
                }
              }
              
              return { 
                ...msg, 
                isStreaming: false, 
                content: finalContent,
                questionData
              };
            }
            return msg;
          }));
          break;
      }
    });
  }, [websocketUrl, userId]);

  return { messages, sendMessage, isConnected, isLoading };
};
```

#### `frontend/src/components/ChatInterface.tsx` - Main Chat Component
```typescript
export const ChatInterface: React.FC<ChatInterfaceProps> = ({ websocketUrl, userId }) => {
  const {
    messages,
    sendMessage,
    isConnected,
    isLoading,
    handleQuestionAnswer
  } = useWebSocket(websocketUrl, userId);

  return (
    <div className="flex flex-col h-full">
      {/* Connection Status Header */}
      <div className="ios-header">
        <div className="flex items-center justify-between">
          <h2>Conversational Agent</h2>
          <span className={`status ${isConnected ? 'connected' : 'disconnected'}`}>
            {isConnected ? 'Online' : 'Offline'}
          </span>
        </div>
      </div>

      {/* Streaming Messages */}
      <div className="flex-1 overflow-y-auto">
        {messages.map((message) => (
          <MessageStream 
            key={message.id} 
            message={message} 
            onQuestionAnswer={handleQuestionAnswer}
          />
        ))}
      </div>

      {/* Message Input */}
      <MessageInput
        onSendMessage={sendMessage}
        disabled={!isConnected || isLoading}
      />
    </div>
  );
};
```

### Static File Serving Setup
```python
# FastAPI static file mounting for SPA
FRONTEND_BUILD_DIR = Path(__file__).parent.parent / "frontend" / "dist"

if FRONTEND_BUILD_DIR.exists():
    # Mount static assets
    app.mount("/assets", StaticFiles(directory=FRONTEND_BUILD_DIR / "assets"), name="static")
    
    # Serve React app for root route
    @app.get("/", response_class=HTMLResponse)
    async def serve_frontend():
        index_file = FRONTEND_BUILD_DIR / "index.html"
        return HTMLResponse(content=index_file.read_text())
    
    # Catch-all route for React Router (MUST be last!)
    @app.get("/{path:path}", response_class=HTMLResponse)
    async def serve_frontend_routes(path: str):
        if path.startswith(("api", "ws", "test", "docs", "redoc")):
            raise HTTPException(status_code=404)
        
        index_file = FRONTEND_BUILD_DIR / "index.html"
        return HTMLResponse(content=index_file.read_text())
```

### Question Rendering System Implementation
```typescript
// Frontend question parsing and rendering
const parseQuestionFromContent = (content: string) => {
  if (content.includes('%{')) {
    try {
      const jsonStart = content.indexOf('%{');
      const jsonPart = content.substring(jsonStart + 1); // Remove '%' prefix
      return JSON.parse(jsonPart);
    } catch (e) {
      return null;
    }
  }
  return null;
};

// Example question format: %{"type": "SINGLE_SELECT", "question": "How are you?", "options": ["Good", "Bad"]}
```

## LangGraph Streaming Best Practices

### Using `astream_events` for Real-time Streaming
```python
async for event in agent.graph.astream_events(state, config, version="v1"):
    if event["event"] == "on_chat_model_stream":
        chunk = event["data"]["chunk"]
        if hasattr(chunk, "content") and chunk.content:
            await websocket.send_text(json.dumps({
                "type": "token",
                "content": chunk.content
            }))
```

### Multi-Agent Configuration with Metadata
```python
config = {
    "configurable": {
        "thread_id": user_id,
        "agent_name": "questionnaire_agent"
    }
}
```

### Stream Event Types
- **`on_chat_model_stream`**: Real-time LLM token streaming
- **`on_tool_start/end`**: Tool execution boundaries  
- **`on_agent_finish`**: Agent completion signals

This scaffolding guide provides complete implementation examples for building sophisticated conversational AI applications with real-time streaming using LangGraph's `astream_events`, WebSocket integration, React frontend with token accumulation, and question rendering system.