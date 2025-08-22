import { NextRequest, NextResponse } from 'next/server'
import * as bcrypt from 'bcryptjs'
import * as jwt from 'jsonwebtoken'
import { config } from '../../../lib/config'
<<<<<<< HEAD

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
=======
import { findUserByEmailOrUsername, updateUserLastLogin } from '../../../lib/database'
>>>>>>> main

const JWT_SECRET = config.jwtSecret

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
<<<<<<< HEAD
        { error: 'Email and password are required' },
=======
        { error: 'Email/username and password are required' },
>>>>>>> main
        { status: 400 }
      )
    }

<<<<<<< HEAD
    // Find user by email
    const user = users.find(u => u.email === email)
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
=======
    // Find user by email or username
    const user = await findUserByEmailOrUsername(email)
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email/username or password' },
>>>>>>> main
        { status: 401 }
      )
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return NextResponse.json(
<<<<<<< HEAD
        { error: 'Invalid email or password' },
=======
        { error: 'Invalid email/username or password' },
>>>>>>> main
        { status: 401 }
      )
    }

<<<<<<< HEAD
=======
    // Update last login
    await updateUserLastLogin(user.id)

>>>>>>> main
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
