# 📡 API Documentation

Base URL: `http://localhost:3001/api`

All endpoints except `/auth/*` require JWT token in Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

---

## 🔐 Authentication

### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "role": "ADMIN",  // or "USER"
  "phone": "+1234567890"
}

Response: 201
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "ADMIN"
  },
  "token": "jwt-token"
}
```

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response: 200
{
  "user": { ... },
  "token": "jwt-token"
}
```

---

## 👨‍⚕️ Providers

### Create Provider
```http
POST /providers
Authorization: Bearer <token>

{
  "userId": "user-uuid",
  "specialty": "General Consultation",
  "timezone": "UTC",
  "defaultServiceDuration": 30
}

Response: 201
{
  "id": "provider-uuid",
  "userId": "user-uuid",
  "specialty": "General Consultation",
  "timezone": "UTC",
  "defaultServiceDuration": 30,
  "user": { ... }
}
```

### Get All Providers
```http
GET /providers
Authorization: Bearer <token>

Response: 200
[
  {
    "id": "provider-uuid",
    "specialty": "General Consultation",
    "user": { ... }
  }
]
```

### Get Provider by ID
```http
GET /providers/:id
Authorization: Bearer <token>

Response: 200
{
  "id": "provider-uuid",
  "specialty": "General Consultation",
  "workingHours": [...],
  "services": [...],
  "user": { ... }
}
```

---

## ⏰ Working Hours

### Create Working Hour
```http
POST /working-hours
Authorization: Bearer <token>

{
  "providerId": "provider-uuid",
  "dayOfWeek": "MONDAY",
  "startTime": "09:00",
  "endTime": "18:00",
  "isActive": true
}

Response: 201
{
  "id": "working-hour-uuid",
  "providerId": "provider-uuid",
  "dayOfWeek": "MONDAY",
  "startTime": "09:00",
  "endTime": "18:00",
  "isActive": true
}
```

### Get Working Hours by Provider
```http
GET /working-hours?providerId=provider-uuid
Authorization: Bearer <token>

Response: 200
[
  {
    "id": "uuid",
    "dayOfWeek": "MONDAY",
    "startTime": "09:00",
    "endTime": "18:00",
    "isActive": true
  }
]
```

---

## 🛠️ Services

### Create Service
```http
POST /services
Authorization: Bearer <token>

{
  "providerId": "provider-uuid",
  "name": "General Consultation",
  "duration": 30,
  "price": 50,
  "description": "Standard consultation"
}

Response: 201
{
  "id": "service-uuid",
  "name": "General Consultation",
  "duration": 30,
  "price": 50
}
```

### Get Services by Provider
```http
GET /services?providerId=provider-uuid
Authorization: Bearer <token>

Response: 200
[
  {
    "id": "service-uuid",
    "name": "General Consultation",
    "duration": 30,
    "price": 50,
    "isActive": true
  }
]
```

---

## ☕ Breaks

### Create Break
```http
POST /breaks
Authorization: Bearer <token>

{
  "providerId": "provider-uuid",
  "title": "Lunch Break",
  "startTime": "2024-01-15T13:00:00Z",
  "endTime": "2024-01-15T14:00:00Z",
  "isRecurring": false
}

Response: 201
{
  "id": "break-uuid",
  "title": "Lunch Break",
  "startTime": "2024-01-15T13:00:00Z",
  "endTime": "2024-01-15T14:00:00Z"
}
```

### Get Breaks by Provider
```http
GET /breaks?providerId=provider-uuid
Authorization: Bearer <token>

Response: 200
[
  {
    "id": "break-uuid",
    "title": "Lunch Break",
    "startTime": "2024-01-15T13:00:00Z",
    "endTime": "2024-01-15T14:00:00Z"
  }
]
```

---

## 🎯 Slot Engine (Core Feature)

### Get Available Slots
```http
GET /slots?providerId=provider-uuid&date=2024-01-15&duration=30
Authorization: Bearer <token>

Response: 200
{
  "providerId": "provider-uuid",
  "date": "2024-01-15",
  "duration": 30,
  "count": 12,
  "slots": [
    {
      "startTime": "2024-01-15T09:00:00Z",
      "endTime": "2024-01-15T09:30:00Z"
    },
    {
      "startTime": "2024-01-15T09:30:00Z",
      "endTime": "2024-01-15T10:00:00Z"
    }
  ]
}
```

**Query Parameters:**
- `providerId` (required): Provider UUID
- `date` (required): Date in YYYY-MM-DD format
- `duration` (required): Service duration in minutes

---

## 📅 Appointments

### Create Appointment
```http
POST /appointments
Authorization: Bearer <token>

{
  "providerId": "provider-uuid",
  "userId": "user-uuid",
  "serviceId": "service-uuid",
  "startTime": "2024-01-15T10:00:00Z",
  "endTime": "2024-01-15T10:30:00Z",
  "notes": "Regular checkup"
}

Response: 201
{
  "id": "appointment-uuid",
  "providerId": "provider-uuid",
  "userId": "user-uuid",
  "serviceId": "service-uuid",
  "startTime": "2024-01-15T10:00:00Z",
  "endTime": "2024-01-15T10:30:00Z",
  "status": "PENDING",
  "provider": { ... },
  "user": { ... },
  "service": { ... }
}
```

**Error Responses:**
- `409 Conflict`: Slot not available or already booked
- `400 Bad Request`: Invalid time slot

### Get Appointments
```http
GET /appointments?providerId=provider-uuid&status=CONFIRMED
Authorization: Bearer <token>

Response: 200
[
  {
    "id": "appointment-uuid",
    "startTime": "2024-01-15T10:00:00Z",
    "endTime": "2024-01-15T10:30:00Z",
    "status": "CONFIRMED",
    "user": { ... },
    "service": { ... }
  }
]
```

**Query Parameters:**
- `providerId` (optional): Filter by provider
- `userId` (optional): Filter by user
- `status` (optional): Filter by status (PENDING, CONFIRMED, COMPLETED, CANCELLED, NO_SHOW)

### Update Appointment Status
```http
PATCH /appointments/:id/status
Authorization: Bearer <token>

{
  "status": "CONFIRMED"
}

Response: 200
{
  "id": "appointment-uuid",
  "status": "CONFIRMED"
}
```

**Valid Status Values:**
- `PENDING`
- `CONFIRMED`
- `COMPLETED`
- `CANCELLED`
- `NO_SHOW`

### Cancel Appointment
```http
PATCH /appointments/:id/cancel
Authorization: Bearer <token>

Response: 200
{
  "id": "appointment-uuid",
  "status": "CANCELLED"
}
```

---

## 📊 Analytics

### Get Dashboard Stats
```http
GET /analytics/dashboard?providerId=provider-uuid
Authorization: Bearer <token>

Response: 200
{
  "totalPatients": 150,
  "todayPatients": 8,
  "todayAppointments": 12,
  "todayAppointmentsList": [
    {
      "id": "appointment-uuid",
      "startTime": "2024-01-15T10:00:00Z",
      "user": { ... },
      "service": { ... },
      "status": "CONFIRMED"
    }
  ],
  "monthlyStats": {
    "total": 85,
    "byStatus": [
      { "status": "COMPLETED", "count": 60 },
      { "status": "CONFIRMED", "count": 15 },
      { "status": "CANCELLED", "count": 10 }
    ]
  }
}
```

### Get Monthly Trend
```http
GET /analytics/monthly-trend?providerId=provider-uuid&year=2024&month=1
Authorization: Bearer <token>

Response: 200
{
  "1": { "total": 5, "completed": 4, "cancelled": 1 },
  "2": { "total": 8, "completed": 7, "cancelled": 1 },
  "3": { "total": 6, "completed": 5, "cancelled": 1 }
}
```

---

## 🚨 Error Responses

### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": ["email must be an email"],
  "error": "Bad Request"
}
```

### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "Provider not found",
  "error": "Not Found"
}
```

### 409 Conflict
```json
{
  "statusCode": 409,
  "message": "Time slot already booked",
  "error": "Conflict"
}
```

---

## 🔄 Typical Workflow

1. **Register/Login** → Get JWT token
2. **Create Provider** → Get provider ID
3. **Set Working Hours** → Define availability
4. **Create Services** → Define service types
5. **Get Available Slots** → Check open times
6. **Book Appointment** → Reserve slot
7. **View Dashboard** → See analytics

---

## 📝 Notes

- All timestamps are in ISO 8601 format (UTC)
- Time format for working hours: "HH:mm" (24-hour)
- Dates in query params: "YYYY-MM-DD"
- All IDs are UUIDs
- Token expires in 7 days (configurable)

---

## 🧪 Testing with cURL

```bash
# Login
TOKEN=$(curl -s -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"password123"}' \
  | jq -r '.token')

# Get slots
curl -X GET "http://localhost:3001/api/slots?providerId=PROVIDER_ID&date=2024-01-15&duration=30" \
  -H "Authorization: Bearer $TOKEN"
```

---

**For more details, check the source code in `backend/src/`**
