// ============================================================
// JUDIGOODS - Database Seed File (Real Products from Merch PDFs)
// Run with: npm run prisma:seed
// ============================================================

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding Judigoods database...')

  // ── Users ──────────────────────────────────────────────────────────────────
  const adminHash    = await bcrypt.hash('admin123!', 12)
  const customerHash = await bcrypt.hash('customer123!', 12)

  const admin = await prisma.user.upsert({
    where:  { email: 'admin@judigoods.com' },
    update: {},
    create: {
      name: 'Judi Admin',
      email: 'admin@judigoods.com',
      password: adminHash,
      role: 'ADMIN',
      emailVerified: new Date(),
    },
  })

  const customer = await prisma.user.upsert({
    where:  { email: 'customer@judigoods.com' },
    update: {},
    create: {
      name: 'Jane Doe',
      email: 'customer@judigoods.com',
      password: customerHash,
      role: 'CUSTOMER',
      emailVerified: new Date(),
    },
  })

  console.log('✅ Users created')

  // ── Categories ──────────────────────────────────────────────────────────────
  const catBeauty = await prisma.category.upsert({
    where:  { slug: 'beauty-wellness' },
    update: {},
    create: {
      name: 'Beauty & Wellness',
      slug: 'beauty-wellness',
      description: 'Handcrafted body oils, perfumes, herbal blends, and natural skincare.',
      image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600&q=80',
    },
  })

  const catClothing = await prisma.category.upsert({
    where:  { slug: 'clothing' },
    update: {},
    create: {
      name: 'Clothing',
      slug: 'clothing',
      description: 'Unique dresses, tunics, shirts and everyday fashion pieces.',
      image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=600&q=80',
    },
  })

  const catAccessories = await prisma.category.upsert({
    where:  { slug: 'accessories' },
    update: {},
    create: {
      name: 'Accessories',
      slug: 'accessories',
      description: 'Handcrafted bags, bracelets, necklaces and wearable art.',
      image: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=600&q=80',
    },
  })

  const catHome = await prisma.category.upsert({
    where:  { slug: 'home-living' },
    update: {},
    create: {
      name: 'Home & Living',
      slug: 'home-living',
      description: 'Pillows, blankets, bedding, and décor to elevate your space.',
      image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&q=80',
    },
  })

  const catFabric = await prisma.category.upsert({
    where:  { slug: 'fabric-textiles' },
    update: {},
    create: {
      name: 'Fabric & Textiles',
      slug: 'fabric-textiles',
      description: 'Vibrant African wax prints, floral silks, and specialty fabrics sold by the yard.',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
    },
  })

  console.log('✅ Categories created')

  // ── Products ────────────────────────────────────────────────────────────────
  const products = [
    // ── BEAUTY & WELLNESS ──────────────────────────────────────────────────
    {
      name:        'Red Rose Handcrafted Body Oil',
      slug:        'red-rose-body-oil',
      description: 'A luxurious, handcrafted body oil infused with rose botanicals, presented in a beautiful crystal-cut glass decanter with cork stopper. Deeply moisturises, leaves skin radiant and softly scented. Perfect as a daily body treatment or a thoughtful gift.',
      price:       24.99,
      compareAt:   34.99,
      stock:       40,
      isPublished: true,
      isFeatured:  true,
      isOnSale:    true,
      tags:        ['body oil', 'rose', 'handcrafted', 'beauty', 'gift'],
      categoryId:  catBeauty.id,
      image:       '/images/products/red-rose-body-oil.jpg',
      variants:    [],
    },
    {
      name:        'Golden Botanical Body Oil',
      slug:        'golden-botanical-oil',
      description: 'Sun-kissed golden botanical oil blended with nourishing plant extracts, bottled in a faceted crystal decanter. Absorbs quickly to leave skin glowing without grease. Excellent for hair, skin, and cuticles — a true multipurpose beauty essential.',
      price:       22.99,
      compareAt:   29.99,
      stock:       35,
      isPublished: true,
      isFeatured:  false,
      isOnSale:    true,
      tags:        ['body oil', 'botanical', 'golden', 'beauty', 'multipurpose'],
      categoryId:  catBeauty.id,
      image:       '/images/products/golden-botanical-oil.jpg',
      variants:    [],
    },
    {
      name:        'Amber Essence Perfume Oil',
      slug:        'amber-perfume-oil',
      description: 'A warm, sensual amber-and-musk perfume oil in a distinctive flat-cut glass bottle with gold cap. Long-lasting fragrance that develops beautifully on skin throughout the day. Alcohol-free and skin-friendly. Apply to pulse points for an unforgettable signature scent.',
      price:       18.99,
      compareAt:   null,
      stock:       50,
      isPublished: true,
      isFeatured:  true,
      isOnSale:    false,
      tags:        ['perfume', 'amber', 'fragrance', 'oil', 'alcohol-free'],
      categoryId:  catBeauty.id,
      image:       '/images/products/amber-perfume-oil.jpg',
      variants:    [],
    },
    {
      name:        'Pure Glycerin Skin Moisturiser',
      slug:        'pure-glycerin',
      description: 'Pharmaceutical-grade pure glycerin for external use — a tried-and-true humectant that draws moisture into the skin. Ideal for dry hands, heels, lips, and elbows. Mix with your favourite oils or creams to boost moisturising power. 100 ml bottle.',
      price:       8.99,
      compareAt:   null,
      stock:       80,
      isPublished: true,
      isFeatured:  false,
      isOnSale:    false,
      tags:        ['glycerin', 'moisturiser', 'skincare', 'natural', 'dry skin'],
      categoryId:  catBeauty.id,
      image:       '/images/products/pure-glycerin.jpg',
      variants:    [],
    },
    {
      name:        'Herbal Wellness Blend Jar',
      slug:        'herbal-wellness-jar',
      description: 'A generous jar of our signature mixed herbal wellness blend — carefully selected dried herbs, botanicals, and spices traditionally used for their health-supporting properties. Use as a herbal tea infusion, aromatherapy steam, or foot soak. Handpacked with love.',
      price:       19.99,
      compareAt:   26.00,
      stock:       30,
      isPublished: true,
      isFeatured:  true,
      isOnSale:    true,
      tags:        ['herbal', 'wellness', 'tea', 'natural', 'handpacked'],
      categoryId:  catBeauty.id,
      image:       '/images/products/herbal-wellness-jar.jpg',
      variants:    [],
    },
    {
      name:        'Natural Bark Infusion Jar',
      slug:        'bark-infusion-jar',
      description: 'Hand-selected natural bark strips — traditionally revered for their anti-inflammatory and antioxidant properties. Brew as a warming tea, use in oil infusions, or add to bathwater. Sustainably sourced and minimally processed to preserve natural potency.',
      price:       16.99,
      compareAt:   null,
      stock:       25,
      isPublished: true,
      isFeatured:  false,
      isOnSale:    false,
      tags:        ['bark', 'herbal', 'natural', 'tea', 'wellness'],
      categoryId:  catBeauty.id,
      image:       '/images/products/bark-infusion-jar.jpg',
      variants:    [],
    },

    // ── CLOTHING ───────────────────────────────────────────────────────────
    {
      name:        'Buffalo Plaid Flannel Shirt',
      slug:        'buffalo-plaid-shirt',
      description: 'A classic red and black buffalo plaid flannel shirt — cozy, versatile, and always in style. Button-front closure, relaxed fit. Works as a standalone top or an open layer. Perfect for casual outings, fall weekends, or a laid-back work-from-home day.',
      price:       29.99,
      compareAt:   42.00,
      stock:       20,
      isPublished: true,
      isFeatured:  false,
      isOnSale:    true,
      tags:        ['shirt', 'plaid', 'flannel', 'casual', 'buffalo check'],
      categoryId:  catClothing.id,
      image:       '/images/products/buffalo-plaid-shirt.jpg',
      variants: [
        { name: 'Size', value: 'S',   price: null,  stock: 4 },
        { name: 'Size', value: 'M',   price: null,  stock: 6 },
        { name: 'Size', value: 'L',   price: null,  stock: 6 },
        { name: 'Size', value: 'XL',  price: null,  stock: 4 },
        { name: 'Size', value: '2XL', price: 32.99, stock: 0 },
      ],
    },
    {
      name:        'Oversized Plaid Tunic Shirt',
      slug:        'oversized-plaid-tunic',
      description: 'An effortlessly chic oversized tunic in a rich multi-toned plaid — earthy blues, browns, and greens in a relaxed boyfriend silhouette. Snap-button cuffs and curved hem. Style over leggings or tuck into high-waisted jeans for an elevated everyday look.',
      price:       34.99,
      compareAt:   null,
      stock:       18,
      isPublished: true,
      isFeatured:  true,
      isOnSale:    false,
      tags:        ['tunic', 'plaid', 'oversized', 'casual', 'shirt'],
      categoryId:  catClothing.id,
      image:       '/images/products/oversized-plaid-tunic.jpg',
      variants: [
        { name: 'Size', value: 'S/M',     price: null,  stock: 6 },
        { name: 'Size', value: 'L/XL',    price: null,  stock: 8 },
        { name: 'Size', value: '2XL/3XL', price: 37.99, stock: 4 },
      ],
    },
    {
      name:        'Brown Paisley Maxi Dress',
      slug:        'paisley-maxi-dress',
      description: 'A flowing, full-length maxi dress in a gorgeous brown-and-gold paisley print on sheer fabric. Long sleeves, relaxed modest cut — perfect for formal events, cultural celebrations, or elegant everyday wear. Lightweight and breathable.',
      price:       49.99,
      compareAt:   65.00,
      stock:       12,
      isPublished: true,
      isFeatured:  true,
      isOnSale:    true,
      tags:        ['maxi dress', 'paisley', 'formal', 'modest', 'long sleeve'],
      categoryId:  catClothing.id,
      image:       '/images/products/paisley-maxi-dress.jpg',
      variants: [
        { name: 'Size', value: 'S',  price: null, stock: 2 },
        { name: 'Size', value: 'M',  price: null, stock: 4 },
        { name: 'Size', value: 'L',  price: null, stock: 4 },
        { name: 'Size', value: 'XL', price: null, stock: 2 },
      ],
    },
    {
      name:        'White Floral Boho Maxi Dress',
      slug:        'floral-maxi-dress',
      description: 'A romantic white maxi dress adorned with vibrant red, orange, and brown floral prints. Relaxed, breathable fit ideal for garden parties, beach days, or warm-weather events. The loose silhouette provides comfort and effortless elegance.',
      price:       44.99,
      compareAt:   null,
      stock:       15,
      isPublished: true,
      isFeatured:  true,
      isOnSale:    false,
      tags:        ['maxi dress', 'floral', 'white', 'boho', 'summer'],
      categoryId:  catClothing.id,
      image:       '/images/products/floral-maxi-dress.jpg',
      variants: [
        { name: 'Size', value: 'S',  price: null, stock: 3 },
        { name: 'Size', value: 'M',  price: null, stock: 5 },
        { name: 'Size', value: 'L',  price: null, stock: 5 },
        { name: 'Size', value: 'XL', price: null, stock: 2 },
      ],
    },
    {
      name:        'Mustard Embroidered Cardigan Dress',
      slug:        'mustard-cardigan-dress',
      description: 'A warm, textured mustard-yellow cardigan dress with delicate white floral embroidery along the button placket. Midi length with a comfortable, relaxed fit. Perfect for layering in cooler months — wear over a turtleneck or dress it down with sneakers.',
      price:       39.99,
      compareAt:   52.00,
      stock:       10,
      isPublished: true,
      isFeatured:  false,
      isOnSale:    true,
      tags:        ['cardigan', 'embroidered', 'mustard', 'midi', 'knitwear'],
      categoryId:  catClothing.id,
      image:       '/images/products/mustard-cardigan-dress.jpg',
      variants: [
        { name: 'Size', value: 'M',  price: null, stock: 3 },
        { name: 'Size', value: 'L',  price: null, stock: 4 },
        { name: 'Size', value: 'XL', price: null, stock: 3 },
      ],
    },
    {
      name:        'African Print Long Dress',
      slug:        'african-print-dress',
      description: 'A bold, eye-catching long dress in a deep burgundy African heritage print. Long sleeves and full-length silhouette make it perfect for formal occasions, cultural events, and celebrations. Relaxed yet sophisticated — celebrate your roots in style.',
      price:       54.99,
      compareAt:   null,
      stock:       8,
      isPublished: true,
      isFeatured:  false,
      isOnSale:    false,
      tags:        ['african print', 'long dress', 'formal', 'cultural', 'heritage'],
      categoryId:  catClothing.id,
      image:       '/images/products/african-print-dress.jpg',
      variants: [
        { name: 'Size', value: 'M',   price: null,  stock: 2 },
        { name: 'Size', value: 'L',   price: null,  stock: 3 },
        { name: 'Size', value: 'XL',  price: null,  stock: 2 },
        { name: 'Size', value: '2XL', price: 57.99, stock: 1 },
      ],
    },
    {
      name:        'Gold Glitter Evening Skirt',
      slug:        'gold-glitter-skirt',
      description: 'Make a statement with this dazzling gold glitter and sequin evening skirt. All-over metallic shimmer catches every light for maximum impact. Pair with a simple bodysuit for a show-stopping night-out look. One size fits most.',
      price:       36.99,
      compareAt:   50.00,
      stock:       14,
      isPublished: true,
      isFeatured:  true,
      isOnSale:    true,
      tags:        ['skirt', 'glitter', 'sequin', 'evening', 'party'],
      categoryId:  catClothing.id,
      image:       '/images/products/gold-glitter-skirt.jpg',
      variants:    [],
    },

    // ── ACCESSORIES ────────────────────────────────────────────────────────
    {
      name:        'Handcrafted Beaded Floral Handbag',
      slug:        'beaded-handbag',
      description: 'A stunning handcrafted handbag covered entirely in silver and multicolour glass beads arranged in bold floral motifs — pinks, blues, greens, yellows, and purples on a silver base. Structured frame with looped bead handles. A true wearable art piece for special occasions.',
      price:       59.99,
      compareAt:   80.00,
      stock:       6,
      isPublished: true,
      isFeatured:  true,
      isOnSale:    true,
      tags:        ['handbag', 'beaded', 'handcrafted', 'floral', 'evening bag'],
      categoryId:  catAccessories.id,
      image:       '/images/products/beaded-handbag.jpg',
      variants:    [],
    },
    {
      name:        'White & Gold Stretch Bead Bracelet',
      slug:        'white-gold-bracelet',
      description: 'An elegant stretch bracelet featuring cream white textured bead clusters alternating with warm gold seed beads. Comfortable elastic band fits most wrists. Stack several for a layered bohemian look, or wear alone for understated chic. Handmade with care.',
      price:       12.99,
      compareAt:   null,
      stock:       45,
      isPublished: true,
      isFeatured:  false,
      isOnSale:    false,
      tags:        ['bracelet', 'beaded', 'white', 'gold', 'stretch', 'handmade'],
      categoryId:  catAccessories.id,
      image:       '/images/products/white-gold-bracelet.jpg',
      variants:    [],
    },
    {
      name:        'Black Hematite Bracelet & Necklace Set',
      slug:        'hematite-bracelet',
      description: 'A bold two-piece set: black hematite tile stretch bracelet paired with a matching strand necklace. Hematite is said to promote grounding and clarity. Sleek, modern look that pairs effortlessly with any outfit. Gift-ready.',
      price:       21.99,
      compareAt:   28.00,
      stock:       20,
      isPublished: true,
      isFeatured:  false,
      isOnSale:    true,
      tags:        ['bracelet', 'necklace', 'hematite', 'set', 'black', 'gemstone'],
      categoryId:  catAccessories.id,
      image:       '/images/products/hematite-bracelet.jpg',
      variants:    [],
    },
    {
      name:        'Pink & Purple Crystal Stretch Bracelet',
      slug:        'crystal-bracelet',
      description: 'A glamorous stretch bracelet featuring faceted pink diamond-cut acrylic gems alternating with deep purple glass beads. Bold, colourful, and fun — perfect for brightening up any outfit. One size fits most adult wrists. Great as a gift.',
      price:       9.99,
      compareAt:   null,
      stock:       60,
      isPublished: true,
      isFeatured:  false,
      isOnSale:    false,
      tags:        ['bracelet', 'crystal', 'pink', 'purple', 'stretch', 'fashion'],
      categoryId:  catAccessories.id,
      image:       '/images/products/crystal-bracelet.jpg',
      variants:    [],
    },

    // ── HOME & LIVING ──────────────────────────────────────────────────────
    {
      name:        'Black Round Meditation Cushions (Set of 2)',
      slug:        'round-cushion-set',
      description: 'A set of two round black textured meditation and floor cushions — perfect for yoga practice, meditation, reading nooks, or floor seating. Ribbed fabric with a clean, modern aesthetic. Firm yet comfortable fill provides lasting support.',
      price:       34.99,
      compareAt:   48.00,
      stock:       18,
      isPublished: true,
      isFeatured:  false,
      isOnSale:    true,
      tags:        ['cushion', 'meditation', 'floor pillow', 'yoga', 'set of 2'],
      categoryId:  catHome.id,
      image:       '/images/products/round-cushion-set.jpg',
      variants:    [],
    },
    {
      name:        'Maroon Woven Stripe Bolster Pillow',
      slug:        'woven-bolster-pillow',
      description: 'A long bolster pillow in a beautifully woven maroon, gold, and blue striped fabric with traditional textile detailing. Perfect as a bed pillow, lumbar support cushion, or decorative accent. Generously stuffed for plush support.',
      price:       27.99,
      compareAt:   null,
      stock:       22,
      isPublished: true,
      isFeatured:  false,
      isOnSale:    false,
      tags:        ['bolster', 'pillow', 'woven', 'stripe', 'decorative', 'lumbar'],
      categoryId:  catHome.id,
      image:       '/images/products/woven-bolster-pillow.jpg',
      variants:    [],
    },
    {
      name:        'Royal Blue Satin Pillow',
      slug:        'blue-satin-pillow',
      description: 'A rich royal blue satin pillow that brings a regal, luxurious touch to any bedroom. The smooth satin surface is gentle on hair and skin — ideal as a protective sleeping pillow. Standard size with generous fill.',
      price:       19.99,
      compareAt:   26.00,
      stock:       30,
      isPublished: true,
      isFeatured:  false,
      isOnSale:    true,
      tags:        ['pillow', 'satin', 'blue', 'bedroom', 'protective', 'luxury'],
      categoryId:  catHome.id,
      image:       '/images/products/blue-satin-pillow.jpg',
      variants: [
        { name: 'Color', value: 'Royal Blue', price: null,  stock: 15 },
        { name: 'Color', value: 'Deep Purple', price: null, stock: 10 },
        { name: 'Color', value: 'Champagne',  price: null,  stock: 5  },
      ],
    },
    {
      name:        'Floral Rose & Butterfly Bedsheet',
      slug:        'floral-bedsheet',
      description: 'A vibrant grey-background bedsheet featuring a stunning pattern of peach roses, lilies, and blue butterflies. Crafted from soft, breathable fabric. The rich print adds a garden-fresh, feminine touch to any bedroom.',
      price:       39.99,
      compareAt:   55.00,
      stock:       16,
      isPublished: true,
      isFeatured:  true,
      isOnSale:    true,
      tags:        ['bedsheet', 'floral', 'rose', 'butterfly', 'grey', 'bedroom'],
      categoryId:  catHome.id,
      image:       '/images/products/floral-bedsheet.jpg',
      variants: [
        { name: 'Size', value: 'Twin',       price: 34.99, stock: 4 },
        { name: 'Size', value: 'Full/Queen', price: null,  stock: 8 },
        { name: 'Size', value: 'King',       price: 44.99, stock: 4 },
      ],
    },
    {
      name:        'Pink Camo Fleece Tie Blanket',
      slug:        'camo-fleece-blanket',
      description: 'A cosy, handmade fleece tie blanket in a pink, burgundy, and black camouflage pattern. Soft and warm — perfect for sofa snuggling, road trips, or gifting. The knotted fringe edges give it a fun, crafted character.',
      price:       29.99,
      compareAt:   null,
      stock:       12,
      isPublished: true,
      isFeatured:  false,
      isOnSale:    false,
      tags:        ['blanket', 'fleece', 'camo', 'pink', 'handmade', 'gift'],
      categoryId:  catHome.id,
      image:       '/images/products/camo-fleece-blanket.jpg',
      variants:    [],
    },
    {
      name:        'Geometric Circle Plaid Bedspread',
      slug:        'circle-bedspread',
      description: 'A modern, eye-catching bedspread featuring large circular plaid medallions in rich maroon, gold, blue, and ivory tones on a natural linen-look background. Lightweight and versatile — works as a bedspread, sofa throw, or picnic blanket.',
      price:       54.99,
      compareAt:   72.00,
      stock:       10,
      isPublished: true,
      isFeatured:  true,
      isOnSale:    true,
      tags:        ['bedspread', 'geometric', 'plaid', 'maroon', 'gold', 'modern'],
      categoryId:  catHome.id,
      image:       '/images/products/circle-bedspread.jpg',
      variants: [
        { name: 'Size', value: 'Full/Queen', price: null,  stock: 6 },
        { name: 'Size', value: 'King',       price: 64.99, stock: 4 },
      ],
    },

    // ── FABRIC & TEXTILES ──────────────────────────────────────────────────
    {
      name:        'African Wax Print Fabric — Yellow & Blue',
      slug:        'african-wax-fabric',
      description: 'Bold, authentic African wax print fabric in a vibrant yellow, blue, red, and white botanical pattern. Sold by the yard. Perfect for making dresses, tops, head wraps, or home décor. 100% cotton, pre-washed. Colours are rich and long-lasting.',
      price:       14.99,
      compareAt:   null,
      stock:       50,
      isPublished: true,
      isFeatured:  false,
      isOnSale:    false,
      tags:        ['fabric', 'african wax', 'cotton', 'yellow', 'blue', 'per yard'],
      categoryId:  catFabric.id,
      image:       '/images/products/african-wax-fabric.jpg',
      variants: [
        { name: 'Yards', value: '1 yard',  price: 14.99, stock: 20 },
        { name: 'Yards', value: '3 yards', price: 39.99, stock: 15 },
        { name: 'Yards', value: '6 yards', price: 74.99, stock: 15 },
      ],
    },
    {
      name:        'Green Floral Satin Fabric',
      slug:        'green-floral-fabric',
      description: 'Luxurious emerald green satin fabric with a stunning cream, peach, and ivory floral print. Soft and drapey with a subtle sheen — ideal for special occasion garments, evening dresses, or elegant home décor. Sold by the yard. Dry clean recommended.',
      price:       16.99,
      compareAt:   22.00,
      stock:       35,
      isPublished: true,
      isFeatured:  false,
      isOnSale:    true,
      tags:        ['fabric', 'satin', 'green', 'floral', 'per yard', 'evening wear'],
      categoryId:  catFabric.id,
      image:       '/images/products/green-floral-fabric.jpg',
      variants: [
        { name: 'Yards', value: '1 yard',  price: 16.99, stock: 15 },
        { name: 'Yards', value: '3 yards', price: 44.99, stock: 12 },
        { name: 'Yards', value: '6 yards', price: 84.99, stock: 8  },
      ],
    },
  ]

  // Insert all products
  for (const p of products) {
    const { variants, image, ...data } = p as any
    const product = await prisma.product.upsert({
      where:  { slug: p.slug },
      update: {},
      create: {
        ...data,
        images: {
          create: [{ url: image, alt: p.name, isPrimary: true, order: 0 }],
        },
        ...(variants && variants.length > 0 && {
          variants: {
            create: variants.map((v: any) => ({
              name:  v.name,
              value: v.value,
              price: v.price ?? null,
              stock: v.stock ?? 0,
            })),
          },
        }),
      },
    })
    console.log(`  ✅ ${product.name}`)
  }

  console.log('✅ Products seeded:', products.length)

  // ── Sample Review ─────────────────────────────────────────────────────────
  const oilProduct = await prisma.product.findUnique({ where: { slug: 'red-rose-body-oil' } })
  if (oilProduct) {
    const existingReview = await prisma.review.findFirst({
      where: { productId: oilProduct.id, userId: customer.id },
    })
    if (!existingReview) {
      await prisma.review.create({
        data: {
          rating:    5,
          title:     'Absolutely love this oil!',
          body:      'The scent is gorgeous and it really does leave my skin feeling silky smooth. The crystal decanter is beautiful too — I display it on my vanity. Will definitely be ordering again!',
          verified:  true,
          productId: oilProduct.id,
          userId:    customer.id,
        },
      })
      console.log('✅ Sample review created')
    }
  }

  console.log('')
  console.log('🎉 Database seeded successfully!')
  console.log('')
  console.log('📋 Login credentials:')
  console.log('   Admin:    admin@judigoods.com  /  admin123!')
  console.log('   Customer: customer@judigoods.com  /  customer123!')
}

main()
  .catch(e => { console.error('❌ Seed error:', e); process.exit(1) })
  .finally(() => prisma.$disconnect())
