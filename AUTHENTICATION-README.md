# MBHA Authentication System

This document describes the authentication system implemented for the MBHA platform.

## Features

### 🔐 Authentication
- **JWT-based authentication** with secure token storage
- **Password hashing** using bcryptjs with 12 salt rounds
- **Token expiration** set to 7 days
- **Automatic token verification** on page load

### 📝 User Registration
- **Unique code requirement** - Users must have a valid registration code
- **One-time use codes** - Each code can only be used once
- **Profile photo upload** - Support for base64 image storage
- **Comprehensive validation** - Email format, password strength, required fields

### 🔑 Login System
- **Secure login** with email and password
- **Automatic redirection** to dashboard after successful login
- **Error handling** with user-friendly messages

### 👨‍💼 Admin Panel
- **Code management** - Generate, view, and delete registration codes
- **Usage tracking** - Monitor which codes are used and by whom
- **Statistics dashboard** - View total, available, and used codes

## File Structure

```
app/
├── api/
│   ├── auth/
│   │   ├── register/route.ts          # User registration
│   │   ├── login/route.ts             # User login
│   │   ├── verify/route.ts            # Token verification
│   │   └── validate-code/route.ts     # Code validation
│   └── admin/
│       ├── codes/route.ts             # Get all codes
│       ├── generate-codes/route.ts    # Generate new codes
│       └── delete-code/route.ts       # Delete a code
├── lib/
│   ├── auth-utils.ts                  # Authentication utilities
│   ├── react-query.ts                 # React Query provider
│   └── hooks/
│       └── useAuth.ts                 # Authentication hooks
├── admin/
│   └── codes/page.tsx                 # Admin panel
├── login/page.tsx                     # Login page
├── signup/page.tsx                    # Registration page
└── dashboard/page.tsx                 # Protected dashboard
data/
├── users.json                         # User data storage
└── unique-codes.json                  # Registration codes storage
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/verify` - Verify JWT token
- `POST /api/auth/validate-code` - Validate registration code

### Admin
- `GET /api/admin/codes` - Get all registration codes
- `POST /api/admin/generate-codes` - Generate new codes
- `DELETE /api/admin/delete-code` - Delete a code

## Usage

### For Users
1. **Registration**: Visit `/signup` and enter required information with a valid registration code
2. **Login**: Visit `/login` and enter email/password
3. **Dashboard**: Access protected content after authentication

### For Administrators
1. **Access Admin Panel**: Visit `/admin/codes` (requires authentication)
2. **Generate Codes**: Create new registration codes as needed
3. **Monitor Usage**: Track which codes are used and by whom

## Security Features

- **Password Hashing**: All passwords are hashed using bcryptjs
- **JWT Tokens**: Secure token-based authentication
- **Input Validation**: Comprehensive validation on all inputs
- **Error Handling**: Secure error messages without exposing sensitive data
- **Token Expiration**: Automatic token expiration and renewal

## Environment Variables

Add to your `.env.local` file:
```
JWT_SECRET=your-secret-key-change-in-production
```

## Dependencies

- `@tanstack/react-query` - State management
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT handling
- `@types/bcryptjs` - TypeScript types
- `@types/jsonwebtoken` - TypeScript types

## Data Storage

The system uses local JSON files for data storage:
- `data/users.json` - User accounts and information
- `data/unique-codes.json` - Registration codes and usage tracking

## React Query Integration

The authentication system is fully integrated with React Query for:
- **Caching**: Automatic caching of user data and tokens
- **State Management**: Centralized state management
- **Optimistic Updates**: Immediate UI updates with background sync
- **Error Handling**: Automatic error handling and retry logic

## Protected Routes

The following routes require authentication:
- `/dashboard` - Main user dashboard
- `/admin/codes` - Admin panel
- `/wizary-exam` - Exam taking interface
- `/qbank` - Question bank

## Code Generation

Registration codes follow the format: `MBHA2024-XXX` where XXX is a sequential number.

## Future Enhancements

- Database integration (PostgreSQL, MongoDB)
- Email verification
- Password reset functionality
- Role-based access control
- Session management
- Rate limiting
- Two-factor authentication 