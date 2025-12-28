import { useEffect, useState, lazy, Suspense } from 'react'
import { motion } from 'framer-motion'
import Header from '../cpnents/Header'
import { designService, DesignComponent } from '../services/api'
import { useScrollProgress } from '../hooks/useScrollProgress'

// Lazy load 3D components để tránh SSR issues
const Hero = lazy(() => import('../components/sections/Hero').then(m => ({ default: m.Hero })))
const Features = lazy(() => import('../components/sections/Features').then(m => ({ default: m.Features })))
const Showcase = lazy(() => import('../components/sections/Showcase').then(m => ({ default: m.Showcase })))
const Testimonials = lazy(() => import('../components/sections/Testimonials').then(m => ({ default: m.Testimonials })))
const CTA = lazy(() => import('../components/sections/CTA').then(m => ({ default: m.CTA })))

const Homepage3D = () => {
  const [components, setComponents] = useState<DesignComponent[]>([])
  const { scrollProgress } = useScrollProgress()

  useEffect(() => {
    // Dynamic import Lenis để tránh SSR issues
    if (typeof window === 'undefined') return
    
    import('lenis').then((LenisModule) => {
      const Lenis = LenisModule.default
      const isMobile = window.innerWidth < 768
      if (!isMobile) {
        const lenis = new Lenis({
          duration: 1.2,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          orientation: 'vertical',
          gestureOrientation: 'vertical',
          smoothWheel: true,
          wheelMultiplier: 1,
          touchMultiplier: 2,
        })

        function raf(time: number) {
          lenis.raf(time)
          requestAnimationFrame(raf)
        }

        requestAnimationFrame(raf)

        return () => {
          lenis.destroy()
        }
      }
    }).catch((err) => {
      console.warn('Lenis not available:', err)
    })

    // Fetch components
    const fetchComponents = async () => {
      try {
        const data = await designService.getAllComponents()
        setComponents(data)
      } catch (err) {
        console.error('Error fetching components:', err)
      }
    }

    fetchComponents()
  }, [])

  // Progress bar
  useEffect(() => {
    const progressBar = document.getElementById('scroll-progress')
    if (progressBar) {
      progressBar.style.width = `${scrollProgress * 100}%`
    }
  }, [scrollProgress])

  return (
    <div className="relative min-h-screen pt-20">
      <Header />
      
      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-white/10 z-50">
        <motion.div
          id="scroll-progress"
          className="h-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600"
          style={{ width: `${scrollProgress * 100}%` }}
        />
      </div>

      {/* Sections */}
      <Suspense fallback={<div className="h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-purple-900"><div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500"></div></div>}>
        <Hero />
        <Features />
        <Showcase components={components} />
        <Testimonials />
        <CTA />
      </Suspense>
    </div>
  )
}

export default Homepage3D

