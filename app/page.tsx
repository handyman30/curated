import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import LifestyleStrip from '@/components/LifestyleStrip'
import HowItWorks from '@/components/HowItWorks'
import MatchPreview from '@/components/MatchPreview'
import WhyCurated from '@/components/WhyCurated'
import Events from '@/components/Events'
import Membership from '@/components/Membership'
import Testimonials from '@/components/Testimonials'
import SocialProof from '@/components/SocialProof'
import WaitlistForm from '@/components/WaitlistForm'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="overflow-hidden">
      <Navbar />
      <Hero />
      <Events />
      <LifestyleStrip />
      <HowItWorks />
      <MatchPreview />
      <WhyCurated />
      <Membership />
      <Testimonials />
      <SocialProof />
      <WaitlistForm />
      <Footer />
    </main>
  )
}
