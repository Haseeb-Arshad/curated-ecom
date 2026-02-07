# Backend-Frontend Connectivity Testing

This document describes how to test the connection between the frontend and backend.

## Prerequisites

1. **Backend Server**: The backend should be running on port 8787 (or configured port)
2. **Environment Variables**: Set `VITE_API_BASE_URL` for the frontend to connect to the backend

## Testing Methods

### Method 1: Command Line Test Script

A Node.js script that tests backend endpoints from the command line.

**Usage:**

```bash
# Start the backend first (in one terminal)
cd backend
bun run dev

# In another terminal, run the test script
node test-connectivity.js

# Or with custom API URL
VITE_API_BASE_URL=http://localhost:8787 node test-connectivity.js
```

**What it tests:**
- Health check endpoint (`/health`)
- CORS configuration
- Products list endpoint (`/api/products`)
- Categories endpoint (`/api/categories`)
- Brands endpoint (`/api/brands`)
- Cart endpoint (`/api/cart`)
- Reviews endpoint (`/api/reviews`)

### Method 2: Frontend Test Page

A visual test page accessible from the browser.

**Usage:**

1. Set the environment variable:
   ```bash
   # Windows (PowerShell)
   $env:VITE_API_BASE_URL="http://localhost:8787"
   
   # Windows (CMD)
   set VITE_API_BASE_URL=http://localhost:8787
   
   # Linux/Mac
   export VITE_API_BASE_URL=http://localhost:8787
   ```

2. Start the frontend:
   ```bash
   npm run dev
   ```

3. Navigate to: `http://localhost:5173/test-backend`

4. Click "Run Tests" to execute all connectivity tests

**What it shows:**
- Current API base URL configuration
- Frontend origin
- Test results for each endpoint
- Response data (expandable)
- Error messages if any

## Expected Results

### Successful Connection

- ✅ Health check returns `{ ok: true }`
- ✅ Products endpoint returns `{ items: [...], page: 1, limit: 12, total: N }`
- ✅ Categories endpoint returns array or object with items
- ✅ Brands endpoint returns array or object with items
- ✅ CORS headers are properly configured

### Common Issues

1. **Connection Refused**
   - Backend is not running
   - Wrong port number
   - Firewall blocking the connection

2. **CORS Errors**
   - Check `ALLOWED_ORIGIN` environment variable in backend
   - Ensure frontend origin matches allowed origin

3. **404 Not Found**
   - Check API route paths
   - Verify backend routes are properly registered

4. **Empty Responses**
   - Database might be empty (this is OK for testing)
   - Check Supabase configuration if using database

## Environment Variables

### Backend (`backend/.env` or environment)

```env
PORT=8787
ALLOWED_ORIGIN=http://localhost:5173
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
```

### Frontend (set before `npm run dev`)

```env
VITE_API_BASE_URL=http://localhost:8787
```

## Quick Test Checklist

- [ ] Backend is running (`cd backend && bun run dev`)
- [ ] Frontend can access `/test-backend` page
- [ ] Health check endpoint responds
- [ ] Products endpoint returns data (or empty array)
- [ ] CORS headers are present
- [ ] No console errors in browser

## Notes

- The test page is excluded from search engines (`noindex` meta tag)
- Both test methods check the same endpoints
- The frontend test page provides visual feedback
- The command-line script is useful for CI/CD pipelines

