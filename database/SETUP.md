# Vedashree CHS - Building Management System Setup Guide

## Prerequisites

- Node.js (v18 or higher)
- MySQL (v8 or higher)
- npm or yarn

## Database Setup

### 1. Create MySQL Database

```sql
CREATE DATABASE bms_db;
```

### 2. Configure Environment Variables

Copy the `.env.example` file to `.env` in the backend directory:

```bash
cd backend
cp .env.example .env
```

Edit the `.env` file with your database credentials:

```env
DATABASE_URL="mysql://root:YOUR_PASSWORD@localhost:3306/bms_db"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
PORT=5000
NODE_ENV=development
```

### 3. Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 4. Run Prisma Migrations

```bash
cd backend

# Generate Prisma Client
npx prisma generate

# Run migrations to create database tables
npx prisma migrate dev --name init

# Seed database with initial data
npx prisma db seed
```

### 5. Start the Application

```bash
# Terminal 1 - Start Backend
cd backend
npm run dev

# Terminal 2 - Start Frontend
cd frontend
npm run dev
```

## Default Login Credentials

After seeding the database, you can use these credentials:

### Admin
- Email: `admin@bms.com`
- Password: `Admin@123`

### Security
- Email: `security@bms.com`
- Password: `Security@123`

### Resident
- Email: `resident@bms.com`
- Password: `Resident@123`

## Application URLs

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- API Health Check: http://localhost:5000/

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/me` - Get current user profile
- POST `/api/auth/logout` - Logout user

### Dashboard
- GET `/api/dashboard` - Get admin dashboard statistics
- GET `/api/residents/dashboard` - Get resident dashboard statistics

### Visitors
- GET `/api/visitors` - Get all visitors
- POST `/api/visitors` - Create new visitor
- POST `/api/visitors/:id/check-in` - Check in visitor
- POST `/api/visitors/:id/check-out` - Check out visitor

### Other Endpoints
- `/api/buildings` - Building management
- `/api/residents` - Resident management
- `/api/flats` - Flat/unit management
- `/api/complaints` - Complaint management
- `/api/payments` - Payment management
- `/api/maintenance` - Maintenance requests
- `/api/notices` - Notice management
- `/api/settings` - System settings
- `/api/notifications` - User notifications

## Troubleshooting

### Prisma Generate Error
If you encounter a file permission error when running `npx prisma generate`, try:
1. Close any running Node processes
2. Delete the `node_modules/.prisma` folder
3. Run `npx prisma generate` again

### Database Connection Error
- Ensure MySQL is running
- Check your DATABASE_URL in `.env`
- Verify the database `bms_db` exists
- Check MySQL user credentials

### CORS Error
The backend is configured to allow CORS. If you still encounter CORS issues:
- Check the backend is running on port 5000
- Verify the frontend API baseURL in `frontend/src/services/api.js`

## Development Notes

### Database Schema
The application uses Prisma ORM with MySQL. The schema is defined in `backend/prisma/schema.prisma`.

### Authentication
- JWT tokens are used for authentication
- Tokens are stored in localStorage
- Protected routes require the `authMiddleware`

### Frontend Structure
- `src/pages/` - Page components
- `src/components/` - Reusable components
- `src/services/api.js` - Axios instance with interceptors
- `src/context/` - React Context providers
- `src/hooks/` - Custom React hooks

### Backend Structure
- `src/controllers/` - Route handlers
- `src/routes/` - API route definitions
- `src/services/` - Business logic services
- `src/middleware/` - Express middleware
- `src/config/` - Configuration files
- `prisma/` - Database schema and seed files

## Features Implemented

### ✅ Authentication
- User registration with role-based access
- Login with JWT tokens
- Protected routes with middleware

### ✅ Dashboards
- Admin dashboard with building statistics
- Resident dashboard with personal statistics
- Security dashboard with visitor management

### ✅ Security Dashboard
- View pending visitors
- Check-in visitors
- Log walk-in visitors
- View visitor history

### ✅ Database Integration
- Prisma ORM for database operations
- Seed data for testing
- Proper relationships between tables

## Next Steps

To complete the application, the following pages need to be implemented:

1. **Visitor Entry Page** (`/security/visitor-entry`)
2. **Delivery Page** (`/security/delivery`)
3. **Visitor History Page** (`/security/visitor-history`)
4. **Security Profile Page** (`/security/profile`)
5. **Admin pages** (Buildings, Residents, Flats, Complaints, etc.)
6. **Resident pages** (My Apartment, Complaints, Payments, etc.)

Each page should:
- Connect to the appropriate API endpoints
- Handle loading and error states
- Provide proper user feedback
- Follow the existing design patterns

## Support

For issues or questions, check the console logs for error messages and verify:
1. Backend is running on port 5000
2. Frontend is running on port 5173
3. Database connection is working
4. Environment variables are set correctly
