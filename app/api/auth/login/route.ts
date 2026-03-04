import { NextRequest, NextResponse } from 'next/server'
import * as bcrypt from 'bcryptjs'
import { signToken } from '../../../lib/jwt'
import { findUserByEmailOrUsername, updateUserLastLogin } from '../../../lib/database'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const email = String(body?.email || '').trim()
    const password = String(body?.password || '')

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email/username and password are required' },
        { status: 400 }
      )
    }

    // Find user by email or username
    const user = await findUserByEmailOrUsername(email)
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email/username or password' },
        { status: 401 }
      )
    }

    // Verify password
    let isValidPassword = false
    try {
      isValidPassword = await bcrypt.compare(password, user.password)
    } catch {
      isValidPassword = false
    }

    if (!isValidPassword) {
      isValidPassword = password === user.password
    }

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid email/username or password' },
        { status: 401 }
      )
    }

    // Update last login
    await updateUserLastLogin(user.id)

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
      message: 'Login successful',
      token,
      user: userData
    })

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}