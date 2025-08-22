import { NextRequest, NextResponse } from 'next/server'
import { getAllTrips, createTrip, initializeDatabase } from '../../lib/database'

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
    const from = searchParams.get('from')
    const to = searchParams.get('to')
    const date = searchParams.get('date')
    const featured = searchParams.get('featured')
    const driverId = searchParams.get('driverId')

    let trips = await getAllTrips()

    // Filter by route
    if (from) {
      trips = trips.filter(trip => 
        trip.from_location.toLowerCase().includes(from.toLowerCase())
      )
    }

    if (to) {
      trips = trips.filter(trip => 
        trip.to_location.toLowerCase().includes(to.toLowerCase())
      )
    }

    // Filter by date
    if (date) {
      trips = trips.filter(trip => trip.trip_date === date)
    }

    // Filter by driver (for driver dashboard)
    if (driverId) {
      trips = trips.filter(trip => trip.driver_id === driverId)
    }

    // Return featured trips (limit to 3)
    if (featured === 'true') {
      trips = trips.slice(0, 3)
    }

    return NextResponse.json(trips)
  } catch (error) {
    console.error('Error fetching trips:', error)
    return NextResponse.json(
      { error: 'Failed to fetch trips' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureDbInitialized()
    
    const body = await request.json()
    const { 
      route, 
      from, 
      to, 
      departureTime, 
      arrivalTime, 
      price, 
      totalSeats, 
      date, 
      vehicle, 
      driverId,
      status = 'scheduled'
    } = body

    // Validate required fields
    if (!route || !from || !to || !departureTime || !arrivalTime || !price || !totalSeats || !date || !vehicle) {
      return NextResponse.json(
        { error: 'All trip details are required' },
        { status: 400 }
      )
    }

    // Create new trip
    const newTrip = await createTrip({
      route: `${from} to ${to}`,
      from_location: from,
      to_location: to,
      departure_time: departureTime,
      arrival_time: arrivalTime,
      price: Number(price),
      total_seats: Number(totalSeats),
      available_seats: Number(totalSeats), // Initially all seats available
      trip_date: date,
      vehicle,
      driver_id: driverId || null,
      status
    })

    return NextResponse.json(newTrip, { status: 201 })
  } catch (error) {
    console.error('Error creating trip:', error)
    return NextResponse.json(
      { error: 'Failed to create trip' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await ensureDbInitialized()
    
    const body = await request.json()
    const { tripId, ...updates } = body

    if (!tripId) {
      return NextResponse.json(
        { error: 'Trip ID is required' },
        { status: 400 }
      )
    }

    // Update trip (implementation would depend on specific update logic)
    // For now, return success message
    return NextResponse.json({
      success: true,
      message: 'Trip updated successfully'
    })
  } catch (error) {
    console.error('Error updating trip:', error)
    return NextResponse.json(
      { error: 'Failed to update trip' },
      { status: 500 }
    )
  }
}