# Preksha Clinic — Fullstack Starter (React + Vite + Spring Boot + DataNucleus JPA + SQLite)

This template includes:
- **frontend/**: React (Vite) SPA: Home, About Us, Contact Us, Register, Login, Take Appointment
- **backend/**: Spring Boot REST API using **DataNucleus JPA** with **SQLite** database, and **JWT** auth.

## Prerequisites
- Java 17+
- Maven 3.9+
- Node.js 18+ (or 20+)

---

## 1) Run backend
```bash
cd backend
mvn -q clean spring-boot:run
```

Backend: `http://localhost:8080`

SQLite DB file will be created at: `backend/preksha.db`

---

## 2) Run frontend (Vite)
```bash
cd frontend
npm install
npm run dev
```

Frontend: `http://localhost:5173`

Vite dev server proxies `/api` requests to `http://localhost:8080` (see `frontend/vite.config.js`).

---

## APIs
### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET  /api/me` (Bearer token)

### Appointments
- `POST /api/appointments` (Bearer token) — create appointment
- `GET  /api/appointments/mine` (Bearer token) — list your appointments

---

## Production build
### Frontend
```bash
cd frontend
npm run build
```

### Backend jar
```bash
cd backend
mvn -q clean package
java -jar target/preksha-clinic-backend-0.0.1-SNAPSHOT.jar
```

> For production, change the JWT secret in `backend/src/main/resources/application.yml`.
