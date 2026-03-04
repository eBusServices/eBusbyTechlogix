import { NextRequest, NextResponse } from 'next/server'
import {
  getAllBookings,
  getBookingByReference,
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

async function mapBookingForClient(booking: any) {
  const trip = booking.trip_id ? await getTripById(booking.trip_id) : null

  return {
    id: booking.id,
    bookingReference: booking.booking_reference,
    passengerName: booking.passenger_name,
    phone: booking.phone,
    email: booking.email,
    tripId: booking.trip_id,
    tripRoute: trip?.route || '',
    tripFrom: trip?.from_location || '',
    tripTo: trip?.to_location || '',
    tripDate: trip?.trip_date || '',
    departureTime: trip?.departure_time || '',
    arrivalTime: trip?.arrival_time || '',
    selectedSeats: booking.selected_seats || [],
    totalAmount: booking.total_amount,
    status: booking.status,
    paymentStatus: booking.payment_status,
    bookingDate: booking.created_at,
    booking_reference: booking.booking_reference,
    passenger_name: booking.passenger_name,
    trip_id: booking.trip_id,
    selected_seats: booking.selected_seats || [],
    total_amount: booking.total_amount,
    payment_status: booking.payment_status,
    created_at: booking.created_at,
  }
}

export async function GET(request: NextRequest) {
  try {
    await ensureDbInitialized()
    const { searchParams } = new URL(request.url)
    const bookingReference = searchParams.get('bookingReference')

    if (bookingReference) {
      const booking = await getBookingByReference(bookingReference)
      if (!booking) {
        return NextResponse.json([])
      }

      const mappedBooking = await mapBookingForClient(booking)
      return NextResponse.json([mappedBooking])
    }

    const bookings = await getAllBookings()
    const mappedBookings = await Promise.all(bookings.map(mapBookingForClient))
    return NextResponse.json(mappedBookings)
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
      booking: await mapBookingForClient(booking),
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