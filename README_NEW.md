# Technical-Support-RAG

**Enterprise-ready AI-powered Technical Support Assistant Platform**

A full-stack multi-service application featuring role-based access control, organization management, audit logging, and RAG-powered AI responses.

---

## 🎯 What This Project Does

This platform provides:

- **🤖 AI-Powered Support:** RAG (Retrieval-Augmented Generation) for intelligent, context-aware responses
- **👥 Multi-Tenancy:** Organization-level data isolation with role-based access
- **🔐 Enterprise Security:** JWT authentication, firewall controls, IP blocking, audit trails
- **💬 Real-Time Chat:** Persistent conversation history with AI assistant integration
- **📊 Admin Dashboard:** User management, analytics, system configuration
- **📁 Document Management:** Secure file upload/download with access controls
- **📝 Audit Logging:** Complete activity tracking for compliance

---

## 🏗️ Architecture

### **Three-Service Architecture**

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│  Frontend   │────────▶│   Backend   │────────▶│  Pipeline   │
│  (Kelo UI)  │  HTTP   │   (API)     │  HTTP   │    (RAG)    │
│  Port 7878  │         │  Port 5000  │         │  Port 8000  │
└─────────────┘         └──────┬──────┘         └──────┬──────┘
                               │                        │
                               ▼                        ▼
                        ┌─────────────┐         ┌─────────────┐
                        │   MongoDB   │         │  ChromaDB   │
                        │             │         │  + Models   │
                        └─────────────┘         └─────────────┘
```

### **Technology Stack**

| Layer        | Technologies                                                          |
| ------------ | --------------------------------------------------------------------- |
| **Frontend** | React 19, TypeScript, Vite, TanStack Router, Tailwind CSS v4, Zustand |
| **Backend**  | Express.js, TypeScript, MongoDB, Mongoose, JWT, Bcrypt                |
| **AI/RAG**   | FastAPI, Python, ChromaDB, SentenceTransformers, TinyLlama, PyTorch   |
| **Security** | Helmet, CORS, Rate Limiting, IP Blocking, RBAC, Audit Logs            |

---

## 🚀 Quick Start

### **Prerequisites**

Install these before setup:

| Software           | Version | Download                                                      |
| ------------------ | ------- | ------------------------------------------------------------- |
| **Node.js**        | 18+     | [nodejs.org](https://nodejs.org/)                             |
| **Python**         | 3.10+   | [python.org](https://www.python.org/)                         |
| **MongoDB**        | 6+      | [mongodb.com](https://www.mongodb.com/try/download/community) |
| **Git**            | Latest  | [git-scm.com](https://git-scm.com/)                           |
| **Bun** (Optional) | Latest  | [bun.sh](https://bun.sh/)                                     |

**System Requirements:**

- RAM: 8 GB+ (for AI model loading)
- Disk: 5 GB+ (for models and dependencies)
- Internet: Required for first-time model downloads

### **Installation**

#### **Step 1: Clone Repository**

```bash
git clone https://github.com/AMOHAMMEDIMRAN/Technical-Support-RAG.git
cd Technical-Support-RAG
```

#### **Step 2: Run Setup Script**

**Windows:**

```cmd
setup.bat
```

**Linux/Mac:**

```bash
chmod +x setup.sh
./setup.sh
```

This single command will:

- ✅ Install all frontend dependencies (Kelo UI)
- ✅ Install all backend dependencies (API)
- ✅ Create Python virtual environment
- ✅ Install all pipeline dependencies (RAG)
- ✅ Validate installations

#### **Step 3: Configure Environment**

**Backend Configuration:**

```cmd
cd backend
copy .env.example .env  # Windows
# or: cp .env.example .env  # Linux/Mac
```

Edit `backend/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/tech-support-assistant
JWT_SECRET=your-super-secret-key-change-this
ADMIN_EMAIL=admin123@gmail.com
ADMIN_PASSWORD=admin123
AI_ENGINE_URL=http://localhost:8000
ALLOWED_ORIGINS=http://localhost:7878
```

**Frontend Configuration:**

```cmd
cd kelo_ui
copy .env.example .env  # Windows
# or: cp .env.example .env  # Linux/Mac
```

Edit `kelo_ui/.env`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_RAG_API_BASE_URL=http://127.0.0.1:8000
```

#### **Step 4: Start MongoDB**

```bash
# Start MongoDB service
mongod

# Or as a service:
net start MongoDB  # Windows
sudo systemctl start mongod  # Linux
brew services start mongodb-community  # Mac
```

#### **Step 5: Start All Services**

**Windows:**

```cmd
start.bat
```

**Linux/Mac:**

```bash
chmod +x start.sh
./start.sh
```

This will open three terminal windows:

- 🔵 Frontend (port 7878)
- 🟣 Backend (port 5000)
- 🟢 Pipeline (port 8000)

#### **Step 6: Access the Application**

Open your browser to: **http://localhost:7878**

**Default Login Credentials:**

- **Email:** `admin123@gmail.com`
- **Password:** `admin123`

⚠️ **Important:** Change these credentials immediately after first login!

---

## 📁 Project Structure

```
Technical-Support-RAG/
│
├── backend/                    # Express.js API Server
│   ├── src/
│   │   ├── index.ts           # Entry point
│   │   ├── config/            # Configuration management
│   │   ├── models/            # MongoDB schemas
│   │   ├── controllers/       # Request handlers
│   │   ├── routes/            # API endpoints
│   │   ├── middleware/        # Auth, RBAC, validation
│   │   ├── firewall/          # IP/User blocking
│   │   └── utils/             # Helpers
│   ├── .env                   # Environment variables
│   └── package.json           # Dependencies
│
├── kelo_ui/                   # React Frontend
│   ├── src/
│   │   ├── main.tsx           # Entry point
│   │   ├── App.tsx            # Root component
│   │   ├── routes/            # Page routes
│   │   ├── components/        # UI components
│   │   ├── infrastructure/    # API clients
│   │   └── presentation/      # Views & stores
│   ├── .env                   # Environment variables
│   ├── vite.config.ts         # Vite configuration
│   └── package.json           # Dependencies
│
├── pipeline/                  # Python RAG Service
│   ├── main.py                # FastAPI app
│   ├── data/
│   │   ├── Project.csv        # Knowledge base
│   │   └── chroma/            # Vector database
│   ├── requirements.txt       # Python packages
│   └── venv/                  # Virtual environment
│
├── firewall/                  # Firewall Configuration
│   └── config.json            # Blocking rules
│
├── setup.bat                  # Windows setup script
├── setup.sh                   # Linux/Mac setup script
├── start.bat                  # Windows startup script
├── start.sh                   # Linux/Mac startup script
├── package.json               # Root npm scripts
├── README.md                  # This file
├── QUICK_START.md             # Quick start guide
├── DEV_SETUP.md               # Development setup
└── FILE_STRUCTURE.md          # Complete file documentation
```

---

## 🔑 Key Features

### **1. Authentication & Authorization**

- JWT-based authentication
- 7 role types: SUPER_ADMIN, CEO, MANAGER, DEVELOPER, SUPPORT, HR, FINANCE
- Organization-level data isolation
- Password hashing with bcrypt
- Automatic admin user creation on first run

### **2. RAG-Powered AI Assistant**

- SentenceTransformers embeddings (BAAI/bge-small-en-v1.5)
- ChromaDB for vector storage and retrieval
- TinyLlama for response generation
- Context-aware answers from project knowledge base
- Configurable retrieval parameters

### **3. Chat Management**

- Persistent conversation history
- Real-time AI responses
- Message threading
- Chat archiving
- Search and filtering

### **4. Organization Management**

- Multi-tenant architecture
- Custom organization settings
- User quotas and limits
- Feature toggles per organization

### **5. User Management**

- CRUD operations for users
- Role assignment
- Status management (Active/Inactive/Suspended)
- Last login tracking
- Bulk operations

### **6. Document Management**

- Secure file upload/download
- Access control (Public, Role-based, Private)
- Metadata tagging
- File type restrictions
- Size limits

### **7. Audit Logging**

- Automatic activity tracking
- Action types: CREATE, READ, UPDATE, DELETE, LOGIN, LOGOUT
- IP address and user agent capture
- Searchable and filterable logs
- Compliance-ready

### **8. Firewall & Security**

- IP address blocking
- User blocking
- Path-based access control
- Rate limiting (100 requests per 15 minutes)
- Bypass rules for health checks
- Security headers (Helmet.js)

---

## 📡 API Endpoints

### **Base URL:** `http://localhost:5000/api`

| Category     | Method         | Endpoint                         | Auth | Description                    |
| ------------ | -------------- | -------------------------------- | ---- | ------------------------------ |
| **Health**   | GET            | `/health`                        | ❌   | Service health check           |
| **Auth**     | POST           | `/auth/login`                    | ❌   | User login                     |
| **Auth**     | GET            | `/auth/profile`                  | ✅   | Get user profile               |
| **Auth**     | PUT            | `/auth/profile`                  | ✅   | Update profile                 |
| **Auth**     | POST           | `/auth/change-password`          | ✅   | Change password                |
| **Users**    | GET/POST       | `/users`                         | ✅   | List/Create users              |
| **Users**    | GET/PUT/DELETE | `/users/:id`                     | ✅   | User CRUD                      |
| **Users**    | PATCH          | `/users/:id/toggle-status`       | ✅   | Enable/Disable user            |
| **Orgs**     | GET/POST       | `/organizations`                 | ✅   | List/Create orgs               |
| **Orgs**     | GET            | `/organizations/my-organization` | ✅   | Get user's org                 |
| **Chats**    | GET/POST       | `/chats`                         | ✅   | List/Create chats              |
| **Chats**    | POST           | `/chats/:id/messages`            | ✅   | Send message & get AI response |
| **Chats**    | PATCH          | `/chats/:id/archive`             | ✅   | Archive chat                   |
| **Docs**     | GET/POST       | `/documents`                     | ✅   | List/Upload docs               |
| **Docs**     | GET            | `/documents/:id/download`        | ✅   | Download file                  |
| **Audit**    | GET            | `/audit-logs`                    | ✅   | List logs (admin)              |
| **Audit**    | GET            | `/audit-logs/my-logs`            | ✅   | User's logs                    |
| **Firewall** | GET/PUT        | `/firewall/config`               | ✅   | Manage rules                   |
| **Firewall** | POST/DELETE    | `/firewall/blocked-ips/:ip`      | ✅   | Block/Unblock IP               |

### **Pipeline Endpoints**

**Base URL:** `http://localhost:8000`

| Method | Endpoint        | Description                  |
| ------ | --------------- | ---------------------------- |
| GET    | `/`             | Health check                 |
| POST   | `/ask`          | Ask question, get RAG answer |
| POST   | `/load_project` | Reload knowledge base        |
| GET    | `/stats`        | Service statistics           |
| GET    | `/docs`         | OpenAPI documentation        |

---

## 🛠️ Development

### **NPM Scripts (Root)**

```bash
npm run setup        # Install all dependencies
npm run dev          # Run all services with concurrently
```

### **Backend Scripts**

```bash
cd backend
npm run dev          # Start dev server with hot reload
npm run build        # Compile TypeScript
npm run start        # Run compiled code
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
npm run seed         # Seed admin user manually
```

### **Frontend Scripts**

```bash
cd kelo_ui
npm run dev          # Start Vite dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### **Pipeline Commands**

```bash
cd pipeline
source venv/bin/activate  # Linux/Mac
# or: venv\Scripts\activate  # Windows

uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

---

## 📚 Documentation

- **[QUICK_START.md](QUICK_START.md)** - Beginner-friendly setup guide
- **[DEV_SETUP.md](DEV_SETUP.md)** - Detailed development setup
- **[FILE_STRUCTURE.md](FILE_STRUCTURE.md)** - Complete file documentation
- **[SETUP_COMPLETE.md](SETUP_COMPLETE.md)** - Post-setup guide

---

## 🔧 Troubleshooting

### **Backend Won't Start**

```bash
# Check MongoDB is running
mongosh

# Check .env file exists
ls backend/.env  # Linux/Mac
dir backend\.env  # Windows

# Reinstall dependencies
cd backend
rm -rf node_modules package-lock.json
npm install
```

### **Frontend Won't Start**

```bash
# Check if port 7878 is free
lsof -ti:7878 | xargs kill  # Linux/Mac
netstat -ano | findstr :7878  # Windows

# Reinstall dependencies
cd kelo_ui
rm -rf node_modules
bun install  # or: npm install
```

### **Pipeline Won't Start**

```bash
# Reinstall Python packages
cd pipeline
rm -rf venv
python -m venv venv
source venv/bin/activate  # Linux/Mac
# venv\Scripts\activate  # Windows
pip install --upgrade pip
pip install -r requirements.txt
```

### **Port Already in Use**

Change ports in configuration:

- Frontend: Edit `kelo_ui/vite.config.ts` (port: 7878)
- Backend: Edit `backend/.env` (PORT=5000)
- Pipeline: Use `--port 8001` flag

### **MongoDB Connection Error**

```bash
# Check MongoDB is running
sudo systemctl status mongod  # Linux
net start MongoDB  # Windows

# Check connection string in backend/.env
MONGODB_URI=mongodb://localhost:27017/tech-support-assistant
```

---

## 🚢 Production Deployment

### **Security Checklist**

- [ ] Change default admin credentials
- [ ] Set strong JWT_SECRET (32+ characters)
- [ ] Update ALLOWED_ORIGINS for your domain
- [ ] Enable HTTPS/TLS
- [ ] Set NODE_ENV=production
- [ ] Configure MongoDB authentication
- [ ] Set up backup strategy
- [ ] Enable MongoDB replication
- [ ] Configure firewall rules
- [ ] Set up monitoring and alerts
- [ ] Review rate limiting settings
- [ ] Implement log rotation

### **Environment Variables (Production)**

```env
# Backend
NODE_ENV=production
HOST=0.0.0.0
PORT=5000
MONGODB_URI=mongodb://user:pass@host:27017/dbname?authSource=admin
JWT_SECRET=<64-character-random-string>
ALLOWED_ORIGINS=https://yourdomain.com
```

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Authors

**AMOHAMMEDIMRAN**

- GitHub: [@AMOHAMMEDIMRAN](https://github.com/AMOHAMMEDIMRAN)
- Repository: [Technical-Support-RAG](https://github.com/AMOHAMMEDIMRAN/Technical-Support-RAG)

---

## 🙏 Acknowledgments

- **React Team** - React 19
- **Vite Team** - Lightning-fast build tool
- **FastAPI** - Modern Python web framework
- **ChromaDB** - Vector database
- **Hugging Face** - Pre-trained models
- **MongoDB** - Database solution

---

## 📞 Support

For issues, questions, or suggestions:

- **Issues:** [GitHub Issues](https://github.com/AMOHAMMEDIMRAN/Technical-Support-RAG/issues)
- **Documentation:** See docs/ folder
- **Email:** Contact through GitHub profile

---

**Made with ❤️ for enterprise technical support teams**
