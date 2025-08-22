import { NextRequest, NextResponse } from 'next/server'
import * as bcrypt from 'bcryptjs'
import * as jwt from 'jsonwebtoken'
import { config } from '../../../lib/config'
<<<<<<< HEAD

// Mock database for drivers
let drivers = [
  {
    id: '1',
    driverId: config.demo.driverId,
    name: 'Samuel Oche',
    email: 'samuel@techlogix.com',
    phone: '+234 810 733 8830',
    password: config.demo.driverPasswordHash, // Use environment variable
    licenseNumber: 'ABC123456789',
    experience: '5 years',
    status: 'active',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    driverId: 'DRV002',
    name: 'Michael Adah',
    email: 'michael@techlogix.com',
    phone: '+234 810 733 8831',
    password: config.demo.driverPasswordHash, // Use environment variable
    licenseNumber: 'DEF987654321',
    experience: '8 years',
    status: 'active',
    createdAt: new Date().toISOString()
  }
]

const JWT_SECRET = config.jwtSecret

export async function POST(request: NextRequest) {
  try {
=======
import { findDriverById, getAllDrivers, initializeDatabase } from '../../../lib/database'

const JWT_SECRET = config.jwtSecret

// Initialize database on first API call
let dbInitialized = false
async function ensureDbInitialized() {
  if (!dbInitialized) {
    try {
      await initializeDatabase()
      dbInitialized = true
    } catch (error) {
      console.error('Database initialization error:', error)
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureDbInitialized()
    
>>>>>>> main
    const body = await request.json()
    const { driverId, password } = body

    // Validate required fields
    if (!driverId || !password) {
      return NextResponse.json(
        { error: 'Driver ID and password are required' },
        { status: 400 }
      )
    }

    // Find driver by driverId
<<<<<<< HEAD
    const driver = drivers.find(d => d.driverId === driverId)
=======
    const driver = await findDriverById(driverId)
>>>>>>> main
    if (!driver) {
      return NextResponse.json(
        { error: 'Invalid driver ID or password' },
        { status: 401 }
      )
    }

    // Check if driver is active
    if (driver.status !== 'active') {
      return NextResponse.json(
        { error: 'Driver account is not active. Contact administrator.' },
        { status: 401 }
      )
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, driver.password)
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid driver ID or password' },
        { status: 401 }
      )
    }

    // Create JWT token
    const token = jwt.sign(
<<<<<<< HEAD
      { userId: driver.id, driverId: driver.driverId, role: 'driver' },
=======
      { userId: driver.id, driverId: driver.driver_id, role: 'driver' },
>>>>>>> main
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    // Remove password from response
    const { password: _, ...driverWithoutPassword } = driver

    return NextResponse.json({
      success: true,
      message: 'Driver login successful',
      driver: driverWithoutPassword,
      token
    })

  } catch (error) {
    console.error('Driver login error:', error)
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
<<<<<<< HEAD
    // Return all active drivers (for admin use)
    const activeDrivers = drivers
      .filter(d => d.status === 'active')
      .map(({ password, ...driver }) => driver)
=======
    await ensureDbInitialized()
    
    // Return all active drivers (for admin use)
    const allDrivers = await getAllDrivers()
    const activeDrivers = allDrivers.map(({ password, ...driver }) => driver)
>>>>>>> main

    return NextResponse.json(activeDrivers)
  } catch (error) {
    console.error('Error fetching drivers:', error)
    return NextResponse.json(
      { error: 'Failed to fetch drivers' },
      { status: 500 }
    )
  }
}
