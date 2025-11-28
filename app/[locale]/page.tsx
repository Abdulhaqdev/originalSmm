import { Suspense } from "react"
import Navbar from "@/components/navbar"
import Hero from "@/components/hero"
import Stats from "@/components/stats"
import Features from "@/components/features"
import ServicesPreview from "@/components/services-preview"
import Testimonials from "@/components/testimonials"
import FAQ from "@/components/faq"
import Footer from "@/components/footer"
import HeroSkeleton from "@/components/skeletons/HeroSkeleton"



export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main>
        <Suspense fallback={<HeroSkeleton />}>
          <Hero />
        </Suspense>

        <Suspense fallback={<HeroSkeleton />}>
          <Stats />
        </Suspense>

        <Suspense fallback={<HeroSkeleton />}>
          <Features />
        </Suspense>
        <Suspense fallback={<HeroSkeleton />}>
          <ServicesPreview />
        </Suspense>

        <Suspense fallback={<HeroSkeleton />}>
          <Testimonials />
        </Suspense>

        <Suspense fallback={<HeroSkeleton />}>
          <FAQ />
        </Suspense>
      </main>

      <Footer />
    </div>
  )
}