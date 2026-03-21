# Profile System Documentation

## Overview
The profile system provides complete user profile management functionality including profile updates, password changes, and account deletion with proper security measures.

## Features

### 1. Profile Management
- **View Profile**: Display user information (name, email, phone, role)
- **Edit Profile**: Update name and phone number with validation
- **Avatar Support**: Profile picture handling (ready for implementation)

### 2. Password Management
- **Secure Password Change**: Requires current password verification
- **Password Validation**: Minimum 6 characters requirement
- **Hashed Storage**: Passwords are securely hashed using bcrypt

### 3. Account Deletion
- **Safe Deletion**: Multi-step confirmation process
- **Data Cleanup**: Automatic deletion of related data (favorites, contacts, schedules)
- **Admin Protection**: Admin accounts cannot be deleted through the interface
- **Property Protection**: Users with properties cannot delete accounts

## API Endpoints

### GET /api/user/profile
Retrieve current user profile information.

**Headers:**
- `Authorization: Bearer <token>`

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "role": "user",
    "avatar_url": null,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### PUT /api/user/profile
Update user profile information.

**Headers:**
- `Authorization: Bearer <token>`
- `Content-Type: application/json`

**Body:**
```json
{
  "name": "John Doe Updated",
  "phone": "+1234567890",
  "avatar_url": "https://example.com/avatar.jpg"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "user": { ... }
}
```

### PUT /api/user/password
Change user password.

**Headers:**
- `Authorization: Bearer <token>`
- `Content-Type: application/json`

**Body:**
```json
{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

### DELETE /api/user/account
Delete user account and all related data.

**Headers:**
- `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "message": "Account deleted successfully"
}
```

## Frontend Components

### useProfile Hook
Custom React hook for profile management.

```typescript
const { 
  user, 
  loading, 
  error, 
  updateProfile, 
  deleteAccount, 
  changePassword, 
  clearError 
} = useProfile();
```

**Methods:**
- `updateProfile(data)`: Update profile information
- `changePassword(current, new)`: Change password
- `deleteAccount()`: Delete account (with confirmation)
- `clearError()`: Clear error messages

### Profile Page Features

#### Profile Display
- Shows current user information
- Real-time data updates
- Responsive design

#### Profile Editing
- Inline editing with form validation
- Phone number format validation
- Name length requirements (2-255 characters)

#### Password Change Modal
- Current password verification
- New password confirmation
- Real-time validation feedback

#### Account Deletion Modal
- Type "DELETE" confirmation
- Information about what will be deleted
- Backend protection for admin accounts

## Security Features

### Authentication
- JWT token-based authentication
- Token validation on all API endpoints
- Automatic token refresh

### Password Security
- bcrypt hashing for password storage
- Minimum password requirements
- Current password verification for changes

### Account Protection
- Admin accounts cannot be deleted
- Property ownership validation
- Cascading data deletion

### Input Validation
- Server-side validation on all inputs
- Client-side validation for better UX
- SQL injection prevention through Prisma

## Database Schema

### User Model
```prisma
model User {
  id         String     @id @default(uuid()) @db.Uuid
  createdAt  DateTime   @default(now()) @map("created_at")
  email      String     @unique @db.VarChar(255)
  name       String     @db.VarChar(255)
  phone      String?    @db.VarChar(50)
  avatarUrl  String?    @map("avatar_url") @db.VarChar(255)
  password   String     @db.VarChar(255)
  role       UserRole   @default(user)
  
  properties Property[]
  favorites  Favorite[]
  
  @@map("users")
}
```

## Error Handling

### API Error Responses
```json
{
  "error": "Error message",
  "details": "Additional error details"
}
```

### Common Error Codes
- `400`: Bad Request (validation errors)
- `401`: Unauthorized (invalid/missing token)
- `403`: Forbidden (admin account deletion)
- `404`: Not Found (user not found)
- `500`: Internal Server Error

## Usage Examples

### Updating Profile
```javascript
const result = await updateProfile({
  name: "John Doe",
  phone: "+1234567890"
});

if (result.success) {
  console.log("Profile updated!");
} else {
  console.error("Error:", result.error);
}
```

### Changing Password
```javascript
const result = await changePassword("oldPass123", "newPass456");

if (result.success) {
  console.log("Password changed!");
} else {
  console.error("Error:", result.error);
}
```

### Deleting Account
```javascript
// This requires user confirmation in the UI
const result = await deleteAccount();

if (result.success) {
  // User will be redirected to login page
  console.log("Account deleted!");
}
```

## Testing

### Manual Testing
1. Log in to the application
2. Navigate to `/profile`
3. Test profile editing
4. Test password change
5. Test account deletion (with confirmation)

### API Testing
Use the provided test script `test-profile-api.js` in browser console.

## Future Enhancements

### Planned Features
- Avatar upload functionality
- Email verification for profile changes
- Two-factor authentication
- Account activity logging
- Profile privacy settings

### Scalability Considerations
- Profile data caching
- Image CDN integration for avatars
- Audit trail for profile changes
- Rate limiting on sensitive operations

## Troubleshooting

### Common Issues

#### Profile Not Updating
- Check authentication token
- Verify API endpoint is reachable
- Check browser console for errors

#### Password Change Failing
- Verify current password is correct
- Check new password meets requirements
- Ensure token is valid

#### Account Deletion Blocked
- Check if user has admin role
- Verify user has no properties
- Check for related data constraints

### Debug Steps
1. Check browser console for JavaScript errors
2. Verify network requests in dev tools
3. Check server logs for API errors
4. Validate database schema is up to date

## Support

For issues or questions about the profile system:
1. Check this documentation
2. Review browser console errors
3. Test with the provided API test script
4. Contact development team with specific error details
