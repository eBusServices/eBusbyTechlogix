import { NextRequest, NextResponse } from 'next/server'

// Mock data for admin statistics
export async function GET(request: NextRequest) {
  try {
    // In a real application, these would be database queries
    const stats = {
      users: {
        total: 156,
        newToday: 3,
        newThisWeek: 12,
        newThisMonth: 45,
        activeUsers: 89,
        verifiedUsers: 134
      },
      trips: {
        total: 24,
        scheduled: 8,
        inProgress: 2,
        completed: 12,
        cancelled: 2,
        todayTrips: 4
      },
      bookings: {
        total: 287,
        todayBookings: 15,
        thisWeekBookings: 89,
        thisMonthBookings: 156,
        confirmedBookings: 245,
        pendingBookings: 23,
        cancelledBookings: 19
      },
      revenue: {
        total: 2450000,
        todayRevenue: 85000,
        thisWeekRevenue: 425000,
        thisMonthRevenue: 1250000,
        averageBookingValue: 8500
      },
      performance: {
        onTimePercentage: 94.5,
        customerSatisfaction: 4.7,
        repeatCustomers: 67,
        cancellationRate: 6.6
      }
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    )
  }
}

// Get filtered statistics based on date range
export async function POST(request: NextRequest) {
  try {
    const { startDate, endDate, filter } = await request.json()

    // Mock filtered data based on parameters
    const filteredStats = {
      period: `${startDate} to ${endDate}`,
      filter,
      bookings: 45,
      revenue: 385000,
      trips: 12,
      passengers: 89
    }

    return NextResponse.json(filteredStats)
  } catch (error) {
    console.error('Error fetching filtered stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch filtered statistics' },
      { status: 500 }
    )
  }
}
