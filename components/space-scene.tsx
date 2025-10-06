"use client"

import { Canvas } from "@react-three/fiber"
import { Stars, OrbitControls, Text3D, Center } from "@react-three/drei"
import { useRef, useMemo } from "react"
import * as THREE from "three"

function StarField() {
  return <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
}

function ParticleField() {
  const particles = useMemo(() => {
    const positions = new Float32Array(1000 * 3)
    for (let i = 0; i < 1000; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20
    }
    return positions
  }, [])

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.length / 3}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial color="#ffffff" size={0.02} transparent opacity={0.8} />
    </points>
  )
}

function NASAElements() {
  return (
    <>
      <ParticleField />
    </>
  )
}

interface SpaceSceneProps {
  analysisResult: {
    isExoplanet: boolean
    confidence: number
  } | null
}

export function SpaceScene({ analysisResult }: SpaceSceneProps) {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={0.8} />
      <pointLight position={[-10, -10, -10]} intensity={0.3} color="#3b82f6" />
      <StarField />
      <NASAElements />
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.3} />
    </Canvas>
  )
}
