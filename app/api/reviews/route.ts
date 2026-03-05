import { NextRequest, NextResponse } from 'next/server'
import { createReview, getAllReviews, getReviewsByRating } from '../../lib/database'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const minRating = searchParams.get('minRating')

    if (minRating) {
      const rating = parseInt(minRating, 10)
      if (isNaN(rating) || rating < 1 || rating > 5) {
        return NextResponse.json(
          { error: 'Invalid rating. Must be between 1 and 5.' },
          { status: 400 }
        )
      }
      const reviews = await getReviewsByRating(rating)
      return NextResponse.json(reviews, { status: 200 })
    }

    const reviews = await getAllReviews()
    return NextResponse.json(reviews, { status: 200 })
  } catch (error) {
    console.error('GET /api/reviews error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { booking_reference, rating, message } = body

    // Validate required fields
    if (!booking_reference) {
      return NextResponse.json(
        { error: 'Booking reference is required' },
        { status: 400 }
      )
    }

    if (rating === undefined || rating === null) {
      return NextResponse.json(
        { error: 'Rating is required' },
        { status: 400 }
      )
    }

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // Validate rating is a number between 1 and 5
    const ratingNum = typeof rating === 'string' ? parseInt(rating, 10) : rating
    if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      return NextResponse.json(
        { error: 'Rating must be a number between 1 and 5' },
        { status: 400 }
      )
    }

    // Validate message length
    if (message.trim().length < 10 || message.trim().length > 500) {
      return NextResponse.json(
        { error: 'Message must be between 10 and 500 characters' },
        { status: 400 }
      )
    }

    const review = await createReview({
      booking_reference: booking_reference.trim(),
      rating: ratingNum,
      message: message.trim(),
    })

    return NextResponse.json(review, { status: 201 })
  } catch (error) {
    console.error('POST /api/reviews error:', error)
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    )
  }
}
