# Technical Support RAG System - Complete Project Documentation & Prompt

## 📄 Document Purpose

This document serves as a comprehensive prompt and documentation for recreating the **Technical Support RAG (Retrieval-Augmented Generation) System** - an enterprise-ready AI-powered technical support assistant platform. This documentation is designed for academic research papers, specifically for studies involving **Secure Technical RAG Support System Using 1-bit quantized LLMs**.

---

## 🎯 Project Overview

### What is This Project?

A **full-stack, multi-service enterprise application** that combines:

- **RAG (Retrieval-Augmented Generation)** for intelligent, context-aware AI responses
- **Multi-tenancy** with organization-level data isolation
- **Enterprise security** (JWT authentication, RBAC, firewall, audit trails)
- **Real-time chat interface** with persistent conversation history

### Key Innovation

This system demonstrates the practical application of **lightweight LLMs (TinyLlama 1.1B)** combined with **semantic search (SentenceTransformers + ChromaDB)** to create an efficient, deployable technical support solution that can run on consumer hardware.

---

## 🏗️ System Architecture

### High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                            TECHNICAL SUPPORT RAG SYSTEM                          │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  ┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐          │
│  │                 │      │                 │      │                 │          │
│  │    FRONTEND     │◄────►│     BACKEND     │◄────►│    PIPELINE     │          │
│  │    (Kelo UI)    │ HTTP │    (Express)    │ HTTP │    (FastAPI)    │          │
│  │                 │      │                 │      │                 │          │
│  │   Port: 7878    │      │   Port: 5000    │      │   Port: 8000    │          │
│  │                 │      │                 │      │                 │          │
│  └────────┬────────┘      └────────┬────────┘      └────────┬────────┘          │
│           │                        │                        │                    │
│           │                        │                        │                    │
│           ▼                        ▼                        ▼                    │
│  ┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐          │
│  │                 │      │                 │      │                 │          │
│  │   Browser       │      │    MongoDB      │      │   ChromaDB      │          │
│  │   (React SPA)   │      │   (User Data)   │      │   (Vectors)     │          │
│  │                 │      │                 │      │                 │          │
│  └─────────────────┘      └─────────────────┘      └────────┬────────┘          │
│                                                              │                    │
│                                                              ▼                    │
│                                                    ┌─────────────────┐          │
│                                                    │                 │          │
│                                                    │  ML Models      │          │
│                                                    │  - Embeddings   │          │
│                                                    │  - TinyLlama    │          │
│                                                    │                 │          │
│                                                    └─────────────────┘          │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### Three-Service Microservices Architecture

| Service      | Technology                        | Port | Responsibility                                  |
| ------------ | --------------------------------- | ---- | ----------------------------------------------- |
| **Frontend** | React 19 + TypeScript + Vite      | 7878 | User Interface, State Management                |
| **Backend**  | Express.js + TypeScript + MongoDB | 5000 | Authentication, Authorization, Data Persistence |
| **Pipeline** | FastAPI + Python + ChromaDB       | 8000 | RAG Processing, AI Generation                   |

---

## 📊 RAG Pipeline Architecture

### Detailed RAG Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              RAG PIPELINE FLOW                                   │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  ┌─────────────┐                                                                │
│  │   User      │                                                                │
│  │   Query     │                                                                │
│  └──────┬──────┘                                                                │
│         │                                                                        │
│         ▼                                                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐        │
│  │                    STEP 1: QUERY PREPROCESSING                       │        │
│  ├─────────────────────────────────────────────────────────────────────┤        │
│  │  • Clean and normalize text                                          │        │
│  │  • Check glossary for common terms (SaaS, DevOps, etc.)              │        │
│  │  • Build query variants (synonyms, stopword removal)                 │        │
│  │  • Extract definition terms if applicable                            │        │
│  └──────────────────────────────┬──────────────────────────────────────┘        │
│                                  │                                               │
│                                  ▼                                               │
│  ┌─────────────────────────────────────────────────────────────────────┐        │
│  │                    STEP 2: EMBEDDING GENERATION                      │        │
│  ├─────────────────────────────────────────────────────────────────────┤        │
│  │  Model: BAAI/bge-small-en-v1.5                                       │        │
│  │  • Convert query variants to dense vector embeddings                 │        │
│  │  • Normalize embeddings for cosine similarity                        │        │
│  │  • Generate multiple embeddings for query expansion                  │        │
│  └──────────────────────────────┬──────────────────────────────────────┘        │
│                                  │                                               │
│                                  ▼                                               │
│  ┌─────────────────────────────────────────────────────────────────────┐        │
│  │                    STEP 3: SEMANTIC RETRIEVAL                        │        │
│  ├─────────────────────────────────────────────────────────────────────┤        │
│  │  Database: ChromaDB (Persistent Vector Store)                        │        │
│  │  • Query vector database with top-K retrieval (K=12 candidates)      │        │
│  │  • Retrieve documents with metadata and distances                    │        │
│  │  • Merge results from multiple query variants                        │        │
│  └──────────────────────────────┬──────────────────────────────────────┘        │
│                                  │                                               │
│                                  ▼                                               │
│  ┌─────────────────────────────────────────────────────────────────────┐        │
│  │                    STEP 4: HYBRID RERANKING                          │        │
│  ├─────────────────────────────────────────────────────────────────────┤        │
│  │  Combined Score = 0.78 × Semantic + 0.22 × Lexical                   │        │
│  │  • Semantic Score: 1/(1 + distance) from embeddings                  │        │
│  │  • Lexical Score: Keyword overlap (BM25-inspired)                    │        │
│  │  • Select top-4 documents for context                                │        │
│  └──────────────────────────────┬──────────────────────────────────────┘        │
│                                  │                                               │
│                                  ▼                                               │
│  ┌─────────────────────────────────────────────────────────────────────┐        │
│  │                    STEP 5: CONTEXT CONSTRUCTION                      │        │
│  ├─────────────────────────────────────────────────────────────────────┤        │
│  │  • Format selected documents with source labels                      │        │
│  │  • Build structured prompt with context + question                   │        │
│  │  • Apply token truncation (max 2048 tokens)                          │        │
│  └──────────────────────────────┬──────────────────────────────────────┘        │
│                                  │                                               │
│                                  ▼                                               │
│  ┌─────────────────────────────────────────────────────────────────────┐        │
│  │                    STEP 6: LLM GENERATION                            │        │
│  ├─────────────────────────────────────────────────────────────────────┤        │
│  │  Model: TinyLlama/TinyLlama-1.1B-Chat-v1.0                           │        │
│  │  Parameters:                                                          │        │
│  │    • max_new_tokens: 96                                              │        │
│  │    • temperature: 0.2 (low for factual responses)                    │        │
│  │    • repetition_penalty: 1.1                                         │        │
│  │    • no_repeat_ngram_size: 3                                         │        │
│  └──────────────────────────────┬──────────────────────────────────────┘        │
│                                  │                                               │
│                                  ▼                                               │
│  ┌─────────────────────────────────────────────────────────────────────┐        │
│  │                    STEP 7: RESPONSE POST-PROCESSING                  │        │
│  ├─────────────────────────────────────────────────────────────────────┤        │
│  │  • Extract answer from generated text                                │        │
│  │  • Truncate to max 4 sentences for conciseness                       │        │
│  │  • Calculate confidence score (average combined scores)              │        │
│  │  • Apply strict grounding check (confidence > 0.25)                  │        │
│  └──────────────────────────────┬──────────────────────────────────────┘        │
│                                  │                                               │
│                                  ▼                                               │
│  ┌─────────────┐                                                                │
│  │   Final     │  Response includes: answer, context sources,                   │
│  │   Response  │  confidence score, grounding status                           │
│  └─────────────┘                                                                │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 📈 Performance Metrics & Evaluation Framework

### Key Metrics for RAG Evaluation

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           EVALUATION METRICS                                     │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────┐        │
│  │                    RETRIEVAL METRICS                                 │        │
│  ├─────────────────────────────────────────────────────────────────────┤        │
│  │                                                                       │        │
│  │  Precision@K = Relevant Retrieved / K                                │        │
│  │  Recall@K = Relevant Retrieved / Total Relevant                      │        │
│  │  MRR (Mean Reciprocal Rank) = 1/|Q| × Σ(1/rank_i)                    │        │
│  │  nDCG@K = DCG@K / IDCG@K                                             │        │
│  │                                                                       │        │
│  └─────────────────────────────────────────────────────────────────────┘        │
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────┐        │
│  │                    GENERATION METRICS                                │        │
│  ├─────────────────────────────────────────────────────────────────────┤        │
│  │                                                                       │        │
│  │  Faithfulness = Supported Claims / Total Claims                      │        │
│  │  Answer Relevancy = Semantic Similarity(Answer, Question)            │        │
│  │  Context Relevancy = Relevant Sentences / Total Context Sentences    │        │
│  │  Hallucination Rate = Unsupported Statements / Total Statements      │        │
│  │                                                                       │        │
│  └─────────────────────────────────────────────────────────────────────┘        │
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────┐        │
│  │                    SYSTEM METRICS                                    │        │
│  ├─────────────────────────────────────────────────────────────────────┤        │
│  │                                                                       │        │
│  │  Latency (E2E) = T_embedding + T_retrieval + T_generation            │        │
│  │  Throughput = Queries Processed / Time                               │        │
│  │  Memory Usage = Peak GPU/CPU Memory During Inference                 │        │
│  │  Token Efficiency = Useful Output Tokens / Total Generated Tokens    │        │
│  │                                                                       │        │
│  └─────────────────────────────────────────────────────────────────────┘        │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### Confidence Score Calculation

```
                    ┌─────────────────────────────────────────┐
                    │        CONFIDENCE CALCULATION            │
                    └─────────────────────────────────────────┘
                                        │
        ┌───────────────────────────────┼───────────────────────────────┐
        │                               │                               │
        ▼                               ▼                               ▼
┌───────────────┐               ┌───────────────┐               ┌───────────────┐
│   Semantic    │               │    Lexical    │               │   Combined    │
│    Score      │               │    Score      │               │    Score      │
├───────────────┤               ├───────────────┤               ├───────────────┤
│               │               │               │               │               │
│    1          │               │  |Q ∩ D|      │               │  0.78 × S +   │
│ ─────────     │               │  ───────      │               │  0.22 × L     │
│ 1 + distance  │               │   |Q|         │               │               │
│               │               │               │               │               │
└───────────────┘               └───────────────┘               └───────────────┘

Where:
  S = Semantic Score (embedding similarity)
  L = Lexical Score (keyword overlap)
  Q = Query tokens
  D = Document tokens
```

---

## 🔧 Technology Stack Details

### Frontend (Kelo UI)

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              FRONTEND STACK                                      │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  Framework:        React 19 (with Strict Mode)                                  │
│  Language:         TypeScript 5.9+                                              │
│  Build Tool:       Vite 7.x (ESBuild + Rollup)                                  │
│  Routing:          TanStack Router v1.x                                         │
│  State Management: Zustand v5.x (lightweight, no boilerplate)                   │
│  Styling:          Tailwind CSS v4 + tw-animate-css                             │
│  UI Components:    Radix UI primitives + shadcn/ui                              │
│  HTTP Client:      Axios with interceptors                                      │
│  Forms:            React Hook Form + Zod validation                             │
│  Charts:           Recharts 2.x                                                 │
│  Icons:            Lucide React                                                 │
│  Animations:       Framer Motion                                                │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### Backend (API Server)

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              BACKEND STACK                                       │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  Framework:        Express.js 4.x                                               │
│  Language:         TypeScript 5.x                                               │
│  Database:         MongoDB 6+ with Mongoose ODM                                 │
│  Authentication:   JWT (jsonwebtoken) with bcrypt hashing                       │
│  Validation:       express-validator                                            │
│  Security:         Helmet.js (HTTP headers), CORS, Rate Limiting                │
│  File Uploads:     Multer                                                       │
│  Logging:          Morgan (HTTP request logger)                                 │
│  Dev Server:       ts-node-dev (hot reload)                                     │
│                                                                                  │
│  Key Middleware:                                                                 │
│    • authenticate - JWT token verification                                       │
│    • requireRole - Role-based access control                                     │
│    • auditLogger - Activity tracking                                             │
│    • firewallMiddleware - IP/User blocking                                       │
│    • errorHandler - Global error handling                                        │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### Pipeline (RAG Engine)

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              PIPELINE STACK                                      │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  Framework:        FastAPI (async Python web framework)                         │
│  Server:           Uvicorn (ASGI server)                                        │
│  ML Framework:     PyTorch (CPU/CUDA support)                                   │
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────┐        │
│  │                      ML MODELS                                       │        │
│  ├─────────────────────────────────────────────────────────────────────┤        │
│  │                                                                       │        │
│  │  Embedding Model:                                                     │        │
│  │    Name: BAAI/bge-small-en-v1.5                                      │        │
│  │    Type: SentenceTransformer                                         │        │
│  │    Dimensions: 384                                                   │        │
│  │    Size: ~130MB                                                      │        │
│  │                                                                       │        │
│  │  Generation Model:                                                    │        │
│  │    Name: TinyLlama/TinyLlama-1.1B-Chat-v1.0                          │        │
│  │    Parameters: 1.1 Billion                                           │        │
│  │    Context Length: 2048 tokens                                       │        │
│  │    Size: ~2.2GB (FP16)                                               │        │
│  │                                                                       │        │
│  └─────────────────────────────────────────────────────────────────────┘        │
│                                                                                  │
│  Vector Database:  ChromaDB (persistent mode)                                   │
│  Data Processing:  Pandas (CSV loading and transformation)                      │
│  Schema:           Pydantic (request/response validation)                       │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 📁 Complete Project Structure

```
Technical-Support-RAG/
│
├── backend/                           # Express.js API Server
│   ├── src/
│   │   ├── index.ts                   # Application entry point
│   │   ├── config/
│   │   │   ├── index.ts               # Environment configuration
│   │   │   └── database.ts            # MongoDB connection
│   │   ├── models/
│   │   │   ├── User.ts                # User schema (email, password, role)
│   │   │   ├── Organization.ts        # Multi-tenant organization
│   │   │   ├── Chat.ts                # Conversation + messages
│   │   │   ├── Document.ts            # File uploads
│   │   │   └── AuditLog.ts            # Activity tracking
│   │   ├── controllers/
│   │   │   ├── authController.ts      # Login, logout, profile
│   │   │   ├── userController.ts      # User CRUD
│   │   │   ├── chatController.ts      # Chat + RAG integration
│   │   │   ├── organizationController.ts
│   │   │   ├── documentController.ts
│   │   │   ├── auditController.ts
│   │   │   └── firewallController.ts
│   │   ├── routes/
│   │   │   ├── index.ts               # Route aggregator
│   │   │   ├── authRoutes.ts
│   │   │   ├── userRoutes.ts
│   │   │   ├── chatRoutes.ts
│   │   │   ├── organizationRoutes.ts
│   │   │   ├── documentRoutes.ts
│   │   │   ├── auditRoutes.ts
│   │   │   └── firewallRoutes.ts
│   │   ├── middleware/
│   │   │   ├── auth.ts                # JWT authentication
│   │   │   ├── rbac.ts                # Role-based access control
│   │   │   ├── validation.ts          # Request validation
│   │   │   ├── auditLogger.ts         # Audit log creation
│   │   │   └── errorHandler.ts        # Global error handling
│   │   ├── firewall/
│   │   │   ├── service.ts             # Firewall config management
│   │   │   ├── middleware.ts          # Request filtering
│   │   │   └── types.ts
│   │   ├── database/
│   │   │   ├── index.ts               # Database initialization
│   │   │   └── seed.ts                # Admin user seeding
│   │   ├── types/
│   │   │   └── index.ts               # TypeScript interfaces
│   │   └── utils/
│   │       ├── jwt.ts                 # Token generation
│   │       ├── pagination.ts
│   │       └── response.ts
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
├── kelo_ui/                           # React Frontend
│   ├── src/
│   │   ├── main.tsx                   # Application entry
│   │   ├── App.tsx                    # Router setup
│   │   ├── index.css                  # Global styles (Tailwind)
│   │   ├── core/
│   │   │   └── domain/
│   │   │       └── types.ts           # Domain types
│   │   ├── infrastructure/
│   │   │   ├── api/
│   │   │   │   ├── client.ts          # Axios instance
│   │   │   │   ├── auth.service.ts
│   │   │   │   ├── chat.service.ts
│   │   │   │   ├── rag.service.ts
│   │   │   │   ├── user.service.ts
│   │   │   │   ├── organization.service.ts
│   │   │   │   └── firewall.service.ts
│   │   │   └── config/
│   │   │       └── api.config.ts      # API endpoints config
│   │   ├── presentation/
│   │   │   ├── stores/
│   │   │   │   └── authStore.ts       # Zustand auth state
│   │   │   ├── hooks/
│   │   │   │   └── useAuthInit.ts
│   │   │   ├── views/
│   │   │   │   ├── home/
│   │   │   │   ├── chatPanel/
│   │   │   │   │   └── ChatPanel.tsx  # Main chat interface
│   │   │   │   └── dashboard/
│   │   │   │       ├── DashboardPage.tsx
│   │   │   │       ├── DashboardOverview.tsx
│   │   │   │       ├── FirewallPage.tsx
│   │   │   │       ├── OrganizationView.tsx
│   │   │   │       └── SettingsPage.tsx
│   │   │   └── components/
│   │   │       ├── ui/                # shadcn/ui components
│   │   │       ├── common/
│   │   │       ├── features/
│   │   │       ├── layouts/
│   │   │       └── theme/
│   │   └── routes/
│   │       ├── root.tsx
│   │       ├── index.tsx
│   │       ├── chat.tsx
│   │       └── dashboardRoute.tsx
│   ├── .env.example
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
│
├── pipeline/                          # Python RAG Service
│   ├── main.py                        # FastAPI application (complete RAG logic)
│   ├── requirements.txt               # Python dependencies
│   ├── data/
│   │   ├── Project.csv                # Knowledge base (customizable)
│   │   └── chroma/                    # Persistent vector database
│   └── venv/                          # Python virtual environment
│
├── firewall/                          # Firewall Configuration
│   └── config.json                    # IP/User blocking rules
│
├── document/                          # Documentation
│   ├── QUICK_START.md
│   ├── DEV_SETUP.md
│   ├── FILE_STRUCTURE.md
│   ├── SETUP_COMPLETE.md
│   └── DOCUMENTATION_INDEX.md
│
├── setup/
│   ├── setup.bat                      # Windows setup script
│   └── setup.sh                       # Linux/Mac setup script
│
├── start/
│   ├── start.bat                      # Windows startup script
│   └── start.sh                       # Linux/Mac startup script
│
├── package.json                       # Root npm scripts
├── README.md
└── prompt.md                          # This file
```

---

## 🔐 Security Architecture

### Authentication & Authorization Flow

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                        SECURITY ARCHITECTURE                                     │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐       │
│  │   Client    │───►│  Firewall   │───►│  Rate Limit │───►│   Auth      │       │
│  │   Request   │    │  Check      │    │  (100/15m)  │    │  Middleware │       │
│  └─────────────┘    └─────────────┘    └─────────────┘    └──────┬──────┘       │
│                                                                    │             │
│                     ┌──────────────────────────────────────────────┘             │
│                     │                                                            │
│                     ▼                                                            │
│  ┌─────────────────────────────────────────────────────────────────────┐        │
│  │                      JWT TOKEN VERIFICATION                          │        │
│  ├─────────────────────────────────────────────────────────────────────┤        │
│  │  1. Extract Bearer token from Authorization header                   │        │
│  │  2. Verify signature with JWT_SECRET                                 │        │
│  │  3. Check token expiration (default: 7 days)                         │        │
│  │  4. Load user from database                                          │        │
│  │  5. Verify user status is ACTIVE                                     │        │
│  │  6. Attach user context to request                                   │        │
│  └──────────────────────────────┬──────────────────────────────────────┘        │
│                                  │                                               │
│                                  ▼                                               │
│  ┌─────────────────────────────────────────────────────────────────────┐        │
│  │                      ROLE-BASED ACCESS CONTROL                       │        │
│  ├─────────────────────────────────────────────────────────────────────┤        │
│  │                                                                       │        │
│  │  Role Hierarchy:                                                      │        │
│  │    SUPER_ADMIN (100) ► CEO (90) ► MANAGER (70) ► DEVELOPER (50)      │        │
│  │                                  ↓                                    │        │
│  │                            SUPPORT (50)                               │        │
│  │                               HR (50)                                 │        │
│  │                           FINANCE (50)                                │        │
│  │                                                                       │        │
│  │  Access Rules:                                                        │        │
│  │    • SUPER_ADMIN: Full system access, cross-organization              │        │
│  │    • CEO: Organization admin, user management                         │        │
│  │    • MANAGER: Team management, limited admin                          │        │
│  │    • Others: Standard user access, chat, documents                    │        │
│  │                                                                       │        │
│  └─────────────────────────────────────────────────────────────────────┘        │
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────┐        │
│  │                      ORGANIZATION ISOLATION                          │        │
│  ├─────────────────────────────────────────────────────────────────────┤        │
│  │  • All data queries filter by organizationId                          │        │
│  │  • Users can only access their organization's data                   │        │
│  │  • SUPER_ADMIN can access all organizations                          │        │
│  │  • Cross-organization access is strictly forbidden                   │        │
│  └─────────────────────────────────────────────────────────────────────┘        │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### Firewall System

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           FIREWALL SYSTEM                                        │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  Features:                                                                       │
│    • IP Address Blocking (blockedIps array)                                     │
│    • IP Allowlist (allowedIps - if set, only these IPs allowed)                 │
│    • User-Agent Blocking (blockedUserAgents)                                    │
│    • Path Blocking (blockedPaths - e.g., /api/admin)                            │
│    • Bypass Paths (bypassPaths - e.g., /api/health, /api/auth/login)            │
│    • User Blocking (blockedUsers - by userId or email)                          │
│    • Custom Block Message                                                        │
│    • Modes: "laptop" (development) or "server" (production)                     │
│                                                                                  │
│  Configuration (firewall/config.json):                                          │
│  {                                                                               │
│    "enabled": true,                                                              │
│    "mode": "laptop",                                                             │
│    "blockedIps": [],                                                             │
│    "allowedIps": [],                                                             │
│    "blockedUserAgents": [],                                                      │
│    "blockedPaths": ["/api/firewall"],                                           │
│    "bypassPaths": ["/api/health", "/api/auth/login"],                           │
│    "blockedUsers": [],                                                           │
│    "customBlockMessage": "Access denied by firewall policy"                     │
│  }                                                                               │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 📝 Data Models

### User Model

```typescript
interface User {
  _id: ObjectId;
  email: string; // Unique, lowercase, validated
  password: string; // Bcrypt hashed (select: false)
  firstName: string;
  lastName: string;
  role: UserRole; // SUPER_ADMIN | CEO | MANAGER | DEVELOPER | SUPPORT | HR | FINANCE
  status: UserStatus; // ACTIVE | INACTIVE | SUSPENDED
  organizationId?: string; // Reference to Organization
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

### Organization Model

```typescript
interface Organization {
  _id: ObjectId;
  name: string; // Unique organization name
  domain: string; // Unique domain identifier
  adminUserId: string; // Reference to admin User
  settings: {
    maxUsers: number; // Default: 50
    allowedRoles: UserRole[];
    features: string[]; // ['chat', 'document-upload', 'audit-logs']
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### Chat Model

```typescript
interface Chat {
  _id: ObjectId;
  organizationId: string;
  userId: string;
  title: string; // Default: "New Conversation"
  status: ChatStatus; // ACTIVE | RESOLVED | ARCHIVED
  messages: Message[];
  metadata: {
    tags: string[];
    category?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  metadata?: {
    sources?: string[]; // RAG source documents
    confidence?: number; // RAG confidence score (0-1)
  };
}
```

### Audit Log Model

```typescript
interface AuditLog {
  _id: ObjectId;
  organizationId: string;
  userId: string;
  action: AuditAction; // CREATE | READ | UPDATE | DELETE | LOGIN | LOGOUT | UPLOAD | DOWNLOAD
  resource: string; // 'user', 'chat', 'document', 'auth', etc.
  resourceId?: string;
  details?: any; // Action-specific metadata
  ipAddress?: string;
  userAgent?: string;
  timestamp: Date;
}
```

---

## 🔌 API Reference

### Authentication Endpoints

| Method | Endpoint                    | Auth | Description                         |
| ------ | --------------------------- | ---- | ----------------------------------- |
| POST   | `/api/auth/login`           | ❌   | User login, returns JWT + user data |
| POST   | `/api/auth/logout`          | ✅   | Logout, logs audit                  |
| GET    | `/api/auth/profile`         | ✅   | Get current user profile            |
| PUT    | `/api/auth/profile`         | ✅   | Update profile (name, email)        |
| POST   | `/api/auth/change-password` | ✅   | Change password                     |

### Chat Endpoints

| Method | Endpoint                  | Auth | Description                          |
| ------ | ------------------------- | ---- | ------------------------------------ |
| GET    | `/api/chats`              | ✅   | List user's chats (paginated)        |
| POST   | `/api/chats`              | ✅   | Create new chat with initial message |
| GET    | `/api/chats/:id`          | ✅   | Get chat with full message history   |
| PUT    | `/api/chats/:id`          | ✅   | Update chat title/status/metadata    |
| DELETE | `/api/chats/:id`          | ✅   | Delete chat                          |
| POST   | `/api/chats/:id/messages` | ✅   | Send message, get AI response        |
| PATCH  | `/api/chats/:id/archive`  | ✅   | Archive chat                         |

### RAG Pipeline Endpoints

| Method | Endpoint        | Description                    |
| ------ | --------------- | ------------------------------ |
| GET    | `/`             | Health check                   |
| POST   | `/ask`          | Query RAG system               |
| POST   | `/load_project` | Reload knowledge base from CSV |
| GET    | `/stats`        | System statistics              |
| GET    | `/docs`         | OpenAPI documentation          |

### RAG Request/Response

```json
// POST /ask Request
{
  "question": "What is SaaS?",
  "top_k": 4,              // Optional: number of context docs
  "strict_grounding": true // Optional: require high confidence
}

// Response
{
  "question": "What is SaaS?",
  "answer": "SaaS means Software as a Service...",
  "context": ["Project A (row 1)", "Project B (row 5)"],
  "confidence": 0.847,
  "retrieved_count": 4,
  "grounded": true
}
```

---

## 📊 Dataset Format

### Knowledge Base (Project.csv)

The RAG system uses a CSV file as its knowledge base. The system is **dataset-agnostic** and can work with any CSV file.

**Required CSV Structure:**

- First row: Column headers
- Subsequent rows: Data records

**Preferred Columns (if available):**

1. `title` - Project/Document title
2. `description` - Detailed description
3. `platform` - Technology platform
4. `appType` - Application type

**Flexible Schema:**
The system dynamically adapts to any CSV structure by:

1. Detecting all columns automatically
2. Concatenating all column values into a searchable document
3. Building embeddings from the combined text

### Example Dataset Structures

**Option 1: Technical Documentation**

```csv
title,description,category,keywords
"API Gateway Setup","Configure nginx reverse proxy for microservices...","Infrastructure","nginx,gateway,proxy"
```

**Option 2: FAQ Database**

```csv
question,answer,category,tags
"How to reset password?","Go to Settings > Security > Reset Password...","Account","password,security"
```

**Option 3: Product Catalog**

```csv
product_name,features,specifications,use_cases
"CloudDB Enterprise","Real-time replication, Auto-scaling...","Max 10TB, 99.99% SLA...","E-commerce,Analytics"
```

---

## 🚀 Deployment Configuration

### Environment Variables

**Backend (.env)**

```env
# Server
HOST=0.0.0.0
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/tech-support-assistant

# Authentication
JWT_SECRET=your-super-secret-key-change-this
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d

# Admin Credentials (initial setup)
ADMIN_EMAIL=admin123@gmail.com
ADMIN_PASSWORD=admin123

# AI/RAG Service
AI_ENGINE_URL=http://localhost:8000
AI_ENGINE_TIMEOUT=120000

# CORS
ALLOWED_ORIGINS=http://localhost:7878

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

**Frontend (.env)**

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_RAG_API_BASE_URL=http://127.0.0.1:8000
```

### System Requirements

| Component | Minimum         | Recommended      |
| --------- | --------------- | ---------------- |
| RAM       | 8 GB            | 16 GB            |
| Disk      | 5 GB            | 10 GB            |
| CPU       | 4 cores         | 8 cores          |
| GPU       | None (CPU mode) | NVIDIA 8GB+ VRAM |
| Node.js   | 18+             | 20+              |
| Python    | 3.10+           | 3.11+            |
| MongoDB   | 6+              | 7+               |

---

## 📈 For Research Papers

### Suggested Metrics to Measure

1. **Retrieval Quality**
   - Precision@K (K=1,3,5,10)
   - Recall@K
   - Mean Reciprocal Rank (MRR)
   - Normalized Discounted Cumulative Gain (nDCG)

2. **Generation Quality**
   - BLEU Score
   - ROUGE-L
   - BERTScore
   - Human Evaluation (relevance, coherence, factuality)

3. **System Performance**
   - End-to-end latency (ms)
   - Embedding generation time
   - Vector search time
   - LLM inference time
   - Memory footprint (CPU/GPU)
   - Throughput (queries/second)

4. **RAG-Specific Metrics**
   - Faithfulness (answer grounded in context)
   - Context Relevancy
   - Answer Relevancy
   - Hallucination Rate

### Experiment Configurations

```python
# Baseline Configuration
EMBEDDING_MODEL = "BAAI/bge-small-en-v1.5"  # 384 dimensions
GENERATION_MODEL = "TinyLlama/TinyLlama-1.1B-Chat-v1.0"
RETRIEVAL_CANDIDATES = 12
MAX_CONTEXT_DOCS = 4
MAX_ANSWER_SENTENCES = 4
SEMANTIC_WEIGHT = 0.78
LEXICAL_WEIGHT = 0.22
CONFIDENCE_THRESHOLD = 0.25

# Alternative Embedding Models to Compare
ALTERNATIVES = [
    "all-MiniLM-L6-v2",           # 384d, smaller
    "BAAI/bge-base-en-v1.5",      # 768d, larger
    "sentence-transformers/all-mpnet-base-v2",  # 768d
]

# Alternative Generation Models (for 1-bit quantization research)
GENERATION_ALTERNATIVES = [
    "TinyLlama/TinyLlama-1.1B-Chat-v1.0",  # Baseline
    "microsoft/phi-2",                       # 2.7B
    "Qwen/Qwen1.5-1.8B-Chat",               # 1.8B
]
```

### 1-Bit Quantization Research Notes

For research on 1-bit quantized LLMs:

1. **Quantization Techniques to Explore:**
   - BitNet (1-bit weights)
   - GPTQ (4-bit, 8-bit)
   - AWQ (Activation-aware Weight Quantization)
   - bitsandbytes (8-bit, 4-bit)

2. **Measurement Points:**
   - Model size reduction (FP16 vs quantized)
   - Inference speed improvement
   - Memory reduction
   - Quality degradation (if any)

3. **Integration Point:**
   In `pipeline/main.py`, the model loading section:
   ```python
   model = AutoModelForCausalLM.from_pretrained(
       GENERATION_MODEL_NAME,
       torch_dtype=GENERATION_DTYPE,
       # Add quantization config here
       # load_in_8bit=True,
       # load_in_4bit=True,
       # quantization_config=BitsAndBytesConfig(...)
   )
   ```

---

## 🎨 UI/UX Flow Diagrams

### User Journey Flow

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              USER JOURNEY                                        │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  ┌─────────────┐                                                                │
│  │   Landing   │                                                                │
│  │    Page     │                                                                │
│  └──────┬──────┘                                                                │
│         │                                                                        │
│         ▼                                                                        │
│  ┌─────────────┐    Success    ┌─────────────┐                                  │
│  │   Login     │──────────────►│    Chat     │                                  │
│  │   Form      │               │   Panel     │                                  │
│  └──────┬──────┘               └──────┬──────┘                                  │
│         │                             │                                          │
│         │ Failure                     ├──────────────┐                          │
│         ▼                             │              │                          │
│  ┌─────────────┐               ┌──────▼──────┐ ┌────▼────┐                      │
│  │   Error     │               │   New Chat  │ │ History │                      │
│  │   Message   │               │   Creation  │ │  View   │                      │
│  └─────────────┘               └──────┬──────┘ └─────────┘                      │
│                                       │                                          │
│                                       ▼                                          │
│                                ┌─────────────┐                                  │
│                                │   Send      │                                  │
│                                │   Message   │◄─────────┐                       │
│                                └──────┬──────┘          │                       │
│                                       │                 │                       │
│                                       ▼                 │                       │
│                                ┌─────────────┐          │                       │
│                                │   RAG       │          │                       │
│                                │   Response  │──────────┘                       │
│                                └─────────────┘                                  │
│                                                                                  │
│  Admin Users:                                                                    │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐       │
│  │  Dashboard  │───►│   Users     │───►│   Firewall  │───►│  Settings   │       │
│  │  Overview   │    │   Mgmt      │    │   Config    │    │   Page      │       │
│  └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘       │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 📋 Complete Prompt for Recreating the Application

### Prompt for AI/Developers

```
Create a full-stack Technical Support RAG (Retrieval-Augmented Generation) system with the following specifications:

## Architecture
- Three-service microservices architecture
- Frontend: React 19 + TypeScript + Vite + Tailwind CSS + TanStack Router + Zustand
- Backend: Express.js + TypeScript + MongoDB + JWT authentication
- Pipeline: FastAPI + Python + ChromaDB + SentenceTransformers + TinyLlama

## Frontend Requirements
1. Modern React SPA with responsive design
2. Authentication flow with JWT token management
3. Chat interface with:
   - Sidebar for chat history
   - Message input with send functionality
   - Real-time AI responses display
   - Confidence scores and source attribution
4. Admin dashboard with:
   - User management (CRUD)
   - Organization settings
   - Firewall configuration
   - Audit log viewer
5. Dark/Light theme toggle
6. State management with Zustand

## Backend Requirements
1. RESTful API with Express.js
2. MongoDB database with Mongoose ODM
3. JWT authentication with bcrypt password hashing
4. Role-based access control (7 roles: SUPER_ADMIN, CEO, MANAGER, DEVELOPER, SUPPORT, HR, FINANCE)
5. Multi-tenant architecture with organization isolation
6. Complete audit logging for compliance
7. In-app firewall with IP/User blocking
8. Rate limiting (100 requests per 15 minutes)
9. Integration with RAG pipeline via HTTP

## RAG Pipeline Requirements
1. FastAPI server with async support
2. Document ingestion from CSV files
3. Embedding generation with BAAI/bge-small-en-v1.5
4. Vector storage with ChromaDB (persistent)
5. Hybrid retrieval (semantic + lexical scoring)
6. Text generation with TinyLlama 1.1B
7. Confidence scoring and strict grounding option
8. Built-in glossary for common terms

## Key Features
- Persistent chat history
- Source attribution in AI responses
- Configurable retrieval parameters
- Support for CPU and GPU inference
- Environment-based configuration
- Setup scripts for Windows/Linux/Mac

## Data Flow
User Question → Backend → RAG Pipeline → Vector Search → LLM Generation → Response with Sources

The system should be enterprise-ready with proper error handling, logging, and security measures.
```

---

## 📚 References & Resources

### Technologies Used

- [React 19](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [TanStack Router](https://tanstack.com/router)
- [Zustand](https://zustand-demo.pmnd.rs/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [FastAPI](https://fastapi.tiangolo.com/)
- [ChromaDB](https://www.trychroma.com/)
- [SentenceTransformers](https://www.sbert.net/)
- [Hugging Face Transformers](https://huggingface.co/docs/transformers)
- [TinyLlama](https://huggingface.co/TinyLlama/TinyLlama-1.1B-Chat-v1.0)

### Research Papers (Related Work)

- "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks" (Lewis et al., 2020)
- "Dense Passage Retrieval for Open-Domain Question Answering" (Karpukhin et al., 2020)
- "REALM: Retrieval-Augmented Language Model Pre-Training" (Guu et al., 2020)
- "BitNet: Scaling 1-bit Transformers for Large Language Models" (Wang et al., 2023)

---

## 👤 Author

**AMOHAMMEDIMRAN**

- GitHub: [@AMOHAMMEDIMRAN](https://github.com/AMOHAMMEDIMRAN)
- Repository: [Technical-Support-RAG](https://github.com/AMOHAMMEDIMRAN/Technical-Support-RAG)

---

## 📄 License

MIT License

---

_This document was generated for research and documentation purposes. Last updated: March 2026_
