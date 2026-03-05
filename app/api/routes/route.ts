import { getAllRoutes, createRoute, Route } from '@/app/lib/database'

export async function GET() {
  try {
    const routes = await getAllRoutes()
    return Response.json(routes)
  } catch (error) {
    console.error('Error fetching routes:', error)
    return Response.json({ error: 'Failed to fetch routes' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.name || !body.from_location || !body.to_location || !body.price) {
      return Response.json(
        { error: 'Missing required fields: name, from_location, to_location, price' },
        { status: 400 }
      )
    }

    const routeData: Omit<Route, 'id' | 'created_at'> = {
      name: body.name,
      from_location: body.from_location,
      to_location: body.to_location,
      price: Math.max(0, Number(body.price) || 0),
      distance: body.distance || '',
      estimated_duration: body.estimated_duration || '',
      status: body.status || 'active',
    }

    const route = await createRoute(routeData)
    return Response.json(route, { status: 201 })
  } catch (error) {
    console.error('Error creating route:', error)
    return Response.json({ error: 'Failed to create route' }, { status: 500 })
  }
}
