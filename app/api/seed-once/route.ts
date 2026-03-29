// ONE-TIME SEED ROUTE — DELETE AFTER USE
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export async function GET(request: Request) {
  const url = new URL(request.url)
  const secret = url.searchParams.get('secret')
  if (secret !== 'judigoods-seed-2024') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const adminHash    = await bcrypt.hash('admin123!', 12)
    const customerHash = await bcrypt.hash('customer123!', 12)

    await prisma.user.upsert({
      where:  { email: 'admin@judigoods.com' },
      update: {},
      create: { name: 'Judi Admin', email: 'admin@judigoods.com', password: adminHash, role: 'ADMIN', emailVerified: new Date() },
    })
    await prisma.user.upsert({
      where:  { email: 'customer@judigoods.com' },
      update: {},
      create: { name: 'Jane Doe', email: 'customer@judigoods.com', password: customerHash, role: 'CUSTOMER', emailVerified: new Date() },
    })

    const catBeauty = await prisma.category.upsert({ where: { slug: 'beauty-wellness' }, update: {}, create: { name: 'Beauty & Wellness', slug: 'beauty-wellness', description: 'Handcrafted body oils, perfumes, herbal blends, and natural skincare.', image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600&q=80' } })
    const catClothing = await prisma.category.upsert({ where: { slug: 'clothing' }, update: {}, create: { name: 'Clothing', slug: 'clothing', description: 'Unique dresses, tunics, shirts and everyday fashion pieces.', image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=600&q=80' } })
    const catAccessories = await prisma.category.upsert({ where: { slug: 'accessories' }, update: {}, create: { name: 'Accessories', slug: 'accessories', description: 'Handcrafted bags, bracelets, necklaces and wearable art.', image: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=600&q=80' } })
    const catHome = await prisma.category.upsert({ where: { slug: 'home-living' }, update: {}, create: { name: 'Home & Living', slug: 'home-living', description: 'Pillows, blankets, bedding, and décor to elevate your space.', image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&q=80' } })
    const catFabric = await prisma.category.upsert({ where: { slug: 'fabric-textiles' }, update: {}, create: { name: 'Fabric & Textiles', slug: 'fabric-textiles', description: 'Vibrant African wax prints, floral silks, and specialty fabrics sold by the yard.', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80' } })

    const products = [
      { name: 'Red Rose Handcrafted Body Oil', slug: 'red-rose-body-oil', description: 'A luxurious, handcrafted body oil infused with rose botanicals, presented in a beautiful crystal-cut glass decanter with cork stopper.', price: 24.99, compareAt: 34.99, stock: 40, isPublished: true, isFeatured: true, isOnSale: true, tags: ['body oil','rose','handcrafted','beauty'], categoryId: catBeauty.id, image: '/images/products/red-rose-body-oil.jpg' },
      { name: 'Golden Botanical Body Oil', slug: 'golden-botanical-oil', description: 'Sun-kissed golden botanical oil blended with nourishing plant extracts, bottled in a faceted crystal decanter.', price: 22.99, compareAt: 29.99, stock: 35, isPublished: true, isFeatured: false, isOnSale: true, tags: ['body oil','botanical','beauty'], categoryId: catBeauty.id, image: '/images/products/golden-botanical-oil.jpg' },
      { name: 'Amber Essence Perfume Oil', slug: 'amber-perfume-oil', description: 'A warm, sensual amber-and-musk perfume oil in a distinctive flat-cut glass bottle with gold cap.', price: 18.99, compareAt: null, stock: 50, isPublished: true, isFeatured: true, isOnSale: false, tags: ['perfume','amber','fragrance'], categoryId: catBeauty.id, image: '/images/products/amber-perfume-oil.jpg' },
      { name: 'Pure Glycerin Skin Moisturiser', slug: 'pure-glycerin', description: 'Pharmaceutical-grade pure glycerin for external use — a tried-and-true humectant that draws moisture into the skin.', price: 8.99, compareAt: null, stock: 80, isPublished: true, isFeatured: false, isOnSale: false, tags: ['glycerin','moisturiser','skincare'], categoryId: catBeauty.id, image: '/images/products/pure-glycerin.jpg' },
      { name: 'Herbal Wellness Blend Jar', slug: 'herbal-wellness-jar', description: 'A generous jar of our signature mixed herbal wellness blend — carefully selected dried herbs, botanicals, and spices.', price: 19.99, compareAt: 26.00, stock: 30, isPublished: true, isFeatured: true, isOnSale: true, tags: ['herbal','wellness','tea'], categoryId: catBeauty.id, image: '/images/products/herbal-wellness-jar.jpg' },
      { name: 'Natural Bark Infusion Jar', slug: 'bark-infusion-jar', description: 'Hand-selected natural bark strips — traditionally revered for their anti-inflammatory and antioxidant properties.', price: 16.99, compareAt: null, stock: 25, isPublished: true, isFeatured: false, isOnSale: false, tags: ['bark','herbal','natural'], categoryId: catBeauty.id, image: '/images/products/bark-infusion-jar.jpg' },
      { name: 'Buffalo Plaid Flannel Shirt', slug: 'buffalo-plaid-shirt', description: 'A classic red and black buffalo plaid flannel shirt — cozy, versatile, and always in style.', price: 29.99, compareAt: 42.00, stock: 20, isPublished: true, isFeatured: false, isOnSale: true, tags: ['shirt','plaid','flannel'], categoryId: catClothing.id, image: '/images/products/buffalo-plaid-shirt.jpg' },
      { name: 'Oversized Plaid Tunic Shirt', slug: 'oversized-plaid-tunic', description: 'An effortlessly chic oversized tunic in a rich multi-toned plaid.', price: 34.99, compareAt: null, stock: 18, isPublished: true, isFeatured: true, isOnSale: false, tags: ['tunic','plaid','oversized'], categoryId: catClothing.id, image: '/images/products/oversized-plaid-tunic.jpg' },
      { name: 'Brown Paisley Maxi Dress', slug: 'paisley-maxi-dress', description: 'A flowing, full-length maxi dress in a gorgeous brown-and-gold paisley print on sheer fabric.', price: 49.99, compareAt: 65.00, stock: 12, isPublished: true, isFeatured: true, isOnSale: true, tags: ['maxi dress','paisley','formal'], categoryId: catClothing.id, image: '/images/products/paisley-maxi-dress.jpg' },
      { name: 'White Floral Boho Maxi Dress', slug: 'floral-maxi-dress', description: 'A romantic white maxi dress adorned with vibrant red, orange, and brown floral prints.', price: 44.99, compareAt: null, stock: 15, isPublished: true, isFeatured: true, isOnSale: false, tags: ['maxi dress','floral','white','boho'], categoryId: catClothing.id, image: '/images/products/floral-maxi-dress.jpg' },
      { name: 'Mustard Embroidered Cardigan Dress', slug: 'mustard-cardigan-dress', description: 'A warm, textured mustard-yellow cardigan dress with delicate white floral embroidery.', price: 39.99, compareAt: 52.00, stock: 10, isPublished: true, isFeatured: false, isOnSale: true, tags: ['cardigan','embroidered','mustard'], categoryId: catClothing.id, image: '/images/products/mustard-cardigan-dress.jpg' },
      { name: 'African Print Long Dress', slug: 'african-print-dress', description: 'A bold, eye-catching long dress in a deep burgundy African heritage print.', price: 54.99, compareAt: null, stock: 8, isPublished: true, isFeatured: false, isOnSale: false, tags: ['african print','long dress','formal'], categoryId: catClothing.id, image: '/images/products/african-print-dress.jpg' },
      { name: 'Gold Glitter Evening Skirt', slug: 'gold-glitter-skirt', description: 'Make a statement with this dazzling gold glitter and sequin evening skirt.', price: 36.99, compareAt: 50.00, stock: 14, isPublished: true, isFeatured: true, isOnSale: true, tags: ['skirt','glitter','sequin','evening'], categoryId: catClothing.id, image: '/images/products/gold-glitter-skirt.jpg' },
      { name: 'Handcrafted Beaded Floral Handbag', slug: 'beaded-handbag', description: 'A stunning handcrafted handbag covered entirely in silver and multicolour glass beads.', price: 59.99, compareAt: 80.00, stock: 6, isPublished: true, isFeatured: true, isOnSale: true, tags: ['handbag','beaded','handcrafted'], categoryId: catAccessories.id, image: '/images/products/beaded-handbag.jpg' },
      { name: 'White & Gold Stretch Bead Bracelet', slug: 'white-gold-bracelet', description: 'An elegant stretch bracelet featuring cream white textured bead clusters alternating with warm gold seed beads.', price: 12.99, compareAt: null, stock: 45, isPublished: true, isFeatured: false, isOnSale: false, tags: ['bracelet','beaded','white','gold'], categoryId: catAccessories.id, image: '/images/products/white-gold-bracelet.jpg' },
      { name: 'Black Hematite Bracelet & Necklace Set', slug: 'hematite-bracelet', description: 'A bold two-piece set: black hematite tile stretch bracelet paired with a matching strand necklace.', price: 21.99, compareAt: 28.00, stock: 20, isPublished: true, isFeatured: false, isOnSale: true, tags: ['bracelet','necklace','hematite'], categoryId: catAccessories.id, image: '/images/products/hematite-bracelet.jpg' },
      { name: 'Pink & Purple Crystal Stretch Bracelet', slug: 'crystal-bracelet', description: 'A glamorous stretch bracelet featuring faceted pink diamond-cut acrylic gems alternating with deep purple glass beads.', price: 9.99, compareAt: null, stock: 60, isPublished: true, isFeatured: false, isOnSale: false, tags: ['bracelet','crystal','pink','purple'], categoryId: catAccessories.id, image: '/images/products/crystal-bracelet.jpg' },
      { name: 'Black Round Meditation Cushions (Set of 2)', slug: 'round-cushion-set', description: 'A set of two round black textured meditation and floor cushions.', price: 34.99, compareAt: 48.00, stock: 18, isPublished: true, isFeatured: false, isOnSale: true, tags: ['cushion','meditation','yoga'], categoryId: catHome.id, image: '/images/products/round-cushion-set.jpg' },
      { name: 'Maroon Woven Stripe Bolster Pillow', slug: 'woven-bolster-pillow', description: 'A long bolster pillow in a beautifully woven maroon, gold, and blue striped fabric.', price: 27.99, compareAt: null, stock: 22, isPublished: true, isFeatured: false, isOnSale: false, tags: ['bolster','pillow','woven'], categoryId: catHome.id, image: '/images/products/woven-bolster-pillow.jpg' },
      { name: 'Royal Blue Satin Pillow', slug: 'blue-satin-pillow', description: 'A rich royal blue satin pillow that brings a regal, luxurious touch to any bedroom.', price: 19.99, compareAt: 26.00, stock: 30, isPublished: true, isFeatured: false, isOnSale: true, tags: ['pillow','satin','blue','bedroom'], categoryId: catHome.id, image: '/images/products/blue-satin-pillow.jpg' },
      { name: 'Floral Rose & Butterfly Bedsheet', slug: 'floral-bedsheet', description: 'A vibrant grey-background bedsheet featuring a stunning pattern of peach roses, lilies, and blue butterflies.', price: 39.99, compareAt: 55.00, stock: 16, isPublished: true, isFeatured: true, isOnSale: true, tags: ['bedsheet','floral','rose','butterfly'], categoryId: catHome.id, image: '/images/products/floral-bedsheet.jpg' },
      { name: 'Pink Camo Fleece Tie Blanket', slug: 'camo-fleece-blanket', description: 'A cosy, handmade fleece tie blanket in a pink, burgundy, and black camouflage pattern.', price: 29.99, compareAt: null, stock: 12, isPublished: true, isFeatured: false, isOnSale: false, tags: ['blanket','fleece','camo','pink'], categoryId: catHome.id, image: '/images/products/camo-fleece-blanket.jpg' },
      { name: 'Geometric Circle Plaid Bedspread', slug: 'circle-bedspread', description: 'A modern, eye-catching bedspread featuring large circular plaid medallions in rich maroon, gold, blue, and ivory tones.', price: 54.99, compareAt: 72.00, stock: 10, isPublished: true, isFeatured: true, isOnSale: true, tags: ['bedspread','geometric','plaid'], categoryId: catHome.id, image: '/images/products/circle-bedspread.jpg' },
      { name: 'African Wax Print Fabric — Yellow & Blue', slug: 'african-wax-fabric', description: 'Bold, authentic African wax print fabric in a vibrant yellow, blue, red, and white botanical pattern. Sold by the yard.', price: 14.99, compareAt: null, stock: 50, isPublished: true, isFeatured: false, isOnSale: false, tags: ['fabric','african wax','cotton'], categoryId: catFabric.id, image: '/images/products/african-wax-fabric.jpg' },
      { name: 'Green Floral Satin Fabric', slug: 'green-floral-fabric', description: 'Luxurious emerald green satin fabric with a stunning cream, peach, and ivory floral print. Sold by the yard.', price: 16.99, compareAt: 22.00, stock: 35, isPublished: true, isFeatured: false, isOnSale: true, tags: ['fabric','satin','green','floral'], categoryId: catFabric.id, image: '/images/products/green-floral-fabric.jpg' },
    ]

    const created: string[] = []
    for (const p of products) {
      const { image, ...data } = p as any
      const product = await prisma.product.upsert({
        where:  { slug: p.slug },
        update: {},
        create: {
          ...data,
          images: { create: [{ url: image, alt: p.name, isPrimary: true, order: 0 }] },
        },
      })
      created.push(product.name)
    }

    await prisma.$disconnect()
    return NextResponse.json({ success: true, message: `Seeded ${created.length} products, 5 categories, 2 users`, products: created })
  } catch (e: any) {
    await prisma.$disconnect()
    return NextResponse.json({ success: false, error: e.message }, { status: 500 })
  }
}
