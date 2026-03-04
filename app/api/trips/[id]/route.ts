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

  const totalSeats = Math.max(0, Number(trip.total_seats) || 0)
  const availableSeatsRaw = Number(trip.available_seats)
  const availableSeats = Number.isFinite(availableSeatsRaw)
    ? Math.min(Math.max(0, availableSeatsRaw), totalSeats)
    : totalSeats

  return {
    id: trip.id,
    route: trip.route,
    from: trip.from_location,
    to: trip.to_location,
    departureTime: trip.departure_time,
    arrivalTime: trip.arrival_time,
    price: trip.price,
    availableSeats,
    totalSeats,
    date: trip.trip_date,
    vehicle: trip.vehicle,
    status: trip.status,
    seatingLayout: buildSeatingLayout(totalSeats, availableSeats),
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
    const normalizedUpdates: Partial<Trip> = {
      ...body,
      from_location: body.from_location ?? body.from,
      to_location: body.to_location ?? body.to,
      departure_time: body.departure_time ?? body.departureTime,
      arrival_time: body.arrival_time ?? body.arrivalTime,
      trip_date: body.trip_date ?? body.date,
      total_seats:
        body.total_seats ??
        (body.totalSeats !== undefined ? Number(body.totalSeats) : undefined),
      available_seats:
        body.available_seats ??
        (body.availableSeats !== undefined ? Number(body.availableSeats) : undefined),
      driver_id: body.driver_id ?? body.driverId,
      price: body.price !== undefined ? Number(body.price) : undefined,
    }

    const updated = await updateTrip(params.id, normalizedUpdates)

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
