import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createCheckoutSession } from '@/lib/stripe'
import prisma from '@/lib/prisma'

// POST /api/checkout — create a Stripe checkout session
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  const body = await request.json()

  const { items } = body as {
    items: { productId: string; quantity: number; variant?: string }[]
  }

  if (!items?.length) {
    return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
  }

  // Fetch products from DB to get real prices (NEVER trust client-side prices!)
  const productIds = items.map((i) => i.productId)
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    include: { images: { where: { isPrimary: true }, take: 1 } },
  })

  const lineItems = items.map((item) => {
    const product = products.find((p) => p.id === item.productId)
    if (!product) throw new Error(`Product ${item.productId} not found`)
    return {
      productId: product.id,
      name: product.name + (item.variant ? ` (${item.variant})` : ''),
      price: product.price,
      quantity: item.quantity,
      image: product.images[0]?.url,
    }
  })

  const origin = request.headers.get('origin') ?? process.env.NEXT_PUBLIC_APP_URL!

  try {
    const checkoutSession = await createCheckoutSession({
      items: lineItems,
      userId: session?.user?.id,
      customerEmail: session?.user?.email ?? undefined,
      successUrl: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${origin}/cart`,
    })

    return NextResponse.json({ url: checkoutSession.url })
  } catch (error: any) {
    console.error('Stripe checkout error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
