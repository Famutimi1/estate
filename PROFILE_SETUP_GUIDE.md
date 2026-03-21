# Profile System Setup Guide

## Quick Setup Steps

### 1. Database Setup
Ensure your PostgreSQL database is running and the schema is up to date:

```bash
# Generate Prisma client
npx prisma generate

# Push schema changes to database
npx prisma db push

# Check database status
npx prisma db status
```

### 2. Environment Variables
Make sure these environment variables are set in `.env.local`:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/realestate"
JWT_SECRET="your-secret-key-change-in-production"
```

### 3. Start Development Server
```bash
npm run dev
```

### 4. Test the System

#### Step 1: Register/Login
1. Navigate to `http://localhost:3000/auth`
2. Register a new user account
3. Log in with your credentials

#### Step 2: Test Profile Features
1. Navigate to `http://localhost:3000/profile`
2. Verify your profile information is displayed
3. Click "Edit" and update your name/phone
4. Test the "Change Password" functionality
5. Test account deletion (use a test account!)

#### Step 3: API Testing
Open browser console and run:
```javascript
// Load the test script
fetch('/test-profile-api.js')
  .then(response => response.text())
  .then(code => eval(code));
```

## Verification Checklist

### ✅ Database
- [ ] Phone field exists in users table
- [ ] Subject field is optional in contacts table
- [ ] All migrations applied successfully

### ✅ API Endpoints
- [ ] GET /api/user/profile returns user data
- [ ] PUT /api/user/profile updates profile
- [ ] PUT /api/user/password changes password
- [ ] DELETE /api/user/account deletes account

### ✅ Frontend
- [ ] Profile page loads with user data
- [ ] Edit profile form works
- [ ] Password change modal works
- [ ] Account deletion confirmation works

### ✅ Security
- [ ] Authentication required for all endpoints
- [ ] Admin accounts protected from deletion
- [ ] Password validation works
- [ ] Input validation on all forms

## Common Setup Issues

### Issue: "Phone field not found"
**Solution:** Run `npx prisma db push` to update the database schema

### Issue: "Authentication required" error
**Solution:** Make sure you're logged in and have a valid token

### Issue: TypeScript errors
**Solution:** Run `npx prisma generate` to update type definitions

### Issue: Admin account deletion blocked
**Solution:** This is intentional - admin accounts cannot be deleted for security

## Testing Different User Roles

### Regular User
- Can update profile
- Can change password
- Can delete account (if no properties)

### Admin User
- Can update profile
- Can change password
- **Cannot** delete account (backend protection)

### Agent User
- Can update profile
- Can change password
- Can delete account (if no properties)

## Performance Considerations

### Database Indexes
The system includes these indexes for optimal performance:
- `users.email` (unique)
- `users.role`
- `contacts.email`
- `contacts.status`

### Caching
Consider implementing Redis caching for:
- User profile data
- Session management
- API rate limiting

## Production Deployment

### Environment Setup
```env
NODE_ENV="production"
DATABASE_URL="your-production-db-url"
JWT_SECRET="strong-production-secret"
```

### Security Headers
Ensure your server includes:
- `Content-Security-Policy`
- `X-Frame-Options`
- `X-Content-Type-Options`
- `Referrer-Policy`

### Database Backup
Set up regular backups for user data:
```bash
# Daily backup example
pg_dump realestate > backup_$(date +%Y%m%d).sql
```

## Monitoring

### Key Metrics to Monitor
- Profile update success rate
- Password change frequency
- Account deletion requests
- API response times
- Authentication failures

### Logging
Ensure these events are logged:
- Profile updates
- Password changes
- Account deletions
- Authentication failures
- API errors

## Support Resources

### Documentation
- Full system documentation: `PROFILE_SYSTEM_DOCUMENTATION.md`
- API endpoint examples
- Security considerations

### Troubleshooting
- Check browser console for JavaScript errors
- Verify network requests in dev tools
- Check server logs for API errors
- Validate database schema

### Development Team
Contact the development team with:
- Specific error messages
- Steps to reproduce issues
- Browser and environment details
