# MANGANEX AI — Installation & Local Setup Guide
### SIH26009 • MOIL Limited

## Prerequisites
- Node.js $\ge 18$ & npm
- Python $\ge 3.10$ & pip (for standalone backend service)
- Docker & Docker Compose (optional for containerized deployment)

---

## Quick Start (Unified Full-Stack Mode)

```bash
# 1. Clone the repository
git clone https://github.com/Anusha-demonslayer/260009.git
cd 260009

# 2. Install Node dependencies
npm install

# 3. Start unified full-stack server (serves frontend & /api on port 3000)
npm run dev
```

Visit `http://localhost:3000` in your web browser.

---

## Docker Deployment (Production Stack)

```bash
# Build and run complete multi-container architecture (Web, Backend, PostgreSQL/PostGIS, Redis)
docker-compose up --build -d

# Verify running containers
docker-compose ps
```

- Web Platform: `http://localhost:3000`
- FastAPI Swagger Documentation: `http://localhost:8000/api/docs`

---

## Standalone Python FastAPI Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate   # or venv\Scripts\activate on Windows
pip install -r requirements.txt

# Run FastAPI engine on port 8000
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

---

## Environment Variables Configuration

Copy `.env.example` to `.env`:

```env
PORT=3000
NODE_ENV=development

# Optional External API Keys (Platform operates in DEMO MODE if omitted)
SENTINEL_API_URL=https://catalogue.dataspace.copernicus.eu/resto/api
SENTINEL_CLIENT_ID=
SENTINEL_CLIENT_SECRET=
WEATHER_API_KEY=
DATABASE_URL=postgresql://manganex:manganex_secure_pass@localhost:5432/manganex_db
REDIS_URL=redis://localhost:6379/0
JWT_SECRET=manganex_production_jwt_secret_key_2026
```
