import { Canvas } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'
import { motion, useInView } from 'framer-motion'
import { useRef, Suspense } from 'react'
import { WireframeGrid } from '../3d/WireframeGrid'
import { Card } from '../ui/Card'
import { Sparkles, Zap, Shield } from 'lucide-react'

const features = [
  {
    icon: Sparkles,
    title: '3D Animations',
    description: 'Smooth 3D effects với Three.js và React Three Fiber'
  },
  {
    icon: Zap,
    title: 'High Performance',
    description: 'Optimized cho 60fps với lazy loading và code splitting'
  },
  {
    icon: Shield,
    title: 'Modern Design',
    description: 'Glassmorphism, gradients và effects hiện đại'
  }
]

export const Features = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-slate-800 via-indigo-900 to-slate-800">
      {/* 3D Background */}
      <div className="absolute inset-0 z-0 opacity-30">
        <Canvas
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          dpr={Math.min(window.devicePixelRatio, 2)}
        >
          <Suspense fallback={null}>
            <PerspectiveCamera makeDefault position={[0, 0, 10]} />
            <WireframeGrid />
          </Suspense>
        </Canvas>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-7xl font-black mb-4 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Tính năng nổi bật
          </h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Mọi thứ bạn cần để tạo ra những sản phẩm tuyệt vời
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <Card hover>
                <feature.icon className="w-12 h-12 text-indigo-400 mb-4" />
                <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-white/70">{feature.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

