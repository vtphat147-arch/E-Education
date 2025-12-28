import { Canvas } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'
import { motion, useInView } from 'framer-motion'
import { useRef, Suspense } from 'react'
import { CosmicBackground } from '../3d/CosmicBackground'
import { Button } from '../ui/Button'
import { Link } from 'react-router-dom'

export const CTA = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
      {/* 3D Background */}
      <div className="absolute inset-0 z-0">
        <Canvas
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          dpr={typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 2) : 1}
        >
          <Suspense fallback={null}>
            <PerspectiveCamera makeDefault position={[0, 0, 10]} />
            <CosmicBackground />
          </Suspense>
        </Canvas>
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center px-4 max-w-4xl mx-auto"
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent leading-tight pb-4"
            style={{ paddingBottom: '0.5rem', lineHeight: '1.15' }}
          >
            Sẵn sàng bắt đầu?
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl text-white/80 mb-10 leading-relaxed"
          >
            Khám phá thư viện components với hàng nghìn mẫu thiết kế đẹp mắt
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.6 }}
            className="flex gap-4 justify-center flex-wrap"
          >
            <Link to="/components">
              <Button variant="glow">Xem tất cả Components</Button>
            </Link>
            <Button variant="secondary">Liên hệ chúng tôi</Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

