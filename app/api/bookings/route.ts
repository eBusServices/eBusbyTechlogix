import { NextRequest, NextResponse } from 'next/server'
import { 
  getAllBookings, 
  createBooking, 
  generateBookingReference, 
  getBookingByReference,
  getUserBookings,
  initializeDatabase 
} from '../../lib/database'

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

export async function GET(request: NextRequest) {
  try {
    await ensureDbInitialized()
    
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const reference = searchParams.get('reference')

    if (reference) {
      // Get specific booking by reference
      const booking = await getBookingByReference(reference)
      if (!booking) {
        return NextResponse.json(
          { error: 'Booking not found' },
          { status: 404 }
        )
      }
      return NextResponse.json(booking)
    }

    if (userId) {
      // Get user's bookings
      const userBookings = await getUserBookings(userId)
      return NextResponse.json(userBookings)
    }

    // Get all bookings (admin view)
    const allBookings = await getAllBookings()
    return NextResponse.json(allBookings)

  } catch (error) {
    console.error('Error fetching bookings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureDbInitialized()
    
    const body = await request.json()
    
    // Validate required fields
    const requiredFields = ['tripId', 'passengerName', 'phone', 'email', 'seats', 'selectedSeats']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        )
      }
    }

    // Generate booking reference
    const bookingReference = generateBookingReference()

    // Calculate total amount based on seats and trip price
    const totalAmount = body.seats * (body.tripPrice || 15000) // Default price if not provided

    const booking = await createBooking({
      booking_reference: bookingReference,
      user_id: body.userId || null,
      trip_id: body.tripId,
      passenger_name: body.passengerName,
      phone: body.phone,
      email: body.email,
      selected_seats: body.selectedSeats,
      total_amount: totalAmount,
      status: 'confirmed',
      payment_status: 'pending'
    })

    return NextResponse.json({
      success: true,
      booking,
      bookingReference,
      message: 'Booking created successfully'
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating booking:', error)
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    )
  }
}