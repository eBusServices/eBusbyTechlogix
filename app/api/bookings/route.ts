import { NextRequest, NextResponse } from 'next/server'
import {
  getAllBookings,
  createBooking,
  generateBookingReference,
  getTripById,
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

export async function GET() {
  try {
    await ensureDbInitialized()
    const bookings = await getAllBookings()
    return NextResponse.json(bookings)
  } catch (error) {
    console.error('Bookings GET error:', error)
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
    const { 
      tripId, 
      passengerName, 
      phone, 
      email, 
      selectedSeats, 
      totalAmount,
      userId 
    } = body

    // Validate required fields
    if (!tripId || !passengerName || !phone || !email || !selectedSeats || !totalAmount) {
      return NextResponse.json(
        { error: 'All booking fields are required' },
        { status: 400 }
      )
    }

    // Validate selected seats
    if (!Array.isArray(selectedSeats) || selectedSeats.length === 0) {
      return NextResponse.json(
        { error: 'At least one seat must be selected' },
        { status: 400 }
      )
    }

    // Verify trip exists
    const trip = await getTripById(tripId)
    if (!trip) {
      return NextResponse.json(
        { error: 'Trip not found' },
        { status: 404 }
      )
    }

    // Check seat availability
    if (trip.available_seats < selectedSeats.length) {
      return NextResponse.json(
        { error: 'Not enough seats available' },
        { status: 400 }
      )
    }

    // Generate booking reference
    const bookingReference = generateBookingReference()

    // Create booking
    const booking = await createBooking({
      booking_reference: bookingReference,
      user_id: userId || null,
      trip_id: tripId,
      passenger_name: passengerName,
      phone,
      email,
      selected_seats: selectedSeats,
      total_amount: totalAmount,
      status: 'confirmed',
      payment_status: 'pending'
    })

    return NextResponse.json({
      message: 'Booking created successfully',
      booking,
      bookingReference
    })

  } catch (error) {
    console.error('Booking creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    )
  }
}