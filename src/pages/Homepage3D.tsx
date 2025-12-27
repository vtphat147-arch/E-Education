import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Lenis from 'lenis'
import Header from '../cpnents/Header'
import { Hero } from '../components/sections/Hero'
import { Features } from '../components/sections/Features'
import { Showcase } from '../components/sections/Showcase'
import { Testimonials } from '../components/sections/Testimonials'
import { CTA } from '../components/sections/CTA'
import { designService, DesignComponent } from '../services/api'
import { useScrollProgress } from '../hooks/useScrollProgress'

const Homepage3D = () => {
  const [components, setComponents] = useState<DesignComponent[]>([])
  const { scrollProgress } = useScrollProgress()

  useEffect(() => {
    // Smooth scroll với Lenis - chỉ trên desktop
    const isMobile = window.innerWidth < 768
    if (!isMobile) {
      const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        smoothTouch: false,
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
    <div className="relative min-h-screen">
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
      <Hero />
      <Features />
      <Showcase components={components} />
      <Testimonials />
      <CTA />
    </div>
  )
}

export default Homepage3D

