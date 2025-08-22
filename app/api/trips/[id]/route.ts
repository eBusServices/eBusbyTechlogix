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
    status: 'scheduled',
    seatingLayout: Array.from({ length: 50 }, (_, i) => ({
      seatNumber: i + 1,
      isOccupied: i < 5 // First 5 seats are occupied for demo
    }))
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
    status: 'scheduled',
    seatingLayout: Array.from({ length: 50 }, (_, i) => ({
      seatNumber: i + 1,
      isOccupied: i < 12 // First 12 seats are occupied for demo
    }))
  }
]

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const trip = trips.find(t => t.id === params.id)
    
    if (!trip) {
      return NextResponse.json(
        { error: 'Trip not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(trip)
  } catch (error) {
    console.error('Error fetching trip:', error)
    return NextResponse.json(
      { error: 'Failed to fetch trip' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const tripIndex = trips.findIndex(t => t.id === params.id)
    
    if (tripIndex === -1) {
      return NextResponse.json(
        { error: 'Trip not found' },
        { status: 404 }
      )
    }

    trips[tripIndex] = { ...trips[tripIndex], ...body }
    return NextResponse.json(trips[tripIndex])
  } catch (error) {
    console.error('Error updating trip:', error)
    return NextResponse.json(
      { error: 'Failed to update trip' },
      { status: 500 }
    )
  }
}
