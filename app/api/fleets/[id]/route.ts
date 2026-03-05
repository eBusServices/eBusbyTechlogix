import { getFleetById, updateFleet } from '@/app/lib/database'

interface Params {
  params: { id: string }
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    const existing = await getFleetById(params.id)
    if (!existing) {
      return Response.json({ error: 'Fleet not found' }, { status: 404 })
    }

    const body = await request.json()
    const updated = await updateFleet(params.id, {
      name: body.name ?? existing.name,
      vehicle_type: body.vehicle_type ?? existing.vehicle_type,
      total_seats: Math.max(1, Number(body.total_seats ?? existing.total_seats) || 1),
      registration_number: body.registration_number ?? existing.registration_number,
      status: body.status ?? existing.status,
    })

    return Response.json(updated)
  } catch (error) {
    console.error('Error updating fleet:', error)
    return Response.json({ error: 'Failed to update fleet' }, { status: 500 })
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  try {
    const existing = await getFleetById(params.id)
    if (!existing) {
      return Response.json({ error: 'Fleet not found' }, { status: 404 })
    }

    await updateFleet(params.id, { status: 'inactive' })
    return Response.json({ success: true })
  } catch (error) {
    console.error('Error deleting fleet:', error)
    return Response.json({ error: 'Failed to delete fleet' }, { status: 500 })
  }
}
