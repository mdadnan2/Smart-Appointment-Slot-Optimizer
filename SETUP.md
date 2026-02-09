# 🚀 Quick Setup Guide

## Step-by-Step Installation

### 1️⃣ Prerequisites
- Node.js 18+ installed
- PostgreSQL installed (or Supabase account)
- Git installed

### 2️⃣ Database Setup

#### Option A: Local PostgreSQL
```bash
# Install PostgreSQL (if not installed)
# Windows: Download from postgresql.org
# Mac: brew install postgresql
# Linux: sudo apt-get install postgresql

# Create database
createdb appointment_db

# Your DATABASE_URL will be:
# postgresql://postgres:password@localhost:5432/appointment_db
```

#### Option B: Supabase (Free Cloud)
1. Go to https://supabase.com
2. Create new project
3. Copy connection string from Settings > Database
4. Use the "Connection Pooling" URL

### 3️⃣ Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create .env file
cp ../.env.example .env

# Edit .env and update:
# DATABASE_URL="your-database-url"
# JWT_SECRET="your-secret-key-change-this"

# Generate Prisma Client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Seed initial data
npm run prisma:seed

# Start backend server
npm run start:dev
```

✅ Backend should now be running on http://localhost:3001

### 4️⃣ Frontend Setup

```bash
# Open new terminal
cd frontend

# Install dependencies
npm install

# Create environment file
echo "NEXT_PUBLIC_API_URL=http://localhost:3001/api" > .env.local

# Start frontend
npm run dev
```

✅ Frontend should now be running on http://localhost:3000

### 5️⃣ Test the Application

1. Open browser: http://localhost:3000
2. Login with:
   - Email: `admin@test.com`
   - Password: `password123`
3. You should see the dashboard!

---

## 🧪 Testing API Endpoints

### Using cURL

```bash
# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"password123"}'

# Get available slots (replace TOKEN and PROVIDER_ID)
curl -X GET "http://localhost:3001/api/slots?providerId=PROVIDER_ID&date=2024-01-15&duration=30" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Using Postman

1. Import collection from `postman_collection.json` (if provided)
2. Set environment variable `baseUrl` to `http://localhost:3001/api`
3. Login to get token
4. Use token in Authorization header for other requests

---

## 📊 Database Management

### View Database
```bash
cd backend
npm run prisma:studio
```
Opens Prisma Studio at http://localhost:5555

### Reset Database
```bash
cd backend
npx prisma migrate reset
npm run prisma:seed
```

### Create New Migration
```bash
cd backend
npx prisma migrate dev --name your_migration_name
```

---

## 🐛 Common Issues

### Issue: "Port 3001 already in use"
```bash
# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3001 | xargs kill -9
```

### Issue: "Cannot connect to database"
- Check PostgreSQL is running
- Verify DATABASE_URL in .env
- Check firewall settings

### Issue: "Prisma Client not generated"
```bash
cd backend
npm run prisma:generate
```

### Issue: "Module not found"
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## 🔧 Development Tools

### Backend
- API runs on: http://localhost:3001
- API docs: http://localhost:3001/api
- Prisma Studio: http://localhost:5555

### Frontend
- App runs on: http://localhost:3000
- Auto-reloads on file changes

---

## 📦 Project Structure

```
backend/
├── src/
│   ├── auth/              # Authentication
│   ├── slot-engine/       # Core slot generation logic
│   ├── appointments/      # Booking management
│   ├── providers/         # Provider profiles
│   ├── services/          # Service definitions
│   ├── working-hours/     # Availability
│   ├── breaks/            # Break management
│   ├── analytics/         # Dashboard stats
│   └── common/            # Shared utilities
└── prisma/
    ├── schema.prisma      # Database schema
    └── seed.ts            # Initial data

frontend/
├── app/
│   ├── dashboard/         # Main dashboard
│   ├── appointments/      # Appointment list
│   └── login/             # Login page
├── components/            # Reusable components
└── lib/
    └── api.ts             # API client
```

---

## 🚀 Deployment

### Deploy Backend to Render

1. Create account on https://render.com
2. New > Web Service
3. Connect GitHub repo
4. Settings:
   - Root Directory: `backend`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm run start:prod`
5. Add Environment Variables:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `NODE_ENV=production`

### Deploy Frontend to Vercel

1. Create account on https://vercel.com
2. Import GitHub repo
3. Settings:
   - Root Directory: `frontend`
   - Framework: Next.js
4. Add Environment Variable:
   - `NEXT_PUBLIC_API_URL=https://your-backend-url.com/api`

---

## 📚 Next Steps

1. ✅ Complete setup
2. ✅ Test login
3. ✅ Create working hours
4. ✅ Add services
5. ✅ Test slot generation
6. ✅ Book appointments
7. ✅ View analytics

---

## 🆘 Need Help?

- Check README.md for detailed documentation
- Review API endpoints in backend/src
- Check console for error messages
- Verify all environment variables are set

---

**Happy Coding! 🎉**
