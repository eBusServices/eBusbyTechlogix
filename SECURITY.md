# Security Configuration Guide

## 🔒 Environment Variables Setup

This application uses environment variables to securely manage credentials and sensitive configuration. **Never commit actual credentials to the repository.**

### Required Environment Variables

Create a `.env.local` file in the project root with the following variables:

```env
# JWT Secret (generate a strong random string)
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters

# Admin Credentials (for demo purposes)
ADMIN_EMAIL=your_admin_email@example.com
ADMIN_PASSWORD_HASH=your_bcrypt_hashed_password_here

# Driver Credentials (for demo purposes)
DRIVER_ID=your_driver_id_here
DRIVER_PASSWORD_HASH=your_bcrypt_hashed_password_here

# Database Configuration (when using real database)
DATABASE_URL=your_database_connection_string_here

# Email Configuration (for notifications)
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_email@example.com
SMTP_PASS=your_email_password

# Deployment Settings
NEXT_PUBLIC_VERCEL_URL=your-domain.vercel.app
NODE_ENV=production
```

## 🔐 Password Hashing

All passwords must be hashed using bcrypt. To generate password hashes:

```javascript
const bcrypt = require('bcryptjs');
const saltRounds = 12;

// Hash a password
const hashedPassword = await bcrypt.hash('your_password', saltRounds);
console.log(hashedPassword);
```

## 🛡️ Security Best Practices

### 1. JWT Secret
- Use a strong, random string (minimum 32 characters)
- Never use the same secret across environments
- Rotate secrets regularly

### 2. Password Security
- All passwords are hashed with bcrypt (12 rounds)
- No plaintext passwords stored anywhere
- Use strong passwords for all accounts

### 3. Environment Variables
- Never commit `.env.local` or `.env` files
- Use different credentials for development/production
- Store production secrets in Vercel environment variables

### 4. API Security
- All authentication endpoints validate input
- JWT tokens expire after 7 days
- Role-based access control implemented

## 🚀 Vercel Deployment Security

### Environment Variables in Vercel:
1. Go to your Vercel project dashboard
2. Navigate to Settings > Environment Variables
3. Add all required variables for production

### Required Vercel Environment Variables:
```
JWT_SECRET=your_production_jwt_secret
ADMIN_EMAIL=your_production_admin_email
ADMIN_PASSWORD_HASH=your_production_admin_password_hash
DRIVER_ID=your_production_driver_id
DRIVER_PASSWORD_HASH=your_production_driver_password_hash
```

## 🔍 Security Checklist

- [ ] All credentials moved to environment variables
- [ ] No hardcoded passwords in source code
- [ ] Strong JWT secret configured
- [ ] Bcrypt password hashing implemented
- [ ] Role-based access control active
- [ ] Production environment variables set
- [ ] `.env.local` added to `.gitignore`
- [ ] Regular security audits performed

## 📞 Support

For security concerns or credential access:
- **Technical Support:** +234 810 733 8827
- **Driver Dispatch:** +234 810 733 8830
- **Emergency Contact:** Available 24/7

## ⚠️ Important Notes

1. **Never share credentials in public channels**
2. **Change default passwords immediately**
3. **Use unique passwords for each environment**
4. **Monitor access logs regularly**
5. **Report security issues immediately**

---

**This application is now secure and ready for production deployment with proper credential management.**
