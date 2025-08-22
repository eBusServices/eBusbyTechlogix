# Database Setup Guide - Real Database Implementation

## 🚀 **Production-Ready Database with Vercel Postgres**

This application now uses a **real database** instead of mock data, ensuring:
- ✅ **Data Persistence** - Data survives server restarts
- ✅ **Security** - Proper authentication and validation
- ✅ **Scalability** - Handle thousands of users and bookings
- ✅ **ACID Compliance** - Reliable transactions
- ✅ **Backup & Recovery** - Data protection

## 📊 **Database Schema**

### **Users Table**
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  username VARCHAR(100) UNIQUE,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20) NOT NULL,
  password TEXT NOT NULL,
  role VARCHAR(20) DEFAULT 'passenger',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_verified BOOLEAN DEFAULT false,
  last_login TIMESTAMP
);
```

### **Drivers Table**
```sql
CREATE TABLE drivers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20) NOT NULL,
  password TEXT NOT NULL,
  license_number VARCHAR(100) NOT NULL,
  experience VARCHAR(50),
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### **Trips Table**
```sql
CREATE TABLE trips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  route VARCHAR(255) NOT NULL,
  from_location VARCHAR(255) NOT NULL,
  to_location VARCHAR(255) NOT NULL,
  departure_time TIME NOT NULL,
  arrival_time TIME NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  total_seats INTEGER NOT NULL,
  available_seats INTEGER NOT NULL,
  trip_date DATE NOT NULL,
  vehicle VARCHAR(255) NOT NULL,
  driver_id UUID REFERENCES drivers(id),
  status VARCHAR(50) DEFAULT 'scheduled',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### **Bookings Table**
```sql
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_reference VARCHAR(100) UNIQUE NOT NULL,
  user_id UUID REFERENCES users(id),
  trip_id UUID REFERENCES trips(id),
  passenger_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255) NOT NULL,
  selected_seats INTEGER[] NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(50) DEFAULT 'confirmed',
  payment_status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🔧 **Setup Instructions**

### **Option 1: Vercel Postgres (Recommended)**

1. **Create Vercel Postgres Database:**
   ```bash
   # In your Vercel project dashboard
   # Go to Storage → Create → Postgres
   # Follow the setup wizard
   ```

2. **Get Connection Details:**
   - Vercel will provide connection URLs automatically
   - Copy the environment variables to your project

3. **Set Environment Variables in Vercel:**
   ```env
   POSTGRES_URL=your_connection_url
   POSTGRES_PRISMA_URL=your_prisma_url
   POSTGRES_URL_NON_POOLING=your_non_pooling_url
   POSTGRES_USER=your_user
   POSTGRES_HOST=your_host
   POSTGRES_PASSWORD=your_password
   POSTGRES_DATABASE=your_database
   JWT_SECRET=your_jwt_secret
   DB_INIT_SECRET=your_init_secret
   ```

### **Option 2: Other Database Providers**

**Supabase:**
```env
POSTGRES_URL=postgresql://user:password@host:5432/database
```

**Railway:**
```env
POSTGRES_URL=postgresql://user:password@host:5432/database
```

**Neon:**
```env
POSTGRES_URL=postgresql://user:password@host:5432/database
```

## 🚀 **Deployment Process**

### **1. Deploy to Vercel:**
```bash
npm run build
vercel --prod
```

### **2. Initialize Database:**
```bash
# After deployment, initialize the database
curl -X POST https://your-domain.vercel.app/api/init-db \
  -H "Authorization: Bearer your_db_init_secret"
```

### **3. Verify Setup:**
- Visit your live site
- Try registering a new user
- Test admin login: admin@techlogix.com / admin123
- Check that data persists between sessions

## 🔒 **Security Features**

### **Environment Variables:**
- All sensitive data stored in environment variables
- Database credentials never exposed in code
- JWT secrets properly configured

### **Authentication:**
- Bcrypt password hashing (12 rounds)
- JWT token-based authentication
- Role-based access control
- Session management

### **Data Validation:**
- Input sanitization on all endpoints
- SQL injection prevention
- XSS protection
- CSRF protection

## 📈 **Performance Optimizations**

### **Database:**
- Connection pooling
- Indexed queries
- Optimized table relationships
- Efficient data types

### **API:**
- Async/await patterns
- Error handling
- Response caching
- Request validation

## 🔧 **Development Setup**

### **Local Development:**
1. **Install Dependencies:**
   ```bash
   npm install @vercel/postgres
   ```

2. **Set Local Environment:**
   ```bash
   # Create .env.local
   cp env.example .env.local
   # Fill in your database credentials
   ```

3. **Initialize Local Database:**
   ```bash
   npm run dev
   # Visit http://localhost:3000/api/init-db
   ```

## 📊 **Database Management**

### **Backup Strategy:**
- Vercel Postgres includes automatic backups
- Point-in-time recovery available
- Export data regularly for additional safety

### **Monitoring:**
- Query performance monitoring
- Connection pool monitoring
- Error rate tracking
- Data growth monitoring

## 🚨 **Troubleshooting**

### **Common Issues:**

**Connection Errors:**
```bash
# Check environment variables
echo $POSTGRES_URL

# Test connection
psql $POSTGRES_URL -c "SELECT version();"
```

**Migration Issues:**
```bash
# Re-run initialization
curl -X POST https://your-domain.vercel.app/api/init-db
```

**Performance Issues:**
- Check query execution plans
- Monitor connection pool usage
- Review database logs

## 📞 **Support**

For database setup assistance:
- **Technical Support:** +234 810 733 8827
- **Email:** support@techlogix.com
- **Documentation:** Check Vercel Postgres docs

---

## 🎉 **Production Ready!**

Your e-Bus platform now has:
- ✅ **Real Database** with full ACID compliance
- ✅ **Data Persistence** across deployments
- ✅ **Secure Authentication** with proper encryption
- ✅ **Scalable Architecture** for growth
- ✅ **Professional Grade** infrastructure

**The mock database has been completely replaced with a production-ready solution!**
