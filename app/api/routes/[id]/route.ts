import { getRouteById, updateRoute } from '@/app/lib/database'

interface Params {
  params: { id: string }
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    const existing = await getRouteById(params.id)
    if (!existing) {
      return Response.json({ error: 'Route not found' }, { status: 404 })
    }

    const body = await request.json()
    const updated = await updateRoute(params.id, {
      name: body.name ?? existing.name,
      from_location: body.from_location ?? existing.from_location,
      to_location: body.to_location ?? existing.to_location,
      price: Math.max(1, Number(body.price ?? existing.price) || 1),
      distance: body.distance ?? existing.distance,
      estimated_duration: body.estimated_duration ?? existing.estimated_duration,
      status: body.status ?? existing.status,
    })

    return Response.json(updated)
  } catch (error) {
    console.error('Error updating route:', error)
    return Response.json({ error: 'Failed to update route' }, { status: 500 })
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  try {
    const existing = await getRouteById(params.id)
    if (!existing) {
      return Response.json({ error: 'Route not found' }, { status: 404 })
    }

    await updateRoute(params.id, { status: 'inactive' })
    return Response.json({ success: true })
  } catch (error) {
    console.error('Error deleting route:', error)
    return Response.json({ error: 'Failed to delete route' }, { status: 500 })
  }
}
