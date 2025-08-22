# 🚀 e-Bus Deployment Guide

This guide covers deploying your e-Bus application to various platforms with optimal performance and security.

## 📋 Pre-Deployment Checklist

- [ ] All features tested locally
- [ ] Environment variables configured
- [ ] Performance optimizations applied
- [ ] Security measures implemented
- [ ] Database configured (if using real database)
- [ ] Payment gateway integrated (if needed)

## 🌐 Deployment Options

### 1. Vercel (Recommended)

Vercel provides the best Next.js deployment experience with zero configuration.

#### Step 1: Prepare for Deployment
```bash
# Ensure all dependencies are installed
npm install

# Test the build locally
npm run build
npm start
```

#### Step 2: Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow the prompts:
# - Link to existing project or create new
# - Select framework preset: Next.js
# - Configure project settings
```

#### Step 3: Configure Environment Variables
In your Vercel dashboard:
1. Go to Project Settings → Environment Variables
2. Add the following variables:

```env
JWT_SECRET=your-super-secret-production-key-make-it-long-and-random-123456789
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://your-app-name.vercel.app
```

#### Step 4: Deploy to Production
```bash
vercel --prod
```

### 2. Netlify

#### Step 1: Build Configuration
Create `netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

#### Step 2: Deploy
1. Connect your Git repository to Netlify
2. Configure build settings
3. Add environment variables
4. Deploy

### 3. Railway

#### Step 1: Install Railway CLI
```bash
npm install -g @railway/cli
```

#### Step 2: Deploy
```bash
railway login
railway init
railway up
```

### 4. DigitalOcean App Platform

1. Connect your GitHub repository
2. Configure build settings:
   - Build Command: `npm run build`
   - Run Command: `npm start`
3. Add environment variables
4. Deploy

## 🔧 Production Optimizations

### Performance Optimizations

1. **Enable Compression**
```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['localhost'],
    formats: ['image/webp', 'image/avif'],
  },
}

module.exports = nextConfig
```

2. **Add Security Headers**
```javascript
// next.config.js
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ]
  },
}
```

### Database Integration

For production, replace mock data with a real database:

#### PostgreSQL with Supabase
```bash
npm install @supabase/supabase-js
```

```javascript
// lib/supabase.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)
```

#### MongoDB with Atlas
```bash
npm install mongodb
```

```javascript
// lib/mongodb.js
import { MongoClient } from 'mongodb'

const client = new MongoClient(process.env.MONGODB_URI)
export default client
```

### Email Integration

Add email notifications for bookings:

```bash
npm install nodemailer
```

```javascript
// lib/email.js
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export async function sendBookingConfirmation(booking) {
  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: booking.email,
    subject: 'Booking Confirmation - e-Bus',
    html: `
      <h1>Booking Confirmed!</h1>
      <p>Your booking reference: ${booking.bookingReference}</p>
      <p>Trip: ${booking.tripRoute}</p>
      <p>Date: ${booking.tripDate}</p>
      <p>Seats: ${booking.selectedSeats.join(', ')}</p>
    `,
  })
}
```

## 🔒 Security Best Practices

### 1. Environment Variables
Never commit sensitive data. Use environment variables:

```env
# Production environment variables
JWT_SECRET=very-long-random-string-for-production-use-only
DATABASE_URL=your-production-database-url
SMTP_HOST=your-smtp-host
SMTP_USER=your-email
SMTP_PASS=your-email-password
PAYSTACK_SECRET_KEY=your-paystack-secret
```

### 2. Rate Limiting
Add rate limiting to prevent abuse:

```bash
npm install @vercel/kv
```

```javascript
// lib/rate-limit.js
import { kv } from '@vercel/kv'

export async function rateLimit(identifier, limit = 10, window = 60000) {
  const key = `rate_limit:${identifier}`
  const current = await kv.get(key) || 0
  
  if (current >= limit) {
    return false
  }
  
  await kv.incr(key)
  await kv.expire(key, Math.ceil(window / 1000))
  
  return true
}
```

### 3. Input Validation
Validate all inputs on both client and server:

```javascript
// lib/validation.js
export function validateBooking(data) {
  const errors = []
  
  if (!data.passengerName || data.passengerName.trim().length < 2) {
    errors.push('Name must be at least 2 characters')
  }
  
  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('Valid email is required')
  }
  
  if (!data.phone || !/^(\+234|0)[7-9][0-1]\d{8}$/.test(data.phone)) {
    errors.push('Valid Nigerian phone number is required')
  }
  
  return errors
}
```

## 📊 Monitoring and Analytics

### 1. Add Google Analytics
```javascript
// app/layout.tsx
import Script from 'next/script'

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
          `}
        </Script>
      </head>
      <body>{children}</body>
    </html>
  )
}
```

### 2. Error Tracking with Sentry
```bash
npm install @sentry/nextjs
```

```javascript
// sentry.client.config.js
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
})
```

## 🧪 Testing in Production

### 1. Smoke Tests
Test all critical paths:
- [ ] Homepage loads correctly
- [ ] Trip search works
- [ ] Booking process completes
- [ ] Authentication works
- [ ] All APIs respond correctly

### 2. Performance Testing
Use tools like:
- Lighthouse for performance audits
- WebPageTest for detailed analysis
- GTmetrix for speed insights

### 3. Cross-browser Testing
Test on:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile browsers

## 📱 Mobile Testing

Test on various devices:
- [ ] iPhone (various sizes)
- [ ] Android phones
- [ ] Tablets (iPad, Android)
- [ ] Desktop (1920x1080, 2560x1440)

## 🚨 Post-Deployment Checklist

- [ ] SSL certificate installed
- [ ] Custom domain configured
- [ ] CDN enabled (if applicable)
- [ ] Monitoring set up
- [ ] Backup strategy implemented
- [ ] Error tracking configured
- [ ] Performance monitoring active
- [ ] Security headers verified

## 🔄 Continuous Deployment

Set up automatic deployments:

### GitHub Actions
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - run: npm run test
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

## 📞 Support and Maintenance

### Regular Maintenance Tasks
- [ ] Update dependencies monthly
- [ ] Monitor error logs daily
- [ ] Review performance metrics weekly
- [ ] Backup database daily
- [ ] Security audit quarterly

### Getting Help
- Check the [README.md](README.md) for basic setup
- Review API documentation
- Contact support: support@techlogix.com
- Phone: +234 810 733 8827

---

**🎉 Congratulations! Your e-Bus application is now ready for the world!**

Remember to monitor your application closely after deployment and be ready to make adjustments based on user feedback and usage patterns.
