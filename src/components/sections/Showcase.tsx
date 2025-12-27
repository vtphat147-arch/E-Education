import { Canvas } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'
import { motion, useInView } from 'framer-motion'
import { useRef, Suspense } from 'react'
import { FluidBackground } from '../3d/FluidBackground'
import { Card } from '../ui/Card'
import { Link } from 'react-router-dom'
import { Eye, Heart } from 'lucide-react'

interface ShowcaseProps {
  components?: any[]
}

export const Showcase = ({ components = [] }: ShowcaseProps) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-purple-900 via-pink-900 to-indigo-900">
      {/* 3D Background */}
      <div className="absolute inset-0 z-0 opacity-20">
        <Canvas
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          dpr={Math.min(window.devicePixelRatio, 2)}
        >
          <Suspense fallback={null}>
            <PerspectiveCamera makeDefault position={[0, 0, 5]} />
            <FluidBackground />
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
          <h2 className="text-5xl md:text-7xl font-black mb-4 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
            Showcase
          </h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Khám phá các components đẹp nhất của chúng tôi
          </p>
        </motion.div>

        {components.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {components.slice(0, 6).map((component, index) => (
              <motion.div
                key={component.id}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.05 }}
              >
                <Link to={`/components/${component.id}`}>
                  <Card hover={false} className="h-full">
                    <div className="relative h-48 mb-4 rounded-xl overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-500">
                      <img
                        src={component.preview}
                        alt={component.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none'
                        }}
                      />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{component.name}</h3>
                    <p className="text-white/70 text-sm mb-4 line-clamp-2">{component.description}</p>
                    <div className="flex items-center gap-4 text-sm text-white/60">
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span>{component.views}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        <span>{component.likes}</span>
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center text-white/70">
            <p>Đang tải components...</p>
          </div>
        )}
      </div>
    </section>
  )
}

