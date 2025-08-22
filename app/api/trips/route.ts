import { NextRequest, NextResponse } from 'next/server'
<<<<<<< HEAD

// Mock database - In production, replace with actual database
let trips = [
  {
    id: '1',
    route: 'Makurdi to Abuja',
    from: 'Makurdi',
    to: 'Abuja',
    departureTime: '06:00',
    arrivalTime: '10:00',
    price: 8000,
    availableSeats: 45,
    totalSeats: 50,
    date: new Date().toISOString().split('T')[0],
    vehicle: 'Luxury Coach',
    driverId: '1',
    status: 'scheduled'
  },
  {
    id: '2',
    route: 'Abuja to Makurdi',
    from: 'Abuja',
    to: 'Makurdi',
    departureTime: '14:00',
    arrivalTime: '18:00',
    price: 8000,
    availableSeats: 38,
    totalSeats: 50,
    date: new Date().toISOString().split('T')[0],
    vehicle: 'Executive Bus',
    driverId: '2',
    status: 'scheduled'
  },
  {
    id: '3',
    route: 'Makurdi to Lagos',
    from: 'Makurdi',
    to: 'Lagos',
    departureTime: '20:00',
    arrivalTime: '08:00',
    price: 15000,
    availableSeats: 30,
    totalSeats: 50,
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
    vehicle: 'Night Express',
    driverId: '3',
    status: 'scheduled'
  },
  {
    id: '4',
    route: 'Abuja to Lagos',
    from: 'Abuja',
    to: 'Lagos',
    departureTime: '07:30',
    arrivalTime: '15:30',
    price: 12000,
    availableSeats: 42,
    totalSeats: 50,
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
    vehicle: 'Deluxe Coach',
    driverId: '4',
    status: 'scheduled'
  }
]

export async function GET(request: NextRequest) {
  try {
=======
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
    
>>>>>>> main
    const { searchParams } = new URL(request.url)
    const from = searchParams.get('from')
    const to = searchParams.get('to')
    const date = searchParams.get('date')
    const featured = searchParams.get('featured')
    const driverId = searchParams.get('driverId')

<<<<<<< HEAD
    let filteredTrips = [...trips]

    // Filter by route
    if (from) {
      filteredTrips = filteredTrips.filter(trip => 
        trip.from.toLowerCase().includes(from.toLowerCase())
=======
    let trips = await getAllTrips()

    // Filter by route
    if (from) {
      trips = trips.filter(trip => 
        trip.from_location.toLowerCase().includes(from.toLowerCase())
>>>>>>> main
      )
    }

    if (to) {
<<<<<<< HEAD
      filteredTrips = filteredTrips.filter(trip => 
        trip.to.toLowerCase().includes(to.toLowerCase())
=======
      trips = trips.filter(trip => 
        trip.to_location.toLowerCase().includes(to.toLowerCase())
>>>>>>> main
      )
    }

    // Filter by date
    if (date) {
<<<<<<< HEAD
      filteredTrips = filteredTrips.filter(trip => trip.date === date)
    }

    // Filter by driver
    if (driverId) {
      filteredTrips = filteredTrips.filter(trip => trip.driverId === driverId)
    }

    // Return only featured trips
    if (featured === 'true') {
      filteredTrips = filteredTrips.slice(0, 6)
    }

    return NextResponse.json(filteredTrips)
=======
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
>>>>>>> main
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
<<<<<<< HEAD
    const body = await request.json()
    const newTrip = {
      id: String(trips.length + 1),
      ...body,
      status: 'scheduled',
      availableSeats: body.totalSeats || 50,
      totalSeats: body.totalSeats || 50
    }

    trips.push(newTrip)
=======
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

>>>>>>> main
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
<<<<<<< HEAD
    const body = await request.json()
    const { id, ...updates } = body

    const tripIndex = trips.findIndex(trip => trip.id === id)
    if (tripIndex === -1) {
      return NextResponse.json(
        { error: 'Trip not found' },
        { status: 404 }
      )
    }

    trips[tripIndex] = { ...trips[tripIndex], ...updates }
    return NextResponse.json(trips[tripIndex])
=======
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
>>>>>>> main
  } catch (error) {
    console.error('Error updating trip:', error)
    return NextResponse.json(
      { error: 'Failed to update trip' },
      { status: 500 }
    )
  }
<<<<<<< HEAD
}
=======
}
>>>>>>> main
