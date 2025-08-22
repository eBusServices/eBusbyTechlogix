import { NextRequest, NextResponse } from 'next/server'
import * as bcrypt from 'bcryptjs'
import { signToken } from '../../../lib/jwt'
import { createUser, findUserByEmail, findUserByUsername } from '../../../lib/database'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, username, email, phone, password, confirmPassword } = body

    // Validate required fields
    if (!name || !email || !phone || !password || !confirmPassword) {
      return NextResponse.json(
        { error: 'Name, email, phone, and password are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      )
    }

    // Validate phone format
    const phoneRegex = /^\+?[1-9]\d{1,14}$/
    if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
      return NextResponse.json(
        { error: 'Please enter a valid phone number' },
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

    // Check if passwords match
    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: 'Passwords do not match' },
        { status: 400 }
      )
    }

    // Check if email already exists
    const existingEmail = await findUserByEmail(email)
    if (existingEmail) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      )
    }

    // Check if username already exists (if provided)
    if (username) {
      const existingUsername = await findUserByUsername(username)
      if (existingUsername) {
        return NextResponse.json(
          { error: 'Username is already taken' },
          { status: 409 }
        )
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const user = await createUser({
      name,
      username: username || undefined,
      email,
      phone,
      password: hashedPassword,
      role: 'passenger',
      is_verified: false
    })

    // Generate JWT token
    const token = signToken({
      userId: user.id,
      email: user.email,
      username: user.username,
      name: user.name,
      role: user.role
    })

    // Return success response (excluding password)
    const { password: _, ...userData } = user
    return NextResponse.json({
      message: 'Registration successful',
      token,
      user: userData
    })

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}