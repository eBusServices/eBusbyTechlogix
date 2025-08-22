import { NextRequest, NextResponse } from 'next/server'

// Mock database for bookings
let bookings: any[] = []
let bookingCounter = 1

export async function POST(request: NextRequest) {
  try {
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

    return NextResponse.json({
      success: true,
      booking,
      message: 'Booking confirmed successfully'
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating booking:', error)
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    )
  }
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
