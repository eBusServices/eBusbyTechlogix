import { NextRequest, NextResponse } from 'next/server'

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
    const { searchParams } = new URL(request.url)
    const from = searchParams.get('from')
    const to = searchParams.get('to')
    const date = searchParams.get('date')
    const featured = searchParams.get('featured')
    const driverId = searchParams.get('driverId')

    let filteredTrips = [...trips]

    // Filter by route
    if (from) {
      filteredTrips = filteredTrips.filter(trip => 
        trip.from.toLowerCase().includes(from.toLowerCase())
      )
    }

    if (to) {
      filteredTrips = filteredTrips.filter(trip => 
        trip.to.toLowerCase().includes(to.toLowerCase())
      )
    }

    // Filter by date
    if (date) {
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
    const body = await request.json()
    const newTrip = {
      id: String(trips.length + 1),
      ...body,
      status: 'scheduled',
      availableSeats: body.totalSeats || 50,
      totalSeats: body.totalSeats || 50
    }

    trips.push(newTrip)
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
  } catch (error) {
    console.error('Error updating trip:', error)
    return NextResponse.json(
      { error: 'Failed to update trip' },
      { status: 500 }
    )
  }
}
