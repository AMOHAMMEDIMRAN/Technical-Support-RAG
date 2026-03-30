# 📦 Complete Project File Structure

This document details every important file and directory in the Technical Support RAG project.

## 📁 Root Directory

```
Technical-Support-RAG/
├── backend/                 # Node.js/Express API Server
├── kelo_ui/                # React Frontend Application
├── pipeline/               # Python FastAPI RAG Service
├── firewall/               # Firewall Configuration
├── .git/                   # Git Repository Data
├── .gitignore             # Git Ignore Rules
├── package.json           # Root NPM Configuration
├── README.md              # Main Documentation
├── QUICK_START.md         # Quick Start Guide
├── DEV_SETUP.md           # Development Setup Guide
├── SETUP_COMPLETE.md      # Setup Completion Guide
├── setup.bat              # Windows Setup Script
├── setup.sh               # Linux/Mac Setup Script
├── start.bat              # Windows Startup Script
└── start.sh               # Linux/Mac Startup Script
```

---

## 🔵 Backend Service (`backend/`)

### **Configuration Files**

| File                    | Purpose                                                | Required    |
| ----------------------- | ------------------------------------------------------ | ----------- |
| **`.env`**              | Environment variables (MongoDB URI, JWT secret, ports) | ✅ YES      |
| **`.env.example`**      | Template for environment variables                     | ✅ YES      |
| **`package.json`**      | Node.js dependencies and scripts                       | ✅ YES      |
| **`package-lock.json`** | Locked dependency versions                             | ✅ YES      |
| **`tsconfig.json`**     | TypeScript compiler configuration                      | ✅ YES      |
| **`bun.lock`**          | Bun package manager lockfile                           | 📦 Optional |
| **`.gitignore`**        | Files to ignore in git                                 | ✅ YES      |

### **Source Code Structure**

```
backend/src/
├── index.ts                    # ⚡ Main entry point
├── config/
│   ├── index.ts               # Configuration management
│   └── database.ts            # Database connection setup
├── database/
│   ├── index.ts               # Database initialization
│   └── seed.ts                # Admin user seeding
├── models/
│   ├── User.ts                # User schema (with password hashing)
│   ├── Organization.ts        # Organization/tenant schema
│   ├── Chat.ts                # Chat & messages schema
│   ├── Document.ts            # Document metadata schema
│   └── AuditLog.ts            # Audit trail schema
├── controllers/
│   ├── authController.ts      # Login, profile, password
│   ├── userController.ts      # User management CRUD
│   ├── organizationController.ts  # Organization CRUD
│   ├── chatController.ts      # Chat & messaging + RAG
│   ├── documentController.ts  # Document upload/download
│   ├── auditLogController.ts  # Audit log queries
│   └── firewallController.ts  # Firewall management
├── routes/
│   ├── index.ts               # Route aggregator
│   ├── authRoutes.ts          # Auth endpoints
│   ├── userRoutes.ts          # User endpoints
│   ├── organizationRoutes.ts  # Organization endpoints
│   ├── chatRoutes.ts          # Chat endpoints
│   ├── documentRoutes.ts      # Document endpoints
│   ├── auditLogRoutes.ts      # Audit log endpoints
│   └── firewallRoutes.ts      # Firewall endpoints
├── middleware/
│   ├── auth.ts                # JWT authentication
│   ├── rbac.ts                # Role-based access control
│   ├── validation.ts          # Request validation
│   ├── errorHandler.ts        # Error handling
│   ├── notFound.ts            # 404 handler
│   └── auditLog.ts            # Audit logging middleware
├── firewall/
│   ├── index.ts               # Firewall exports
│   ├── service.ts             # Firewall logic
│   └── middleware.ts          # Request filtering
├── types/
│   ├── index.ts               # Type exports
│   ├── user.ts                # User types & enums
│   ├── organization.ts        # Organization types
│   ├── chat.ts                # Chat types
│   ├── document.ts            # Document types
│   ├── auditLog.ts            # Audit log types
│   └── firewall.ts            # Firewall types
└── utils/
    ├── jwt.ts                 # JWT token utilities
    ├── pagination.ts          # Pagination helpers
    └── response.ts            # API response formatters
```

### **Essential Backend Files**

| File                                    | What It Does                                                       | Why It's Needed     |
| --------------------------------------- | ------------------------------------------------------------------ | ------------------- |
| **`src/index.ts`**                      | Starts Express server, initializes middleware, connects to MongoDB | Entry point         |
| **`src/config/index.ts`**               | Loads environment variables (PORT, MongoDB URI, JWT secret)        | Configuration       |
| **`src/database/index.ts`**             | Connects to MongoDB using Mongoose                                 | Database connection |
| **`src/database/seed.ts`**              | Creates default admin user on first run                            | Initial setup       |
| **`src/models/User.ts`**                | Defines user schema with password hashing                          | User data           |
| **`src/models/Chat.ts`**                | Stores conversations and messages                                  | Chat history        |
| **`src/controllers/chatController.ts`** | Handles chat creation and RAG integration                          | AI responses        |
| **`src/middleware/auth.ts`**            | Verifies JWT tokens for protected routes                           | Security            |
| **`src/firewall/middleware.ts`**        | Blocks IPs/users based on firewall rules                           | Access control      |

---

## 🟣 Frontend Service (`kelo_ui/`)

### **Configuration Files**

| File                     | Purpose                                 | Required    |
| ------------------------ | --------------------------------------- | ----------- |
| **`.env`**               | API URLs (backend & pipeline endpoints) | ✅ YES      |
| **`.env.example`**       | Template for environment variables      | ✅ YES      |
| **`package.json`**       | React dependencies and scripts          | ✅ YES      |
| **`package-lock.json`**  | Locked dependency versions              | ✅ YES      |
| **`tsconfig.json`**      | Base TypeScript configuration           | ✅ YES      |
| **`tsconfig.app.json`**  | App-specific TS config                  | ✅ YES      |
| **`tsconfig.node.json`** | Node tools TS config                    | ✅ YES      |
| **`vite.config.ts`**     | Vite bundler settings (port 7878)       | ✅ YES      |
| **`components.json`**    | Shadcn UI component registry            | ✅ YES      |
| **`eslint.config.js`**   | Linting rules                           | 📦 Optional |
| **`index.html`**         | HTML entry point                        | ✅ YES      |
| **`.gitignore`**         | Files to ignore in git                  | ✅ YES      |
| **`bun.lock`**           | Bun package lockfile                    | 📦 Optional |

### **Source Code Structure**

```
kelo_ui/src/
├── main.tsx                   # ⚡ React DOM entry point
├── App.tsx                    # Root component with routing
├── index.css                  # Global styles
├── routes/
│   ├── root.tsx              # Root layout
│   ├── chatRoute.tsx         # Chat interface
│   ├── dashboardRoute.tsx    # Admin dashboard
│   └── ... (other routes)
├── components/
│   ├── ui/                   # Base UI components (buttons, cards, etc.)
│   └── ... (feature components)
├── core/
│   └── domain/
│       ├── types.ts          # Domain types & interfaces
│       └── enums.ts          # Enumerations
├── infrastructure/
│   ├── api/
│   │   ├── client.ts         # Axios HTTP client
│   │   ├── auth.service.ts   # Authentication API calls
│   │   ├── chat.service.ts   # Chat API calls
│   │   ├── user.service.ts   # User API calls
│   │   └── ... (other services)
│   └── config/
│       └── api.config.ts     # API base URLs
├── presentation/
│   ├── stores/
│   │   └── authStore.ts      # Zustand auth state
│   ├── hooks/
│   │   └── useAuthInit.ts    # Auth initialization
│   ├── layouts/
│   │   └── MainLayout.tsx    # Main app layout
│   ├── views/
│   │   ├── chat/             # Chat views
│   │   ├── dashboard/        # Dashboard views
│   │   └── auth/             # Auth views
│   └── theme/
│       └── ThemeProvider.tsx # Dark/light theme
├── hooks/
│   └── ... (custom hooks)
└── lib/
    └── utils.ts              # Utility functions
```

### **Essential Frontend Files**

| File                                          | What It Does                               | Why It's Needed    |
| --------------------------------------------- | ------------------------------------------ | ------------------ |
| **`src/main.tsx`**                            | Mounts React app to DOM                    | Entry point        |
| **`src/App.tsx`**                             | Sets up routing and providers              | App structure      |
| **`src/infrastructure/api/client.ts`**        | Configures Axios with auth headers         | API communication  |
| **`src/infrastructure/config/api.config.ts`** | Defines backend & pipeline URLs            | Environment config |
| **`src/presentation/stores/authStore.ts`**    | Manages authentication state (user, token) | State management   |
| **`src/routes/chatRoute.tsx`**                | Chat interface component                   | Main feature       |
| **`vite.config.ts`**                          | Sets port to 7878, configures Tailwind     | Dev server         |

---

## 🟢 Pipeline Service (`pipeline/`)

### **Files**

| File                   | Purpose                                           | Required |
| ---------------------- | ------------------------------------------------- | -------- |
| **`main.py`**          | FastAPI app with RAG logic                        | ✅ YES   |
| **`requirements.txt`** | Python dependencies                               | ✅ YES   |
| **`.gitignore`**       | Files to ignore                                   | ✅ YES   |
| **`venv/`**            | Python virtual environment (created during setup) | ✅ YES   |

### **Data Directory**

```
pipeline/data/
├── Project.csv               # Knowledge base (project data)
└── chroma/                   # ChromaDB vector database (auto-created)
    ├── chroma.sqlite3
    └── ... (vector storage files)
```

### **Essential Pipeline Files**

| File                   | What It Does                                                | Why It's Needed |
| ---------------------- | ----------------------------------------------------------- | --------------- |
| **`main.py`**          | FastAPI server, loads models, handles `/ask` endpoint       | Core RAG engine |
| **`requirements.txt`** | Lists all Python packages (FastAPI, ChromaDB, Transformers) | Dependencies    |
| **`data/Project.csv`** | Source data to be embedded and searched                     | Knowledge base  |
| **`data/chroma/`**     | Persistent vector storage for embeddings                    | Search index    |

---

## 🔥 Firewall Service (`firewall/`)

### **Files**

| File              | Purpose                                    | Required |
| ----------------- | ------------------------------------------ | -------- |
| **`config.json`** | Firewall rules (blocked IPs, users, paths) | ✅ YES   |

### **Example `config.json` Structure**

```json
{
  "enabled": true,
  "blockedIps": ["192.168.1.100"],
  "blockedUsers": ["user-id-123"],
  "blockedPaths": [],
  "bypassPaths": ["/api/health", "/api/auth/login"],
  "rateLimiting": {
    "enabled": true,
    "maxRequests": 100,
    "windowMs": 900000
  }
}
```

---

## 📝 Environment Variables

### **Backend `.env`**

```env
# Server
HOST=0.0.0.0
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/tech-support-assistant

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-12345
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d

# Admin Credentials
ADMIN_EMAIL=admin123@gmail.com
ADMIN_PASSWORD=admin123

# AI Engine
AI_ENGINE_URL=http://localhost:8000

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads

# CORS
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:7878
CORS_ALLOW_PRIVATE_NETWORK_ORIGINS=true

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### **Frontend `.env`**

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_RAG_API_BASE_URL=http://127.0.0.1:8000
```

---

## 🔍 File Importance Legend

| Symbol      | Meaning                                     |
| ----------- | ------------------------------------------- |
| ✅ YES      | **Critical** - Must exist for app to work   |
| 📦 Optional | Can be generated or is environment-specific |
| 🔧 Dev      | Only needed for development                 |

---

## 📊 Dependency Summary

### **Backend**

- **Runtime:** Node.js 18+, MongoDB 6+
- **Key Packages:** Express, Mongoose, JWT, Bcrypt, Axios

### **Frontend**

- **Runtime:** Node.js 18+ or Bun
- **Key Packages:** React 19, Vite, TanStack Router, Axios, Zustand, Tailwind

### **Pipeline**

- **Runtime:** Python 3.10+
- **Key Packages:** FastAPI, Uvicorn, ChromaDB, SentenceTransformers, TinyLlama, PyTorch

---

## 🚀 Minimal Required Files for First Run

To get the app running, you MUST have:

1. **Backend**
   - `backend/.env` (from `.env.example`)
   - `backend/package.json` + dependencies installed
   - MongoDB running

2. **Frontend**
   - `kelo_ui/.env` (from `.env.example`)
   - `kelo_ui/package.json` + dependencies installed

3. **Pipeline**
   - `pipeline/requirements.txt` + dependencies installed
   - `pipeline/data/Project.csv` (sample data)
   - `pipeline/venv/` (virtual environment)

4. **Firewall**
   - `firewall/config.json` (auto-created if missing)

---

## 📦 Generated/Auto-Created Files

These files are created automatically and should be in `.gitignore`:

- `backend/node_modules/` - Node packages
- `backend/dist/` - Compiled TypeScript
- `kelo_ui/node_modules/` - Node packages
- `kelo_ui/dist/` - Built production files
- `pipeline/venv/` - Python virtual environment
- `pipeline/data/chroma/` - Vector database (created at runtime)
- `pipeline/__pycache__/` - Python cache

---

**Next:** See [README.md](README.md) for architecture overview and [QUICK_START.md](QUICK_START.md) for setup instructions.
