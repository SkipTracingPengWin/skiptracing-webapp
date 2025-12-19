# Authentication Integration Guide

## Overview
Complete authentication system setup with login and registration pages, integrated with Zustand store and API services.

## Architecture

### 1. **Auth Service** (`src/services/auth.ts`)
API communication layer that handles:
- **Register**: POST `/auth/register` - Creates new user account
- **Login**: POST `/auth/login` - Authenticates user
- **GetCurrentUser**: GET `/auth/profile` - Fetches authenticated user profile

**Key Features:**
- Automatic role conversion to uppercase (admin → ADMIN, manager → MANAGER, agent → AGENT)
- Token and user data normalization
- Error handling and logging

### 2. **Auth Store** (`src/store/auth.store.ts`)
Zustand state management with persistence:

**State:**
- `user`: Current authenticated user
- `isAuthenticated`: Boolean flag for auth status
- `loading`: Request loading state
- `error`: Error messages

**Actions:**
- `login(credentials)`: Authenticate user with email/password
- `register(data)`: Create new user account
- `logout()`: Clear authentication
- `checkAuth()`: Verify authentication status
- `clearError()`: Clear error messages

**Features:**
- Automatic persistence to localStorage
- Integration with auth utilities for secure storage
- Proper error handling with fallbacks

### 3. **Login Page** (`src/app/auth/login/page.tsx`)
Interactive login interface:

**Features:**
- Email and password input fields
- "Show/Hide password" toggle
- Real-time error display
- Loading state on submit button
- Forgot password link
- Link to registration page
- Integration with auth store
- Automatic redirect to `/dashboard` on success

**Form Handling:**
```typescript
// Example usage
const { loading, error, login } = useAuthStore();
await login({ email, password });
```

### 4. **Register Page** (`src/app/auth/register/page.tsx`)
New account creation interface:

**Fields:**
- Full Name
- Work Email
- Role (Admin, Manager, Agent)
- Password
- Password visibility toggle

**Features:**
- Form validation
- Real-time error display
- Loading state
- Role selection dropdown
- Terms & Privacy Policy links
- Link to login page
- Automatic redirect to `/dashboard` on success

**Form Handling:**
```typescript
// Example usage
const { loading, error, register } = useAuthStore();
await register({ name, email, password, role });
```

## API Endpoints

All endpoints are relative to: `http://localhost:5000/api`

### Register Endpoint
**Request:**
```bash
POST /auth/register
Content-Type: application/json

{
  "name": "tata",
  "email": "thathaji1@example.com",
  "password": "Thathaji",
  "role": "ADMIN"
}
```

**Expected Response:**
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "email": "thathaji1@example.com",
    "name": "tata",
    "role": "ADMIN"
  }
}
```

### Login Endpoint
**Request:**
```bash
POST /auth/login
Content-Type: application/json

{
  "email": "thathaji1@example.com",
  "password": "Thathaji"
}
```

**Expected Response:**
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "email": "thathaji1@example.com",
    "name": "tata",
    "role": "ADMIN"
  }
}
```

### Profile Endpoint
**Request:**
```bash
GET /auth/profile
Authorization: Bearer jwt_token_here
```

**Expected Response:**
```json
{
  "id": "user_id",
  "email": "thathaji1@example.com",
  "name": "tata",
  "role": "ADMIN"
}
```

## Data Flow

### Login Flow
```
User Input → Login Page
    ↓
useAuthStore.login()
    ↓
authService.login()
    ↓
API POST /auth/login
    ↓
Response with token & user
    ↓
authUtils.saveAuth() → localStorage
    ↓
Store updated
    ↓
Redirect to /dashboard
```

### Register Flow
```
User Input → Register Page
    ↓
useAuthStore.register()
    ↓
authService.register()
    ↓
API POST /auth/register
    ↓
Response with token & user
    ↓
authUtils.saveAuth() → localStorage
    ↓
Store updated
    ↓
Redirect to /dashboard
```

## Storage

### localStorage Keys
- `token`: JWT authentication token
- `user`: Stringified user object
- `auth-store`: Zustand persist data

### Cookies
- `token`: JWT token (24-hour expiry)
- `role`: User role (24-hour expiry)

## Error Handling

Both login and register pages display errors with:
- Red background styling
- Clear error messages
- Both local and store error states
- User-friendly fallback messages

## Configuration

### Environment Variables
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Default fallback: `http://localhost:5000/api`

## Security Features

1. **Token Management**: JWT stored in localStorage and cookies
2. **Authorization Headers**: Automatically attached to all API requests
3. **Password Fields**: Support for show/hide toggle
4. **Role-Based Validation**: Proper role handling (ADMIN, MANAGER, AGENT)
5. **Secure Token Handling**: No token exposure in logs

## Usage Examples

### Use Store in Components
```typescript
import { useAuthStore } from '@/store/auth.store';

export function MyComponent() {
    const { user, isAuthenticated, login } = useAuthStore();
    
    return (
        <div>
            {isAuthenticated && <p>Welcome, {user?.name}!</p>}
        </div>
    );
}
```

### Check Authentication
```typescript
import { useAuthStore } from '@/store/auth.store';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function ProtectedComponent() {
    const { isAuthenticated } = useAuthStore();
    const router = useRouter();
    
    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/auth/login');
        }
    }, [isAuthenticated]);
}
```

## Testing Sample User

Use this data to test the authentication flow:
```json
{
  "name": "tata",
  "email": "thathaji1@example.com",
  "password": "Thathaji",
  "role": "ADMIN"
}
```

## Troubleshooting

### Issue: "No token found" warning
- Ensure `/auth/login` or `/auth/register` was completed successfully
- Check localStorage for `token` key
- Verify API response includes `token` field

### Issue: CORS errors
- Ensure backend API is running on `http://localhost:5000`
- Check CORS configuration on backend

### Issue: Invalid login response
- Verify API returns both `token` and `user` fields
- Check user object has required fields: `id`, `email`, `name`, `role`

### Issue: Redirect not working
- Ensure Next.js router is properly imported from `next/navigation`
- Check browser console for errors
- Verify `/dashboard` route exists

## Next Steps

1. Connect to backend API at `http://localhost:5000/api`
2. Implement `/dashboard` route
3. Add role-based redirects based on user role
4. Implement forgot password functionality
5. Add email verification (optional)
6. Set up session refresh logic
