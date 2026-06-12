# Curated

Matchmaking platform for Jakarta professionals. Built with Next.js 15, Supabase, Stripe, and Resend.

**Live site:** https://join-curated.netlify.app

---

## Local Setup

### 1. Clone & install

```bash
git clone https://github.com/handyman30/curated.git
cd curated
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env.local
```

Fill in `.env.local` with your own keys (see below).

### 3. Set up Supabase

1. Create a free project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the contents of `supabase/schema.sql`
3. Copy your **Project URL**, **anon key**, and **service_role key** into `.env.local`

### 4. Set up Stripe (test mode)

1. Create an account at [stripe.com](https://stripe.com)
2. Use **test mode** keys (start with `pk_test_` / `sk_test_`)
3. Paste into `.env.local`

### 5. Set up Resend (optional for local)

1. Free account at [resend.com](https://resend.com)
2. Paste API key into `.env.local`
3. If you skip this, the app still works — emails just won't send

### 6. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

Admin panel: [http://localhost:3000/admin](http://localhost:3000/admin) — password is `curated2025`

---

## Project Structure

```
app/
  page.tsx              # Landing page
  dashboard/page.tsx    # Member browse page
  admin/page.tsx        # Admin panel
  auth/page.tsx         # Login / register
  subscribe/page.tsx    # Stripe payment page
  api/
    admin-auth/         # Admin login check
    admin-profiles/     # Fetch waitlist (service role)
    admin-approve/      # Approve member + copy to discover_profiles
    create-checkout/    # Stripe subscription checkout
    event-signup/       # Event registration + Stripe

components/
  Hero.tsx
  Events.tsx            # Upcoming Saturday events
  Membership.tsx
  WaitlistForm.tsx
  ...

netlify/functions/
  waitlist-submit.js    # Saves form data to Supabase + sends emails

lib/
  supabase.ts           # Anon client + admin client

supabase/
  schema.sql            # Run this in Supabase SQL Editor on first setup
```

## Database Tables

| Table | Purpose |
|-------|---------|
| `profiles` | Waitlist applicants (admin manages here) |
| `discover_profiles` | Profiles visible in dashboard (populated on approval) |
| `likes` | Member interest signals |
| `events` | Upcoming events |
| `event_signups` | Event registrations |

## Key flows

- **Waitlist** → `/.netlify/functions/waitlist-submit` → saves to `profiles` + sends email
- **Admin approves** → `/api/admin-approve` → updates `profiles.status` + inserts into `discover_profiles`
- **Dashboard** → reads from `discover_profiles`
- **Payment** → `/api/create-checkout` → Stripe checkout → `/dashboard?paid=true`
