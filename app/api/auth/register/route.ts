import { NextRequest, NextResponse } from 'next/server'
import * as bcrypt from 'bcryptjs'
import * as jwt from 'jsonwebtoken'
<<<<<<< HEAD

// Mock database for users
let users: any[] = []
let userCounter = 1

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'
=======
import { config } from '../../../lib/config'
import { createUser, findUserByEmail, findUserByUsername } from '../../../lib/database'

const JWT_SECRET = config.jwtSecret
>>>>>>> main

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
<<<<<<< HEAD
    const { name, email, phone, password, confirmPassword } = body
=======
    const { name, username, email, phone, password, confirmPassword } = body
>>>>>>> main

    // Validate required fields
    if (!name || !email || !phone || !password || !confirmPassword) {
      return NextResponse.json(
<<<<<<< HEAD
        { error: 'All fields are required' },
=======
        { error: 'Name, email, phone, and password are required' },
>>>>>>> main
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Validate password match
    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: 'Passwords do not match' },
        { status: 400 }
      )
    }

    // Validate password strength
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      )
    }

<<<<<<< HEAD
    // Check if user already exists
    const existingUser = users.find(u => u.email === email)
    if (existingUser) {
=======
    // Check if email already exists
    const existingEmail = await findUserByEmail(email)
    if (existingEmail) {
>>>>>>> main
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      )
    }

<<<<<<< HEAD
=======
    // Check if username already exists (if provided)
    if (username) {
      const existingUsername = await findUserByUsername(username)
      if (existingUsername) {
        return NextResponse.json(
          { error: 'Username already taken' },
          { status: 409 }
        )
      }
    }

>>>>>>> main
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
<<<<<<< HEAD
    const user = {
      id: userCounter.toString(),
      name,
=======
    const user = await createUser({
      name,
      username: username || undefined,
>>>>>>> main
      email,
      phone,
      password: hashedPassword,
      role: 'passenger',
<<<<<<< HEAD
      createdAt: new Date().toISOString(),
      isVerified: false
    }

    users.push(user)
    userCounter++
=======
      is_verified: false
    })
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
      message: 'Registration successful',
      user: userWithoutPassword,
      token
    }, { status: 201 })

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    )
  }
}
