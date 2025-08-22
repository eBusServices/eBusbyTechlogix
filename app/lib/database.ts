// Real Database Implementation using Vercel Postgres
import { sql } from '@vercel/postgres'
import * as bcrypt from 'bcryptjs'

export interface User {
  id: string
  name: string
  username?: string
  email: string
  phone: string
  password: string
  role: 'admin' | 'passenger' | 'driver'
  created_at: string
  is_verified: boolean
  last_login?: string
}

export interface Driver {
  id: string
  driver_id: string
  name: string
  email: string
  phone: string
  password: string
  license_number: string
  experience: string
  status: 'active' | 'inactive'
  created_at: string
}

export interface Trip {
  id: string
  route: string
  from_location: string
  to_location: string
  departure_time: string
  arrival_time: string
  price: number
  total_seats: number
  available_seats: number
  trip_date: string
  vehicle: string
  driver_id?: string
  status: string
  created_at: string
}

export interface Booking {
  id: string
  booking_reference: string
  user_id: string
  trip_id: string
  passenger_name: string
  phone: string
  email: string
  selected_seats: number[]
  total_amount: number
  status: string
  payment_status: string
  created_at: string
}

// Database initialization and table creation
export async function initializeDatabase() {
  try {
    // Create users table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
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
      )
    `

    // Create drivers table
    await sql`
      CREATE TABLE IF NOT EXISTS drivers (
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
      )
    `

    // Create trips table
    await sql`
      CREATE TABLE IF NOT EXISTS trips (
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
      )
    `

    // Create bookings table
    await sql`
      CREATE TABLE IF NOT EXISTS bookings (
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
      )
    `

    console.log('Database tables initialized successfully')
    await seedInitialData()
    
  } catch (error) {
    console.error('Database initialization error:', error)
    throw error
  }
}

// Seed initial data (admin user, sample drivers, trips)
async function seedInitialData() {
  try {
    // Get credentials from environment variables
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@techlogix.com'
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'
    const adminPhone = process.env.ADMIN_PHONE || '+234 810 733 8827'
    
    const driverPassword = process.env.DRIVER_PASSWORD || 'driver123'
    const driver1Id = process.env.DRIVER_1_ID || 'DRV001'
    const driver1Name = process.env.DRIVER_1_NAME || 'Samuel Oche'
    const driver1Email = process.env.DRIVER_1_EMAIL || 'samuel@techlogix.com'
    const driver1Phone = process.env.DRIVER_1_PHONE || '+234 810 733 8830'
    const driver1License = process.env.DRIVER_1_LICENSE || 'ABC123456789'
    
    const driver2Id = process.env.DRIVER_2_ID || 'DRV002'
    const driver2Name = process.env.DRIVER_2_NAME || 'Michael Adah'
    const driver2Email = process.env.DRIVER_2_EMAIL || 'michael@techlogix.com'
    const driver2Phone = process.env.DRIVER_2_PHONE || '+234 810 733 8831'
    const driver2License = process.env.DRIVER_2_LICENSE || 'DEF987654321'

    // Check if admin user exists
    const adminExists = await sql`
      SELECT id FROM users WHERE email = ${adminEmail}
    `

    if (adminExists.rows.length === 0) {
      // Create admin user
      const adminPasswordHash = await bcrypt.hash(adminPassword, 12)
      await sql`
        INSERT INTO users (name, username, email, phone, password, role, is_verified)
        VALUES ('Admin User', 'admin', ${adminEmail}, ${adminPhone}, ${adminPasswordHash}, 'admin', true)
      `
      console.log('Admin user created')
    }

    // Check if sample drivers exist
    const driversExist = await sql`
      SELECT id FROM drivers WHERE driver_id = ${driver1Id}
    `

    if (driversExist.rows.length === 0) {
      const driverPasswordHash = await bcrypt.hash(driverPassword, 12)
      
      // Create sample drivers
      await sql`
        INSERT INTO drivers (driver_id, name, email, phone, password, license_number, experience)
        VALUES 
          (${driver1Id}, ${driver1Name}, ${driver1Email}, ${driver1Phone}, ${driverPasswordHash}, ${driver1License}, '5 years'),
          (${driver2Id}, ${driver2Name}, ${driver2Email}, ${driver2Phone}, ${driverPasswordHash}, ${driver2License}, '8 years')
      `
      console.log('Sample drivers created')
    }

    // Check if sample trips exist
    const tripsExist = await sql`
      SELECT id FROM trips LIMIT 1
    `

    if (tripsExist.rows.length === 0) {
      // Create sample trips
      await sql`
        INSERT INTO trips (route, from_location, to_location, departure_time, arrival_time, price, total_seats, available_seats, trip_date, vehicle)
        VALUES 
          ('Lagos to Abuja', 'Lagos', 'Abuja', '08:00', '14:00', 15000, 50, 45, CURRENT_DATE + INTERVAL '1 day', 'Mercedes Sprinter - LG123ABC'),
          ('Abuja to Port Harcourt', 'Abuja', 'Port Harcourt', '09:00', '16:00', 18000, 50, 48, CURRENT_DATE + INTERVAL '1 day', 'Toyota Hiace - AB456DEF'),
          ('Lagos to Kano', 'Lagos', 'Kano', '07:00', '15:00', 20000, 50, 42, CURRENT_DATE + INTERVAL '2 days', 'Mercedes Sprinter - LG789GHI'),
          ('Port Harcourt to Lagos', 'Port Harcourt', 'Lagos', '10:00', '17:00', 16000, 50, 47, CURRENT_DATE + INTERVAL '2 days', 'Toyota Hiace - PH123JKL')
      `
      console.log('Sample trips created')
    }

  } catch (error) {
    console.error('Error seeding initial data:', error)
  }
}

// User database functions
export async function createUser(userData: Omit<User, 'id' | 'created_at'>): Promise<User> {
  const result = await sql`
    INSERT INTO users (name, username, email, phone, password, role, is_verified)
    VALUES (${userData.name}, ${userData.username || null}, ${userData.email}, ${userData.phone}, ${userData.password}, ${userData.role}, ${userData.is_verified})
    RETURNING *
  `
  return result.rows[0] as User
}

export async function findUserByEmail(email: string): Promise<User | null> {
  const result = await sql`
    SELECT * FROM users WHERE email = ${email}
  `
  return result.rows[0] as User || null
}

export async function findUserByUsername(username: string): Promise<User | null> {
  const result = await sql`
    SELECT * FROM users WHERE username = ${username}
  `
  return result.rows[0] as User || null
}

export async function findUserByEmailOrUsername(identifier: string): Promise<User | null> {
  const result = await sql`
    SELECT * FROM users WHERE email = ${identifier} OR username = ${identifier}
  `
  return result.rows[0] as User || null
}

export async function updateUserLastLogin(userId: string): Promise<void> {
  await sql`
    UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ${userId}
  `
}

// Driver database functions
export async function findDriverById(driverId: string): Promise<Driver | null> {
  const result = await sql`
    SELECT * FROM drivers WHERE driver_id = ${driverId}
  `
  return result.rows[0] as Driver || null
}

export async function getAllDrivers(): Promise<Driver[]> {
  const result = await sql`
    SELECT * FROM drivers WHERE status = 'active' ORDER BY name
  `
  return result.rows as Driver[]
}

// Trip database functions
export async function getAllTrips(): Promise<Trip[]> {
  const result = await sql`
    SELECT * FROM trips WHERE trip_date >= CURRENT_DATE ORDER BY trip_date, departure_time
  `
  return result.rows as Trip[]
}

export async function getTripById(tripId: string): Promise<Trip | null> {
  const result = await sql`
    SELECT * FROM trips WHERE id = ${tripId}
  `
  return result.rows[0] as Trip || null
}

export async function createTrip(tripData: Omit<Trip, 'id' | 'created_at'>): Promise<Trip> {
  const result = await sql`
    INSERT INTO trips (route, from_location, to_location, departure_time, arrival_time, price, total_seats, available_seats, trip_date, vehicle, driver_id, status)
    VALUES (${tripData.route}, ${tripData.from_location}, ${tripData.to_location}, ${tripData.departure_time}, ${tripData.arrival_time}, ${tripData.price}, ${tripData.total_seats}, ${tripData.available_seats}, ${tripData.trip_date}, ${tripData.vehicle}, ${tripData.driver_id || null}, ${tripData.status})
    RETURNING *
  `
  return result.rows[0] as Trip
}

export async function updateTrip(tripId: string, updates: Partial<Trip>): Promise<Trip> {
  // For now, implement a simple status update
  if (updates.status) {
    const result = await sql`
      UPDATE trips SET status = ${updates.status} WHERE id = ${tripId} RETURNING *
    `
    return result.rows[0] as Trip
  }
  
  // For more complex updates, we can expand this later
  const result = await sql`
    SELECT * FROM trips WHERE id = ${tripId}
  `
  return result.rows[0] as Trip
}

// Booking database functions
export async function createBooking(bookingData: Omit<Booking, 'id' | 'created_at'>): Promise<Booking> {
  const result = await sql`
    INSERT INTO bookings (booking_reference, user_id, trip_id, passenger_name, phone, email, selected_seats, total_amount, status, payment_status)
    VALUES (
      ${bookingData.booking_reference}, 
      ${bookingData.user_id || null}, 
      ${bookingData.trip_id}, 
      ${bookingData.passenger_name}, 
      ${bookingData.phone}, 
      ${bookingData.email}, 
      ${JSON.stringify(bookingData.selected_seats)}, 
      ${bookingData.total_amount}, 
      ${bookingData.status}, 
      ${bookingData.payment_status}
    )
    RETURNING *
  `
  return result.rows[0] as Booking
}

export async function getAllBookings(): Promise<Booking[]> {
  const result = await sql`
    SELECT * FROM bookings ORDER BY created_at DESC
  `
  return result.rows as Booking[]
}

export async function getBookingByReference(reference: string): Promise<Booking | null> {
  const result = await sql`
    SELECT * FROM bookings WHERE booking_reference = ${reference}
  `
  return result.rows[0] as Booking || null
}

export async function getUserBookings(userId: string): Promise<Booking[]> {
  const result = await sql`
    SELECT b.*, t.route, t.from_location, t.to_location, t.departure_time, t.trip_date
    FROM bookings b
    JOIN trips t ON b.trip_id = t.id
    WHERE b.user_id = ${userId}
    ORDER BY b.created_at DESC
  `
  return result.rows as Booking[]
}

// Utility function to generate booking reference
export function generateBookingReference(): string {
  const prefix = 'EB'
  const timestamp = Date.now().toString().slice(-6)
  const random = Math.random().toString(36).substr(2, 4).toUpperCase()
  return `${prefix}${timestamp}${random}`
}
