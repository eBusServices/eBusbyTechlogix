import { getAllFleets, createFleet, Fleet } from '@/app/lib/database'

export async function GET() {
  try {
    const fleets = await getAllFleets()
    return Response.json(fleets)
  } catch (error) {
    console.error('Error fetching fleets:', error)
    return Response.json({ error: 'Failed to fetch fleets' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.name || !body.vehicle_type || !body.total_seats) {
      return Response.json(
        { error: 'Missing required fields: name, vehicle_type, total_seats' },
        { status: 400 }
      )
    }

    const fleetData: Omit<Fleet, 'id' | 'created_at'> = {
      name: body.name,
      vehicle_type: body.vehicle_type,
      total_seats: Math.max(1, Number(body.total_seats) || 1),
      registration_number: body.registration_number || '',
      status: body.status || 'active',
    }

    const fleet = await createFleet(fleetData)
    return Response.json(fleet, { status: 201 })
  } catch (error) {
    console.error('Error creating fleet:', error)
    return Response.json({ error: 'Failed to create fleet' }, { status: 500 })
  }
}
