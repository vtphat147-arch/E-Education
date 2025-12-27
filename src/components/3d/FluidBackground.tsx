import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Mesh } from 'three'

export const FluidBackground = () => {
  const meshRef = useRef<Mesh>(null)

  useFrame((state) => {
    if (!meshRef.current) return
    
    const time = state.clock.elapsedTime
    meshRef.current.rotation.x = Math.sin(time * 0.3) * 0.2
    meshRef.current.rotation.y = Math.cos(time * 0.2) * 0.2
    meshRef.current.position.y = Math.sin(time * 0.5) * 0.3
  })

  return (
    <>
      <mesh ref={meshRef}>
        <planeGeometry args={[20, 20, 32, 32]} />
        <meshStandardMaterial
          color="#0f172a"
          emissive="#1e293b"
          emissiveIntensity={0.3}
          wireframe
          wireframeLinewidth={1}
        />
      </mesh>
      <pointLight position={[5, 5, 5]} intensity={0.5} color="#6366f1" />
      <pointLight position={[-5, -5, -5]} intensity={0.5} color="#d946ef" />
    </>
  )
}

