# Healthcare Clinic Application

Complete full-stack clinic management system.

## Quick Start

```bash
# Start everything
./start-all.sh

# Stop everything
./stop-all.sh
```

## Access

- Frontend: http://localhost:5173
- Backend:  http://localhost:8080
- H2 Console: http://localhost:8080/h2-console

## Features

✅ User Registration & Login
✅ Book Appointments
✅ Contact Form
✅ Real-time updates
✅ Responsive design

## Tech Stack

**Frontend:** React 19.2, Vite, Tailwind CSS
**Backend:** Spring Boot, EclipseLink, JWT
**Database:** H2 (dev) / PostgreSQL (prod)

## Development

```bash
# Backend only
cd backend
mvn spring-boot:run

# Frontend only
cd frontend
npm run dev
```

## Configuration

Edit `backend/src/main/resources/application.properties` for database settings.

Default uses H2 in-memory database (no setup needed).

## Testing

Register a new user, login, and book an appointment!

## Real-time Notifications

When you book an appointment while logged in, you'll receive an instant notification via WebSocket/SSE. The notification will appear in the top-right corner of the screen.

**To test:**
1. Register and login
2. Book an appointment
3. Watch for real-time notification confirming your appointment

The frontend automatically connects to the Atmosphere notification stream when you login.
