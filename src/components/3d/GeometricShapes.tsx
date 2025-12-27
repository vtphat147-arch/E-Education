import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Mesh, Group } from 'three'

export const GeometricShapes = () => {
  const groupRef = useRef<Group>(null)

  useFrame((state) => {
    if (!groupRef.current) return
    
    groupRef.current.rotation.x = state.clock.elapsedTime * 0.2
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.3
    
    groupRef.current.children.forEach((child, i) => {
      const mesh = child as Mesh
      mesh.position.y = Math.sin(state.clock.elapsedTime + i) * 0.5
      mesh.rotation.z += 0.01
    })
  })

  return (
    <group ref={groupRef}>
      <mesh position={[-2, 0, 0]}>
        <octahedronGeometry args={[1, 0]} />
        <meshStandardMaterial 
          color="#6366f1" 
          emissive="#6366f1"
          emissiveIntensity={0.5}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <torusGeometry args={[1, 0.3, 16, 100]} />
        <meshStandardMaterial 
          color="#8b5cf6" 
          emissive="#8b5cf6"
          emissiveIntensity={0.5}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      <mesh position={[2, 0, 0]}>
        <icosahedronGeometry args={[1, 0]} />
        <meshStandardMaterial 
          color="#d946ef" 
          emissive="#d946ef"
          emissiveIntensity={0.5}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      <pointLight position={[0, 5, 5]} intensity={1} color="#60a5fa" />
      <ambientLight intensity={0.5} />
    </group>
  )
}

