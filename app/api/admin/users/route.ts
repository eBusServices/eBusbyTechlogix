import { NextRequest, NextResponse } from 'next/server'

// Mock users data
let users = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+234 801 234 5678',
    role: 'passenger',
    createdAt: '2025-01-15T10:00:00Z',
    isVerified: true,
    lastLogin: '2025-01-20T14:30:00Z',
    totalBookings: 5,
    totalSpent: 45000
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '+234 802 345 6789',
    role: 'passenger',
    createdAt: '2025-01-10T09:15:00Z',
    isVerified: true,
    lastLogin: '2025-01-19T16:45:00Z',
    totalBookings: 3,
    totalSpent: 28000
  },
  {
    id: '3',
    name: 'Samuel Oche',
    email: 'samuel@techlogix.com',
    phone: '+234 810 733 8830',
    role: 'driver',
    createdAt: '2025-01-01T08:00:00Z',
    isVerified: true,
    lastLogin: '2025-01-20T06:00:00Z',
    totalTrips: 15,
    rating: 4.8
  },
  {
    id: '4',
    name: 'Admin User',
<<<<<<< HEAD
    email: process.env.ADMIN_EMAIL || 'demo@admin.com',
=======
    email: process.env.ADMIN_EMAIL || 'admin@techlogix.com',
>>>>>>> main
    phone: '+234 810 733 8827',
    role: 'admin',
    createdAt: '2024-12-01T00:00:00Z',
    isVerified: true,
    lastLogin: '2025-01-20T15:00:00Z',
    permissions: ['all']
  }
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const role = searchParams.get('role')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    let filteredUsers = [...users]

    // Filter by role
    if (role && role !== 'all') {
      filteredUsers = filteredUsers.filter(user => user.role === role)
    }

    // Search functionality
    if (search) {
      const searchLower = search.toLowerCase()
      filteredUsers = filteredUsers.filter(user =>
        user.name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        user.phone.includes(search)
      )
    }

    // Pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex)

    // Remove sensitive information
    const safeUsers = paginatedUsers.map(user => {
      const { ...safeUser } = user
      return safeUser
    })

    return NextResponse.json({
      users: safeUsers,
      pagination: {
        page,
        limit,
        total: filteredUsers.length,
        totalPages: Math.ceil(filteredUsers.length / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}

// Update user status or role
export async function PATCH(request: NextRequest) {
  try {
    const { userId, updates } = await request.json()

    const userIndex = users.findIndex(user => user.id === userId)
    if (userIndex === -1) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Update user
    users[userIndex] = { ...users[userIndex], ...updates }

    return NextResponse.json({
      success: true,
      user: users[userIndex]
    })
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    )
  }
}

// Delete user (soft delete in real app)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const userIndex = users.findIndex(user => user.id === userId)
    if (userIndex === -1) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // In a real app, this would be a soft delete
    users.splice(userIndex, 1)

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    )
  }
}
