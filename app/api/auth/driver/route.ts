import { NextRequest, NextResponse } from 'next/server'
import * as bcrypt from 'bcryptjs'
import { signToken } from '../../../lib/jwt'
import { findDriverById, getAllDrivers, initializeDatabase } from '../../../lib/database'

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

export async function GET() {
  try {
    await ensureDbInitialized()
    const drivers = await getAllDrivers()
    return NextResponse.json(drivers)
  } catch (error) {
    console.error('Driver GET error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch drivers' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureDbInitialized()
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
    const driver = await findDriverById(driverId)
    if (!driver) {
      return NextResponse.json(
        { error: 'Invalid driver ID or password' },
        { status: 401 }
      )
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, driver.password)
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid driver ID or password' },
        { status: 401 }
      )
    }

    // Generate JWT token
    const token = signToken({
      driverId: driver.driver_id,
      id: driver.id,
      name: driver.name,
      email: driver.email,
      role: 'driver'
    })

    // Return success response (excluding password)
    const { password: _, ...driverData } = driver
    return NextResponse.json({
      message: 'Login successful',
      token,
      driver: driverData
    })

  } catch (error) {
    console.error('Driver login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}