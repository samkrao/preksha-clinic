#!/bin/bash
echo "🏥 Starting Healthcare Clinic..."

# Start Backend
echo "Starting backend..."
cd backend
mvn spring-boot:run > backend.log 2>&1 &
BACKEND_PID=$!
echo $BACKEND_PID > backend.pid
cd ..

# Wait for backend
sleep 10

# Start Frontend
echo "Starting frontend..."
cd frontend
npm install
npm run dev > frontend.log 2>&1 &
FRONTEND_PID=$!
echo $FRONTEND_PID > frontend.pid
cd ..

echo ""
echo "✅ Application started!"
echo "📱 Frontend: http://localhost:5173"
echo "🔌 Backend:  http://localhost:8080"
echo ""
echo "To stop: ./stop-all.sh"
