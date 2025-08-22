import { NextRequest, NextResponse } from 'next/server'
import * as bcrypt from 'bcryptjs'
import * as jwt from 'jsonwebtoken'
import { config } from '../../../lib/config'

// Mock database - In production, this would be your actual database
let users = [
  {
    id: '1',
    name: 'Admin User',
    email: config.demo.adminEmail,
    phone: '+234 810 733 8827',
    password: config.demo.adminPasswordHash, // Use environment variable
    role: 'admin',
    createdAt: new Date().toISOString(),
    isVerified: true
  }
]

const JWT_SECRET = config.jwtSecret

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Find user by email
    const user = users.find(u => u.email === email)
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      user: userWithoutPassword,
      token
    })

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    )
  }
}
