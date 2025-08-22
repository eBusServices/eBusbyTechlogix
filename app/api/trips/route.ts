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

    let trips = await getAllTrips()

    // Apply filters if provided
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

    if (date) {
      trips = trips.filter(trip => {
        const tripDate = new Date(trip.trip_date).toISOString().split('T')[0]
        return tripDate === date
      })
    }

    return NextResponse.json(trips)
  } catch (error) {
    console.error('Trips GET error:', error)
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
      from_location,
      to_location,
      departure_time,
      arrival_time,
      price,
      total_seats,
      trip_date,
      vehicle,
      driver_id
    } = body

    // Validate required fields
    if (!route || !from_location || !to_location || !departure_time || !arrival_time || !price || !total_seats || !trip_date || !vehicle) {
      return NextResponse.json(
        { error: 'All trip fields are required' },
        { status: 400 }
      )
    }

    // Create trip
    const trip = await createTrip({
      route,
      from_location,
      to_location,
      departure_time,
      arrival_time,
      price: Number(price),
      total_seats: Number(total_seats),
      available_seats: Number(total_seats),
      trip_date,
      vehicle,
      driver_id: driver_id || null,
      status: 'scheduled'
    })

    return NextResponse.json({
      message: 'Trip created successfully',
      trip
    })

  } catch (error) {
    console.error('Trip creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create trip' },
      { status: 500 }
    )
  }
}