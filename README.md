# DataMind — AI-Powered Business Intelligence

Ask questions about your data in plain English and get instant insights. No SQL required.

![DataMind](https://img.shields.io/badge/AI-Powered-blueviolet) ![Next.js](https://img.shields.io/badge/Next.js-16-black) ![FastAPI](https://img.shields.io/badge/FastAPI-latest-009688) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-13+-316192)

## ✨ Features

- 🔌 **Connect Any Database** — PostgreSQL support with one-click setup
- 🤖 **Natural Language Queries** — Ask questions in plain English, powered by Llama 3.3 70B
- 📊 **Smart Visualizations** — Automatic chart selection (bar, line, pie, table)
- 🔒 **Enterprise Security** — JWT auth, role-based access, encrypted credentials
- ⚡ **Real-time Results** — Execute queries in milliseconds
- 📈 **Query History** — Every query logged and searchable
- 🎨 **Modern UI** — Beautiful, animated interface with canvas-based visualizations

## 🚀 Tech Stack

### Frontend
- **Next.js 16** — React framework with App Router
- **Framer Motion** — Smooth animations and transitions
- **Recharts** — Data visualization library
- **Tailwind CSS** — Utility-first styling
- **Lucide React** — Modern icon library

### Backend
- **FastAPI** — High-performance Python API framework
- **SQLAlchemy** — SQL toolkit and ORM
- **PostgreSQL** — Primary database
- **Groq API** — AI-powered SQL generation (Llama 3.3 70B)
- **JWT** — Secure authentication
- **Passlib + bcrypt** — Password hashing

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm
- Python 3.9+
- PostgreSQL 13+

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install fastapi uvicorn sqlalchemy psycopg2-binary python-jose[cryptography] passlib[bcrypt] python-dotenv requests
   ```

4. **Configure environment variables:**
   
   Create a `.env` file in the `backend` directory:
   ```env
   DATABASE_URL=postgresql://username:password@localhost:5432/DataMind
   SECRET_KEY=your-secret-key-here
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=60
   GROQ_API_KEY=your-groq-api-key-here
   ```

5. **Create database:**
   ```sql
   CREATE DATABASE DataMind;
   ```

6. **Run the backend:**
   ```bash
   uvicorn main:app --reload
   ```

   Backend will run on `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

   Frontend will run on `http://localhost:3000`

## 🎯 Usage

1. **Register an account** at `http://localhost:3000/register`
2. **Login** with your credentials
3. **Add a database connection** — Click "Add Connection" in the sidebar
4. **Start asking questions!** — Type natural language queries like:
   - "Show me top 10 customers by revenue"
   - "What was our sales growth last quarter?"
   - "Which products have low inventory?"

## 🏗️ Project Structure

```
DataMind/
├── backend/
│   ├── main.py              # FastAPI application entry point
│   ├── database.py          # Database configuration
│   ├── models/
│   │   └── models.py        # SQLAlchemy models
│   ├── schemas/
│   │   └── schemas.py       # Pydantic schemas
│   ├── routers/
│   │   ├── auth.py          # Authentication endpoints
│   │   ├── connections.py   # Database connection management
│   │   └── query.py         # Query execution endpoints
│   └── services/
│       ├── ai_service.py    # AI-powered SQL generation
│       ├── auth_service.py  # Auth utilities
│       └── schema_service.py # Database schema introspection
│
├── frontend/
│   ├── app/
│   │   ├── page.js          # Landing page
│   │   ├── login/           # Login page
│   │   ├── register/        # Registration page
│   │   ├── dashboard/       # Main dashboard
│   │   ├── layout.js        # Root layout
│   │   └── globals.css      # Global styles
│   └── components/
│       ├── Logo.js          # Brand logo component
│       ├── HeroCanvas.js    # Animated hero background
│       ├── ConnectionModal.js # Add/Edit connection modal
│       ├── DeleteModal.js   # Delete confirmation modal
│       └── Toast.js         # Toast notification system
│
└── README.md
```

## 🔐 Security Features

- **JWT-based authentication** with configurable expiration
- **Password hashing** using bcrypt
- **Role-based access control** (Admin/Viewer)
- **Workspace isolation** — Users only see their workspace data
- **SQL injection prevention** — Parameterized queries only
- **Read-only AI queries** — AI cannot generate destructive SQL (DROP, DELETE, etc.)

## 🎨 Design System

- **Color Palette:** Indigo, purple, cyan gradients
- **Typography:** Inter (UI), JetBrains Mono (code)
- **Dark Theme:** Premium dark mode optimized for long sessions
- **Animations:** Framer Motion with 60fps smooth transitions
- **Canvas Graphics:** Real-time data flow visualization

## 📝 API Endpoints

### Authentication
- `POST /auth/register` — Create new account
- `POST /auth/login` — Login and get JWT token
- `GET /auth/me` — Get current user info

### Connections
- `GET /connections/` — List all connections
- `POST /connections/` — Create new connection
- `GET /connections/{id}` — Get connection details
- `PUT /connections/{id}` — Update connection
- `DELETE /connections/{id}` — Delete connection
- `POST /connections/test` — Test connection credentials
- `POST /connections/{id}/test` — Test saved connection

### Queries
- `POST /query/` — Execute natural language query
- `GET /query/history` — Get query history

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Adarsh Gupta**
- GitHub: [@AdarshXGupta07](https://github.com/AdarshXGupta07)

## 🙏 Acknowledgments

- **Groq** for providing fast AI inference
- **Llama 3.3 70B** for natural language understanding
- **Next.js** team for the amazing framework
- **FastAPI** team for the high-performance backend framework

---

Made with ❤️ by Adarsh Gupta
