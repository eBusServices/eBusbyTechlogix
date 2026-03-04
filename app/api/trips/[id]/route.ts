import { NextRequest, NextResponse } from 'next/server'
import { getTripById, updateTrip, initializeDatabase, Trip } from '../../../lib/database'

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

function buildSeatingLayout(totalSeats: number, availableSeats: number) {
  const occupiedSeats = Math.max(0, totalSeats - availableSeats)
  return Array.from({ length: totalSeats }, (_, index) => ({
    seatNumber: index + 1,
    isOccupied: index < occupiedSeats,
  }))
}

function mapTripForClient(trip: Trip | null) {
  if (!trip) {
    return null
  }

  return {
    id: trip.id,
    route: trip.route,
    from: trip.from_location,
    to: trip.to_location,
    departureTime: trip.departure_time,
    arrivalTime: trip.arrival_time,
    price: trip.price,
    availableSeats: trip.available_seats,
    totalSeats: trip.total_seats,
    date: trip.trip_date,
    vehicle: trip.vehicle,
    status: trip.status,
    seatingLayout: buildSeatingLayout(trip.total_seats, trip.available_seats),
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await ensureDbInitialized()

    const trip = await getTripById(params.id)

    if (!trip) {
      return NextResponse.json(
        { error: 'Trip not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(mapTripForClient(trip))
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
    await ensureDbInitialized()

    const body = await request.json()
    const updated = await updateTrip(params.id, body)

    return NextResponse.json(mapTripForClient(updated))
  } catch (error) {
    console.error('Error updating trip:', error)
    const isNotFound = error instanceof Error && error.message === 'Trip not found'

    return NextResponse.json(
      { error: isNotFound ? 'Trip not found' : 'Failed to update trip' },
      { status: isNotFound ? 404 : 500 }
    )
  }
}
