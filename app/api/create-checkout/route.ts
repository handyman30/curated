import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

export async function POST(req: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
  const { email } = await req.json()
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://join-curated.netlify.app'

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'subscription',
    customer_email: email,
    line_items: [
      {
        price_data: {
          currency: 'idr',
          product_data: { name: 'Curated Matchmaking — Unlock semua profil & perkenalan' },
          unit_amount: 75000, // Rp 75.000
          recurring: { interval: 'month' },
        },
        quantity: 1,
      },
    ],
    success_url: `${siteUrl}/dashboard?paid=true`,
    cancel_url: `${siteUrl}/dashboard`,
  })

  return NextResponse.json({ url: session.url })
}
