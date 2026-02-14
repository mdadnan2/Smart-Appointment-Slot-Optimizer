<div align="center">

# 🎯 Smart Appointment Slot Optimizer

### Enterprise-Grade Appointment Scheduling System with Real-Time Slot Generation

[![Live Demo](https://img.shields.io/badge/demo-live-success?style=for-the-badge&logo=vercel)](https://getsmartslots.vercel.app/)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/mdadnan2/Smart-Appointment-Slot-Optimizer)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0077B5?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/mohammadadnan01/)

**[Live Demo](https://getsmartslots.vercel.app/)** • **[Documentation](#api-documentation)** • **[Installation](#installation--setup-local)** • **[Architecture](#system-architecture-backend-focused)**

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Demo Credentials](#-demo-credentials)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [System Architecture](#system-architecture-backend-focused)
- [API Documentation](#api-documentation)
- [Database Design](#database-design)
- [Installation & Setup](#installation--setup-local)
- [Deployment](#deployment)
- [Author](#-author)

---

## 🚀 Overview

A **production-ready full-stack application** that revolutionizes appointment scheduling by dynamically generating conflict-free time slots in real-time, eliminating the need for database storage of pre-generated slots.

### The Problem
Traditional appointment systems store thousands of pre-generated slots in databases, causing:
- Database bloat and performance degradation
- Synchronization issues between slots and bookings
- Maintenance overhead for slot regeneration
- Scalability challenges

### The Solution
This system computes available slots **on-demand** by processing:
- Provider working hours and availability
- Break intervals (lunch, prayer times, emergency blocks)
- Existing appointments and bookings
- Service duration requirements
- Holiday and special day-off management

### Target Audience
- 🏥 Healthcare providers and clinics
- 💼 Consultants and professional services
- 💇 Salons and beauty services
- 🎓 Educational institutions
- 🔧 Service-based businesses

### Technical Highlights
- **Backend-Driven Architecture** with modular design patterns
- **Transaction-Based Booking** preventing double-booking with row-level locking
- **RESTful API Design** following industry best practices
- **JWT Authentication** with role-based access control
- **Real-Time Slot Calculation** with optimized algorithms

---

## 🎫 Demo Credentials

Test the application with these pre-configured accounts:

### 👨‍⚕️ Provider Account (Admin)
```
Email: admin@test.com
Password: password123
Role: ADMIN
```
**Capabilities:**
- Manage services and pricing
- Configure working hours and breaks
- View all appointments and analytics
- Update appointment statuses
- Access admin dashboard

### 👤 Patient Account (User)
```
Email: patient@test.com
Password: password123
Role: USER
```
**Capabilities:**
- Browse available providers
- Book appointments
- View personal appointment history
- Cancel appointments
- Receive booking confirmations

> **Note:** You can also register a new account to test the registration flow.

---

## ✨ Key Features

### 🔧 Backend Features
- ⚡ **Dynamic Slot Generation Engine** – Real-time slot calculation without database storage
- 🔒 **Transaction-Based Booking** – Prevents double-booking with row-level locking
- 🔐 **JWT Authentication** – Secure token-based auth with bcrypt password hashing
- 👥 **Role-Based Access Control** – Admin (Provider) and User (Patient) roles
- 🏗️ **RESTful API Architecture** – Clean, modular design following REST principles
- ⏰ **Working Hours Management** – Day-wise availability with timezone support
- ☕ **Break Management System** – Lunch breaks, prayer times, emergency blocks
- 🏖️ **Holiday Management** – Recurring holidays and special days off
- 📊 **Analytics & Reporting** – Dashboard statistics and monthly trends
- ✅ **Input Validation** – Request validation using class-validator and Zod
- 🛡️ **Error Handling** – Centralized exception handling with meaningful responses

### 🎨 Frontend Features
- 📱 **Responsive Dashboard** – Real-time statistics with interactive charts
- 📅 **Appointment Management** – View, update, and cancel appointments
- 🔑 **Authentication UI** – Login and registration with NextAuth.js
- 🎯 **Status Management** – Track appointment lifecycle (Pending → Confirmed → Completed)
- 📊 **Interactive Charts** – Visual analytics using Recharts
- 🔔 **Toast Notifications** – Real-time user feedback
- ✨ **Modern UI/UX** – Clean interface with Tailwind CSS

---

## 🛠️ Tech Stack

### Backend
- **Language:** TypeScript
- **Framework:** NestJS (Node.js)
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** JWT (@nestjs/jwt, passport-jwt) with bcrypt
- **Validation:** class-validator, class-transformer, Zod
- **Date Handling:** date-fns, date-fns-tz
- **Architecture:** Modular architecture with dependency injection

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **HTTP Client:** Axios
- **Authentication:** NextAuth.js
- **Charts:** Recharts
- **Icons:** Lucide React
- **Date Utilities:** date-fns
- **Utilities:** clsx, tailwind-merge

### DevOps & Tools
- **Version Control:** Git
- **Package Manager:** npm
- **Database Migration:** Prisma Migrate
- **Deployment:** Vercel (Frontend), Render (Backend), Neon (Database)
- **Environment Management:** dotenv

---

## System Architecture (Backend Focused)

### Architecture Pattern
The backend follows a **modular architecture** with clear separation of concerns:

```
Request → Controller → Service → Repository → Database
                ↓
         DTO Validation
                ↓
         Business Logic
                ↓
         Response Formatting
```

### Folder Structure
```
backend/
├── src/
│   ├── auth/                 # Authentication module (JWT, guards)
│   ├── providers/            # Provider management (CRUD operations)
│   ├── services/             # Service definitions and pricing
│   ├── working-hours/        # Day-wise availability management
│   ├── breaks/               # Break interval management
│   ├── holidays/             # Holiday management
│   ├── appointments/         # Booking logic with transactions
│   ├── slot-engine/          # Core: Dynamic slot calculation algorithm
│   ├── analytics/            # Dashboard statistics and reports
│   ├── users/                # User management
│   ├── common/               # Shared utilities, decorators, guards
│   │   ├── decorators/       # Custom decorators (CurrentUser, Roles)
│   │   ├── guards/           # Auth guards, role guards
│   │   └── filters/          # Exception filters
│   ├── app.module.ts         # Root application module
│   └── main.ts               # Application entry point
├── prisma/
│   ├── schema.prisma         # Database schema definition
│   ├── migrations/           # Database migration files
│   └── seed.ts               # Database seeding script
├── check-data.ts             # Data verification utility
└── check-users.ts            # User verification utility
```

### Request Flow Example (Booking Appointment)
1. **Controller** receives POST request at `/api/appointments`
2. **DTO Validation** validates request body using class-validator
3. **Auth Guard** verifies JWT token and extracts user
4. **Service Layer** checks slot availability
5. **Transaction** begins to prevent race conditions
6. **Database** locks relevant rows and creates appointment
7. **Transaction** commits if successful, rolls back on conflict
8. **Response** returns created appointment or error

### Core Algorithm: Slot Engine
The slot engine is the heart of the system:

```typescript
1. Fetch provider's working hours for requested date
2. Create time intervals from start to end time
3. Subtract break intervals (lunch, prayer, etc.)
4. Subtract booked appointment intervals
5. Filter intervals matching service duration
6. Return available slots as JSON
```

This approach ensures slots are always accurate and reflect real-time availability.

---

## API Documentation

**Base URL:** `http://localhost:3000/api` (Development)

**Postman Collection:** A complete Postman collection is available at the root directory (`postman_collection.json`) for easy API testing.

**Authentication:** Bearer Token (JWT) in Authorization header

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register new user | No |
| POST | `/auth/login` | Login and receive JWT token | No |

### Provider Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/providers` | Get all providers | Yes |
| POST | `/providers` | Create provider profile | Yes (Admin) |
| GET | `/providers/:id` | Get provider by ID | Yes |
| PATCH | `/providers/:id` | Update provider | Yes (Admin) |
| DELETE | `/providers/:id` | Delete provider | Yes (Admin) |

### Working Hours Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/working-hours` | Create working hours | Yes (Admin) |
| GET | `/working-hours?providerId=xxx` | Get working hours | Yes |
| PATCH | `/working-hours/:id` | Update working hours | Yes (Admin) |
| DELETE | `/working-hours/:id` | Delete working hours | Yes (Admin) |

### Service Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/services` | Create service | Yes (Admin) |
| GET | `/services?providerId=xxx` | Get services | Yes |
| PATCH | `/services/:id` | Update service | Yes (Admin) |
| DELETE | `/services/:id` | Delete service | Yes (Admin) |

### Break Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/breaks` | Create break | Yes (Admin) |
| GET | `/breaks?providerId=xxx` | Get breaks | Yes |
| DELETE | `/breaks/:id` | Delete break | Yes (Admin) |

### Holiday Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/holidays` | Create holiday | Yes (Admin) |
| GET | `/holidays?providerId=xxx` | Get holidays | Yes |
| DELETE | `/holidays/:id` | Delete holiday | Yes (Admin) |

### Slot Engine (Core)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/slots?providerId=xxx&date=2024-01-15&duration=30` | Get available slots | Yes |

### Appointment Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/appointments` | Book appointment | Yes |
| GET | `/appointments?providerId=xxx` | Get appointments | Yes |
| GET | `/appointments/:id` | Get appointment by ID | Yes |
| PATCH | `/appointments/:id/status` | Update appointment status | Yes (Admin) |
| PATCH | `/appointments/:id/cancel` | Cancel appointment | Yes |

### Analytics Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/analytics/dashboard?providerId=xxx` | Get dashboard stats | Yes (Admin) |
| GET | `/analytics/monthly-trend?providerId=xxx&year=2024&month=1` | Get monthly trends | Yes (Admin) |

---

## Database Design

### Database Choice
**PostgreSQL** was chosen for its:
- ACID compliance for transaction safety
- Row-level locking to prevent race conditions
- Strong support for date/time operations
- JSON data type support for flexible fields
- Excellent performance with proper indexing

### Entity Relationships

**User** (1) ↔ (1) **Provider**  
A user can have one provider profile (for service providers)

**Provider** (1) ↔ (M) **WorkingHour**  
A provider has multiple working hour configurations (one per day)

**Provider** (1) ↔ (M) **Service**  
A provider offers multiple services with different durations

**Provider** (1) ↔ (M) **Break**  
A provider can have multiple breaks (lunch, prayer, emergency) with recurring options

**Provider** (1) ↔ (M) **Holiday**  
A provider can have multiple holidays with recurring options

**Provider** (1) ↔ (M) **Appointment**  
A provider has multiple appointments

**User** (1) ↔ (M) **Appointment**  
A user (patient) can book multiple appointments

**Service** (1) ↔ (M) **Appointment**  
A service can be booked in multiple appointments

### Indexing Strategy
- **User.email** – Unique index for fast login queries
- **Appointment.providerId** – Index for provider appointment lookups
- **Appointment.startTime, endTime** – Composite index for slot conflict detection
- **WorkingHour.providerId, dayOfWeek** – Composite index for availability queries

### Appointment Status Lifecycle
```
PENDING → CONFIRMED → COMPLETED
         ↓
      CANCELLED / NO_SHOW
```

---

## Environment Variables

### Backend (.env)

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/appointment_db"

# JWT Authentication
JWT_SECRET="your-secret-key-change-in-production"
JWT_EXPIRES_IN="7d"

# Server Configuration
PORT=3000
NODE_ENV="development"

# CORS
FRONTEND_URL="http://localhost:3001"
```

**Variable Descriptions:**
- `DATABASE_URL` – PostgreSQL connection string (required)
- `JWT_SECRET` – Secret key for signing JWT tokens (required, change in production)
- `JWT_EXPIRES_IN` – Token expiration time (default: 7 days)
- `PORT` – Backend server port (default: 3000)
- `NODE_ENV` – Environment mode (development/production)
- `FRONTEND_URL` – Frontend URL for CORS configuration

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL="http://localhost:3000/api"
```

**Variable Descriptions:**
- `NEXT_PUBLIC_API_URL` – Backend API base URL (required)

---

## Installation & Setup (Local)

### Prerequisites
- Node.js 18+ installed
- PostgreSQL 14+ installed (or Supabase account)
- npm or yarn package manager
- Git

### Step 1: Clone Repository
```bash
git clone https://github.com/yourusername/smart-appointment-slot-optimizer.git
cd smart-appointment-slot-optimizer
```

### Step 2: Setup Backend

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env and update DATABASE_URL and JWT_SECRET
# Example: DATABASE_URL="postgresql://user:password@localhost:5432/appointment_db"

# Generate Prisma Client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# (Optional) Seed database with sample data
npm run prisma:seed

# Start backend server
npm run start:dev
```

Backend will run on: `http://localhost:3000`

### Step 3: Setup Frontend

```bash
# Open new terminal and navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create environment file
echo "NEXT_PUBLIC_API_URL=http://localhost:3000/api" > .env.local

# Start frontend development server
npm run dev
```

Frontend will run on: `http://localhost:3001`

### Step 4: Verify Installation

1. Open browser and navigate to `http://localhost:3001`
2. Login with demo credentials or register a new account
3. Test the appointment booking flow
4. Backend API: `http://localhost:3000/api`

**Quick Test:**
```bash
# Test backend health
curl http://localhost:3000/api

# Test authentication
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"patient@test.com","password":"password123"}'
```

---

## Available Scripts / Commands

### Backend Commands

```bash
# Development
npm run start:dev          # Start backend in development mode with hot reload
npm run start              # Start backend in standard mode

# Production
npm run build              # Build backend for production
npm run start:prod         # Start backend in production mode

# Database
npm run prisma:generate    # Generate Prisma Client
npm run prisma:migrate     # Run database migrations
npm run prisma:seed        # Seed database with sample data
npm run prisma:studio      # Open Prisma Studio (database GUI)
```

### Frontend Commands

```bash
# Development
npm run dev                # Start frontend in development mode (port 3001)
npm run build              # Build frontend for production
npm run start              # Start frontend in production mode

# Code Quality
npm run lint               # Run ESLint
```

---

## Authentication & Security

### Authentication Strategy
The application uses **JWT (JSON Web Token)** based authentication:

1. User registers or logs in with email and password
2. Backend validates credentials and generates JWT token
3. Token contains user ID and role (encoded, not encrypted)
4. Frontend stores token in localStorage
5. All protected API requests include token in Authorization header
6. Backend validates token on each request using JWT guard

### Password Security
- Passwords are hashed using **bcrypt** with salt rounds (10)
- Plain text passwords are never stored in database
- Password validation enforces minimum length requirements

### Token Validation
- JWT tokens are signed with secret key (JWT_SECRET)
- Tokens expire after configured time (default: 7 days)
- Invalid or expired tokens return 401 Unauthorized
- Token payload includes: userId, email, role

### Role-Based Access Control (RBAC)
Two roles are implemented:
- **ADMIN** (Provider) – Can manage providers, services, working hours, breaks
- **USER** (Patient) – Can view providers, book appointments, view own appointments

Protected routes use `@Roles()` decorator and `RolesGuard` to enforce permissions.

### Additional Security Measures
- CORS configuration restricts API access to frontend domain
- Input validation on all endpoints using DTOs
- SQL injection prevention through Prisma ORM
- Rate limiting can be added using @nestjs/throttler (future enhancement)

---

## Error Handling & Validation

### Validation Strategy
All incoming requests are validated using **class-validator** decorators in DTOs:

```typescript
// Example DTO
export class CreateAppointmentDto {
  @IsUUID()
  providerId: string;

  @IsUUID()
  serviceId: string;

  @IsISO8601()
  startTime: string;

  @IsISO8601()
  endTime: string;
}
```

Validation occurs automatically before reaching controller methods.

### Error Handling
Centralized exception handling using NestJS exception filters:

- **ValidationException** – Returns 400 Bad Request with validation errors
- **UnauthorizedException** – Returns 401 when authentication fails
- **ForbiddenException** – Returns 403 when user lacks permissions
- **NotFoundException** – Returns 404 when resource not found
- **ConflictException** – Returns 409 for booking conflicts
- **InternalServerErrorException** – Returns 500 for unexpected errors

### Common Error Responses

**400 Bad Request:**
```json
{
  "statusCode": 400,
  "message": ["startTime must be a valid ISO 8601 date string"],
  "error": "Bad Request"
}
```

**401 Unauthorized:**
```json
{
  "statusCode": 401,
  "message": "Invalid credentials",
  "error": "Unauthorized"
}
```

**409 Conflict:**
```json
{
  "statusCode": 409,
  "message": "Time slot is no longer available",
  "error": "Conflict"
}
```

---

## Testing

### Testing Tools
- **Jest** – Unit testing framework
- **Supertest** – HTTP assertion library for E2E tests
- **@nestjs/testing** – NestJS testing utilities

### Running Tests

```bash
# Run all unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run E2E tests
npm run test:e2e

# Generate coverage report
npm run test:cov
```

### Test Coverage Areas
- Authentication service (login, register, token validation)
- Slot engine algorithm (various scenarios)
- Appointment booking (race conditions, conflicts)
- Working hours validation
- Break management

---

## Deployment

### Backend Deployment (Render / Railway)

**Render:**
1. Create new Web Service on Render
2. Connect GitHub repository
3. Configure build settings:
   - **Build Command:** `cd backend && npm install && npm run build`
   - **Start Command:** `cd backend && npm run start:prod`
4. Add environment variables:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `NODE_ENV=production`
   - `FRONTEND_URL` (your Vercel URL)
5. Deploy

**Railway:**
1. Create new project on Railway
2. Connect GitHub repository
3. Add PostgreSQL database service
4. Configure environment variables (same as above)
5. Deploy

### Frontend Deployment (Vercel)

1. Import GitHub repository to Vercel
2. Configure project settings:
   - **Framework Preset:** Next.js
   - **Root Directory:** `frontend`
3. Add environment variable:
   - `NEXT_PUBLIC_API_URL` (your backend URL)
4. Deploy

### Database Deployment (Supabase / Neon)

**Supabase:**
1. Create new project on Supabase
2. Copy PostgreSQL connection string
3. Update `DATABASE_URL` in backend environment variables
4. Run migrations: `npm run prisma:migrate deploy`

**Neon:**
1. Create new project on Neon
2. Copy connection string
3. Update `DATABASE_URL` in backend environment variables
4. Run migrations: `npm run prisma:migrate deploy`

### Environment Handling in Production
- Never commit `.env` files to version control
- Use platform-specific environment variable management
- Rotate JWT_SECRET regularly
- Use strong database passwords
- Enable SSL for database connections in production

---

## Future Improvements

### Planned Features
- Email notifications for appointment confirmations and reminders
- SMS reminders using Twilio API
- Google Calendar integration for automatic calendar sync
- Multi-provider support with provider search and filtering
- Recurring appointments (weekly, monthly)
- Waitlist management for fully booked slots
- Payment integration using Stripe
- Admin dashboard with advanced analytics

### Scalability Improvements
- Redis caching for frequently accessed data (working hours, services)
- Database read replicas for analytics queries
- Rate limiting to prevent API abuse
- WebSocket support for real-time slot updates
- Microservices architecture for high-traffic scenarios

### Performance Optimizations
- Query optimization with database indexes
- Lazy loading for large appointment lists
- Pagination for all list endpoints
- CDN integration for frontend assets
- Database connection pooling

---

## 🎬 Live Demo

**🌐 Live Application:** [https://getsmartslots.vercel.app/](https://getsmartslots.vercel.app/)

**Test the application with:**
- Provider dashboard and analytics
- Real-time slot availability
- Appointment booking flow
- Admin management features

**Demo Features:**
- ✅ Fully functional booking system
- ✅ Real-time slot generation
- ✅ Interactive dashboard with charts
- ✅ Mobile-responsive design
- ✅ Complete CRUD operations

---

## 👨‍💻 Author

**Mohammad Adnan**  
*Full-Stack Developer | Backend Specialist*

Passionate about building scalable, production-ready systems with modern technologies. This project showcases expertise in:
- 🏗️ Enterprise-grade backend architecture
- 🔐 Secure authentication and authorization
- 💾 Database design and optimization
- ⚡ Real-time algorithm development
- 🎨 Full-stack application development

### Connect With Me

<div align="center">

[![GitHub](https://img.shields.io/badge/GitHub-mdadnan2-181717?style=for-the-badge&logo=github)](https://github.com/mdadnan2/Smart-Appointment-Slot-Optimizer)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Mohammad_Adnan-0077B5?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/mohammadadnan01/)
[![Portfolio](https://img.shields.io/badge/Portfolio-Visit_Site-FF5722?style=for-the-badge&logo=google-chrome)](https://mdadnan.vercel.app/)
[![Live Demo](https://img.shields.io/badge/Live_Demo-GetSmartSlots-success?style=for-the-badge&logo=vercel)](https://getsmartslots.vercel.app/)

</div>

### 📫 Get In Touch
- 💼 **LinkedIn:** [linkedin.com/in/mohammadadnan01](https://www.linkedin.com/in/mohammadadnan01/)
- 🐙 **GitHub:** [github.com/mdadnan2](https://github.com/mdadnan2)
- 🌐 **Portfolio:** [mdadnan.vercel.app](https://mdadnan.vercel.app/)
- 🚀 **Live Project:** [getsmartslots.vercel.app](https://getsmartslots.vercel.app/)

---

<div align="center">

### ⭐ If you find this project useful, please consider giving it a star!

**Built with ❤️ by Mohammad Adnan**

</div>

---

## 📄 License

MIT License

Copyright (c) 2026 Mohammad Adnan

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
