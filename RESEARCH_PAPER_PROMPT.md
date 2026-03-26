# RESEARCH_PAPER_PROMPT

Use the following prompt directly with ChatGPT/Claude/Gemini to generate a full 12-page conference-style paper based on this project.

---

## MASTER PROMPT (COPY EVERYTHING BELOW)

You are an expert academic researcher and scientific writer in AI systems, information retrieval, and enterprise software engineering.

I need a complete, publication-quality **12-page conference paper** (single-spaced equivalent, around 6500-8500 words) based on my codebase.

### 1) Paper Objective

Write a rigorous conference paper that analyzes, designs, and evaluates an enterprise technical-support Retrieval-Augmented Generation (RAG) platform implemented as a multi-service architecture:

- Backend: TypeScript + Express + MongoDB + JWT + RBAC + audit logging + firewall policy controls
- Frontend: React + TypeScript + Vite + TanStack Router + Zustand + Tailwind
- AI Pipeline: Python FastAPI + SentenceTransformers embeddings + ChromaDB retrieval + TinyLlama generation

The paper must read like a real systems paper with:

- Clear research motivation
- Technical depth
- Methodological rigor
- Reproducible experiments
- Strong visual figures/tables
- Honest limitations and threat analysis

### 2) Codebase Facts You Must Use

Base your writing on these concrete implementation facts:

#### Architecture

- Multi-service workspace with 3 main modules:
  - `backend/` (Express API)
  - `kelo_ui/` (React frontend)
  - `pipeline/` (FastAPI RAG service)
- Runtime flow:
  - User interacts with web UI
  - UI calls backend API
  - Backend calls RAG service endpoint `/ask`
  - RAG retrieves context from ChromaDB and generates response

#### Backend implementation details

- Stack: Express, Mongoose, axios, jsonwebtoken, bcryptjs, helmet, cors, express-rate-limit, express-validator
- Authentication: JWT-based
- Role-aware access control (organization + admin capabilities)
- API domains include:
  - auth
  - organizations
  - users
  - chats/messages
  - documents
  - audit logs
  - firewall controls
- Audit logging exists for important events (login, CRUD actions, message actions)
- Firewall config is persisted in JSON (`firewall/config.json`) and supports blocked users/IPs/paths
- CORS and rate limiting are implemented
- Backend can integrate with RAG via configurable URL

#### Frontend implementation details

- Stack: React 19, TypeScript, Vite, TanStack Router, Zustand, Tailwind
- Views include home/login, chat panel, and admin dashboard sections
- Dashboard includes organization/users/firewall/settings workflows
- API clients implemented through Axios service layer
- Route guards based on authentication and role

#### Pipeline (RAG) implementation details

- FastAPI app with CORS middleware
- Embedding model: `BAAI/bge-small-en-v1.5`
- Generation model: `TinyLlama/TinyLlama-1.1B-Chat-v1.0`
- Vector store: ChromaDB persistent storage
- Startup indexing from CSV (`Project.csv`), currently lightweight subset (`head(5)`) for local dev
- Main endpoint:
  - `POST /ask` with `{ question: string }`
- Retrieval + prompt construction + controlled generation flow

### 3) Required Paper Structure

Write all sections fully, in this order:

1. Title
2. Abstract (200-300 words)
3. Keywords (6-10)
4. Introduction
5. Problem Statement and Research Questions
6. Related Work
7. System Architecture and Design
8. Implementation Details
9. Experimental Methodology
10. Results and Analysis
11. Discussion
12. Threats to Validity
13. Limitations and Ethical Considerations
14. Conclusion and Future Work
15. References (IEEE-style or ACM-style, consistent)
16. Appendix (optional but include if useful for reproducibility)

### 4) Research Questions (must include and answer)

Use at least these RQs:

- RQ1: How effectively can a lightweight local RAG stack support enterprise technical-support question answering?
- RQ2: What are the latency/quality trade-offs of this architecture under realistic query workloads?
- RQ3: How do RBAC, audit trails, and firewall controls influence practical deployability in enterprise settings?
- RQ4: What bottlenecks and failure modes emerge in end-to-end operation?

### 5) Experimental Design Requirements

Provide a concrete, reproducible experiment plan with:

- Dataset preparation protocol from the project CSV
- Query set construction (easy/medium/hard + ambiguous queries)
- Metrics:
  - Retrieval: Recall@k, Precision@k, MRR, nDCG
  - Generation: factuality proxy, answer relevance, context adherence
  - Systems: p50/p95 latency, throughput, error rate
  - Security/operations: blocked-request ratio, auth failures, audit completeness
- Ablation studies:
  - with/without retrieval
  - top-k sensitivity
  - different prompt templates
  - constrained vs unconstrained generation
- Provide hypothetical but realistic numeric results tables if real logs are unavailable
- Explicitly mark simulated vs measured values

### 6) Visual Assets Requirement (Critical)

You must include **high-quality figure and graph plan** and provide both:

1. Figure captions + descriptions for paper insertion
2. Exact plotting/generation instructions (Python matplotlib/seaborn + Mermaid where suitable)

Create at least these visuals:

- Figure 1: End-to-end architecture diagram
- Figure 2: Request sequence diagram (UI -> backend -> RAG -> backend -> UI)
- Figure 3: Data and indexing pipeline flowchart
- Figure 4: Latency breakdown bar chart (frontend/backend/retrieval/generation)
- Figure 5: Retrieval quality vs top-k line chart
- Figure 6: Throughput vs concurrent users chart
- Figure 7: Security event distribution (auth failures, firewall blocks, denied role actions)
- Figure 8: Error taxonomy pie or stacked bar chart
- Table 1: API modules and responsibilities
- Table 2: Experimental setup and hardware/software config
- Table 3: Core performance metrics summary
- Table 4: Ablation results

For each figure/table include:

- Why it exists
- What data fields are required
- How to interpret it
- Publication-ready caption text

### 7) Output Formatting Requirements

- Write in formal academic English
- Avoid marketing tone
- Use precise technical terminology
- Include equation-style formalism where relevant (e.g., retrieval scoring notation)
- Include pseudocode for end-to-end inference flow and/or request authorization flow
- Keep strong narrative coherence from problem to conclusion

### 8) Reproducibility Section Requirement

Add a "Reproducibility Checklist" section that includes:

- Runtime versions (Node/Python/dependencies)
- Environment variables and service ports
- Startup order of services
- Minimal commands to run all services
- Evaluation script scaffold (even if pseudocode)

### 9) If Real Data Is Missing

If exact runtime logs are unavailable, do this:

- Use clearly labeled synthetic yet plausible experimental values
- Explain assumptions explicitly
- Provide a migration path from synthetic evaluation to real deployment evaluation

### 10) Deliverables I Need In Your Response

Your response must contain all of the following:

1. The full 12-page paper draft
2. A "Figure Production Pack" subsection with Python code snippets to generate all required graphs
3. A "Diagram Pack" subsection with Mermaid code for architecture and sequence diagrams
4. A "Submission Readiness Checklist" for conference submission
5. A concise list of what to replace with real measurements before final submission

Now produce the complete paper.

---

## OPTIONAL: IMAGE/GRAPH GENERATION PROMPTS (FOR IMAGE MODELS)

Use these prompts if you want visual assets from an image model in parallel.

### Prompt A: Architecture Figure

Create a clean academic systems architecture diagram for an enterprise RAG platform. Components: React frontend (web browser), Express backend API, MongoDB, firewall policy store, FastAPI RAG service, ChromaDB vector store, embedding model (BGE-small), generation model (TinyLlama). Show arrows for request/response and data flow. Style: conference-paper figure, white background, black labels, muted professional colors, vector-like clarity, no decorative icons, include legend.

### Prompt B: Sequence Figure

Create a UML-like sequence diagram image showing: User, Frontend, Backend, RAG service, Vector DB, LLM. Steps: login/auth, question submission, backend authorization, retrieval query, context return, prompt construction, answer generation, answer return, audit log write. Style: publication-ready, minimal, monochrome with one accent color.

### Prompt C: Evaluation Dashboard Figure

Create a multi-panel scientific figure with four panels: (1) latency bars p50/p95 by pipeline stage, (2) Recall@k line chart for k={1,3,5,10}, (3) throughput vs concurrent users, (4) error category distribution. Academic style, readable axis labels, gridlines, export-quality.

---

## Suggested usage

1. Paste the MASTER PROMPT into your LLM.
2. Generate full draft.
3. Ask it to export LaTeX/Word-ready format.
4. Replace synthetic metrics with real measurements from your benchmark runs.
5. Regenerate final figures at 300 DPI (or vector SVG/PDF).
