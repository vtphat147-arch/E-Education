import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export const CosmicBackground = () => {
  const starsRef = useRef<THREE.Points>(null)

  const stars = useMemo(() => {
    const count = 5000
    const positions = new Float32Array(count * 3)
    
    for (let i = 0; i < count * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 100
    }
    
    return positions
  }, [])

  useFrame((state) => {
    if (!starsRef.current) return
    starsRef.current.rotation.y = state.clock.elapsedTime * 0.05
  })

  return (
    <>
      <points ref={starsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={5000}
            array={stars}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.1}
          color="#60a5fa"
          transparent
          opacity={0.8}
        />
      </points>
      <ambientLight intensity={0.2} />
      <pointLight position={[0, 0, 0]} intensity={2} color="#a78bfa" />
    </>
  )
}

