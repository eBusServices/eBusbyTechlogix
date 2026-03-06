import { NextRequest, NextResponse } from 'next/server'
import { updateReviewApproval, getAllReviews } from '../../../lib/database'

export async function PATCH(req: NextRequest, { params }: { params: { id: string }}) {
  try {
    const { id } = params
    const body = await req.json()
    const { approved } = body

    if (approved === undefined || typeof approved !== 'boolean') {
      return NextResponse.json(
        { error: 'approved(boolean) field required' },
        { status: 400 }
      )
    }

    const updated = await updateReviewApproval(id, approved)
    return NextResponse.json(updated, { status: 200 })
  } catch (error) {
    console.error('PATCH /api/reviews/[id] error:', error)
    return NextResponse.json({ error: 'Failed to update review' }, { status: 500 })
  }
}

export async function GET(req: NextRequest, { params }: { params: { id: string }}) {
  try {
    const { id } = params
    const reviews = await getAllReviews()
    const review = reviews.find((r) => r.id === id)
    if (!review) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    return NextResponse.json(review, { status: 200 })
  } catch (error) {
    console.error('GET /api/reviews/[id] error:', error)
    return NextResponse.json({ error: 'Failed to fetch review' }, { status: 500 })
  }
}
