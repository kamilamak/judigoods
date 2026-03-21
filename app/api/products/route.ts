import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET /api/products — list products with filtering, sorting, pagination
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl

  const page     = parseInt(searchParams.get('page') ?? '1')
  const limit    = parseInt(searchParams.get('limit') ?? '12')
  const category = searchParams.get('category') ?? undefined
  const tag      = searchParams.get('tag') ?? undefined
  const sale     = searchParams.get('sale') === 'true'
  const featured = searchParams.get('featured') === 'true'
  const search   = searchParams.get('search') ?? undefined
  const sort     = searchParams.get('sort') ?? 'createdAt_desc'
  const minPrice = parseFloat(searchParams.get('minPrice') ?? '0')
  const maxPrice = parseFloat(searchParams.get('maxPrice') ?? '9999')

  // Build sort
  const [sortField, sortDir] = sort.split('_')
  const orderBy: any =
    sortField === 'price' ? { price: sortDir as 'asc' | 'desc' } :
    sortField === 'name'  ? { name: sortDir as 'asc' | 'desc' } :
    { createdAt: 'desc' }

  const where = {
    isPublished: true,
    ...(sale     && { isOnSale: true }),
    ...(featured && { isFeatured: true }),
    ...(category && { category: { slug: category } }),
    ...(tag      && { tags: { has: tag } }),
    ...(search   && {
      OR: [
        { name: { contains: search, mode: 'insensitive' as const } },
        { description: { contains: search, mode: 'insensitive' as const } },
      ],
    }),
    price: { gte: minPrice, lte: maxPrice },
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      take: limit,
      skip: (page - 1) * limit,
      orderBy,
      include: {
        images: { where: { isPrimary: true }, take: 1 },
        category: { select: { name: true, slug: true } },
        reviews: { select: { rating: true } },
      },
    }),
    prisma.product.count({ where }),
  ])

  return NextResponse.json({
    products,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  })
}
