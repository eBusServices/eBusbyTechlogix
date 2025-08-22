import { NextRequest, NextResponse } from 'next/server'
import { initializeDatabase } from '../../lib/database'

export async function POST(request: NextRequest) {
  try {
    // Only allow database initialization in development or with proper authorization
    const authHeader = request.headers.get('authorization')
    const isAuthorized = authHeader === `Bearer ${process.env.DB_INIT_SECRET}` || process.env.NODE_ENV === 'development'
    
    if (!isAuthorized) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    await initializeDatabase()
    
    return NextResponse.json({
      success: true,
      message: 'Database initialized successfully'
    })
    
  } catch (error) {
    console.error('Database initialization error:', error)
    return NextResponse.json(
      { error: 'Database initialization failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// GET endpoint for checking database status
export async function GET() {
  try {
    return NextResponse.json({
      message: 'Database initialization endpoint',
      status: 'ready',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Database check failed' },
      { status: 500 }
    )
  }
}
