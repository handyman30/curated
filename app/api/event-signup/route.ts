import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const { eventId, name, email, gender } = await req.json()
  if (!eventId || !name || !email || !gender) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  const admin = supabaseAdmin()

  // Get event details
  const { data: event, error: evErr } = await admin
    .from('events')
    .select('*')
    .eq('id', eventId)
    .single()

  if (evErr || !event) {
    return NextResponse.json({ error: 'Event not found' }, { status: 404 })
  }

  // Check slots
  const signupCol = gender === 'female' ? 'signups_women' : 'signups_men'
  const capCol    = gender === 'female' ? 'capacity_women' : 'capacity_men'
  if (event[signupCol] >= event[capCol]) {
    return NextResponse.json({ error: 'No slots left for this gender' }, { status: 400 })
  }

  // Record signup (unpaid — paid after Stripe redirect)
  await admin.from('event_signups').upsert(
    { event_id: eventId, email, name, gender, is_paid: false },
    { onConflict: 'event_id,email' }
  )

  // Create Stripe checkout (IDR)
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://join-curated.netlify.app'

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    customer_email: email,
    line_items: [{
      price_data: {
        currency: 'idr',
        product_data: {
          name: `Curated Event — ${event.name}`,
          description: `${event.venue} · ${new Date(event.date_time).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}`,
        },
        unit_amount: event.price_idr,
      },
      quantity: 1,
    }],
    success_url: `${siteUrl}/?event=confirmed&name=${encodeURIComponent(name)}`,
    cancel_url:  `${siteUrl}/#events`,
    metadata: { eventId, email, gender },
  })

  return NextResponse.json({ checkoutUrl: session.url })
}
