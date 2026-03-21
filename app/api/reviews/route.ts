import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { z } from 'zod'

const ReviewSchema = z.object({
  productId: z.string().cuid(),
  rating:    z.number().int().min(1).max(5),
  title:     z.string().max(100).optional(),
  body:      z.string().min(10).max(2000),
})

// POST /api/reviews — submit a review
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Sign in to leave a review' }, { status: 401 })
  }

  const body = await request.json()
  const parsed = ReviewSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.format() }, { status: 400 })
  }

  // Check for existing review
  const existing = await prisma.review.findFirst({
    where: { userId: session.user.id, productId: parsed.data.productId },
  })
  if (existing) {
    return NextResponse.json({ error: 'You already reviewed this product' }, { status: 409 })
  }

  const review = await prisma.review.create({
    data: { ...parsed.data, userId: session.user.id },
    include: { user: { select: { name: true, image: true } } },
  })

  return NextResponse.json(review, { status: 201 })
}

// GET /api/reviews?productId=xxx
export async function GET(request: NextRequest) {
  const productId = request.nextUrl.searchParams.get('productId')
  if (!productId) return NextResponse.json({ error: 'productId required' }, { status: 400 })

  const reviews = await prisma.review.findMany({
    where: { productId },
    orderBy: { createdAt: 'desc' },
    include: { user: { select: { name: true, image: true } } },
  })

  const avgRating = reviews.length
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : null

  return NextResponse.json({ reviews, avgRating, count: reviews.length })
}
