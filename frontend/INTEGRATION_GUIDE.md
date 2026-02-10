# Frontend - Backend Integration Guide

## Overview

The frontend is now fully integrated with the backend authentication system. This guide explains how to use the login functionality and manage authentication state.

## Architecture

### Files Created

#### 1. **API Configuration** - `src/infrastructure/config/api.config.ts`

- Contains API base URL, endpoints, and storage keys
- Configure `VITE_API_BASE_URL` in `.env` file
- Default: `http://localhost:5000/api`

#### 2. **Type Definitions** - `src/core/domain/types.ts`

- TypeScript interfaces for User, Organization, Chat, Document
- Enums for UserRole and UserStatus
- API request/response types

#### 3. **API Client** - `src/infrastructure/api/client.ts`

- Axios instance with interceptors
- Automatically adds JWT token to requests
- Handles 401 errors (auto-logout and redirect)

#### 4. **Auth Service** - `src/infrastructure/api/auth.service.ts`

- `login(credentials)` - Login with email/password
- `logout()` - Logout and clear storage
- `getProfile()` - Get current user profile
- `updateProfile(data)` - Update user profile
- `changePassword()` - Change password
- `isAuthenticated()` - Check if user is logged in

#### 5. **Organization Service** - `src/infrastructure/api/organization.service.ts`

- `createOrganization(data)` - Create new organization
- `getMyOrganization()` - Get user's organization
- `updateOrganization()` - Update organization
- And more...

#### 6. **Auth Store** - `src/presentation/stores/authStore.ts`

- Global state management using Zustand
- Stores user, token, authentication status
- Handles loading and error states

#### 7. **Login Component** - `src/presentation/components/features/login/Login.tsx`

- Updated with form handling and API integration
- Shows loading state during login
- Displays error messages
- Includes default admin credentials hint

## Usage

### 1. Login Flow

```tsx
import { useAuthStore } from "@/presentation/stores/authStore";

const MyComponent = () => {
  const { login, user, isAuthenticated, isLoading, error } = useAuthStore();

  const handleLogin = async () => {
    try {
      await login("admin123@gmail.com", "admin123");
      // Login successful - user is now authenticated
      console.log("Logged in user:", user);
    } catch (error) {
      // Error is displayed in the UI automatically
      console.error("Login failed:", error);
    }
  };

  return (
    <div>
      {isAuthenticated ? (
        <p>Welcome, {user?.firstName}!</p>
      ) : (
        <button onClick={handleLogin} disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </button>
      )}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};
```

### 2. Protected Routes

```tsx
import { useAuthStore } from "@/presentation/stores/authStore";
import { Navigate } from "@tanstack/react-router";

const ProtectedPage = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  return <div>Protected Content</div>;
};
```

### 3. Check User Role

```tsx
import { useAuthStore } from "@/presentation/stores/authStore";
import { UserRole } from "@/core/domain/types";

const AdminPanel = () => {
  const user = useAuthStore((state) => state.user);

  if (user?.role !== UserRole.SUPER_ADMIN && user?.role !== UserRole.CEO) {
    return <p>Access Denied</p>;
  }

  return <div>Admin Panel</div>;
};
```

### 4. Logout

```tsx
import { useAuthStore } from "@/presentation/stores/authStore";

const LogoutButton = () => {
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    await logout();
    // User is logged out, token cleared, redirected to home
  };

  return <button onClick={handleLogout}>Logout</button>;
};
```

### 5. Using Other Services

```tsx
import { organizationService } from "@/infrastructure/api/organization.service";

const CreateOrgButton = () => {
  const handleCreateOrg = async () => {
    try {
      const org = await organizationService.createOrganization({
        name: "My Company",
        domain: "mycompany.com",
      });
      console.log("Organization created:", org);
    } catch (error) {
      console.error("Failed to create organization:", error);
    }
  };

  return <button onClick={handleCreateOrg}>Create Organization</button>;
};
```

## Environment Configuration

Create a `.env` file in the `frontend` directory:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## Default Admin Credentials

- **Email**: admin123@gmail.com
- **Password**: admin123

These credentials are automatically seeded when the backend starts for the first time.

## User Flow After Login

1. **Login** with default credentials (admin123@gmail.com / admin123)
2. **Create Organization** - User becomes CEO of the organization
3. **Update Profile** - Change email, first name, last name via dashboard
4. **Change Password** - Change from default admin123 to secure password
5. **Manage Users** - Add team members, assign roles

## Role Hierarchy

```
SUPER_ADMIN (highest)
└── CEO
    └── MANAGER
        ├── DEVELOPER
        ├── SUPPORT
        ├── HR
        └── FINANCE
```

## API Response Format

All API responses follow this structure:

```typescript
{
  success: boolean;
  message?: string;
  data?: any;
  error?: string;
}
```

## Error Handling

- **401 Unauthorized**: Auto-logout and redirect to login page
- **Network errors**: Displayed in UI via error state
- **Validation errors**: Show field-specific error messages

## Authentication State Persistence

- JWT token stored in `localStorage` under key `access_token`
- User data stored in `localStorage` under key `user_data`
- Auth state automatically restored on page refresh

## Testing the Integration

### Step 1: Start Backend

```bash
cd backend
npm run dev
```

Backend will run on `http://localhost:5000`

### Step 2: Start Frontend

```bash
cd frontend
npm run dev
```

Frontend will run on `http://localhost:5173`

### Step 3: Test Login

1. Open `http://localhost:5173` in browser
2. Click on Login button
3. Enter default credentials:
   - Email: `admin123@gmail.com`
   - Password: `admin123`
4. You should be logged in and redirected to dashboard

### Step 4: Check Browser Storage

Open browser DevTools > Application > Local Storage > `http://localhost:5173`

You should see:

- `access_token`: JWT token
- `user_data`: User object JSON

## Next Steps

1. **Create Dashboard Page** - Display user info and organization details
2. **Add Protected Routes** - Implement route guards for authenticated pages
3. **Create Organization Form** - Allow users to create/join organizations
4. **Profile Settings Page** - Update email, password, personal info
5. **User Management** - CRUD operations for team members
6. **Chat Interface** - AI-powered technical support chat
7. **Document Upload** - Upload and manage knowledge base documents

## Common Issues

### CORS Errors

- Ensure backend CORS is configured to allow `http://localhost:5173`
- Check backend `src/index.ts` CORS configuration

### 401 Errors

- Check if JWT token is present in request headers
- Verify token hasn't expired (7-day validity)
- Ensure backend JWT_SECRET matches

### Network Errors

- Verify backend is running on port 5000
- Check `.env` file has correct `VITE_API_BASE_URL`
- Ensure MongoDB is running

## Additional Resources

- **Backend API Documentation**: See `backend/README.md`
- **Quick Start Guide**: See `backend/QUICK_START.md`
- **Project Structure**: See `backend/BACKEND_STRUCTURE.md`
