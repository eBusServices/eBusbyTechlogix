import { NextRequest, NextResponse } from 'next/server'
<<<<<<< HEAD

// Mock database for bookings
let bookings: any[] = []
let bookingCounter = 1

export async function POST(request: NextRequest) {
  try {
=======
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
    
>>>>>>> main
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
<<<<<<< HEAD
    const bookingReference = `TL${Date.now().toString().slice(-6)}${bookingCounter.toString().padStart(3, '0')}`
    bookingCounter++

    const booking = {
      id: bookingCounter.toString(),
      bookingReference,
      ...body,
      bookingDate: new Date().toISOString(),
      status: 'confirmed',
      paymentStatus: 'pending'
    }

    bookings.push(booking)

    // In a real app, you would:
    // 1. Update the trip's available seats
    // 2. Send confirmation email
    // 3. Generate QR code for ticket
    // 4. Process payment
=======
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
>>>>>>> main

    return NextResponse.json({
      success: true,
      booking,
<<<<<<< HEAD
      message: 'Booking confirmed successfully'
=======
      bookingReference,
      message: 'Booking created successfully'
>>>>>>> main
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating booking:', error)
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    )
  }
<<<<<<< HEAD
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const bookingReference = searchParams.get('bookingReference')

    let filteredBookings = [...bookings]

    if (userId) {
      filteredBookings = filteredBookings.filter(booking => booking.userId === userId)
    }

    if (bookingReference) {
      filteredBookings = filteredBookings.filter(booking => 
        booking.bookingReference === bookingReference
      )
    }

    return NextResponse.json(filteredBookings)
  } catch (error) {
    console.error('Error fetching bookings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    )
  }
}
=======
}
>>>>>>> main
