import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const illustrationId = searchParams.get('illustrationId')
  const userId = searchParams.get('userId')
  const sessionId = searchParams.get('session_id')

  if (!illustrationId || !userId || !sessionId) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (session.payment_status === 'paid') {
      await supabase.from('purchases').upsert({
        user_id: userId,
        illustration_id: illustrationId,
        amount: session.amount_total
      }, { onConflict: 'user_id,illustration_id' })
    }
  } catch (error) {
    console.error('Purchase error:', error)
  }

  return NextResponse.redirect(new URL('/dashboard?success=true', req.url))
}