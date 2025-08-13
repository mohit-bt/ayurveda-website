# Admin Guide - Password Management

## 🔐 **For Your Client: How to Change Admin Password**

### **Changing Password (No Technical Skills Needed)**

1. **Login to Admin Panel:**
   - Go to `yourwebsite.com/admin.html`
   - Enter current password
   - Click "Login"

2. **Change Password:**
   - In admin panel, look for "Change Password" button in Quick Actions
   - Click "Change Password"
   - Enter current password
   - Enter new password (minimum 8 characters)
   - Confirm new password
   - Click "Change Password"

3. **After Password Change:**
   - System will automatically log you out
   - Login again with your new password
   - New password is saved permanently

### **Password Requirements:**
- Minimum 8 characters
- Can include letters, numbers, and symbols
- Examples: `MyNewPass2024!` or `SecureAdmin123`

### **Important Notes:**
- ✅ Password is saved permanently (survives server restarts)
- ✅ Old password immediately becomes invalid
- ✅ No need to contact developer to change password
- ✅ Works on any device (mobile, tablet, desktop)

## 🛠️ **For Developer: How It Works**

### **Technical Details:**
- Password stored in `admin-config.json` file
- File is automatically created when password is changed
- Fallback to environment variable or default
- All existing sessions invalidated on password change

### **File Structure:**
```json
{
  "adminPassword": "newpassword123",
  "updatedAt": "2024-08-13T10:30:00.000Z"
}
```

### **Deployment Notes:**
- `admin-config.json` excluded from git (in .gitignore)
- Password persists across deployments
- Client can change password without redeployment
- Environment variables still supported for initial setup

### **Security Features:**
- Current password verification required
- Session invalidation after password change
- Server-side validation and storage
- No password visible in client code
