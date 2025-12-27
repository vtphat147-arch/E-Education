import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export const WireframeGrid = () => {
  const gridRef = useRef<THREE.GridHelper>(null)

  useFrame((state) => {
    if (!gridRef.current) return
    gridRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1
    gridRef.current.rotation.z = Math.cos(state.clock.elapsedTime * 0.1) * 0.1
  })

  return (
    <>
      <gridHelper ref={gridRef} args={[20, 20, '#6366f1', '#8b5cf6']} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
    </>
  )
}

