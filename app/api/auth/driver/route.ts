import { NextRequest, NextResponse } from 'next/server'
import * as bcrypt from 'bcryptjs'
import * as jwt from 'jsonwebtoken'

// Mock database for drivers
let drivers = [
  {
    id: '1',
    driverId: 'DRV001',
    name: 'Samuel Oche',
    email: 'samuel@techlogix.com',
    phone: '+234 810 733 8830',
    password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6hsHEp/Gp2', // password: driver123
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
    password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6hsHEp/Gp2', // password: driver123
    licenseNumber: 'DEF987654321',
    experience: '8 years',
    status: 'active',
    createdAt: new Date().toISOString()
  }
]

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

export async function POST(request: NextRequest) {
  try {
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
    const driver = drivers.find(d => d.driverId === driverId)
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
      { userId: driver.id, driverId: driver.driverId, role: 'driver' },
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
    // Return all active drivers (for admin use)
    const activeDrivers = drivers
      .filter(d => d.status === 'active')
      .map(({ password, ...driver }) => driver)

    return NextResponse.json(activeDrivers)
  } catch (error) {
    console.error('Error fetching drivers:', error)
    return NextResponse.json(
      { error: 'Failed to fetch drivers' },
      { status: 500 }
    )
  }
}
