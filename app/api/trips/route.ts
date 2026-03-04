import { NextRequest, NextResponse } from 'next/server'
import { getAllTrips, createTrip, initializeDatabase } from '../../lib/database'

function buildFallbackTrips() {
  const date1 = new Date()
  date1.setDate(date1.getDate() + 1)
  const date2 = new Date()
  date2.setDate(date2.getDate() + 2)

  return [
    {
      id: 'fallback-1',
      route: 'Lagos to Abuja',
      from_location: 'Lagos',
      to_location: 'Abuja',
      departure_time: '08:00',
      arrival_time: '14:00',
      price: 15000,
      total_seats: 50,
      available_seats: 45,
      trip_date: date1.toISOString().split('T')[0],
      vehicle: 'Mercedes Sprinter - LG123ABC',
      driver_id: null,
      status: 'scheduled',
      created_at: new Date().toISOString(),
    },
    {
      id: 'fallback-2',
      route: 'Abuja to Port Harcourt',
      from_location: 'Abuja',
      to_location: 'Port Harcourt',
      departure_time: '09:00',
      arrival_time: '16:00',
      price: 18000,
      total_seats: 50,
      available_seats: 48,
      trip_date: date2.toISOString().split('T')[0],
      vehicle: 'Toyota Hiace - AB456DEF',
      driver_id: null,
      status: 'scheduled',
      created_at: new Date().toISOString(),
    },
  ]
}

function mapTripForClient(trip: any) {
  return {
    id: trip.id,
    route: trip.route,
    from: trip.from_location,
    to: trip.to_location,
    departureTime: trip.departure_time,
    arrivalTime: trip.arrival_time,
    price: trip.price,
    totalSeats: trip.total_seats,
    availableSeats: trip.available_seats,
    date: trip.trip_date,
    vehicle: trip.vehicle,
    status: trip.status,
    from_location: trip.from_location,
    to_location: trip.to_location,
    departure_time: trip.departure_time,
    arrival_time: trip.arrival_time,
    total_seats: trip.total_seats,
    available_seats: trip.available_seats,
    trip_date: trip.trip_date,
    created_at: trip.created_at,
  }
}

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
  const { searchParams } = new URL(request.url)
  const from = searchParams.get('from')
  const to = searchParams.get('to')
  const date = searchParams.get('date')

  try {
    await ensureDbInitialized()
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

    return NextResponse.json(trips.map(mapTripForClient))
  } catch (error) {
    console.error('Trips GET error:', error)

    let fallbackTrips = buildFallbackTrips()

    if (from) {
      fallbackTrips = fallbackTrips.filter(trip =>
        trip.from_location.toLowerCase().includes(from.toLowerCase())
      )
    }

    if (to) {
      fallbackTrips = fallbackTrips.filter(trip =>
        trip.to_location.toLowerCase().includes(to.toLowerCase())
      )
    }

    if (date) {
      fallbackTrips = fallbackTrips.filter(trip => trip.trip_date === date)
    }

    return NextResponse.json(fallbackTrips.map(mapTripForClient))
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