# Secure Deployment Guide

## 🔒 **Security Checklist Before Deployment:**

### 1. **Set Secure Admin Password**
```bash
# Create .env file
echo "ADMIN_PASSWORD=YourVerySecurePassword123!" > .env
```

### 2. **Environment Variables for Hosting Services**

**Railway.app:**
- Go to project settings → Variables
- Add: `ADMIN_PASSWORD` = `YourSecurePassword`

**Render.com:**
- Go to service settings → Environment
- Add: `ADMIN_PASSWORD` = `YourSecurePassword`

**Cyclic.sh:**
- Go to settings → Environment Variables
- Add: `ADMIN_PASSWORD` = `YourSecurePassword`

### 3. **Password Requirements**
- Minimum 8 characters
- Include uppercase, lowercase, numbers, and symbols
- Example: `MySecurePass2024!@#`

## 🚀 **Deployment Steps:**

1. **Update password** (set environment variable)
2. **Test locally** with new password
3. **Push to GitHub** (`.env` is ignored by git)
4. **Deploy to hosting service**
5. **Set environment variable** on hosting platform
6. **Test admin login** on live site

## 🔧 **Post-Deployment:**

- Test admin login with new password
- Verify all CRUD operations work
- Check image uploads
- Confirm unauthorized access is blocked

## 🆘 **Troubleshooting:**

**Admin login fails:**
- Check environment variable is set correctly
- Ensure no extra spaces in password
- Check server logs for errors

**API calls fail:**
- Check browser network tab for 401 errors
- Verify authentication token is being sent
- Clear browser cache and localStorage
